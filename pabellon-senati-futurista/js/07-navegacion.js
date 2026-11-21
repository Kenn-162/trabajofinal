/* modes + walking */
let mode='orb';const P={x:1.2,z:0,y:0,fl:1,yaw:-Math.PI/2,pitch:0,sp:0,run:false},keys={};
const btn=id=>document.getElementById(id),setOn=id=>['vOrb','vTop','vWalk','vB1','vB2','vAerial','vStreet','vPhoto'].forEach(i=>btn(i).classList.toggle('on',i===id));
function toOrbit(p,t,id){mode='orb';orbit.enabled=true;lamp.intensity=0;pad.style.display='none';view(p,t);setOn(id)}
btn('vOrb').onclick=()=>toOrbit([46,13,20],[-12,2.5,-3],'vOrb');btn('vTop').onclick=()=>toOrbit([0,165,.1],[0,0,-5],'vTop');
function walk(x,z,fl,yaw){mode='walk';orbit.enabled=false;lamp.intensity=.7;btn('cx').checked=false;g[1].position.y=3;Object.assign(P,{x,z,fl,yaw,pitch:0,y:fl==2?3:0,sp:0,run:false});mvx=mvz=0;setOn('vWalk');pad.style.display=matchMedia('(pointer:coarse)').matches?'grid':'none'}
btn('vWalk').onclick=()=>walk(1.2,0,1,-Math.PI/2);
/* Encuadre cinematográfico */
btn('vAerial').onclick=()=>toOrbit([120,150,185],[-10,0,-30],'vAerial');   /* dron alto: campus Independencia */
btn('vStreet').onclick=()=>toOrbit([0,1.8,-134],[0,2.6,10],'vStreet');     /* a pie: eje del INGRESO SENATI */
btn('vPhoto').onclick=()=>toOrbit([16,4.2,-21],[-11,3.0,0.5],'vPhoto');    /* postal: fachada + pirámide */
const pad=btn('pad');
const go=btn('go');rooms.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(r=>{const o=document.createElement('option');o.value=rooms.indexOf(r);o.textContent=r.name+(r.f?' (piso 2)':' (piso 1)');go.appendChild(o)});
[['bm1','Baño hombres (piso 1)'],['bf1','Baño mujeres (piso 1)'],['bm2','Baño hombres (piso 2)'],['bf2','Baño mujeres (piso 2)']].forEach(a=>{const o=document.createElement('option');o.value=a[0];o.textContent=a[1];go.appendChild(o)});
go.onchange=()=>{if(go.value==='')return;if(go.value[0]=='b'){btn('c1').checked=btn('c2').checked=true;g[0].visible=g[1].visible=true;walk(go.value[1]=='m'?47.5:52.5,3.6,+go.value[2],Math.PI);return}const r=rooms[+go.value];btn('c1').checked=btn('c2').checked=true;g[0].visible=g[1].visible=true;walk(r.X(.9),r.Z(3.2),r.f+1,r.ex>0?Math.PI/2:-Math.PI/2)};
const OB=(typeof obstacles!=='undefined')?obstacles:[];
const blocked=(x,z,f)=>cols[f].some(c=>x>c[0]-.28&&x<c[1]+.28&&z>c[2]-.28&&z<c[3]+.28)||OB.some(c=>x>c[0]-.32&&x<c[1]+.32&&z>c[2]-.32&&z<c[3]+.32);
/* Caminar / correr: Shift = correr (solo hacia delante o de lado). La velocidad acelera y frena suave (inercia)
   y la diagonal ya no es más rápida. P.sp = velocidad actual (m/s), P.run = true mientras se corre de verdad. */
const SPD_WALK=2.3,SPD_RUN=5.8;let mvx=0,mvz=0;
function walkStep(dt){const fw=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),st=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);
 let ix=-Math.sin(P.yaw)*fw+Math.cos(P.yaw)*st,iz=-Math.cos(P.yaw)*fw-Math.sin(P.yaw)*st;const n=Math.hypot(ix,iz);if(n>1){ix/=n;iz/=n}
 const f=P.y>1.5?1:0,want=!!keys.shift&&fw>=0&&n>0,base=(want?SPD_RUN:SPD_WALK)*(fw<0&&!st?.7:1),k=1-Math.exp(-(n?9:14)*dt);
 mvx+=(ix*base-mvx)*k;mvz+=(iz*base-mvz)*k;
 const nx=P.x+mvx*dt,nz=P.z+mvz*dt;if(!blocked(nx,P.z,f))P.x=Math.max(-150,Math.min(150,nx));else mvx=0;if(!blocked(P.x,nz,f))P.z=Math.max(-175,Math.min(98,nz));else mvz=0;
 P.sp=Math.hypot(mvx,mvz);P.run=want&&P.sp>(SPD_WALK+SPD_RUN)/2;
 const zn=zones.find(q=>P.x>q[0]&&P.x<q[1]&&P.z*q[2]>CW&&P.z*q[2]<q[3]+1);if(zn){P.y=Math.max(0,Math.min(3,(zn[3]-P.z*zn[2])/5.4*3));P.fl=P.y>1.5?2:1}else P.y=P.fl==2?3:0;
 camera.position.set(P.x,P.y+1.65,P.z);camera.rotation.set(P.pitch,P.yaw,0,'YXZ')}
