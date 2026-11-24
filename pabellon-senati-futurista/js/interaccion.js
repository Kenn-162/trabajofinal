/* ════════════════════════════════════════════════════════════════════════
   INTERACCIÓN · sentarse y conducir.  Va DESPUÉS de jugador.js y ANTES de multiplayer.js.

   SENTARSE  (E cerca de una silla de aula, silla de laboratorio o banca)
     · Tu personaje se sienta de verdad (modelo sentado del mismo aspecto). 1ª o 3ª persona (V), mirar con el mouse.
     · Levantarte: E, Espacio o cualquier tecla de movimiento.

   CONDUCIR  (E cerca de un carro o una moto del estacionamiento)
     · W acelerar · S frenar / reversa · A D girar · Espacio freno de mano (derrape) · H bocina · L luces · V cámara · M sonido · E bajar
     · Física propia: motor con 5 marchas y cambios automáticos, resistencia del aire y de rodadura, freno motor, ABS,
       dirección que se endurece con la velocidad, límite de agarre en curva (subviraje), derrape con freno de mano,
       balanceo/cabeceo de la carrocería, moto que se inclina en las curvas, choques con edificios, árboles, postes,
       bancas, cerco y otros vehículos. Sonido de motor, bocina, chirrido y golpes (WebAudio).

   Se acopla sin reescribir la navegación: envuelve walkStep (el más externo). Mientras estás sentado/conduciendo
   NO se llama a la caminata; este archivo mueve P (para multijugador) y la cámara.
   Seguridad: todo va en try/catch; si algo falla te devuelve a pie y el visor nunca se congela.
   ════════════════════════════════════════════════════════════════════════ */
