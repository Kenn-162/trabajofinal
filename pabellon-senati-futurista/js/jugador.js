/* ════════════════════════════════════════════════════════════════════════
   JUGADOR · tu personaje (mismo diseño que los demás), selector de género y skins,
   cámara 1ª / 3ª persona y extras del modo correr. Se acopla sin reescribir la navegación:
   envuelve walkStep igual que salto.js. Va DESPUÉS de salto.js y ANTES de multiplayer.js.

   Controles:  V = alternar 1ª / 3ª persona · Shift = correr · C = agacharse · Espacio = saltar · Rueda = zoom (3ª persona)
   Exporta:    window.PJ (estado), window.crearAvatar(nombre,etiqueta,look), window.cambiarAspecto(avatar,nombre,look),
               window.animarAvatar(avatar,vel,dt,aire,agachado 0-1), window.liberarAvatar(avatar), window.claveAspecto(look)
               → los usa multiplayer.js para dibujar a los demás jugadores igual que a ti.

   Aspecto ("look") = {f:0|1 género, o:0-5 ropa/skin, t:0-3 tono de piel, h:0-5 cabello}.

   Seguridad: todo lo que hace este archivo después de walkStep va dentro de un try/catch. Si algo falla, se
   desactiva solo la parte nueva (queda la 1ª persona de siempre) y el visor NUNCA se queda congelado.
   ════════════════════════════════════════════════════════════════════════ */