const typingTarget=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');addEventListener('keydown',e=>{if(typingTarget(e))return;keys[e.key.toLowerCase()]=1;if(e.key.startsWith('Arrow'))e.preventDefault()});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0});
pad.querySelectorAll('button').forEach(b=>{const k=b.dataset.k;b.onpointerdown=()=>keys[k]=1;b.onpointerup=b.onpointerleave=()=>keys[k]=0});
let d0=null,drag=false;const cv=renderer.domElement;
cv.addEventListener('pointerdown',e=>{d0={x:e.clientX,y:e.clientY};drag=false});
cv.addEventListener('pointermove',e=>{if(!d0)return;if(Math.hypot(e.clientX-d0.x,e.clientY-d0.y)>5)drag=true;if(mode=='walk'&&drag){P.yaw-=e.movementX*.005;P.pitch=Math.max(-1.3,Math.min(1.3,P.pitch-e.movementY*.005))}});
cv.addEventListener('pointerup',e=>{if(d0&&!drag&&tool)place(e);d0=null});

/* floor toggles */
btn('c1').onchange=e=>g[0].visible=e.target.checked;btn('c2').onchange=e=>g[1].visible=e.target.checked;btn('cr').onchange=e=>roofG.visible=e.target.checked;
btn('cx').onchange=e=>{if(e.target.checked&&mode=='walk')toOrbit([46,13,20],[-12,2.5,-3],'vOrb');g[1].position.y=e.target.checked?10:3};
function size(){renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',size);size();
const clk=new THREE.Clock();let booted=false;(function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05);animate(dt);clouds.position.x=((clouds.position.x+dt*1.5+250)%500)-250;if(mode=='walk')walkStep(dt);else orbit.update();if(typeof tickEnv==='function')tickEnv(clk.getElapsedTime(),dt);
{const d=mode==='walk'?0:camera.position.distanceTo(orbit.target);
/* desenfoque: solo de cerca; al alejar la imagen queda nítida */
if(typeof bokehPass!=='undefined'){bokehPass.uniforms['focus'].value=mode==='walk'?(window.PJ&&PJ.third?Math.max(2.5,PJ.cur+.8):4.5):d;bokehPass.uniforms['maxblur'].value=mode==='walk'?.008:.0075*Math.max(0,Math.min(1,(40-d)/20))}
/* bruma proporcional a la distancia: al alejar no se lava ni pierde calidad */
if(window.__fogBase){scene.fog.near=window.__fogBase.n+d*1.3;scene.fog.far=window.__fogBase.f+d*3}
/* near dinámico: evita parpadeo (z-fighting) del suelo en vistas lejanas */
{const nn=Math.max(.1,Math.min(3,d/120));if(Math.abs(camera.near-nn)>.05){camera.near=nn;camera.updateProjectionMatrix()}}
/* las nubes no tapan la vista cuando la cámara está a su altura o por encima */
{const cy=camera.position.y;clouds.children.forEach(s=>{s.visible=cy<s.position.y-35})}}
if(typeof gradePass!=='undefined')gradePass.uniforms['uTime'].value=clk.getElapsedTime();
composer.render();if(!booted){booted=true;const l=document.getElementById('loader');if(l)l.classList.add('done')}})();
function bathView(f){btn('c1').checked=true;g[0].visible=true;btn('cx').checked=false;g[1].position.y=3;btn('c2').checked=f==1;g[1].visible=f==1;roofG.visible=false;btn('cr').checked=false;toOrbit(f?[50,24,17]:[50,18,15],f?[50,3,4.5]:[50,0,4.5],f?'vB2':'vB1')}
btn('vB1').onclick=()=>bathView(0);btn('vB2').onclick=()=>bathView(1);
btn('tDay').onclick=()=>setTime(0);btn('tSunset').onclick=()=>setTime(1);btn('tNight').onclick=()=>setTime(2);setTime(0);
