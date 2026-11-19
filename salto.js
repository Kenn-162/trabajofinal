/* Salto con la tecla Espacio (acoplado sin tocar 07-navegacion.js).
   P.y sigue siendo la altura del SUELO (pisos/escaleras) que calcula la navegación; el salto es un desfase
   vertical JUMP.h >= 0 que se suma a la cámara y se envía al multijugador como y = P.y + JUMP.h.
   Física: impulso vertical + gravedad; solo se salta si JUMP.grounded (h == 0), así no hay salto infinito en el aire. */
(()=>{
 const V0=4.6,G=14,MAXH=1.2;           /* impulso (m/s), gravedad (m/s²) → altura de salto ≈ V0²/2G ≈ 0.75 m */
 const J=window.JUMP={h:0,vy:0,grounded:true};
 const typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
 function jump(){if(mode==='walk'&&J.grounded){J.vy=V0;J.grounded=false}}
 addEventListener('keydown',e=>{
  if(e.code!=='Space'||typing(e))return;       /* escribiendo en el chat: la barra espaciadora es un espacio normal */
  if(mode!=='walk')return;                     /* fuera del recorrido no se toca el comportamiento del navegador */
  e.preventDefault();                          /* evita scroll y que active el botón enfocado */
  if(!e.repeat)jump();
 },true);
 addEventListener('keyup',e=>{if(e.code==='Space'&&!typing(e)&&mode==='walk')e.preventDefault()},true);
 addEventListener('blur',()=>{keys[' ']=0});

 /* Botón de salto para pantallas táctiles (el pad en pantalla ya existe; este se muestra solo al recorrer). */
 let jb=null;
 if(matchMedia('(pointer:coarse)').matches){
  jb=document.createElement('button');jb.type='button';jb.textContent='Saltar';jb.setAttribute('aria-label','Saltar');
  jb.style.cssText='position:fixed;left:16px;bottom:150px;z-index:25;display:none;padding:14px 18px;border-radius:50%;border:1px solid #9bdfff;background:#081321cc;color:#fff;font:bold 13px Arial';
  jb.addEventListener('pointerdown',e=>{e.preventDefault();jump()});
  document.body.append(jb);
 }

 /* Gancho: se ejecuta después de walkStep (que ya fijó la cámara sobre el suelo) y le suma el salto. */
 const base=window.walkStep;
 window.walkStep=function(dt){
  base(dt);
  if(!J.grounded){
   J.vy-=G*dt;J.h+=J.vy*dt;
   if(J.h>=MAXH){J.h=MAXH;if(J.vy>0)J.vy=0}
   if(J.h<=0){J.h=0;J.vy=0;J.grounded=true}   /* detección de piso: aterriza */
  }
  if(J.h>0)camera.position.y+=J.h;
 };
 /* Al salir del recorrido o reiniciar la vista, se cancela cualquier salto en curso. */
 (function watch(){requestAnimationFrame(watch);if(mode!=='walk'&&(J.h||!J.grounded)){J.h=0;J.vy=0;J.grounded=true}if(jb)jb.style.display=mode==='walk'?'block':'none'})();
})();