(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const lerpA=(a,b,k)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*k;          /* interpolación de ángulos por el camino corto */
 const typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
 const coarse=matchMedia('(pointer:coarse)').matches;
 const FOV=camera.fov;                                                        /* 58, definido en 01-escena.js */
 const KEY='senati.camara',KEYL='senati.aspecto';
 const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

 /* ── catálogo de aspecto ───────────────────────────────────────────── */
 const OUTFITS=[
  {type:'alumno',    name:'Alumno',        c:'#2d6cdf'},
  {type:'profesor',  name:'Profesor',      c:'#e9edf2'},
  {type:'persona',   name:'Casual',        c:'#d9822b'},
  {type:'limpieza',  name:'Mantenimiento', c:'#2fa24f'},
  {type:'deportista',name:'Deportivo',     c:'#d62f2f'},
  {type:'mecanico',  name:'Mecánico',      c:'#2f3b52'}];
 const TONES=[0xf1c9a5,0xd9a47a,0xb97a52,0x8a5a3a];                           /* = SKINS de 05-personas.js */
 const HAIRC=[0x14110f,0x2b1d12,0x4a3524,0x777777,0xc9a45a,0x8a3b1e];         /* los 4 primeros = HAIRS; + rubio y pelirrojo */
 const hex=n=>'#'+n.toString(16).padStart(6,'0');
 const normLook=l=>({f:l&&l.f?1:0,o:clamp(l&&l.o|0,0,OUTFITS.length-1),t:clamp(l&&l.t|0,0,TONES.length-1),h:clamp(l&&l.h|0,0,HAIRC.length-1)});
 const claveAspecto=window.claveAspecto=l=>l?l.f+'.'+l.o+'.'+l.t+'.'+l.h:'';

 function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
 function rng(seed){let a=seed||1;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 /* Valores estables que salen del nombre: aspecto por defecto (si no elegiste uno), mochila y estatura. */
 function baseFor(name){const r=rng(hash(String(name||'invitado')));return{t:r()*4|0,h:r()*4|0,f:r()<.4?1:0,pack:r()<.5,scale:.97+r()*.06}}

 /* ── avatar = raíz (posición + giro) > nodo de inclinación (al correr) > modelo de `person()` ── */
 function armModel(nombre,look){
  const b=baseFor(nombre),l=look?normLook(look):{f:b.f,o:0,t:b.t,h:b.h};
  const m=person(OUTFITS[l.o].type,false,{skin:TONES[l.t],hair:HAIRC[l.h],fem:!!l.f,pack:b.pack,scale:b.scale*(l.f?.97:1)});
  m.rotation.y=Math.PI;return m}                                              /* el frente del modelo es +Z; la cámara mira hacia -Z */
 function etiqueta(txt){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');
  x.fillStyle='rgba(5,12,24,.86)';x.fillRect(0,0,512,128);x.fillStyle='white';x.textAlign='center';x.font='bold 32px Arial';x.fillText(String(txt).slice(0,32),256,70);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));s.scale.set(2.4,.6,1);s.position.y=2.08;return s}

 window.crearAvatar=function(nombre,conEtiqueta,look){
  const root=new THREE.Group(),node=new THREE.Group(),model=armModel(nombre,look);
  node.add(model);root.add(node);
  root.userData.av={node,model,sy:model.scale.y,legs:model.userData.legs,arms:model.userData.arms,phase:Math.random()*6,amp:0,air:0,lean:0,cr:0};
  if(conEtiqueta)root.add(etiqueta(nombre));
  return root};
 window.cambiarAspecto=function(root,nombre,look){
  const a=root.userData.av;if(!a)return;
  a.node.remove(a.model);liberarAvatar(a.model);
  const m=armModel(nombre,look);a.node.add(m);a.model=m;a.sy=m.scale.y;a.legs=m.userData.legs;a.arms=m.userData.arms};

 /* Animación de marcha/carrera: la cadencia y el balanceo crecen con la velocidad; al saltar encoge piernas y sube brazos. */
 window.animarAvatar=function(root,sp,dt,aire,agach){
  const a=root.userData.av;if(!a)return;
  const moving=sp>.15,run=sp>3.6;
  a.phase+=dt*(moving?3+sp:0);
  a.cr+=((agach?1:0)*(agach>1?1:agach||0)-a.cr)*(1-Math.exp(-14*dt));                /* 0 de pie · 1 agachado */
  a.amp+=((moving?clamp(.12+sp*.15,0,1)*(1-.35*a.cr):0)-a.amp)*(1-Math.exp(-12*dt));
  a.air+=((aire>.02?1:0)-a.air)*(1-Math.exp(-18*dt));
  a.lean+=((run?.17:sp>.5?.05:0)-a.lean)*(1-Math.exp(-8*dt));
  const s=Math.sin(a.phase)*a.amp,arm=(run?-.38:0),A=a.air,L=a.legs,R=a.arms;
  L[0].rotation.x=s*(1-A)+(-.6)*A;      L[1].rotation.x=-s*(1-A)+(.25)*A;
  R[0].rotation.x=(-s*.9+arm)*(1-A)+(-1)*A; R[1].rotation.x=(s*.9+arm)*(1-A)+(-1)*A;
  /* agachado: el cuerpo se acorta (apoyado en los pies), se inclina hacia delante y los brazos se adelantan */
  const C=a.cr;a.model.scale.y=a.sy*(1-.34*C);R[0].rotation.x-=.5*C;R[1].rotation.x-=.5*C;
  a.node.rotation.x=-a.lean-.22*C};                    /* inclinación hacia delante (el frente del modelo es -Z) */

 window.liberarAvatar=function(root){root.traverse(o=>{
  if(o.isMesh&&o.geometry!==bg&&o.geometry!==SP)o.geometry.dispose();             /* bg y SP se comparten entre todas las personas */
  if(o.isSprite){if(o.material.map)o.material.map.dispose();o.material.dispose()}})};

 /* ── estado compartido ─────────────────────────────────────────────── */
 const PJ=window.PJ={third:lsGet(KEY)==='3',bodyYaw:P.yaw,dist:3.4,cur:3.4,broken:false,look:null,crouching:false,crouch:0};
 let custom=null;try{const s=lsGet(KEYL);if(s)custom=normLook(JSON.parse(s))}catch(e){}
 const curLook=()=>custom||Object.assign({o:0},(b=>({f:b.f,t:b.t,h:b.h}))(baseFor(window.PLAYER_NAME||'invitado')));
 PJ.look=curLook();

 /* ── mi avatar: se crea al recorrer y se rehace si cambia el nombre (inicio de sesión) o el aspecto ── */
 let me=null,meKey='';
 function syncMe(){const nm=window.PLAYER_NAME||'invitado',l=curLook(),k=nm+'|'+claveAspecto(l);PJ.look=l;if(k===meKey)return;meKey=k;
  if(!me){me=crearAvatar(nm,false,l);me.visible=false;me.name='mi-jugador';scene.add(me)}else cambiarAspecto(me,nm,l)}

 /* ── interfaz: panel "Mi personaje", botones de cámara, chip de estado y botones táctiles ───── */
 const css=document.createElement('style');
 css.textContent='#jug-hud{position:fixed;left:50%;bottom:calc(74px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:15;display:none;padding:7px 14px;border-radius:999px;background:rgba(6,12,28,.72);border:1px solid rgba(148,197,255,.25);color:#dfeaff;font:600 12px Barlow,Arial,sans-serif;letter-spacing:.04em;backdrop-filter:blur(8px);pointer-events:none;white-space:nowrap}#jug-hud b{color:#38e1ff;font-weight:700}#jug-hud i{font-style:normal;opacity:.65}@media(hover:none){#jug-hud{display:none!important}}.jug-t{position:fixed;z-index:25;display:none;padding:12px 14px;border-radius:50%;border:1px solid #9bdfff;background:#081321cc;color:#fff;font:bold 12px Arial}.jug-t.on{background:#1a4fc4}'+
  '#pjUI .pjl{font:600 11px Barlow,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8fa6cf;margin:10px 0 5px}#pjO button.on{background:rgba(47,116,255,.32);border-color:#6f97ff;box-shadow:0 0 0 1px rgba(111,151,255,.5),0 0 16px rgba(56,225,255,.25)}'+
  '.pjsw{display:flex;gap:8px;flex-wrap:wrap}.pjsw button{width:30px;height:30px;padding:0;border-radius:50%;border:2px solid rgba(255,255,255,.25);background:var(--c);box-shadow:none}.pjsw button.on{background:var(--c);border-color:#38e1ff;box-shadow:0 0 0 2px rgba(56,225,255,.45),0 0 12px rgba(56,225,255,.6)}';
 document.head.append(css);
 const hud=document.createElement('div');hud.id='jug-hud';document.body.append(hud);
 const say=m=>{if(typeof toast==='function')toast(m)};

 const cm1=btn('cm1'),cm3=btn('cm3');
 function paintCam(){if(cm1)cm1.classList.toggle('on',!PJ.third);if(cm3)cm3.classList.toggle('on',PJ.third)}
 function setCam(third){PJ.third=third;if(third)PJ.cur=PJ.dist;paintCam();lsSet(KEY,third?'3':'1');say(third?'Cámara en 3ª persona · rueda para el zoom':'Cámara en 1ª persona')}
 /* los botones del panel también inician el recorrido, porque solo ahí se ve la cámara */
 if(cm1)cm1.onclick=()=>{setCam(false);if(mode!=='walk')btn('vWalk').click()};
 if(cm3)cm3.onclick=()=>{setCam(true);if(mode!=='walk')btn('vWalk').click()};
 paintCam();

 /* Mi personaje: género + skin (ropa) + tono de piel + cabello. Se guarda en el navegador y se envía a los demás jugadores. */
 const ui=document.getElementById('pjUI');
 function paintLook(){if(!ui)return;const l=curLook();
  ui.querySelectorAll('#pjG button').forEach(b=>b.classList.toggle('on',+b.dataset.f===l.f));
  ui.querySelectorAll('#pjO button').forEach(b=>b.classList.toggle('on',+b.dataset.o===l.o));
  ui.querySelectorAll('#pjT button').forEach(b=>b.classList.toggle('on',+b.dataset.t===l.t));
  ui.querySelectorAll('#pjH button').forEach(b=>b.classList.toggle('on',+b.dataset.h===l.h))}
 if(ui){
  ui.innerHTML='<div class="seg" id="pjG"><button data-f="0">♂ Hombre</button><button data-f="1">♀ Mujer</button></div>'+
   '<div class="pjl">Skin</div><div class="row" id="pjO">'+OUTFITS.map((o,i)=>'<button data-o="'+i+'"><i class="g" style="background:'+o.c+'"></i> '+o.name+'</button>').join('')+'</div>'+
   '<div class="pjl">Tono de piel</div><div class="pjsw" id="pjT">'+TONES.map((c,i)=>'<button data-t="'+i+'" style="--c:'+hex(c)+'" aria-label="Tono '+(i+1)+'"></button>').join('')+'</div>'+
   '<div class="pjl">Cabello</div><div class="pjsw" id="pjH">'+HAIRC.map((c,i)=>'<button data-h="'+i+'" style="--c:'+hex(c)+'" aria-label="Cabello '+(i+1)+'"></button>').join('')+'</div>'+
   '<button id="pjSee" class="wide">Verme en 3ª persona</button>';
  ui.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
   if(b.id==='pjSee'){setCam(true);if(mode!=='walk')btn('vWalk').click();return}
   const l=Object.assign({},curLook());
   if(b.dataset.f!==undefined)l.f=+b.dataset.f;if(b.dataset.o!==undefined)l.o=+b.dataset.o;if(b.dataset.t!==undefined)l.t=+b.dataset.t;if(b.dataset.h!==undefined)l.h=+b.dataset.h;
   custom=normLook(l);lsSet(KEYL,JSON.stringify(custom));paintLook();
   if(mode!=='walk')say('Guardado · pulsa «Verme en 3ª persona» para ver tu personaje')});
  paintLook()}

 addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||typing(e)||mode!=='walk')return;
  if(e.code==='KeyV')setCam(!PJ.third);
  else if(e.code==='KeyC'){PJ.crouching=!PJ.crouching;syncTouch()}                 /* C: agacharse / levantarse */
  else if(e.code==='Space'&&PJ.crouching){PJ.crouching=false;syncTouch()}});     /* saltar desde agachado = levantarse y saltar */
 cv.addEventListener('wheel',e=>{if(mode!=='walk'||!PJ.third)return;e.preventDefault();PJ.dist=clamp(PJ.dist+e.deltaY*.003,1.6,6.5)},{passive:false});
 /* sin esto, soltar la ventana con Shift pulsado dejaba el personaje corriendo para siempre */
 const releaseKeys=()=>{for(const k in keys)keys[k]=0;syncTouch()};
 addEventListener('blur',releaseKeys);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseKeys()});

 let tRun=null,tCam=null,tCr=null;
 function syncTouch(){if(tRun)tRun.classList.toggle('on',!!keys.shift);if(tCr)tCr.classList.toggle('on',PJ.crouching)}
 if(coarse){
  tRun=document.createElement('button');tRun.type='button';tRun.className='jug-t';tRun.textContent='Correr';tRun.style.cssText='left:96px;bottom:150px';
  tRun.addEventListener('pointerdown',e=>{e.preventDefault();keys.shift=keys.shift?0:1;syncTouch()});
  tCam=document.createElement('button');tCam.type='button';tCam.className='jug-t';tCam.textContent='Cámara';tCam.style.cssText='left:16px;bottom:214px';
  tCam.addEventListener('pointerdown',e=>{e.preventDefault();setCam(!PJ.third)});
  tCr=document.createElement('button');tCr.type='button';tCr.className='jug-t';tCr.textContent='Agachar';tCr.style.cssText='left:176px;bottom:150px';
  tCr.addEventListener('pointerdown',e=>{e.preventDefault();PJ.crouching=!PJ.crouching;syncTouch()});
  document.body.append(tRun,tCam,tCr)}

 /* ── bucle de jugador: envuelve walkStep (ya envuelto por salto.js) ───── */
 const base=window.walkStep;let bob=0;
 function extras(dt){
  syncMe();
  const J=window.JUMP||{h:0,grounded:true},ground=P.y+J.h,sp=P.sp||0,f=P.y>1.5?1:0;
  const vx=typeof mvx==='number'?mvx:0,vz=typeof mvz==='number'?mvz:0;                   /* tolerante a una 07-navegacion.js en caché */
  const hit=typeof blocked==='function'?blocked:()=>false;

  /* hacia dónde mira el cuerpo: 1ª persona = hacia donde miras; 3ª persona = hacia donde caminas */
  if(PJ.third){if(sp>.35)PJ.bodyYaw=lerpA(PJ.bodyYaw,Math.atan2(-vx,-vz),1-Math.exp(-14*dt))}
  else PJ.bodyYaw=P.yaw;

  PJ.crouch+=((PJ.crouching?1:0)-PJ.crouch)*(1-Math.exp(-11*dt));if(PJ.crouch<.005&&!PJ.crouching)PJ.crouch=0;
  me.position.set(P.x,ground,P.z);me.rotation.y=PJ.bodyYaw;animarAvatar(me,sp,dt,J.h,PJ.crouch);

  if(PJ.third){
   /* cámara orbital detrás del hombro; la distancia se acorta si hay un muro y vuelve despacio */
   P.pitch=clamp(P.pitch,-.8,.6);
   const cp=Math.cos(P.pitch),sPt=Math.sin(P.pitch),sy=Math.sin(P.yaw),cy=Math.cos(P.yaw),px=P.x,pz=P.z,py=ground+1.55-.6*PJ.crouch,side=.35;
   let free=PJ.dist;
   for(let t=.3;t<=PJ.dist;t+=.15){if(hit(px+sy*cp*t+cy*side,pz+cy*cp*t-sy*side,f)){free=Math.max(.5,t-.25);break}}
   PJ.cur+=(free-PJ.cur)*(1-Math.exp(-(free<PJ.cur?26:5)*dt));
   camera.position.set(px+sy*cp*PJ.cur+cy*side,Math.max(ground+.3,py-sPt*PJ.cur),pz+cy*cp*PJ.cur-sy*side);
   camera.rotation.set(P.pitch,P.yaw,0,'YXZ');
   me.visible=PJ.cur>.9;                               /* si la cámara queda pegada al cuerpo, se oculta para no ver por dentro */
  }else{
   me.visible=false;                                   /* en 1ª persona no se dibuja el propio cuerpo */
   camera.position.y-=.62*PJ.crouch;                   /* los ojos bajan al agacharse */
   /* balanceo de cabeza muy sutil al caminar y más marcado al correr (solo en el suelo) */
   if(sp>.3&&J.grounded){bob+=dt*(3+sp);camera.position.y+=Math.sin(bob*2)*(P.run?.035:.016)*clamp(sp/2.3,0,1)}
  }

  /* el campo de visión se abre al correr (sensación de velocidad) */
  const tf=FOV+(P.run?8:0)+(PJ.third?2:0);
  if(Math.abs(camera.fov-tf)>.05){camera.fov+=(tf-camera.fov)*(1-Math.exp(-7*dt));camera.updateProjectionMatrix()}
  if(!(isFinite(camera.position.x+camera.position.y+camera.position.z)&&isFinite(camera.fov)))throw new Error('cámara con valores no válidos (NaN)');
 }
 function fallback(err){
  PJ.broken=true;PJ.third=false;paintCam();
  console.error('[jugador.js] Se desactivó la 3ª persona para no congelar el visor:',err);
  if(me)me.visible=false;camera.fov=FOV;camera.updateProjectionMatrix();
  say('Se desactivó la 3ª persona por un error. Detalle en la consola (F12).')}
 window.walkStep=function(dt){
  base(dt);                                           /* mueve, fija la cámara a la altura de los ojos y suma el salto */
  if(PJ.broken)return;
  try{extras(dt)}catch(err){fallback(err)}
 };

 /* ── chip de estado y limpieza al salir del recorrido ──────────────── */
 let last='',lastMode='';
 (function watch(){requestAnimationFrame(watch);
  try{
   const w=mode==='walk';
   if(w&&lastMode!=='walk')PJ.cur=PJ.dist;
   if(!w&&lastMode==='walk'){PJ.crouching=false;PJ.crouch=0;if(me)me.visible=false;if(camera.fov!==FOV){camera.fov=FOV;camera.updateProjectionMatrix()}}
   lastMode=mode;
   if(tRun)tRun.style.display=tCam.style.display=tCr.style.display=w?'block':'none';
   const t=w?'<b>'+(PJ.third?'3ª persona':'1ª persona')+'</b> · '+(PJ.crouching?'Agachado':P.run?'Corriendo':P.sp>.3?'Caminando':'Quieto')+' <i>· V cámara · Shift correr · C agacharse · Espacio saltar</i>':'';
   if(t!==last){last=t;hud.innerHTML=t;hud.style.display=w?'block':'none'}
  }catch(e){}
 })();
})();