(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const lerpA=(a,b,k)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*k;
 const dAng=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
 const typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
 const coarse=matchMedia('(pointer:coarse)').matches;
 const FOV0=camera.fov;
 const say=m=>{if(typeof toast==='function')toast(m)};
 const J=window.JUMP||{h:0,vy:0,grounded:true};
 const OBS=(typeof obstacles!=='undefined')?obstacles:[];
 const CIRC=(typeof SOL!=='undefined')?SOL:[];
 const KMH=3.6;

 const INT=window.INT={mode:'foot',seat:null,veh:null,vcam:3,zoom:1,pz:0,remote:null,busyFail:false};
 const PJ=window.PJ;
 const V3=new THREE.Vector3();

 /* ════════ 1 · registro de asientos ════════ */
 function allSeats(){
  const out=[];
  for(const r of rooms){const yaw=r.ex>0?-Math.PI/2:Math.PI/2;
   for(const st of r.seats)out.push({x:r.X(st.u)+PAV.x,z:r.Z(st.v)+PAV.z,fl:r.f,top:.45,yaw,kind:r.lab?'silla de '+r.name:'silla de '+r.name,room:r})}
  for(const b of ASIENTOS)out.push({x:b.x,z:b.z,fl:0,top:b.y,yaw:b.yaw,kind:'banca'});
  return out}
 const SEATS=allSeats();

 /* ════════ 2 · vehículos ════════ */
 const VEH=[];
 AUTOS.forEach((t,i)=>{const d=t.userData.veh;d.root=t;d.id=i;d.kind='car';d.taken=false;initVeh(d);VEH.push(d)});
 const MS=window.__motoSet,MOTOS=[];
 if(MS)MS.list.forEach(([x,z,color,ry],i)=>{const d={kind:'moto',id:i,color,root:null,x,z,ry,scl:1,hx:[-.5,.5],circ:.36,taken:false,eye:[-.02,1.62,0],ims:MS.ims};initVeh(d);MOTOS.push(d);VEH.push(d)});
 function initVeh(d){d.st=Object.assign({vx:0,vz:0,steer:0,delta:0,pitch:0,roll:0,gear:1,shift:0,rpm:.15,spin:0,thr:0,brk:0,hand:0,slip:0,lights:false,vf:0,aLong:0,aLat:0},d.st||{})}
 const spec=d=>d.kind==='car'?{L:2.64*d.scl,vmax:36,tops:[9,16,23,30,36],acc:[6.6,5.5,4.5,3.7,3.0],brake:9.5,rev:3.2,vrev:7,grip:9,hgrip:1.4,mu:8.6,dmax:.6,steerRate:3.0,idle:.16}
  :{L:1.24,vmax:30,tops:[8,14,20,25,30],acc:[7.6,6.2,4.9,3.9,3.1],brake:8.2,rev:1.6,vrev:3,grip:7.5,hgrip:2.2,mu:7.4,dmax:.55,steerRate:2.4,idle:.2};

 /* moto individual (las del estacionamiento son instancias: al subir se oculta la instancia y se crea un modelo propio) */
 const mTire=S(0x101216,.85),mDark=S(0x24282e,.55,{metalness:.5}),mChrome=S(0xb9bfc5,.25,{metalness:.9,envMapIntensity:1.2}),mSeat=S(0x0c0d10,.8),mLamp=new THREE.MeshBasicMaterial({color:0xf3e2ac});
 const mWheelG=new THREE.CylinderGeometry(.31,.31,.13,16);
 function buildMoto(color){
  const root=new THREE.Group(),lean=new THREE.Group();root.add(lean);
  const paint=std({color,roughness:.3,metalness:.55,envMapIntensity:.9});
  const add=(g,m,x,y,z,par=lean,rx=0,ry=0,rz=0)=>{const q=new THREE.Mesh(g,m);q.position.set(x,y,z);q.rotation.set(rx,ry,rz);q.castShadow=true;par.add(q);return q};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  add(B(.52,.36,.24),mDark,0,.46,0);add(B(.56,.22,.3),paint,.14,.8,0);add(B(.62,.1,.28),mSeat,-.34,.78,0);
  add(B(.46,.07,.22),paint,-.76,.74,0,lean,0,0,.18);add(B(.58,.07,.09),mChrome,-.34,.3,-.17);
  const tailM=new THREE.MeshBasicMaterial({color:0x6a0d0d});add(B(.06,.07,.16),tailM,-.99,.76,0);
  const wheels=[];
  const rear=new THREE.Group();rear.position.set(-.62,.31,0);lean.add(rear);const rs=new THREE.Group();rear.add(rs);
  add(mWheelG,mTire,0,0,0,rs,Math.PI/2);add(new THREE.CylinderGeometry(.15,.15,.15,10),mChrome,0,0,0,rs,Math.PI/2);add(B(.5,.05,.16),mDark,0,0,0,rs);add(B(.05,.5,.16),mDark,0,0,0,rs);
  wheels.push({sp:rs,front:false,pv:rear});
  /* conjunto delantero: horquilla + rueda + manubrio + faro; gira con la dirección */
  const steer=new THREE.Group();steer.position.set(.52,0,0);lean.add(steer);
  add(B(.05,.74,.07),mChrome,.08,.62,0,steer,0,0,.32);add(B(.06,.06,.62),mDark,0,1.02,0,steer);add(new THREE.SphereGeometry(.1,10,8),mLamp,.08,.93,0,steer);
  add(B(.4,.05,.06),paint,-.1,.5,0,steer,0,0,.42);
  const fp=new THREE.Group();fp.position.set(.1,.31,0);steer.add(fp);const fs=new THREE.Group();fp.add(fs);
  add(mWheelG,mTire,0,0,0,fs,Math.PI/2);add(new THREE.CylinderGeometry(.15,.15,.15,10),mChrome,0,0,0,fs,Math.PI/2);add(B(.5,.05,.16),mDark,0,0,0,fs);add(B(.05,.5,.16),mDark,0,0,0,fs);
  wheels.push({sp:fs,front:true,pv:fp});
  const anchor=new THREE.Group();anchor.position.set(-.05,.38,0);lean.add(anchor);
  return {root,lean,steer,wheels,tailM,anchor}}
 function ensureRoot(d){
  if(d.root)return d.root;
  if(d.kind!=='moto')return null;
  const z=new THREE.Matrix4().makeScale(0,0,0);                      /* oculta la instancia: ahora la moto es un modelo propio */
  d.ims.forEach(im=>{im.setMatrixAt(d.id,z);im.instanceMatrix.needsUpdate=true});
  const m=buildMoto(d.color);Object.assign(d,{body:m.lean,lean:m.lean,steer:m.steer,wheels:m.wheels,tailM:m.tailM,anchor:m.anchor,root:m.root});
  m.root.position.set(d.x,0,d.z);m.root.rotation.y=d.ry;scene.add(m.root);return d.root}
 const vp=d=>d.root?{x:d.root.position.x,z:d.root.position.z,ry:d.root.rotation.y}:{x:d.x,z:d.z,ry:d.ry};
 const fwd=ry=>[Math.cos(ry),-Math.sin(ry)];

 /* ════════ 3 · colisiones ════════ */
 const PAVB=[PAV.x-4,PAV.x+L+4,PAV.z-D-2.6,PAV.z+D+2.6];
 const PLB=(window.RAISED||[]).map(r=>[r.x0-.4,r.x1+.4,r.z0-.4,r.z1+.4]);   /* plataforma del estadio: no entran vehículos */            /* el pabellón entero (ni carros ni motos entran) */
 const WB=[-168,166,-170,96];                                        /* límites del mundo */
 const tmp=[];
 function otherCircles(self,out){out.length=0;
  for(const d of VEH){if(d===self)continue;const p=vp(d),f=fwd(p.ry),sc=d.scl||1;
   if(Math.abs(p.x-self._px)>9||Math.abs(p.z-self._pz)>9)continue;
   for(const o of d.hx)out.push(p.x+f[0]*o*sc,p.z+f[1]*o*sc,d.circ*sc)}
  return out}
 /* ¿hay algo sólido en (x,z) con radio r? (para colocar al jugador al bajar y para la cámara) */
 function solidAt(x,z,r){
  for(const b of OBS)if(x>b[0]-r&&x<b[1]+r&&z>b[2]-r&&z<b[3]+r)return true;
  if(x>PAVB[0]-r&&x<PAVB[1]+r&&z>PAVB[2]-r&&z<PAVB[3]+r)return true;
  for(const b of PLB)if(x>b[0]-r&&x<b[1]+r&&z>b[2]-r&&z<b[3]+r)return true;
  for(const c of CIRC)if((x-c[0])**2+(z-c[1])**2<(c[2]+r)**2)return true;
  return false}
 /* resuelve choques de los círculos del vehículo contra todo; devuelve la fuerza del impacto (m/s) */
 function collide(d,s){
  const sc=d.scl||1;let worst=0;d._px=d.x;d._pz=d.z;
  const oc=otherCircles(d,tmp);
  for(let it=0;it<3;it++){
   const f=fwd(d.ry);let any=false;
   for(const o of d.hx){
    let cx=d.x+f[0]*o*sc,cz=d.z+f[1]*o*sc;const r=d.circ*sc;
    const push=(nx,nz,pen)=>{d.x+=nx*pen;d.z+=nz*pen;cx+=nx*pen;cz+=nz*pen;any=true;
     const vn=s.vx*nx+s.vz*nz;if(vn<0){worst=Math.max(worst,-vn);const k=-(1.28)*vn;s.vx+=nx*k;s.vz+=nz*k;s.vx*=.985;s.vz*=.985}};
    /* cajas: edificios, cerco, pirámide, torres… */
    const box=(b0,b1,b2,b3)=>{
     if(cx<b0-r||cx>b1+r||cz<b2-r||cz>b3+r)return;
     const qx=clamp(cx,b0,b1),qz=clamp(cz,b2,b3);let dx=cx-qx,dz=cz-qz,dist=Math.hypot(dx,dz);
     if(dist>1e-4){if(dist<r)push(dx/dist,dz/dist,r-dist)}
     else{const l=cx-b0,rr=b1-cx,t=cz-b2,bt=b3-cz,m=Math.min(l,rr,t,bt);
      if(m===l)push(-1,0,l+r);else if(m===rr)push(1,0,rr+r);else if(m===t)push(0,-1,t+r);else push(0,1,bt+r)}};
    for(const b of OBS)box(b[0],b[1],b[2],b[3]);
    box(PAVB[0],PAVB[1],PAVB[2],PAVB[3]);for(const b of PLB)box(b[0],b[1],b[2],b[3]);
    /* círculos: árboles, postes, bancas, columnas */
    const ci=(x,z,rr)=>{const dx=cx-x,dz=cz-z,dd=dx*dx+dz*dz,R=r+rr;if(dd<R*R&&dd>1e-8){const dist=Math.sqrt(dd);push(dx/dist,dz/dist,R-dist)}};
    for(const c of CIRC){if(Math.abs(cx-c[0])>5||Math.abs(cz-c[1])>5)continue;ci(c[0],c[1],c[2])}
    for(let k=0;k<oc.length;k+=3)ci(oc[k],oc[k+1],oc[k+2]);
   }
   if(!any)break}
  /* bordes del mundo */
  if(d.x<WB[0]){d.x=WB[0];if(s.vx<0){worst=Math.max(worst,-s.vx);s.vx*=-.2}}
  if(d.x>WB[1]){d.x=WB[1];if(s.vx>0){worst=Math.max(worst,s.vx);s.vx*=-.2}}
  if(d.z<WB[2]){d.z=WB[2];if(s.vz<0){worst=Math.max(worst,-s.vz);s.vz*=-.2}}
  if(d.z>WB[3]){d.z=WB[3];if(s.vz>0){worst=Math.max(worst,s.vz);s.vz*=-.2}}
  return worst}

 /* ════════ 4 · sonido (WebAudio) ════════ */
 const Snd={ctx:null,on:true};
 function sndInit(){
  if(Snd.ctx){if(Snd.ctx.state==='suspended')Snd.ctx.resume();return}
  try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=Snd.ctx=new A();
   const master=c.createGain();master.gain.value=.5;master.connect(c.destination);Snd.master=master;
   const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=600;lp.Q.value=1.2;const eg=c.createGain();eg.gain.value=0;
   const o1=c.createOscillator(),o2=c.createOscillator(),o3=c.createOscillator();o1.type='sawtooth';o2.type='square';o3.type='sawtooth';
   const g2=c.createGain(),g3=c.createGain();g2.gain.value=.35;g3.gain.value=.5;
   o1.connect(lp);o2.connect(g2).connect(lp);o3.connect(g3).connect(lp);lp.connect(eg).connect(master);o1.start();o2.start();o3.start();
   const nb=c.createBuffer(1,c.sampleRate*1.5,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;Snd.nb=nb;
   const ns=c.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1700;bp.Q.value=.8;const sg=c.createGain();sg.gain.value=0;ns.connect(bp).connect(sg).connect(master);ns.start();
   const hn=c.createGain();hn.gain.value=0;hn.connect(master);const h1=c.createOscillator(),h2=c.createOscillator();h1.type=h2.type='square';h1.connect(hn);h2.connect(hn);h1.start();h2.start();
   Object.assign(Snd,{lp,eg,o1,o2,o3,sg,bp,hn,h1,h2})}catch(e){Snd.ctx=null}}
 function sndTick(d,s,sp,dt){
  const c=Snd.ctx;if(!c||!Snd.o1)return;const t=c.currentTime,on=Snd.on&&INT.mode==='drive';
  const moto=d.kind==='moto',rpmHz=(900+s.rpm*(moto?8200:5600))/60;           /* rpm real aproximado */
  const f0=moto?rpmHz*.5*2:rpmHz*2;                                           /* 4 cilindros: 2 explosiones por vuelta */
  Snd.o1.frequency.setTargetAtTime(f0,t,.04);Snd.o2.frequency.setTargetAtTime(f0*.5,t,.04);Snd.o3.frequency.setTargetAtTime(f0*1.003*2,t,.04);
  Snd.lp.frequency.setTargetAtTime(380+s.rpm*(moto?2800:1700)+s.thr*500,t,.05);
  Snd.eg.gain.setTargetAtTime(on?(.07+.13*s.rpm+.09*s.thr):0,t,.06);
  Snd.sg.gain.setTargetAtTime(on?clamp(s.slip,0,1)*.22:0,t,.05);Snd.bp.frequency.setTargetAtTime(1400+Math.abs(sp)*30,t,.1);
  const horn=on&&INT.horn;Snd.hn.gain.setTargetAtTime(horn?.09:0,t,.015);
  Snd.h1.frequency.value=moto?640:420;Snd.h2.frequency.value=moto?800:525}
 function sndThump(power){
  const c=Snd.ctx;if(!c||!Snd.nb||!Snd.on)return;const s=c.createBufferSource();s.buffer=Snd.nb;
  const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=260+power*40;const g=c.createGain(),t=c.currentTime;
  g.gain.setValueAtTime(clamp(power/14,.05,.8),t);g.gain.exponentialRampToValueAtTime(.001,t+.5);s.connect(f).connect(g).connect(Snd.master);s.start(t,Math.random(),.55)}
 function sndStop(){const c=Snd.ctx;if(!c||!Snd.eg)return;const t=c.currentTime;Snd.eg.gain.setTargetAtTime(0,t,.05);Snd.sg.gain.setTargetAtTime(0,t,.05);Snd.hn.gain.setTargetAtTime(0,t,.02)}

 /* ════════ 5 · interfaz ════════ */
 const css=document.createElement('style');
 css.textContent='#int-hud{position:fixed;left:50%;bottom:calc(122px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:16;display:none;align-items:center;gap:9px;padding:9px 16px;border-radius:12px;background:rgba(6,12,28,.82);border:1px solid rgba(94,214,255,.55);color:#eaf4ff;font:600 14px Barlow,Arial,sans-serif;box-shadow:0 0 22px rgba(56,225,255,.25);pointer-events:none}'+
  '#int-hud kbd{display:inline-block;min-width:24px;padding:3px 8px;border-radius:6px;background:#38e1ff;color:#04121f;font:800 14px Arial;text-align:center}'+
  '#veh-hud{position:fixed;left:50%;transform:translateX(-50%);top:calc(14px + env(safe-area-inset-top,0px));z-index:16;display:none;align-items:center;gap:16px;padding:8px 18px;border-radius:14px;background:rgba(6,12,28,.78);border:1px solid rgba(148,197,255,.28);color:#eaf4ff;font:600 12px Barlow,Arial,sans-serif;pointer-events:none}'+
  '#veh-hud .kmh{font:800 34px/1 Arial;letter-spacing:-.02em}#veh-hud .u{font:600 11px Arial;color:#8fa6cf;margin-left:4px}#veh-hud .g{font:800 24px Arial;color:#38e1ff;min-width:20px;text-align:center}'+
  '#veh-hud .rb{width:110px;height:7px;border-radius:4px;background:#16233b;overflow:hidden}#veh-hud .rb i{display:block;height:100%;width:0;background:linear-gradient(90deg,#38e1ff,#ffd24a 70%,#ff4a3a)}#veh-hud .ic{color:#6c7fa6;font-size:11px;letter-spacing:.04em;line-height:1.4}#veh-hud .ic b{color:#ffd24a}'+
  '.int-t{position:fixed;z-index:25;display:none;padding:14px 16px;border-radius:50%;border:1px solid #9bdfff;background:#081321cc;color:#fff;font:bold 13px Arial}';
 document.head.append(css);
 const hud=document.createElement('div');hud.id='int-hud';document.body.append(hud);
 const vh=document.createElement('div');vh.id='veh-hud';document.body.append(vh);
 let tE=null,tHand=null,tHorn=null;
 if(coarse){
  const mk=(txt,css,fn,up)=>{const b=document.createElement('button');b.type='button';b.className='int-t';b.textContent=txt;b.style.cssText=css;b.addEventListener('pointerdown',e=>{e.preventDefault();fn()});if(up)b.addEventListener('pointerup',up);document.body.append(b);return b};
  tE=mk('E','right:18px;bottom:230px',act);
  tHand=mk('Freno','right:18px;bottom:300px',()=>{keys[' ']=1},()=>{keys[' ']=0});
  tHorn=mk('Bocina','right:92px;bottom:300px',()=>{INT.horn=true},()=>{INT.horn=false})}

 /* ════════ 6 · estado y transiciones ════════ */
 let me=null;const blend={t:1,from:new THREE.Vector3()};
 const startBlend=()=>{blend.t=0;blend.from.copy(camera.position)};
 let lastLook=0,shake=0;
 cv.addEventListener('pointermove',e=>{if(e.buttons&1||e.pointerType==='touch')lastLook=performance.now()});
 cv.addEventListener('wheel',e=>{if(INT.mode==='foot'||mode!=='walk')return;e.preventDefault();INT.zoom=clamp(INT.zoom+e.deltaY*.0015,.55,2.2)},{passive:false});
 const floorY=()=>P.y>1.5?3:0;

 function setBusy(on,txt){PJ.busy=on;PJ.busyHud=txt||''}

 /* ── sentarse ── */
 function sit(st){
  me=PJ.avatar();if(!me)return;
  INT.mode='sit';INT.seat=st;PJ.crouching=false;PJ.crouch=0;mvx=0;mvz=0;
  const dx=-Math.sin(st.yaw),dz=-Math.cos(st.yaw),gy=st.fl?3:0;
  startBlend();
  P.x=st.x;P.z=st.z;P.fl=st.fl?2:1;P.y=gy;P.yaw=st.yaw;P.pitch=-.08;PJ.bodyYaw=st.yaw;
  me.position.set(st.x-dx*.08,gy+(st.top-.45),st.z-dz*.08);me.rotation.set(0,st.yaw,0);me.visible=PJ.third;poseAvatar(me,1);INT.pz=1;
  setBusy(true,'<b>Sentado</b> · '+st.kind+' <i>· V cámara · mouse mirar · E / Espacio / W levantarse</i>')}
 function stand(){
  const st=INT.seat;if(!st)return;
  const dx=-Math.sin(st.yaw),dz=-Math.cos(st.yaw),sx=-dz,sz=dx,f=st.fl?1:0;
  const tries=[[-.55,0],[0,.62],[0,-.62],[.5,0],[-.5,.5],[-.5,-.5],[-1,0]];
  let ex=st.x,ez=st.z;
  for(const [a,b] of tries){const x=st.x+dx*a+sx*b,z=st.z+dz*a+sz*b;if(!blocked(x,z,f)){ex=x;ez=z;break}}
  J.h=0;J.vy=0;J.grounded=true;startBlend();P.x=ex;P.z=ez;P.pitch=0;mvx=mvz=0;poseAvatar(me,0);INT.mode='foot';INT.seat=null;INT.pz=0;setBusy(false);me.rotation.set(0,PJ.bodyYaw,0)}

 /* ── subir / bajar de un vehículo ── */
 function mount(d){
  me=PJ.avatar();if(!me)return;
  const root=ensureRoot(d);if(!root)return;
  INT.mode='drive';INT.veh=d;d.taken=true;PJ.crouching=false;PJ.crouch=0;mvx=mvz=0;INT.zoom=1;INT.vcam=3;INT.horn=false;
  startBlend();sndInit();
  d.x=root.position.x;d.z=root.position.z;d.ry=root.rotation.y;d.st.vx=d.st.vz=0;d.st.steer=d.st.delta=0;d.st.gear=1;d.st.rpm=.16;
  d.anchor.add(me);me.position.set(0,0,0);me.rotation.set(0,-Math.PI/2,0);poseAvatar(me,d.kind==='car'?2:3);INT.pz=d.kind==='car'?2:3;
  const p=vp(d);P.x=p.x;P.z=p.z;P.fl=1;P.y=0;P.yaw=p.ry-Math.PI/2;P.pitch=-.16;PJ.bodyYaw=P.yaw;
  me.visible=true;
  setBusy(true,'');
  say(d.kind==='car'?'Carro: W acelera · S frena/reversa · A D gira · Espacio freno de mano':'Moto: W acelera · S frena/reversa · A D gira · Espacio freno trasero')}
 function dismount(force){
  const d=INT.veh;if(!d)return;const s=d.st;
  if(!force&&Math.abs(s.vf)>1.8){say('Detén el vehículo para bajar (S o Espacio)');return}
  const p=vp(d),f=fwd(p.ry),lx=-f[1],lz=f[0],sc=d.scl||1;      /* izquierda del vehículo = -derecha */
  const left=[-Math.sin(p.ry),-Math.cos(p.ry)];
  const off=(d.kind==='car'?1.75:1.05)*sc;
  const tries=[[left[0]*off,left[1]*off],[-left[0]*off,-left[1]*off],[-f[0]*(off+1.4),-f[1]*(off+1.4)],[f[0]*(off+1.4),f[1]*(off+1.4)]];
  let ex=p.x+tries[0][0],ez=p.z+tries[0][1];
  for(const [a,b] of tries){const x=p.x+a,z=p.z+b;if(!solidAt(x,z,.35)){ex=x;ez=z;break}}
  s.vx=s.vz=0;s.thr=s.brk=0;s.vf=0;s.hand=0;
  scene.add(me);poseAvatar(me,0);me.rotation.set(0,PJ.bodyYaw,0);
  startBlend();P.x=ex;P.z=ez;P.y=0;P.fl=1;P.pitch=0;P.yaw=p.ry-Math.PI/2;mvx=mvz=0;
  d.taken=false;INT.mode='foot';INT.veh=null;INT.pz=0;INT.horn=false;setBusy(false);sndStop();vh.style.display='none';
  camera.fov=FOV0;camera.updateProjectionMatrix();camera.rotation.z=0;
  setHeadlights(d,false)}

 /* un solo foco compartido (creado desde el inicio con intensidad 0 para no recompilar los materiales al encenderlo) */
 const HL=new THREE.SpotLight(0xfff0cf,0,80,.55,.55,1.1);HL.castShadow=false;scene.add(HL,HL.target);
 function setHeadlights(d,on){d.st.lights=on;HL.intensity=on?2.6:0}
 function placeHeadlights(d){const f=fwd(d.ry),o=d.kind==='car'?2.1:.9;HL.position.set(d.x+f[0]*o,.85,d.z+f[1]*o);HL.target.position.set(d.x+f[0]*24,.2,d.z+f[1]*24)}

 /* ── interactuar (E) ── */
 function act(){
  if(mode!=='walk')return;
  try{
   if(INT.mode==='sit'){stand();return}
   if(INT.mode==='drive'){dismount();return}
   const c=INT.nearby;if(!c)return;
   if(c.type==='seat')sit(c.seat);else mount(c.veh)
  }catch(err){fail(err)}}
 function fail(err){console.error('[interaccion.js]',err);INT.busyFail=true;
  try{if(INT.mode==='drive'&&INT.veh)dismount(true);else if(INT.mode==='sit')stand()}catch(e){}
  INT.mode='foot';INT.seat=INT.veh=null;setBusy(false);camera.fov=FOV0;camera.updateProjectionMatrix();say('La interacción falló y se desactivó (detalle en la consola, F12)')}

 addEventListener('keydown',e=>{
  if(typing(e)||mode!=='walk'||e.ctrlKey||e.metaKey||e.altKey)return;
  if(INT.busyFail)return;
  if(e.code==='KeyE'){if(!e.repeat){e.preventDefault();act()}return}
  if(INT.mode==='drive'){
   if(e.code==='KeyH'){INT.horn=true;sndInit()}
   else if(e.repeat)return;
   else if(e.code==='KeyL'){setHeadlights(INT.veh,!INT.veh.st.lights);say(INT.veh.st.lights?'Luces encendidas':'Luces apagadas')}
   else if(e.code==='KeyV'){INT.vcam=INT.vcam===3?1:3;say(INT.vcam===3?'Cámara externa':'Cámara del conductor')}
   else if(e.code==='KeyM'){Snd.on=!Snd.on;say(Snd.on?'Sonido activado':'Sonido silenciado')}
  }else if(INT.mode==='sit'){
   if(e.repeat)return;
   if(e.code==='Space'||/^(w|a|s|d|arrowup|arrowdown|arrowleft|arrowright)$/.test(e.key.toLowerCase()))stand();
   else if(e.code==='KeyV'){PJ.third=!PJ.third;if(me)me.visible=PJ.third;say(PJ.third?'Cámara en 3ª persona':'Cámara en 1ª persona')}}
 },true);
 addEventListener('keyup',e=>{if(e.code==='KeyH'){INT.horn=false}});

 /* ════════ 7 · física del vehículo ════════ */
 function drive(d,dt,input){
  const sp=spec(d),s=d.st,sc=d.scl||1;
  const h=dt;
  let f=fwd(d.ry),r=[Math.sin(d.ry),Math.cos(d.ry)];
  let vf=s.vx*f[0]+s.vz*f[1],vl=s.vx*r[0]+s.vz*r[1];
  const thr=input.thr,brk=input.brk,hand=input.hand;
  /* marcha automática: sube a ~93% de revoluciones y baja bajo ~38% (con corte de par al cambiar) */
  const tops=sp.tops;let g=s.gear;const av=Math.abs(vf);
  if(vf<-.4){g=0}else{if(g===0)g=1;
   const rN=.15+.85*clamp(av/tops[g-1],0,1.2);
   if(s.shift<=0){if(rN>.93&&g<tops.length){g++;s.shift=.28}else if(g>1&&.15+.85*av/tops[g-2]<.8&&rN<.36){g--;s.shift=.2}}}
  s.gear=g;s.shift=Math.max(0,s.shift-h);
  /* aceleración */
  let a=0;
  const gi=g>0?g-1:0;
  if(thr>0&&vf>-.4){a+=s.shift>0?0:sp.acc[gi]*thr*(1-Math.pow(clamp(av/(tops[gi]*1.02),0,1),6))}
  else if(thr>0&&vf<=-.4)a+=sp.brake*thr*(vf<0?1:0);                                   /* W en reversa = frenar */
  if(brk>0){if(vf>.5)a-=sp.brake*brk;else a-=sp.rev*(1-clamp(-vf/sp.vrev,0,1)) * brk}   /* S: frenar y luego reversa */
  if(hand>0&&av>.1)a-=Math.sign(vf)*sp.brake*.35;
  /* resistencias: aire, rodadura y freno motor al soltar el acelerador */
  const drag=.0012*vf*Math.abs(vf)+.14*Math.sign(vf);
  const eb=(!thr&&!brk&&av>.3)?1.1*Math.sign(vf):0;
  let nvf=vf+(a-drag-eb)*h;
  if((vf>0&&nvf<0&&a<=0)||(vf<0&&nvf>0&&a>=0)||(!thr&&!brk&&av<.12&&Math.abs(nvf)<.25))nvf=(thr||brk)?nvf:0;
  /* dirección: ángulo de rueda sensible a la velocidad + límite de agarre (subviraje) */
  const target=input.steer;
  const rate=target!==0?sp.steerRate:sp.steerRate*1.7;
  s.steer+=clamp(target-s.steer,-rate*h,rate*h);
  const dmax=sp.dmax/(1+Math.pow(av/(d.kind==='car'?10:14),2));
  const delta=s.steer*dmax;s.delta=delta;
  let om=nvf/sp.L*Math.tan(delta);
  const aLat=nvf*om,lim=sp.mu*(hand?.55:1);
  if(Math.abs(aLat)>lim)om*=lim/Math.abs(aLat);
  if(hand&&av>4&&Math.abs(s.steer)>.05)om*=1.35;                                       /* freno de mano: la cola se suelta */
  d.ry+=om*h;
  /* velocidad lineal: se proyecta en los ejes del vehículo; el agarre lateral mata el deslizamiento */
  f=fwd(d.ry);r=[Math.sin(d.ry),Math.cos(d.ry)];
  let wx=s.vx,wz=s.vz;
  const vf2=wx*f[0]+wz*f[1];let vl2=wx*r[0]+wz*r[1];
  const grip=hand&&av>2?sp.hgrip:sp.grip*(av<1.5?1.6:1);
  vl2*=Math.exp(-grip*h);
  /* el cambio de velocidad en la dirección de avance viene de la integración de arriba */
  const vfN=vf2+(nvf-vf);
  s.vx=f[0]*vfN+r[0]*vl2;s.vz=f[1]*vfN+r[1]*vl2;
  d.x+=s.vx*h;d.z+=s.vz*h;
  /* choques */
  const hit=collide(d,s);
  /* telemetría */
  const nvf2=s.vx*f[0]+s.vz*f[1];
  s.aLong+=((nvf2-vf)/h-s.aLong)*(1-Math.exp(-9*h));s.aLat+=(nvf2*om-s.aLat)*(1-Math.exp(-9*h));
  s.vf=nvf2;s.slip=clamp(Math.abs(vl2)/5+(hand&&av>4?.5:0)+(Math.abs(aLat)>lim*.92?.4:0)+(brk>0&&vf>14?.35:0),0,1);
  s.thr+=((thr?1:0)-s.thr)*(1-Math.exp(-10*h));s.brk=brk>0&&vf>.5?1:0;s.hand=hand?1:0;
  /* rpm: con embrague en 1ª / parado sube con el acelerador */
  const tgt=(Math.abs(nvf2)<1.3?(.16+.34*(thr||0)):.15+.85*clamp(Math.abs(nvf2)/tops[gi],0,1.1));
  s.rpm+=(tgt-s.rpm)*(1-Math.exp(-(s.shift>0?5:9)*h));
  s.spin+=nvf2*h/(.34*sc);
  return hit}

 /* aplicar la pose al modelo 3D (ruedas, carrocería, volante, luces) */
 function applyVisual(d,dt){
  const s=d.st,root=d.root,sc=d.scl||1;
  root.position.set(d.x,0,d.z);root.rotation.y=d.ry;
  const tp=clamp(s.aLong*.011,-.045,.05),tr=d.kind==='car'?clamp(s.aLat*.012,-.06,.06):clamp(-Math.atan2(s.aLat,9.8)*1.05,-.62,.62);
  d._p=(d._p||0)+(tp-(d._p||0))*(1-Math.exp(-8*dt));d._r=(d._r||0)+(tr-(d._r||0))*(1-Math.exp(-6*dt));
  if(d.kind==='car'){d.body.rotation.set(d._r,0,d._p)}else{d.body.rotation.set(d._r,0,d._p*.6)}
  for(const w of d.wheels){w.sp.rotation.z=-s.spin;if(w.front)w.pv.rotation.y=(d.kind==='car')?s.delta:0}
  if(d.kind==='moto')d.steer.rotation.y=s.delta*1.15;
  if(d.kind==='car'&&d.steerG)d.steerG.rotation.x=-s.steer*2.4;
  d.tailM.color.setHex((s.brk||s.hand)?0xff2a1a:(s.lights?0xb01616:0x6a0d0d))}

 /* ════════ 8 · cámaras ════════ */
 function orbit(tx,ty,tz,dist,f,minD){
  const cp=Math.cos(P.pitch),sPt=Math.sin(P.pitch),sy=Math.sin(P.yaw),cy=Math.cos(P.yaw);
  let free=dist;
  for(let t=.5;t<=dist;t+=.4){const x=tx+sy*cp*t,z=tz+cy*cp*t;if(f===undefined?solidAt(x,z,.25):blocked(x,z,f)){free=Math.max(minD||.6,t-.4);break}}
  INT.camDist=INT.camDist===undefined?free:INT.camDist+(free-INT.camDist)*(1-Math.exp(-(free<INT.camDist?24:4)*(INT.dt||.016)));
  const cd=INT.camDist;
  camera.position.set(tx+sy*cp*cd,Math.max(.3,ty-sPt*cd),tz+cy*cp*cd);camera.rotation.set(P.pitch,P.yaw,0,'YXZ')}

 function sitStep(dt){
  const st=INT.seat,gy=st.fl?3:0;
  J.h=0;J.vy=0;J.grounded=true;
  P.x=st.x;P.z=st.z;P.y=gy;
  me.visible=PJ.third;
  const dx=-Math.sin(st.yaw),dz=-Math.cos(st.yaw);
  if(PJ.third){P.pitch=clamp(P.pitch,-.8,.6);orbit(st.x,gy+st.top+.7,st.z,2.4*INT.zoom,st.fl?1:0,.9);me.visible=INT.camDist>1}
  else{
   P.yaw=st.yaw+clamp(dAng(P.yaw,st.yaw),-2.0,2.0);P.pitch=clamp(P.pitch,-1.0,.9);INT.camDist=undefined;
   camera.position.set(st.x+dx*.1,gy+st.top+.72,st.z+dz*.1);camera.rotation.set(P.pitch,P.yaw,0,'YXZ')}
  const tf=FOV0;if(Math.abs(camera.fov-tf)>.05){camera.fov+=(tf-camera.fov)*(1-Math.exp(-7*dt));camera.updateProjectionMatrix()}}

 function driveStep(dt){
  const d=INT.veh,s=d.st;
  J.h=0;J.vy=0;J.grounded=true;
  const kk=k=>!!keys[k];
  const input={thr:(kk('w')||kk('arrowup'))?1:0,brk:(kk('s')||kk('arrowdown'))?1:0,hand:kk(' ')?1:0,
   steer:((kk('a')||kk('arrowleft'))?1:0)-((kk('d')||kk('arrowright'))?1:0)};
  /* subpasos para que a 120 km/h no se atraviesen paredes */
  const n=Math.max(1,Math.ceil(dt/.011));let hit=0;
  for(let i=0;i<n;i++)hit=Math.max(hit,drive(d,dt/n,input));
  applyVisual(d,dt);if(d.st.lights)placeHeadlights(d);
  if(hit>1.5){sndThump(hit);shake=Math.min(1,shake+hit/16);if(hit>9)say('¡Choque!')}
  /* P (multijugador y NPC) sigue al vehículo */
  P.x=d.x;P.z=d.z;P.y=0;P.fl=1;P.sp=Math.abs(s.vf);P.run=false;
  const fy=d.ry-Math.PI/2;PJ.bodyYaw=fy;
  /* cámara: la vista se recentra sola detrás del vehículo si no estás moviendo el mouse */
  const idle=(performance.now()-lastLook)>1300;
  const sy=Math.abs(s.vf);
  if(idle){P.yaw=lerpA(P.yaw,fy,1-Math.exp(-(INT.vcam===3?3.2:7)*dt));P.pitch+=((INT.vcam===3?(d.kind==='car'?-.17:-.15):(d.kind==='car'?-.09:-.2))-P.pitch)*(1-Math.exp(-3*dt))}
  P.pitch=clamp(P.pitch,-.9,.7);
  if(INT.vcam===1){P.yaw=fy+clamp(dAng(P.yaw,fy),-2.3,2.3)}
  INT.dt=dt;
  const p=vp(d);
  if(INT.vcam===3){
   me.visible=true;
   const dist=(d.kind==='car'?6.2:4.3)*INT.zoom+sy*.045;
   orbit(p.x,(d.kind==='car'?1.45:1.45),p.z,dist,undefined,1.6);camera.rotation.z=0;
   /* leve vaivén al acelerar */
  }else{
   me.visible=false;INT.camDist=undefined;
   d.body.updateWorldMatrix(true,false);const e=d.eye;V3.set(e[0],e[1],e[2]);d.body.localToWorld(V3);
   camera.position.copy(V3);camera.rotation.set(P.pitch,P.yaw,0,'YXZ');
   if(d.kind==='moto')camera.rotation.z=-d._r*.7;else camera.rotation.z=0;
   /* vibración del motor */
   camera.position.y+=Math.sin(performance.now()*.05)*.004*clamp(sy/10,0,1)}
  if(shake>.01){camera.position.x+=(Math.random()-.5)*.25*shake;camera.position.y+=(Math.random()-.5)*.2*shake;camera.position.z+=(Math.random()-.5)*.25*shake;shake*=Math.exp(-6*dt)}
  /* campo de visión: se abre con la velocidad */
  const tf=FOV0+clamp(sy/(d.kind==='car'?36:30),0,1)*13;
  if(Math.abs(camera.fov-tf)>.05){camera.fov+=(tf-camera.fov)*(1-Math.exp(-5*dt));camera.updateProjectionMatrix()}
  sndTick(d,s,s.vf,dt);
  /* tablero */
  const spd=Math.round(sy*KMH),gl=s.gear===0?'R':(sy<.4&&!input.thr?'N':String(s.gear));
  vh.style.display='flex';
  vh.innerHTML='<div><span class="kmh">'+spd+'</span><span class="u">km/h</span></div><div class="g">'+gl+'</div><div class="rb"><i style="width:'+Math.round(clamp(s.rpm,0,1)*100)+'%"></i></div>'+
   '<div class="ic">'+(s.lights?'<b>LUCES</b>':'luces')+' · '+(s.hand?'<b>FRENO DE MANO</b>':'freno de mano')+'</div>';
  PJ.busyHud='<b>'+(d.kind==='car'?'Conduciendo un carro':'En moto')+'</b> <i>· W S A D · Espacio freno de mano · H bocina · L luces · V cámara · M sonido · E bajar</i>'}

 /* ════════ 9 · envoltura de walkStep ════════ */
 const base=window.walkStep;
 window.walkStep=function(dt){
  if(INT.busyFail||INT.mode==='foot'){base(dt);postBlend(dt);return}
  try{
   INT.dt=dt;
   if(INT.mode==='sit')sitStep(dt);else if(INT.mode==='drive')driveStep(dt);
  }catch(err){fail(err);base(dt)}
  postBlend(dt)};
 function postBlend(dt){
  if(blend.t<1){blend.t=Math.min(1,blend.t+dt/.5);const e=1-Math.pow(1-blend.t,3);camera.position.lerpVectors(blend.from,camera.position,e)}}

 /* ════════ 10 · avisos y reglas al salir del modo recorrido ════════ */
 const people_=()=>typeof people!=='undefined'?people:[];
 function occupied(st){
  for(const p of people_()){if(!p.userData.seated||!p.parent)continue;
   const x=p.position.x+p.parent.position.x,z=p.position.z+p.parent.position.z;if(Math.abs(x-st.x)<.45&&Math.abs(z-st.z)<.45)return true}
  return false}
 let frame=0;
 (function watch(){requestAnimationFrame(watch);
  try{
   frame++;
   if(mode!=='walk'){
    if(INT.mode==='sit')stand();else if(INT.mode==='drive')dismount(true);
    hud.style.display='none';vh.style.display='none';INT.nearby=null;
    if(tE)tE.style.display=tHand.style.display=tHorn.style.display='none';return}
   if(tE){const dv=INT.mode==='drive';tE.style.display='block';tHand.style.display=tHorn.style.display=dv?'block':'none'}
   if(INT.mode!=='foot'){
    INT.nearby=null;
    if(INT.mode==='sit'){hud.style.display='none';vh.style.display='none'}
    else{hud.style.display='none'}
    return}
   if(INT.busyFail||(frame&1))return;
   /* ¿qué hay cerca? */
   const px=P.x,pz=P.z,fl=P.y>1.5?1:0;let best=null,bd=9;
   for(const st of SEATS){if((st.fl?1:0)!==fl)continue;const dx=st.x-px,dz=st.z-pz;if(Math.abs(dx)>1.7||Math.abs(dz)>1.7)continue;
    const dd=Math.hypot(dx,dz);if(dd<1.5&&dd<bd&&!occupied(st)){bd=dd;best={type:'seat',seat:st,label:'Sentarte · '+st.kind}}}
   if(fl===0){
    for(const d of VEH){if(d.taken)continue;const p=vp(d);const dx=p.x-px,dz=p.z-pz;if(Math.abs(dx)>4.5||Math.abs(dz)>4.5)continue;
     const dd=Math.hypot(dx,dz)-(d.kind==='car'?1.5*(d.scl||1):.35);
     if(dd<(d.kind==="car"?1.9:1.7)&&dd+.6<bd){bd=dd+.6;best={type:'veh',veh:d,label:(d.kind==='car'?'Conducir el carro':'Subir a la moto')}}}}
   INT.nearby=best;
   if(best){hud.innerHTML='<kbd>E</kbd> '+best.label;hud.style.display='flex'}else hud.style.display='none';
   vh.style.display='none';
  }catch(err){}
 })();

 /* ════════ 11 · multijugador: cómo se ven los demás sentados o conduciendo ════════ */
 const remoteVeh=(k,i)=>k==='c'?AUTOS[i]&&AUTOS[i].userData.veh:MOTOS[i];
 INT.state=()=>{                                   /* lo que multiplayer.js envía */
  if(INT.mode==='sit')return {pz:1};
  if(INT.mode==='drive'&&INT.veh){const d=INT.veh;return {pz:d.kind==='car'?2:3,v:{k:d.kind==='car'?'c':'m',i:d.id,r:+d.ry.toFixed(3),s:+d.st.steer.toFixed(2),f:+d.st.vf.toFixed(1)}}}
  return {pz:0}};
 INT.remote=(a,dt)=>{
  const g=a.g,t=a.t,av=g.userData.av;if(!av)return false;
  try{
   if(t.v){
    const d=remoteVeh(t.v.k,t.v.i);if(!d)return false;
    const root=ensureRoot(d);if(!root)return false;
    if(a.rveh!==d){if(a.rveh)releaseRemote(a);a.rveh=d;d.taken=true;d.anchor.add(g);poseAvatar(g,t.v.k==='c'?2:3)}
    g.position.set(0,0,0);g.rotation.set(0,-Math.PI/2,0);
    const k=1-Math.exp(-12*dt);
    d.x+=(t.x-d.x)*k;d.z+=(t.z-d.z)*k;d.ry=lerpA(d.ry,t.v.r,k);
    d.st.vf=t.v.f||0;d.st.steer+=((t.v.s||0)-d.st.steer)*k;d.st.delta=d.st.steer*spec(d).dmax/(1+Math.pow(Math.abs(d.st.vf)/(d.kind==='car'?10:14),2));
    d.st.spin+=d.st.vf*dt/(.34*(d.scl||1));d.st.aLong=0;d.st.aLat=d.st.vf*d.st.vf*d.st.delta/spec(d).L*0;
    applyVisual(d,dt);return true}
   if(a.rveh){releaseRemote(a)}
   if(t.pz===1){if(av.pose!==1)poseAvatar(g,1);return true}
   if(av.pose)poseAvatar(g,0);
  }catch(err){}
  return false};
 function releaseRemote(a){const d=a.rveh;a.rveh=null;if(!d)return;d.taken=false;d.st.vf=0;scene.add(a.g);poseAvatar(a.g,0);
  const f=fwd(d.ry);a.g.position.set(d.x-Math.sin(d.ry)*0-f[1]*0+(-Math.sin(d.ry))*1.7,0,d.z+(-Math.cos(d.ry))*1.7);a.g.rotation.set(0,d.ry-Math.PI/2,0)}
})();
