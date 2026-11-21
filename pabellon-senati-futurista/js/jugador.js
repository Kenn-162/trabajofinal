/* ════════════════════════════════════════════════════════════════════════
   JUGADOR · tu personaje (mismo diseño que los demás), cámara 1ª / 3ª persona
   y extras del modo correr. Se acopla sin reescribir la navegación: envuelve walkStep
   igual que salto.js. Va DESPUÉS de salto.js y ANTES de multiplayer.js.

   Controles:  V = alternar 1ª / 3ª persona · Shift = correr · Espacio = saltar · Rueda = zoom (3ª persona)
   Exporta:    window.PJ (estado), window.crearAvatar(nombre), window.animarAvatar(avatar,vel,dt,aire),
               window.liberarAvatar(avatar)  → los usa multiplayer.js para dibujar a los demás jugadores igual.
   ════════════════════════════════════════════════════════════════════════ */
(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const lerpA=(a,b,k)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*k;          /* interpolación de ángulos por el camino corto */
 const typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
 const coarse=matchMedia('(pointer:coarse)').matches;
 const FOV=camera.fov;                                                        /* 58, definido en 01-escena.js */
 const KEY='senati.camara';

 /* ── estado compartido ─────────────────────────────────────────────── */
 let saved=null;try{saved=localStorage.getItem(KEY)}catch(e){}
 const PJ=window.PJ={third:saved==='3',bodyYaw:P.yaw,dist:3.4,cur:3.4};

 /* ── aspecto propio y estable: sale del nombre de usuario ─────────────
    Todos los clientes calculan el mismo aspecto para el mismo nombre, así que los demás te ven
    igual que tú te ves, sin enviar nada extra al servidor. */
 function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
 function rng(seed){let a=seed||1;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 function lookFor(name){const r=rng(hash(String(name||'invitado')));return{skin:SKINS[r()*4|0],hair:HAIRS[r()*4|0],fem:r()<.4,pack:r()<.5,scale:.97+r()*.06}}

 function etiqueta(txt){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');
  x.fillStyle='rgba(5,12,24,.86)';x.fillRect(0,0,512,128);x.fillStyle='white';x.textAlign='center';x.font='bold 32px Arial';x.fillText(String(txt).slice(0,32),256,70);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));s.scale.set(2.4,.6,1);s.position.y=2.08;return s}

 /* Avatar = raíz (posición + giro) > inclinación (al correr) > modelo de `person()` (mira hacia -Z local, como la cámara). */
 window.crearAvatar=function(nombre,conEtiqueta){
  const root=new THREE.Group(),lean=new THREE.Group(),model=person('alumno',false,lookFor(nombre));
  model.rotation.y=Math.PI;lean.add(model);root.add(lean);
  root.userData.av={node:lean,legs:model.userData.legs,arms:model.userData.arms,phase:Math.random()*6,amp:0,air:0,lean:0};
  if(conEtiqueta)root.add(etiqueta(nombre));
  return root};

 /* Animación de marcha/carrera: la cadencia y el balanceo crecen con la velocidad; al saltar encoge piernas y sube brazos. */
 window.animarAvatar=function(root,sp,dt,aire){
  const a=root.userData.av;if(!a)return;
  const moving=sp>.15,run=sp>3.6;
  a.phase+=dt*(moving?3+sp:0);
  a.amp+=((moving?clamp(.12+sp*.15,0,1):0)-a.amp)*(1-Math.exp(-12*dt));
  a.air+=((aire>.02?1:0)-a.air)*(1-Math.exp(-18*dt));
  a.lean+=((run?.17:sp>.5?.05:0)-a.lean)*(1-Math.exp(-8*dt));
  const s=Math.sin(a.phase)*a.amp,arm=(run?-.38:0),A=a.air,L=a.legs,R=a.arms;
  L[0].rotation.x=s*(1-A)+(-.6)*A;      L[1].rotation.x=-s*(1-A)+(.25)*A;
  R[0].rotation.x=(-s*.9+arm)*(1-A)+(-1)*A; R[1].rotation.x=(s*.9+arm)*(1-A)+(-1)*A;
  a.node.rotation.x=-a.lean};                          /* inclinación hacia delante (el frente del modelo es -Z) */

 window.liberarAvatar=function(root){root.traverse(o=>{
  if(o.isMesh&&o.geometry!==bg&&o.geometry!==SP)o.geometry.dispose();             /* bg y SP se comparten entre todas las personas */
  if(o.isSprite){if(o.material.map)o.material.map.dispose();o.material.dispose()}})};

 /* ── mi avatar (se reconstruye cuando se conoce el usuario de la sesión) ─ */
 let me=null,meName=null;
 function buildMe(){const nm=window.PLAYER_NAME||'invitado';if(nm===meName)return;meName=nm;
  if(me){scene.remove(me);liberarAvatar(me)}
  me=crearAvatar(nm,false);me.visible=false;               /* sin etiqueta: tú ya sabes quién eres y de cerca tapa la vista */me.name='mi-jugador';scene.add(me)}

 /* ── interfaz: botones del panel, chip de estado y botones táctiles ───── */
 const css=document.createElement('style');
 css.textContent='#jug-hud{position:fixed;left:50%;bottom:calc(74px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:15;display:none;padding:7px 14px;border-radius:999px;background:rgba(6,12,28,.72);border:1px solid rgba(148,197,255,.25);color:#dfeaff;font:600 12px Barlow,Arial,sans-serif;letter-spacing:.04em;backdrop-filter:blur(8px);pointer-events:none;white-space:nowrap}#jug-hud b{color:#38e1ff;font-weight:700}#jug-hud i{font-style:normal;opacity:.65}@media(hover:none){#jug-hud{display:none!important}}.jug-t{position:fixed;z-index:25;display:none;padding:12px 14px;border-radius:50%;border:1px solid #9bdfff;background:#081321cc;color:#fff;font:bold 12px Arial}.jug-t.on{background:#1a4fc4}';
 document.head.append(css);
 const hud=document.createElement('div');hud.id='jug-hud';document.body.append(hud);
 const cm1=btn('cm1'),cm3=btn('cm3');
 function paintCam(){if(cm1)cm1.classList.toggle('on',!PJ.third);if(cm3)cm3.classList.toggle('on',PJ.third)}
 function setCam(third){PJ.third=third;if(third)PJ.cur=PJ.dist;paintCam();try{localStorage.setItem(KEY,third?'3':'1')}catch(e){}
  if(typeof toast==='function')toast(third?'Cámara en 3ª persona · rueda para el zoom':'Cámara en 1ª persona')}
 /* los botones del panel también inician el recorrido, porque solo ahí se ve la cámara */
 if(cm1)cm1.onclick=()=>{setCam(false);if(mode!=='walk')btn('vWalk').click()};
 if(cm3)cm3.onclick=()=>{setCam(true);if(mode!=='walk')btn('vWalk').click()};
 paintCam();
 addEventListener('keydown',e=>{if(e.code!=='KeyV'||e.repeat||e.ctrlKey||e.metaKey||e.altKey||typing(e)||mode!=='walk')return;setCam(!PJ.third)});
 cv.addEventListener('wheel',e=>{if(mode!=='walk'||!PJ.third)return;e.preventDefault();PJ.dist=clamp(PJ.dist+e.deltaY*.003,1.6,6.5)},{passive:false});
 /* sin esto, soltar la ventana con Shift pulsado dejaba el personaje corriendo para siempre */
 const releaseKeys=()=>{for(const k in keys)keys[k]=0;syncTouch()};
 addEventListener('blur',releaseKeys);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseKeys()});

 let tRun=null,tCam=null;
 function syncTouch(){if(tRun)tRun.classList.toggle('on',!!keys.shift)}
 if(coarse){
  tRun=document.createElement('button');tRun.type='button';tRun.className='jug-t';tRun.textContent='Correr';tRun.style.cssText='left:96px;bottom:150px';
  tRun.addEventListener('pointerdown',e=>{e.preventDefault();keys.shift=keys.shift?0:1;syncTouch()});
  tCam=document.createElement('button');tCam.type='button';tCam.className='jug-t';tCam.textContent='Cámara';tCam.style.cssText='left:16px;bottom:214px';
  tCam.addEventListener('pointerdown',e=>{e.preventDefault();setCam(!PJ.third)});
  document.body.append(tRun,tCam)}

 /* ── bucle de jugador: envuelve walkStep (ya envuelto por salto.js) ───── */
 const base=window.walkStep;let bob=0;
 window.walkStep=function(dt){
  base(dt);                                           /* mueve, fija la cámara a la altura de los ojos y suma el salto */
  buildMe();
  const J=window.JUMP||{h:0,grounded:true},ground=P.y+J.h,sp=P.sp||0,f=P.y>1.5?1:0;

  /* hacia dónde mira el cuerpo: 1ª persona = hacia donde miras; 3ª persona = hacia donde caminas */
  if(PJ.third){if(sp>.35)PJ.bodyYaw=lerpA(PJ.bodyYaw,Math.atan2(-mvx,-mvz),1-Math.exp(-14*dt))}
  else PJ.bodyYaw=P.yaw;

  me.position.set(P.x,ground,P.z);me.rotation.y=PJ.bodyYaw;animarAvatar(me,sp,dt,J.h);

  if(PJ.third){
   /* cámara orbital detrás del hombro; la distancia se acorta si hay un muro y vuelve despacio */
   P.pitch=clamp(P.pitch,-.8,.6);
   const cp=Math.cos(P.pitch),sPt=Math.sin(P.pitch),sy=Math.sin(P.yaw),cy=Math.cos(P.yaw),px=P.x,pz=P.z,py=ground+1.55,side=.35;
   let free=PJ.dist;
   for(let t=.3;t<=PJ.dist;t+=.15){if(blocked(px+sy*cp*t+cy*side,pz+cy*cp*t-sy*side,f)){free=Math.max(.5,t-.25);break}}
   PJ.cur+=(free-PJ.cur)*(1-Math.exp(-(free<PJ.cur?26:5)*dt));
   camera.position.set(px+sy*cp*PJ.cur+cy*side,Math.max(ground+.3,py-sPt*PJ.cur),pz+cy*cp*PJ.cur-sy*side);
   camera.rotation.set(P.pitch,P.yaw,0,'YXZ');
   me.visible=PJ.cur>.9;                               /* si la cámara queda pegada al cuerpo, se oculta para no ver por dentro */
  }else{
   me.visible=false;                                   /* en 1ª persona no se dibuja el propio cuerpo */
   /* balanceo de cabeza muy sutil al caminar y más marcado al correr (solo en el suelo) */
   if(sp>.3&&J.grounded){bob+=dt*(3+sp);camera.position.y+=Math.sin(bob*2)*(P.run?.035:.016)*clamp(sp/2.3,0,1)}
  }

  /* el campo de visión se abre al correr (sensación de velocidad) */
  const tf=FOV+(P.run?8:0)+(PJ.third?2:0);
  if(Math.abs(camera.fov-tf)>.05){camera.fov+=(tf-camera.fov)*(1-Math.exp(-7*dt));camera.updateProjectionMatrix()}
 };

 /* ── chip de estado y limpieza al salir del recorrido ──────────────── */
 let last='',lastMode='';
 (function watch(){requestAnimationFrame(watch);
  const w=mode==='walk';
  if(w&&lastMode!=='walk')PJ.cur=PJ.dist;
  if(!w&&lastMode==='walk'){if(me)me.visible=false;if(camera.fov!==FOV){camera.fov=FOV;camera.updateProjectionMatrix()}}
  lastMode=mode;
  if(tRun)tRun.style.display=tCam.style.display=w?'block':'none';
  const t=w?'<b>'+(PJ.third?'3ª persona':'1ª persona')+'</b> · '+(P.run?'Corriendo':P.sp>.3?'Caminando':'Quieto')+' <i>· V cámara · Shift correr · Espacio saltar</i>':'';
  if(t!==last){last=t;hud.innerHTML=t;hud.style.display=w?'block':'none'}
 })();
})();
