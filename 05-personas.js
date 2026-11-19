/* people */
const pm={},PM=c=>pm[c]||(pm[c]=S(c,.8));
const TY={alumno:{shirt:0x2d6cdf,pants:0x1d2433,h:1.68},profesor:{shirt:0xf0f0f0,pants:0x3a3a40,h:1.78,tie:1},persona:{shirt:0xd9822b,pants:0x3a5a8c,h:1.7},limpieza:{shirt:0x2fa24f,pants:0x1c7a3a,h:1.7}};
const sph=new THREE.SphereGeometry(.115,12,10),bg=new THREE.BoxGeometry(1,1,1);
function person(type,seated){const T=TY[type],p=new THREE.Group(),skin=[0xf1c9a5,0xd9a47a,0xb97a52,0x8a5a3a][Math.random()*4|0],hair=[0x1a1a1a,0x3b2a1a,0x777777][Math.random()*3|0];
 const bx=(w,h,d,c,x,y,z,par=p)=>{const m=new THREE.Mesh(bg,PM(c));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;par.add(m)};
 const hy=seated?.5:.82,legs=[],arms=[];
 for(const k of[-1,1]){const l=new THREE.Group();l.position.set(k*.1,hy,0);p.add(l);
  if(seated){bx(.15,.15,.44,T.pants,0,0,.22,l);bx(.14,.46,.14,T.pants,0,-.24,.42,l);bx(.14,.06,.24,0x222222,0,-.49,.48,l)}
  else{bx(.15,.78,.17,T.pants,0,-.39,0,l);bx(.15,.06,.26,0x222222,0,-.79,.04,l)}legs.push(l);
  const a=new THREE.Group();a.position.set(k*.27,hy+.52,0);p.add(a);bx(.1,.5,.12,T.shirt,0,-.25,0,a);bx(.09,.08,.09,skin,0,-.54,0,a);if(seated)a.rotation.x=-.8;arms.push(a)}
 bx(.4,.55,.22,T.shirt,0,hy+.28,0);const h=new THREE.Mesh(sph,PM(skin));h.position.y=hy+.72;h.castShadow=true;p.add(h);bx(.24,.07,.25,hair,0,hy+.82,-.01);
 if(T.tie)bx(.05,.3,.02,0x7a1f1f,0,hy+.3,.12);
 p.scale.setScalar(T.h/1.7*(.95+Math.random()*.1));p.userData={legs,arms,type,seated};return p}
