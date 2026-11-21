/* Funciones profesionales: eliminar de a una, ficha del proyecto, ocupación, captura */
const $=id=>document.getElementById(id);
let delMode=false,hov=null;
const NOM={alumno:'Alumno',profesor:'Profesor',persona:'Persona',limpieza:'Limpieza'},COL={alumno:'#2d6cdf',profesor:'#eeeeee',persona:'#d9822b',limpieza:'#2fa24f'};

/* aviso breve */
const toast=(()=>{const t=document.createElement('div');t.id='toast';document.body.appendChild(t);let h;return m=>{t.textContent=m;t.classList.add('show');clearTimeout(h);h=setTimeout(()=>t.classList.remove('show'),1600)}})();

/* anillo de selección */
const ring=new THREE.Mesh(new THREE.RingGeometry(.28,.38,32),new THREE.MeshBasicMaterial({color:0xff3b30,side:THREE.DoubleSide,depthTest:false,transparent:true}));
ring.rotation.x=-Math.PI/2;ring.renderOrder=10;ring.visible=false;scene.add(ring);

const owner=o=>{while(o&&!people.includes(o))o=o.parent;return o};
function hit(ev){mv.set(ev.clientX/innerWidth*2-1,-(ev.clientY/innerHeight)*2+1);ray.setFromCamera(mv,camera);scene.updateMatrixWorld(true);
 const h=ray.intersectObjects(people.filter(p=>p.parent&&p.parent.visible),true)[0];return h&&owner(h.object)}
function removePerson(p){const i=people.indexOf(p);if(i<0)return;p.parent.remove(p);people.splice(i,1);
 const w=walkers.findIndex(x=>x.p===p);if(w>=0)walkers.splice(w,1);if(hov===p){hov=null;ring.visible=false}cnt();toast('Eliminado: '+NOM[p.userData.type]+' · quedan '+people.length)}
function removeLast(){const p=people[people.length-1];p?removePerson(p):toast('No hay personas para quitar')}

function setDel(on){delMode=on;if(on){tool=null;document.querySelectorAll('#tools button').forEach(x=>x.classList.remove('on'))}
 $('del').classList.toggle('on',on);cv.style.cursor=on?'crosshair':'';if(!on){ring.visible=false;hov=null}
 if(on)toast('Modo eliminar: toca una persona')}
$('del').onclick=()=>setDel(!delMode);
$('undo').onclick=removeLast;
$('clr').onclick=()=>{if(people.length&&confirm('¿Borrar las '+people.length+' personas? Para quitar una sola usa "Eliminar una" o "Quitar última".'))clearAll()};
$('tools').addEventListener('click',()=>setDel(false));
cv.addEventListener('pointermove',e=>{if(!delMode)return;const p=hit(e);hov=p||null;ring.visible=!!p;if(p){p.getWorldPosition(ring.position);ring.position.y+=.04}cv.style.cursor=p?'pointer':'crosshair'});
cv.addEventListener('click',e=>{if(!delMode||drag)return;const p=hit(e);if(p)removePerson(p)});
addEventListener('keydown',e=>{if(/select|input/i.test(e.target.tagName))return;
 if(e.key==='Delete'||e.key==='Backspace'||(e.ctrlKey&&e.key.toLowerCase()==='z')){e.preventDefault();removeLast()}
 else if(e.key==='Escape')setDel(false);else if(e.key.toLowerCase()==='e'&&mode!=='walk')setDel(!delMode)});

/* ficha del proyecto */
const cap=rooms.reduce((a,r)=>a+r.seats.length,0),labs=rooms.filter(r=>r.lab).length;
const pro=document.createElement('aside');pro.id='pro';
pro.innerHTML=`<details open><summary>Ficha del proyecto</summary>
<div class="tabs"><button class="on" data-p="pa">Resumen</button><button data-p="pb">Ocupación</button><button data-p="pc">Atajos</button></div>
<div id="pa" class="pp"><dl>
<dt>Longitud</dt><dd>${L} m</dd><dt>Ancho</dt><dd>${(2*D).toFixed(1)} m</dd><dt>Área por piso</dt><dd>≈ ${Math.round(L*2*D)} m²</dd>
<dt>Pisos</dt><dd>2 (altura libre ${H} m)</dd><dt>Aulas</dt><dd>${rooms.length-labs} teóricas</dd><dt>Laboratorios</dt><dd>${labs} de cómputo</dd>
<dt>Baños</dt><dd>2 por piso (H / M)</dd><dt>Escaleras</dt><dd>5 (3 internas, 2 exteriores)</dd><dt>Aforo sentado</dt><dd>${cap} puestos</dd></dl></div>
<div id="pb" class="pp" hidden></div>
<div id="pc" class="pp" hidden><dl><dt>Supr / Retroceso</dt><dd>Quita la última</dd><dt>Ctrl + Z</dt><dd>Quita la última</dd><dt>E</dt><dd>Modo eliminar</dd><dt>Esc</dt><dd>Salir del modo</dd><dt>WASD / flechas</dt><dd>Recorrer</dd><dt>Shift</dt><dd>Correr</dd><dt>Espacio</dt><dd>Saltar</dd><dt>V</dt><dd>1ª / 3ª persona</dd><dt>Rueda</dt><dd>Zoom en 3ª persona</dd></dl></div>
<button id="shot" class="wide">Capturar imagen (PNG · 4K)</button></details>`;
document.body.appendChild(pro);
pro.querySelector('.tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;
 pro.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));pro.querySelectorAll('.pp').forEach(x=>x.hidden=x.id!==b.dataset.p)};
$('shot').onclick=()=>{const url=typeof window.captureFrame==='function'?window.captureFrame():(renderer.render(scene,camera),cv.toDataURL('image/png'));const a=document.createElement('a');a.download='pabellon-senati-futurista.png';a.href=url;a.click();toast('Imagen guardada')};

function updStats(){const n={alumno:0,profesor:0,persona:0,limpieza:0},fl=[0,0];let sit=0;
 people.forEach(p=>{n[p.userData.type]++;fl[p.parent===g[1]?1:0]++;if(p.userData.seated&&p.userData.type==='alumno')sit++});
 const tot=people.length||1,bar=(l,v,c)=>`<div class="bar"><span>${l}</span><i style="--w:${v/tot*100}%;--c:${c}"></i><b>${v}</b></div>`,pc=Math.round(sit/cap*100);
 $('pb').innerHTML=`<div class="kpi"><strong>${pc}%</strong><small>ocupación de puestos<br>${sit} de ${cap} sentados</small></div>`+
 Object.keys(n).map(k=>bar(NOM[k],n[k],COL[k])).join('')+'<h3>Por nivel</h3>'+bar('Piso 1',fl[0],'#6f97ff')+bar('Piso 2',fl[1],'#f5b700')}
updStats();
