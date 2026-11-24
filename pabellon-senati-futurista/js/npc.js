/* ════════════════════════════════════════════════════════════════════════
   NPC · comportamiento por rol para toda persona que no sea un "caminante" de pasillo.
   Antes, lo que colocabas con el panel (o salía de "Poblar aulas") quedaba quieto: solo los
   caminantes tenían animación. Aquí cada rol tiene su propia rutina:

     alumno    pasea cerca de donde está, se detiene a mirar alrededor y a veces "charla" con gestos.
               Sentado: teclea (se mueven los brazos).
     profesor  recorre un tramo corto y lento; al detenerse explica con el brazo levantado.
               El que está al frente de un aula solo se mueve junto a la pizarra.
     limpieza  (conserje) barre sin parar con una escoba, avanzando despacio.
     persona   camina más rápido y más lejos, con paradas cortas.

   Se acopla igual que salto.js y jugador.js: envuelve animate(dt) (la llama el bucle de 07-navegacion.js).
   Respeta las paredes con la misma función blocked() que usa el jugador. Va DESPUÉS de 07-navegacion.js.
   ════════════════════════════════════════════════════════════════════════ */
(()=>{
 const R=(a,b)=>a+Math.random()*(b-a);
 const lerpA=(a,b,k)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*k;
 const ROLE={                       /* speed m/s · rad = radio de paseo (m) · idle = segundos quieto */
  alumno:  {speed:[.9,1.4], rad:7,  idle:[2.5,7]},
  profesor:{speed:[.55,.85],rad:4,  idle:[3,8]},
  limpieza:{speed:[.45,.65],rad:10, idle:[.4,1.2]},
  persona: {speed:[1.1,1.6],rad:12, idle:[1,4]}};

 /* escoba compartida (una sola geometría/material para todos los conserjes) */
 const broomMat=[new THREE.MeshStandardMaterial({color:0x8a5a2b,roughness:.8}),new THREE.MeshStandardMaterial({color:0xd8b04a,roughness:.9})];
 const broomGeo=[new THREE.CylinderGeometry(.018,.018,1,6),new THREE.BoxGeometry(.38,.07,.09)];
 function addBroom(p){
  const b=new THREE.Group(),h=new THREE.Mesh(broomGeo[0],broomMat[0]),hd=new THREE.Mesh(broomGeo[1],broomMat[1]);
  h.scale.y=1.0;h.position.set(0,.5,.46);h.rotation.x=-.155;hd.position.set(0,.04,.56);
  b.add(h,hd);p.add(b);return b}

 function init(p){
  const u=p.userData,role=ROLE[u.type]||ROLE.persona;
  const ai=u.ai={role,hx:p.position.x,hz:p.position.z,rad:u.rad!==undefined?u.rad:role.rad,st:'idle',t:R(0,2.5),tx:0,tz:0,spd:R(role.speed[0],role.speed[1]),
   ph:R(0,6.28),clk:R(0,50),a0:[u.arms[0].rotation.x,u.arms[1].rotation.x],fy:p.rotation.y,swing:0,broom:null};
  ai.pl=inP(p.position.x+p.parent.position.x,p.position.z+p.parent.position.z);
  if(u.type==='limpieza'&&!u.seated)ai.broom=addBroom(p);
  return ai}

 /* los NPC no suben a la plataforma del estadio (ni bajan de ella si empezaron allí): solo entra el jugador */
 const RP=()=>window.RAISED&&window.RAISED[0];
 const inP=(x,z)=>{const r=RP();return !!r&&x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1};
 const nblocked=(ai,x,z,f)=>blocked(x,z,f)||(inP(x,z)!==!!ai.pl);
 function pickTarget(p,ai){
  const f=p.parent===g[1]?1:0,ox=p.parent.position.x,oz=p.parent.position.z;   /* p.position es local al grupo; blocked() usa el mundo */
  for(let i=0;i<8;i++){
   const a=R(0,6.283),d=R(.35,1)*ai.rad,tx=ai.hx+Math.sin(a)*d,tz=ai.hz+Math.cos(a)*d;
   let ok=!nblocked(ai,tx+ox,tz+oz,f);                                             /* el destino y 3 puntos del camino deben estar libres */
   for(let s=1;ok&&s<4;s++)ok=!nblocked(ai,p.position.x+(tx-p.position.x)*s/4+ox,p.position.z+(tz-p.position.z)*s/4+oz,f);
   if(ok){ai.tx=tx;ai.tz=tz;return true}}
  return false}

 function step(p,dt){
  const u=p.userData,ai=u.ai||init(p),A=u.arms,L=u.legs,role=ai.role,k=1-Math.exp(-10*dt);
  ai.clk+=dt;const T=ai.clk;
  const f=p.parent===g[1]?1:0,ox=p.parent.position.x,oz=p.parent.position.z;
  let wantSwing=0,armT0=ai.a0[0],armT1=ai.a0[1],yawT=null;

  if(u.seated){                                          /* sentados: alumno teclea, el resto respira */
   if(u.type==='alumno'){armT0+=Math.sin(T*9+ai.ph)*.07;armT1+=Math.sin(T*9+ai.ph+1.9)*.07}
   else{armT0+=Math.sin(T*1.5+ai.ph)*.02;armT1+=Math.sin(T*1.5+ai.ph)*.02}
  }else if(u.talk){                                      /* pareja conversando: no caminan, gesticulan por turnos */
   const on=Math.sin(T*.8+ai.ph)>0;armT1=on?-1.0+Math.sin(T*3.2)*.3:0;armT0=on?0:-.9+Math.sin(T*3.2+1)*.3;
   yawT=ai.fy+Math.sin(T*.6+ai.ph)*.18;
  }else{
   if(ai.st==='idle'){
    ai.t-=dt;
    if(u.type==='profesor'){armT1=-1.05+Math.sin(T*3)*.32;armT0=-.05+Math.sin(T*1.7)*.04;yawT=ai.fy+Math.sin(T*.5+ai.ph)*.35}   /* explica */
    else if(u.type==='limpieza'){armT0=armT1=-.9;yawT=ai.fy+Math.sin(T*.7+ai.ph)*.3}                                          /* barre sin avanzar */
    else if(u.type==='alumno'&&Math.sin(T*.35+ai.ph)>.55){armT1=-.95+Math.sin(T*4)*.25;yawT=ai.fy+Math.sin(T*.8+ai.ph)*.5}    /* charla */
    else{armT0+=Math.sin(T*1.2+ai.ph)*.03;armT1+=Math.sin(T*1.2+ai.ph+1)*.03;yawT=ai.fy+Math.sin(T*.45+ai.ph)*.6}              /* mira alrededor */
    if(ai.t<=0){if(ai.rad>.05&&pickTarget(p,ai)){ai.st='walk';ai.spd=R(role.speed[0],role.speed[1])}else ai.t=R(1,2.5)}
   }else{                                                /* caminando hacia el destino */
    const dx=ai.tx-p.position.x,dz=ai.tz-p.position.z,d=Math.hypot(dx,dz);
    if(d<.15){ai.st='idle';ai.t=R(role.idle[0],role.idle[1]);ai.fy=p.rotation.y}
    else{
     const nx=p.position.x+dx/d*ai.spd*dt,nz=p.position.z+dz/d*ai.spd*dt;
     if(nblocked(ai,nx+ox,nz+oz,f)){ai.st='idle';ai.t=R(.4,1.2);ai.fy=p.rotation.y}      /* pared o muro: se detiene y elige otro rumbo */
     else{p.position.x=nx;p.position.z=nz;yawT=Math.atan2(dx,dz);
      ai.ph+=dt*(2.6+ai.spd*3.4);wantSwing=Math.min(1,.45+ai.spd*.45);
      if(u.type==='limpieza')armT0=armT1=-.9}}
   }
  }
  ai.swing+=(wantSwing-ai.swing)*(1-Math.exp(-8*dt));
  const s=Math.sin(ai.ph)*.62*ai.swing,limp=u.type==='limpieza';
  L[0].rotation.x=u.seated?L[0].rotation.x:s;L[1].rotation.x=u.seated?L[1].rotation.x:-s;
  if(!u.seated&&!limp){A[0].rotation.x+=((armT0-s*.7*(wantSwing?1:0))-A[0].rotation.x)*k;A[1].rotation.x+=((armT1+s*.7*(wantSwing?1:0))-A[1].rotation.x)*k}
  else{A[0].rotation.x+=(armT0-A[0].rotation.x)*k;A[1].rotation.x+=(armT1-A[1].rotation.x)*k}
  if(yawT!==null)p.rotation.y=lerpA(p.rotation.y,yawT,1-Math.exp(-(ai.st==='walk'?9:3)*dt));
  if(ai.broom){                                           /* escoba: barrido lateral continuo, más amplio al avanzar */
   const amp=.28+.14*ai.swing;ai.broom.rotation.y=Math.sin(T*4.2)*amp;ai.broom.rotation.z=Math.sin(T*4.2)*.05}
 }

 const baseAnimate=window.animate;
 window.animate=function(dt){
  baseAnimate(dt);                                       /* caminantes de pasillo y campo, como antes */
  const ws=new Set(walkers.map(w=>w.p));
  for(let i=0;i<people.length;i++){const p=people[i];if(!p.parent||ws.has(p))continue;
   try{step(p,dt)}catch(e){p.userData.ai=p.userData.ai||{};p.userData.seated=true;console.error('[npc.js]',e)}}   /* ante un error, ese NPC queda quieto; el resto sigue */
 };
})();