/* personas más realistas */
const cyl=(a,b,h,s=10)=>new THREE.CylinderGeometry(a,b,h,s),SP=new THREE.SphereGeometry(1,14,12);
const TY2={alumno:{top:0x1b4fd8,bot:0x0e0f12,h:1.68},profesor:{top:0xe9edf2,bot:0x2b2e36,h:1.78},persona:{top:0xd9822b,bot:0x3a5a8c,h:1.7},limpieza:{top:0x2fa24f,bot:0x1d7a3b,h:1.68}};let logoMat=null;
function person(type,seated){const T=TY2[type],p=new THREE.Group(),sk=[0xf1c9a5,0xd9a47a,0xb97a52,0x8a5a3a][Math.random()*4|0],hc=[0x14110f,0x2b1d12,0x4a3524,0x777777][Math.random()*4|0],fem=Math.random()<.4;
 const mk=(g,c,x,y,z,par=p,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(g,PM(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;par.add(m);return m};
 const hy=seated?.5:.82,legs=[],arms=[];
 for(const k of[-1,1]){const l=new THREE.Group();l.position.set(k*.1,hy,0);p.add(l);
  if(seated){mk(cyl(.075,.065,.44),T.bot,0,0,.22,l).rotation.x=Math.PI/2;mk(cyl(.065,.055,.46),T.bot,0,-.24,.42,l);mk(bg,0xf2f2f2,0,-.49,.48,l,.12,.06,.26)}
  else{mk(cyl(.08,.06,.8),T.bot,0,-.4,0,l);mk(bg,type=='alumno'?0xf2f2f2:0x1a1a1a,0,-.79,.04,l,.12,.07,.27)}legs.push(l);
  const a=new THREE.Group();a.position.set(k*.26,hy+.5,0);p.add(a);mk(cyl(.058,.052,.24),T.top,0,-.12,0,a);mk(cyl(.042,.036,.3),sk,0,-.38,0,a);if(seated)a.rotation.x=-.8;arms.push(a)}
 mk(cyl(.2,.17,.62,14),T.top,0,hy+.3,0,p,1,1,.62);mk(cyl(.05,.05,.1),sk,0,hy+.64,0);mk(SP,sk,0,hy+.78,0,p,.105,.125,.115);
 mk(SP,hc,0,hy+.8,-.015,p,.112,.12,.12);if(fem)mk(cyl(.1,.09,.28),hc,0,hy+.62,-.08,p,1,1,.7);
 if(type=='alumno'){if(!logoMat)logoMat=new THREE.MeshBasicMaterial({map:tex(64,64,(c,w,h)=>{logo(c,32,32,26,'#fff')}),transparent:true});
  const lg=new THREE.Mesh(new THREE.PlaneGeometry(.075,.075),logoMat);lg.position.set(.09,hy+.45,.13);p.add(lg);if(Math.random()<.5)mk(bg,0x15171b,0,hy+.32,-.17,p,.3,.4,.12)}
 if(type=='limpieza')mk(cyl(.12,.12,.06),0x1f7a3a,0,hy+.9,0);
 if(type=='profesor')mk(bg,0x7a1f1f,0,hy+.38,.12,p,.05,.28,.02);
 p.scale.setScalar(T.h/1.7*(.95+Math.random()*.1));p.userData={legs,arms,type,seated};return p}
const people=[],walkers=[];
const cnt=()=>{document.getElementById('cnt').textContent=people.length+' personas';if(typeof updStats==='function')updStats()};
function put(f,type,x,z,ry,seated){const p=person(type,seated);p.position.set(x,0,z);p.rotation.y=ry;g[f].add(p);people.push(p);cnt();return p}
function clearAll(){people.forEach(p=>p.parent&&p.parent.remove(p));people.length=0;walkers.length=0;cnt()}
function populate(){clearAll();
 for(const r of rooms){if(Math.random()<.45)continue;const fy=r.ex>0?Math.PI/2:-Math.PI/2;
  put(r.f,'profesor',r.X(5),r.Z(3.4),fy+Math.PI,false);
  r.seats.filter(()=>Math.random()<(r.lab?.45:.5)).forEach(st=>put(r.f,'alumno',r.X(st.u),r.Z(st.v),fy,true))}
 const types=['alumno','persona','profesor','alumno'];
 for(const f of[0,1]){for(let k=0;k<6;k++){const p=put(f,types[k%4],0,0,0,false);walkers.push({p,z:(Math.random()-.5)*1.3,a:2+Math.random()*10,b:40+Math.random()*24,x:10+Math.random()*30,v:(.8+Math.random()*.5)*(Math.random()<.5?1:-1),t:Math.random()*6})}
  const c=put(f,'limpieza',0,0,0,false);walkers.push({p:c,z:.5,a:3,b:63,x:20,v:.6,t:0});put(f,'limpieza',50,2,Math.PI,false)}
 for(let k=0;k<5;k++)put(0,types[k%4],-16+k*8,12.6+Math.random()*2.4,Math.random()*6,false);
 if(window.__pabellonCampus)window.__pabellonCampus.forEach(([x,z,t,ry,st])=>put(0,t,x,z,ry,st))}
 /* cancha de fútbol: equipo azul vs blanco + referí */
 const field=[[-94,7],[-75,-3],[-58,9],[-46,-5],[-88,-12],[-52,13],[-70,2]];
 field.forEach(([fx,fz],i)=>{const p=put(0,i%3==2?'profesor':(i%2?'alumno':'persona'),fx,fz,Math.random()*6.28,false)});
 for(const fx of[-110,-42]){const p=put(0,'alumno',fx,1+Math.random()*6,Math.random()*6.28,false);
  walkers.push({p,z:0+Math.random()*6,a:-110,b:-42,x:fx,v:(.7+Math.random()*.5)*(Math.random()<.5?1:-1),t:Math.random()*6})}
 /* dos estudiantes conversando junto al ingreso */
 put(0,'alumno',2.6,-8.4,Math.PI/2,false);put(0,'persona',3.6,-8.1,-Math.PI/2,false)
function animate(dt){for(const w of walkers){w.x+=w.v*dt;w.t+=dt*4;if(w.x>w.b){w.x=w.b;w.v=-Math.abs(w.v)}if(w.x<w.a){w.x=w.a;w.v=Math.abs(w.v)}
 w.p.position.set(w.x,0,w.z);w.p.rotation.y=w.v>0?Math.PI/2:-Math.PI/2;const s=Math.sin(w.t)*.6,u=w.p.userData;u.legs[0].rotation.x=s;u.legs[1].rotation.x=-s;u.arms[0].rotation.x=-s*.7;u.arms[1].rotation.x=s*.7}}
