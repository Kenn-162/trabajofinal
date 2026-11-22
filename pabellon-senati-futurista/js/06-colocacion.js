/* placement */
const pick=[new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshBasicMaterial({visible:false})),new THREE.Mesh(new THREE.PlaneGeometry(L,2*D),new THREE.MeshBasicMaterial({visible:false}))];
pick[0].rotation.x=-Math.PI/2;pick[0].position.set(24,0,0);scene.add(pick[0]);   /* en el mundo: el pabellón ya no está en el origen */
pick[1].rotation.x=-Math.PI/2;pick[1].position.set(33,.02,0);g[1].add(pick[1]);
let tool=null;const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
function place(ev){mv.set(ev.clientX/innerWidth*2-1,-(ev.clientY/innerHeight)*2+1);ray.setFromCamera(mv,camera);scene.updateMatrixWorld(true);
 const c=[pick[0]];if(g[1].visible)c.push(pick[1]);const h=ray.intersectObjects(c)[0];if(!h)return;
 const f=h.object===pick[1]?1:0,l=g[f].worldToLocal(h.point.clone());put(f,tool,l.x,l.z,Math.random()*6.28,document.getElementById('sit').checked)}
document.getElementById('tools').onclick=e=>{const b=e.target.closest('button');if(!b)return;const t=b.dataset.t;tool=tool===t?null:t;[...document.querySelectorAll('#tools button')].forEach(x=>x.classList.toggle('on',x.dataset.t===tool))};
document.getElementById('pop').onclick=populate;document.getElementById('clr').onclick=clearAll;
