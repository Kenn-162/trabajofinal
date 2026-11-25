/* ════════════════════════════════════════════════════════════
   04c · AJUSTES DE PLANO (v9). Va DESPUÉS de 04-entorno.js y 04b-cerco-verde.js.
   1. Calle entre la Escuela de Artes Gráficas y el pabellón (+ calzada de ingreso prolongada hasta la pista sur)
   2. Muro a lo largo de la pista sur, de extremo a extremo
   3. Auditorio más pequeño: su mitad oeste pasa a ser una plaza con la puerta de ingreso
   3b. (ver bloque 5) Todo el nivel elevado 1.20 m: paseo, estadio, loza, comedor y plaza del auditorio
   4. Comedor habilitado: se entra por la puerta, con barra, cocina, mesas y carta
   5. Pedidos del comedor (al final de este archivo): E junto a la barra = carta → pagar → recoger en ENTREGA, y puerta corrediza
   Cada bloque está aislado en try/catch: si uno falla, el resto del campus queda como antes.
   ════════════════════════════════════════════════════════════ */
(()=>{
const near=(a,b,e=.03)=>Math.abs(a-b)<e;
const ok=(n,f)=>{try{f()}catch(e){console.warn('[04c-ajustes] «'+n+'» no se pudo aplicar:',e)}};
const todos=[];scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.parameters)todos.push(o)});
const esCaja=(o,w,h,d,x,y,z)=>{const p=o.geometry.parameters;return /Box/.test(o.geometry.type)&&near(p.width,w)&&near(p.height,h)&&near(p.depth,d)&&near(o.position.x,x)&&near(o.position.y,y)&&near(o.position.z,z)};
const caja=(...a)=>todos.filter(o=>esCaja(o,...a));
const plano=(w,h,x,z)=>todos.filter(o=>{const p=o.geometry.parameters;return /Plane/.test(o.geometry.type)&&near(p.width,w)&&near(p.height,h)&&near(o.position.x,x)&&near(o.position.z,z)});
const tocar=(a,f)=>{const m=caja(...a)[0];if(m)f(m);else console.warn('[04c-ajustes] pieza no hallada',a)};
const remodelar=(o,w,h,d,x,y,z)=>{o.geometry.dispose();o.geometry=new THREE.BoxGeometry(w,h,d);o.position.set(x,y,z)};
const quitar=o=>{if(o&&o.parent)o.parent.remove(o)};
const quitarObst=(x0,x1,z0,z1)=>{const i=obstacles.findIndex(b=>near(b[0],x0)&&near(b[1],x1)&&near(b[2],z0)&&near(b[3],z1));if(i>=0)obstacles.splice(i,1);else console.warn('[04c-ajustes] obstáculo no hallado',x0,x1,z0,z1)};
const quitarArbol=(x,z)=>{const g=scene.children.find(o=>o.isGroup&&o.children.length>=6&&near(o.position.x,x,.01)&&near(o.position.z,z,.01));if(g)scene.remove(g);
  for(let i=SOL.length-1;i>=0;i--)if(near(SOL[i][0],x,.01)&&near(SOL[i][1],z,.01))SOL.splice(i,1)};
/* cajas instanciadas (una sola llamada de dibujo por material) */
const unit=new THREE.BoxGeometry(1,1,1),IB=new Map();
const ib=(m,x0,x1,y0,y1,z0,z1)=>{let a=IB.get(m);if(!a)IB.set(m,a=[]);a.push([(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,x1-x0,y1-y0,z1-z0])};
const volcar=()=>{const q=new THREE.Quaternion(),M=new THREE.Matrix4(),p=new THREE.Vector3(),s=new THREE.Vector3();
  IB.forEach((a,m)=>{const im=new THREE.InstancedMesh(unit,m,a.length);a.forEach((b,i)=>{p.set(b[0],b[1],b[2]);s.set(b[3],b[4],b[5]);M.compose(p,q,s);im.setMatrixAt(i,M)});
    im.castShadow=!m.isMeshBasicMaterial;im.receiveShadow=true;im.frustumCulled=false;scene.add(im)});IB.clear()};
const EL=1.2;                                     /* altura del nivel elevado (estadio, loza, paseo, comedor, auditorio) */
const campus=[];                                   /* personas nuevas (mundo): [x,z,tipo,giro,sentado] */

/* ───────── 1 · CALLE ENTRE ARTES GRÁFICAS Y PABELLÓN ───────── */
ok('Calle Artes Gráficas / pabellón',()=>{
  const gG=scene.children.find(o=>o.isGroup&&near(o.position.x,-34)&&near(o.position.y,0)&&near(o.position.z,8));
  if(!gG)throw new Error('no se halló Artes Gráficas');
  const en=(...a)=>todos.filter(o=>esCaja(o,...a)).find(o=>{let p=o;while(p&&p!==gG)p=p.parent;return p===gG});
  /* Artes Gráficas pierde 4 m de fondo por el lado norte: queda en z 38…58 (antes 34…58) */
  const A=en(114,14.6,24,-31,7.3,38),B=en(115.2,.65,25.2,-31,14.925,38),C=en(114.8,.5,.4,-31,.35,25.4);
  if(A)remodelar(A,114,14.6,20,-31,7.3,40);if(B)remodelar(B,115.2,.65,21.2,-31,14.925,40);if(C)remodelar(C,114.8,.5,.4,-31,.35,29.4);
  quitarObst(-122,-8,34,58);obst(-122,-8,38,58);
  [[-3,34],[-100,44],[-120,30]].forEach(a=>quitarArbol(a[0],a[1]));                  /* árboles que quedan sobre la calle o dentro del edificio */
  const ZA=31.2,ZB=37.2,ZM=(ZA+ZB)/2;
  asphalt(-123,-9,ZA,ZB,12);                                                        /* calle E-O: de la pista oeste a la calzada */
  box(0xd6d9db,-123,-9,0,.07,ZA-.8,ZA);box(0xd6d9db,-123,-9,0,.07,ZB,ZB+.8);        /* veredas a cada lado */
  lineY(-123,-9,ZA+1.1,0xe3b93c,.8,.28);lineY(-123,-9,ZB-1.1,0xe3b93c,.8,.28);
  for(let x=-121;x<-10;x+=8)lineY(x,x+4,ZM,0xe8e9e6,.75,.2);
  /* la calzada de ingreso se prolonga al sur hasta empalmar con la pista sur */
  asphalt(-9,9,8,60,9);
  lineX(-8.3,6.5,ZA,0xe3b93c,.9,.3);lineX(-8.3,ZB,60,0xe3b93c,.9,.3);lineX(8.3,6.5,60,0xe3b93c,.9,.3);
  /* la línea amarilla de la pista oeste se corta en el cruce */
  plano(.28,209,-124.1,-46).forEach(m=>{m.geometry.dispose();m.geometry=new THREE.PlaneGeometry(.28,ZA+150.5);m.position.z=(ZA-150.5)/2});
  lineX(-124.1,ZB,58.5,0xe3b93c,.8,.28);
  circ.position.set(40,.018,16);                                                    /* "Zona de seguridad" sale de la calzada */
  [[1.8,.05,.5,8,.475,10],[1.8,.05,.05,8,.725,10.225],[.05,.45,.4,7.175,.225,10],[.05,.45,.4,8.825,.225,10]].forEach(a=>tocar(a,quitar));   /* banca que quedó sobre la calzada */
  for(let i=ASIENTOS.length-1;i>=0;i--)if(near(ASIENTOS[i].z,10)&&(near(ASIENTOS[i].x,7.55)||near(ASIENTOS[i].x,8.45)))ASIENTOS.splice(i,1);
  for(let i=SOL.length-1;i>=0;i--)if(near(SOL[i][1],10)&&(near(SOL[i][0],7.1)||near(SOL[i][0],8)||near(SOL[i][0],8.9)))SOL.splice(i,1);
  bench(13,10);
});

/* ───────── 2 · MURO A LO LARGO DE LA PISTA SUR ───────── */
ok('Muro pista sur',()=>{
  const X0=-175,X1=175,ZC=66.6,TH=.5,HM=2.8,DX=76,GW=1.9,HP=2.4;                      /* puerta peatonal frente a la Torre B (x 76) */
  const t0=tex(512,256,(c,w,h)=>{c.fillStyle='#e3e6e9';c.fillRect(0,0,w,h);noise(c,w,h,1200,.07,120,225);
    c.fillStyle='#8f969e';c.fillRect(0,h*.88,w,h*.12);c.fillStyle='rgba(40,48,60,.22)';c.fillRect(0,0,4,h);
    c.fillStyle='#1646a0';c.fillRect(0,h*.06,w,h*.07);logo(c,w/2,h*.52,40,'#1646a0')});
  const tramo=(a,b)=>{const t=t0.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set((b-a)/5,1);t.needsUpdate=true;
    const m=new THREE.Mesh(new THREE.BoxGeometry(b-a,HM,TH),new THREE.MeshStandardMaterial({map:t,roughness:.86,metalness:.02,envMapIntensity:.25}));
    m.position.set((a+b)/2,HM/2,ZC);m.castShadow=m.receiveShadow=true;scene.add(m);box(0xc9ced4,a-.15,b+.15,HM,HM+.12,ZC-.35,ZC+.35);obst(a,b,ZC-TH/2,ZC+TH/2)};
  tramo(X0,DX-GW/2);tramo(DX+GW/2,X1);
  const n=(X1-X0)/10+1,im=new THREE.InstancedMesh(new THREE.BoxGeometry(.7,HM+.25,.8),S(0xcfd3d8,.8),n),M=new THREE.Matrix4();
  for(let i=0;i<n;i++){M.makeTranslation(X0+i*10,(HM+.25)/2,ZC);im.setMatrixAt(i,M)}
  im.castShadow=im.receiveShadow=true;im.frustumCulled=false;scene.add(im);
  /* puerta: marco azul, dintel sobre el vano y una hoja abierta (como la puerta de una casa) */
  boxM(portalBlue,DX-GW/2-.18,DX-GW/2,0,HP+.3,ZC-.32,ZC+.32);boxM(portalBlue,DX+GW/2,DX+GW/2+.18,0,HP+.3,ZC-.32,ZC+.32);
  boxM(portalBlue,DX-GW/2-.18,DX+GW/2+.18,HP,HP+.3,ZC-.32,ZC+.32);boxM(S(0xe3e6e9,.86),DX-GW/2-.18,DX+GW/2+.18,HP+.3,HM,ZC-TH/2,ZC+TH/2);
  box(0xc9ced4,DX-GW/2-.33,DX+GW/2+.33,HM,HM+.12,ZC-.35,ZC+.35);
  {const hoja=new THREE.Group(),w=GW-.06;
   const hm=S(0x10151d,.18,{metalness:.6,envMapIntensity:1.1});
   const pn=new THREE.Mesh(new THREE.BoxGeometry(w,HP-.1,.06),hm);pn.position.set(w/2,(HP-.1)/2+.05,0);pn.castShadow=true;hoja.add(pn);
   for(const [x,y,ww,hh] of[[w/2,.08,w,.1],[w/2,HP-.05,w,.1],[.04,(HP-.1)/2+.05,.08,HP-.1],[w-.04,(HP-.1)/2+.05,.08,HP-.1]]){const b=new THREE.Mesh(new THREE.BoxGeometry(ww,hh,.1),portalBlue);b.position.set(x,y,0);hoja.add(b)}
   const mn=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.16,8),S(0xd3d8dc,.25,{metalness:.9}));mn.position.set(w-.18,1.05,.08);mn.rotation.z=Math.PI/2;hoja.add(mn);
   hoja.position.set(DX-GW/2+.02,0,ZC-TH/2-.05);hoja.rotation.y=Math.PI*.62;scene.add(hoja)}                       /* hoja entreabierta hacia el campus */
  box(0xd6d9db,DX-1.4,DX+1.4,0,.07,ZC-.4,75);                                                           /* senda hasta la Torre B */
});

/* ───────── 3 · AUDITORIO MÁS PEQUEÑO + PLAZA CON LA PUERTA ───────── */
ok('Auditorio y plaza',()=>{
  const CX=-46;                                                                        /* nuevo centro: el auditorio ocupa x −68…−24 */
  tocar([88,9.4,28,-68,4.7,-84],m=>remodelar(m,44,9.4,28,CX,4.7,-84));brickTex.repeat.set(4,2.4);
  tocar([88,.08,28.4,-68,.02,-84],m=>remodelar(m,44,.08,28.4,CX,.02,-84));
  tocar([91,3.2,36,-68,11,-86.5],m=>remodelar(m,47,3.2,36,CX,11,-86.5));
  tocar([91.5,2.6,36.5,-67.75,11,-86.5],m=>remodelar(m,47.5,2.6,36.5,CX,11,-86.5));
  tocar([88,6.8,.8,-68,3.4,-69.2],m=>{remodelar(m,44,6.8,.8,CX,3.4,-69.2);if(m.material.map)m.material.map.repeat.set(5,2)});
  tocar([36,4.6,.7,-66,2.3,-69.55],m=>remodelar(m,32,4.6,.7,CX,2.3,-69.55));
  tocar([37.6,.7,.8,-66,4.95,-69.5],m=>remodelar(m,33.6,.7,.8,CX,4.95,-69.5));
  tocar([.34,2.6,.18,-66,3.4,-68.65],m=>{if(m.parent&&m.parent!==scene)m.parent.position.x+=CX+66});   /* cruz */
  tocar([74,.35,1.2,-67,12.775,-102.6],m=>remodelar(m,40,.35,1.2,CX,12.775,-102.6));
  tocar([12,.24,2.1,-66,.12,-67.45],m=>m.position.x=CX);tocar([12,.24,1.4,-66,.36,-67.1],m=>m.position.x=CX);
  banner.geometry.dispose();banner.geometry=new THREE.PlaneGeometry(38,6.6);banner.position.x=CX;
  const col=todos.filter(o=>/Cylinder/.test(o.geometry.type)&&near(o.geometry.parameters.height,9.4)&&near(o.position.z,-102.2)&&near(o.position.y,4.7)).sort((a,b)=>a.position.x-b.position.x);
  col.forEach((m,i)=>m.position.x=-63.25+i*11.5);
  const zz=todos.filter(o=>/Box/.test(o.geometry.type)&&near(o.geometry.parameters.width,5.8)&&near(o.geometry.parameters.height,.72)&&near(o.position.y,12.82)&&near(o.position.z,-104.2)).sort((a,b)=>a.position.x-b.position.x);
  zz.forEach((m,i)=>{if(i<5)m.position.x=-63+i*9;else quitar(m)});
  quitarObst(-112,-24,-98,-70);obst(-68,-24,-98,-70);
  const viejos=window.__pabellonCampus.filter(a=>a[1]>-90);
  window.__pabellonCampus=[[-62,-96.5,'alumno',Math.PI/2,true],[-55,-96.5,'alumno',-Math.PI/2,true],[-38,-96.5,'persona',Math.PI/2,true],...viejos];
  campus.push([-90,-92,'alumno',2.2,false],[-88.8,-91.4,'persona',-.9,false],[-104,-80,'alumno',.5,false],[-103,-78.8,'alumno',3.6,false],[-76,-84,'profesor',-Math.PI/2,false]);

  /* plaza (donde estaba la mitad oeste del auditorio) */
  const PX0=-118,PX1=-68,PZ0=-111.5,PZ1=-70;
  const pt=tex(256,256,(c,w,h)=>{c.fillStyle='#dad5c9';c.fillRect(0,0,w,h);noise(c,w,h,600,.06,150,225);c.strokeStyle='#b8b2a4';c.lineWidth=3;c.strokeRect(1.5,1.5,w-3,h-3);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.strokeRect(5,5,w-10,h-10)});
  pt.wrapS=pt.wrapT=THREE.RepeatWrapping;pt.repeat.set((PX1-PX0)/2.4,(PZ1-PZ0)/2.4);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(PX1-PX0,PZ1-PZ0),new THREE.MeshStandardMaterial({map:pt,roughness:.88,metalness:.02,envMapIntensity:.2}));
  pl.rotation.x=-Math.PI/2;pl.position.set((PX0+PX1)/2,.012,(PZ0+PZ1)/2);pl.receiveShadow=true;scene.add(pl);
  box(0xe1e4e6,PX0-.15,PX1,0,.1,PZ0-.15,PZ0);box(0xe1e4e6,PX0-.15,PX0,0,.1,PZ0,PZ1);box(0xe1e4e6,PX0-.15,PX1,0,.1,PZ1,PZ1+.15);
  medallion(-86,-84,4.2);
  const anillo=new THREE.Mesh(new THREE.RingGeometry(4.5,5.1,48),new THREE.MeshBasicMaterial({color:0xe8b400}));anillo.rotation.x=-Math.PI/2;anillo.position.set(-86,.02,-84);scene.add(anillo);
  /* puerta de ingreso al auditorio (cara oeste, mirando a la plaza) */
  boxM(new THREE.MeshStandardMaterial({color:0x10151d,roughness:.15,metalness:.7,envMapIntensity:1.2}),-68.4,-67.9,0,3.5,-87,-81);
  boxM(portalBlue,-68.5,-67.85,3.5,3.8,-87.4,-80.6);
  for(const z of[-87.2,-84,-80.8])boxM(portalBlue,-68.5,-67.85,0,3.5,z-.12,z+.12);
  boxM(portalBlue,-73,-67.6,4.3,4.65,-91,-77);
  for(const z of[-90.6,-77.4])cylM(S(0xf2f2ee,.6),.2,.2,4.3,-72.7,2.15,z,12);
  box(0xd8d8d5,-70.2,-67.9,0,.14,-89,-79);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(10.4,1.3),new THREE.MeshBasicMaterial({map:signBlue('INGRESO AUDITORIO',null,'left',.85)}));
  sg.position.set(-67.93,6.2,-84);sg.rotation.y=-Math.PI/2;scene.add(sg);
  for(let i=0;i<5;i++)royalPalm(-114+i*9,-109.3,1.0);datePalm(-72.5,-108.5,.9);
  tree(-116,-100,.85);tree(-116,-80,.9);bushY(-116,-90,.9);bushY(-110,-110.3,.8);bushY(-92,-110.3,.8);bushY(-76,-110.3,.8);
  bench(-108,-72.4);bench(-96,-72.4);bench(-84,-72.4);lampPost(-72,-106,0);lampPost(-114,-76,0);
});

/* ───────── 4 · COMEDOR HABILITADO ───────── */
window.COMEDOR_CARTA=[
 {nombre:'Almuerzos',items:[{id:'menu',nombre:'Menú del día',desc:'Sopa + segundo + refresco',precio:10},{id:'lomo',nombre:'Lomo saltado',desc:'Con arroz y papas fritas',precio:15},{id:'arroz',nombre:'Arroz con pollo',desc:'Con ensalada criolla',precio:12},{id:'aji',nombre:'Ají de gallina',desc:'Con arroz y papa',precio:13},{id:'tallarin',nombre:'Tallarín saltado',desc:'De pollo o de carne',precio:13},{id:'broaster',nombre:'Pollo broaster',desc:'1/4 con papas y ensalada',precio:12}]},
 {nombre:'Snacks',items:[{id:'sandwich',nombre:'Sándwich de pollo',desc:'Pan francés y ensalada',precio:6},{id:'salchi',nombre:'Salchipapa',desc:'Con cremas',precio:7},{id:'empanada',nombre:'Empanada de carne',desc:'',precio:3.5},{id:'keke',nombre:'Keke de vainilla',desc:'',precio:2.5},{id:'fruta',nombre:'Porción de fruta',desc:'',precio:3}]},
 {nombre:'Bebidas',items:[{id:'chicha',nombre:'Chicha morada',desc:'Vaso grande',precio:3},{id:'maracuya',nombre:'Jugo de maracuyá',desc:'',precio:4},{id:'gaseosa',nombre:'Gaseosa 500 ml',desc:'',precio:3.5},{id:'agua',nombre:'Agua mineral',desc:'',precio:2},{id:'cafe',nombre:'Café pasado',desc:'',precio:2.5},{id:'emoliente',nombre:'Emoliente',desc:'',precio:1.5}]}];

ok('Comedor',()=>{
  const X0=-120,X1=-72,Z0=-62,Z1=-36,T=.3,HT=6.2,XD=-96,DW=3.2,dl=XD-DW/2,dr=XD+DW/2;
  const IX0=X0+T,IX1=X1-T,IZ0=Z0+T,IZ1=Z1-T,XO=XD,XP=-88,CB0=-57.8,CB1=-56.2,TY=1.07;
  /* se retira el bloque macizo viejo y su vidrio opaco; las mesas de afuera que tapaban la puerta */
  tocar([48,6.2,26,-100,3.1,-49],quitar);plano(47.4,4.4,-100,-35.92).forEach(quitar);plano(24.6,4.4,-75.92,-49).forEach(quitar);
  [1.075,.735].forEach(y=>tocar([48,.11,.14,-100,y,-35.75],quitar));quitarObst(-120,-72,-62,-36);
  scene.children.slice().forEach(o=>{if(o.isMesh&&o.position.y<1.3&&o.position.x>-99.6&&o.position.x<-91.4&&o.position.z>-35&&o.position.z<-32)quitar(o)});
  for(let i=ASIENTOS.length-1;i>=0;i--){const a=ASIENTOS[i];if(a.kind==='silla del comedor'&&a.x>-99.6&&a.x<-91.4&&a.z>-35&&a.z<-32)ASIENTOS.splice(i,1)}

  const blanco=S(0xdfe3e6,.88,{envMapIntensity:.3}),acero=S(0xb9bfc5,.32,{metalness:.8,envMapIntensity:1}),topA=S(0x9aa1a8,.3,{metalness:.85,envMapIntensity:1.1}),negro=S(0x1b1e24,.5,{metalness:.4}),
    amarillo=S(0xe8b400,.55),pata=S(0x6b7078,.5,{metalness:.6}),mesa=S(0xe9ebed,.6),luz=new THREE.MeshBasicMaterial({color:0xfff7e2}),pantalla=new THREE.MeshBasicMaterial({color:0x2bd7ff}),
    vidrio=new THREE.MeshStandardMaterial({color:0xa8d4ee,roughness:.06,metalness:.6,transparent:true,opacity:.28,side:THREE.DoubleSide,depthWrite:false,emissive:0xffcf8a,emissiveIntensity:0,envMapIntensity:1.6});
  window.__comedorGlassMat=vidrio;
  const P=(w,h,x,y,z,ry=0,m=vidrio)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);q.position.set(x,y,z);q.rotation.y=ry;scene.add(q);return q};

  const zComedor=scene.children.length;                                             /* todo lo que se crea desde aquí sube a 1.20 m al final */
  /* muros: norte y oeste macizos; sur y este con zócalo, vidrio y dintel */
  boxM(blanco,X0,X1,0,HT,Z0,Z0+T);boxM(blanco,X0,X0+T,0,HT,Z0,Z1);
  for(const [a,b] of[[X0,dl],[dr,X1]]){boxM(blanco,a,b,0,.9,Z1-T,Z1);boxM(blanco,a,b,5.3,HT,Z1-T,Z1);P(b-a,4.4,(a+b)/2,3.1,Z1-T/2);
    box(0xe8b400,a,b,1.02,1.13,Z1,Z1+.14);box(0xe8b400,a,b,.68,.79,Z1,Z1+.14);
    const n=Math.max(1,Math.round((b-a)/4));for(let k=0;k<=n;k++){const x=a+(b-a)*k/n;ib(portalBlue,x-.06,x+.06,.9,5.3,Z1-T-.02,Z1+.04)}}
  boxM(blanco,dl,dr,3.2,HT,Z1-T,Z1);
  boxM(blanco,X1-T,X1,0,.9,Z0,Z1);boxM(blanco,X1-T,X1,5.3,HT,Z0,Z1);P(Z1-Z0,4.4,X1-T/2,3.1,(Z0+Z1)/2,Math.PI/2);
  {const n=6;for(let k=0;k<=n;k++){const z=Z0+(Z1-Z0)*k/n;ib(portalBlue,X1-T-.02,X1+.04,.9,5.3,z-.06,z+.06)}}
  /* puerta: marco azul + 2 hojas corredizas de vidrio (se abren solas al acercarte; ver comedor.js) */
  boxM(portalBlue,dl-.2,dr+.2,3.2,3.5,Z1-T-.1,Z1+.15);boxM(portalBlue,dl-.2,dl,0,3.2,Z1-T-.1,Z1+.15);boxM(portalBlue,dr,dr+.2,0,3.2,Z1-T-.1,Z1+.15);
  const hoja=cx=>{const g=new THREE.Group(),bm=(w,h,d,x,y)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),portalBlue);m.position.set(x,y,0);g.add(m)};
    const v=new THREE.Mesh(new THREE.PlaneGeometry(DW/2-.04,3.0),vidrio);v.position.y=1.55;g.add(v);
    bm(DW/2-.04,.08,.06,0,.04);bm(DW/2-.04,.08,.06,0,3.1);bm(.06,3.1,.06,-(DW/4-.05),1.55);bm(.06,3.1,.06,DW/4-.05,1.55);
    g.position.set(cx,0,Z1-T-.08);scene.add(g);return g};
  window.__comedorPuertas={izq:hoja(XD-DW/4),der:hoja(XD+DW/4),xi:XD-DW/4,xd:XD+DW/4,x:XD,z:Z1,paso:DW/2-.1};
  {const L=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.85),new THREE.MeshBasicMaterial({map:tex(512,128,(c,w,h)=>{c.fillStyle='#0d2f6b';c.fillRect(0,0,w,h);c.strokeStyle='#8fb4f2';c.lineWidth=4;c.strokeRect(4,4,w-8,h-8);
    c.fillStyle='#3fe08a';c.beginPath();c.arc(48,64,16,0,7);c.fill();c.fillStyle='#fff';c.font='800 50px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.textBaseline='middle';c.fillText('ABIERTO · ENTRADA',84,52);
    c.font='600 28px "Barlow Condensed",Arial Narrow,Arial';c.fillStyle='#ffe9a8';c.fillText('Lun–Sáb 7:00 – 20:00',84,96)})}));L.position.set(XD,4.45,Z1+.02);scene.add(L)}
  /* piso, cielo raso, luces */
  const pt=tex(128,128,(c,w,h)=>{c.fillStyle='#d9dcda';c.fillRect(0,0,w,h);noise(c,w,h,360,.08,150,225);c.strokeStyle='#b4b9b6';c.lineWidth=3;c.strokeRect(0,0,w,h)});
  pt.wrapS=pt.wrapT=THREE.RepeatWrapping;pt.repeat.set((IX1-IX0)/1.2,(IZ1-IZ0)/1.2);
  const piso=new THREE.Mesh(new THREE.PlaneGeometry(IX1-IX0,IZ1-IZ0),new THREE.MeshStandardMaterial({map:pt,roughness:.35,metalness:.05,envMapIntensity:.5}));
  piso.rotation.x=-Math.PI/2;piso.position.set((IX0+IX1)/2,.04,(IZ0+IZ1)/2);piso.receiveShadow=true;scene.add(piso);
  const techo=new THREE.Mesh(new THREE.PlaneGeometry(IX1-IX0,IZ1-IZ0),new THREE.MeshStandardMaterial({color:0xf2f2ee,roughness:.9}));
  techo.rotation.x=Math.PI/2;techo.position.set((IX0+IX1)/2,HT-.04,(IZ0+IZ1)/2);scene.add(techo);
  for(const z of[-59,-53,-47,-41])for(let k=0;k<8;k++){const x=IX0+3.4+k*6.1;ib(luz,x-1.3,x+1.3,HT-.09,HT-.05,z-.25,z+.25)}
  for(let k=0;k<=7;k++){const x=IX0+k*6.8;ib(portalBlue,x-.12,x+.12,HT-.45,HT-.04,IZ0,IZ1)}
  const pl=new THREE.PointLight(0xffe8c4,.9,60,1.4);pl.position.set(XD,5.2,-49);scene.add(pl);

  /* barra de atención: caja de pedidos (XO) y entrega (XP); la cocina queda detrás */
  boxM(portalBlue,IX0,IX1,0,1,CB0,CB1-.05);boxM(S(0xf2f4f6,.35),IX0,IX1,1,TY,CB0-.05,CB1+.2);
  for(const [a,b] of[[IX0,XO-1.6],[XO+1.6,XP-1.6],[XP+1.6,IX1]]){P(b-a,.68,(a+b)/2,1.41,-56.5);ib(negro,a,b,1.74,1.78,-56.54,-56.46)}
  for(let i=0;i<7;i++){const x=-117.5+i*2.05,fc=[0xf3efe2,0x6b3a1f,0xe3b23c,0x7aa23a,0xe8c15a,0x4f9a3f,0xb5651d][i];ib(acero,x,x+1.8,TY,TY+.13,-57.6,-56.7);ib(S(fc,.85),x+.1,x+1.7,TY+.13,TY+.2,-57.5,-56.8)}
  ib(acero,-84,-78,TY,2.3,-57.7,-56.9);ib(S(0x2d6cdf,.4,{metalness:.3}),-83.8,-78.2,1.3,1.5,-56.92,-56.88);ib(S(0xd62f2f,.4),-83.8,-78.2,1.7,1.9,-56.92,-56.88);
  ib(negro,XO-1.5,XO-.6,TY,TY+.13,-57.5,-56.8);ib(pantalla,XO-1.45,XO-.65,TY+.13,TY+.4,-57.45,-57.4);ib(amarillo,XP-.7,XP+.7,TY,TY+.02,-57.3,-56.6);
  const rotulo=(txt,x,sub)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),new THREE.MeshBasicMaterial({map:tex(512,128,(c,w,h)=>{c.fillStyle='#1646a0';c.fillRect(0,0,w,h);c.strokeStyle='#f5b700';c.lineWidth=6;c.strokeRect(5,5,w-10,h-10);
    c.fillStyle='#fff';c.font='800 60px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(txt,w/2,sub?50:66);if(sub){c.font='600 30px "Barlow Condensed",Arial Narrow,Arial';c.fillStyle='#ffe9a8';c.fillText(sub,w/2,98)}})}));
    m.position.set(x,3.6,-57.0);scene.add(m);for(const dx of[-1.5,1.5])cylM(negro,.03,.03,2.1,x+dx,5.1,-57.0,6)};
  rotulo('CAJA · PEDIDOS',XO,'Pulsa E para pedir');rotulo('ENTREGA',XP,'Recoge tu pedido aquí');
  /* tableros de la carta, sobre la cocina */
  window.COMEDOR_CARTA.forEach((cat,i)=>{const cx=-108+i*12;
    const t=tex(1536,320,(c,w,h)=>{c.fillStyle='#0f1a2e';c.fillRect(0,0,w,h);c.fillStyle='#1646a0';c.fillRect(0,0,w,64);c.fillStyle='#fff';c.font='800 46px "Barlow Condensed",Arial Narrow,Arial';c.textBaseline='middle';c.textAlign='left';c.fillText(cat.nombre.toUpperCase(),28,34);
      cat.items.slice(0,6).forEach((it,k)=>{const x=28+(k%2)*760,y=108+(k/2|0)*68;c.fillStyle='#fff';c.font='600 36px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.fillText(it.nombre,x,y);c.fillStyle='#f5b700';c.textAlign='right';c.fillText('S/ '+it.precio.toFixed(2),x+700,y)})});
    boxM(negro,cx-4.9,cx+4.9,3.9,6.0,IZ0,IZ0+.02);P(9.6,2.0,cx,4.95,IZ0+.04,0,new THREE.MeshBasicMaterial({map:t}))});
  /* cocina (pared norte) */
  ib(acero,IX0+.1,-112,0,.9,IZ0+.02,IZ0+1.1);ib(topA,IX0+.1,-112,.9,.95,IZ0+.02,IZ0+1.15);ib(acero,-119.5,-112.2,3.1,3.8,IZ0+.02,IZ0+1.6);
  [-118.3,-116.9,-115.5,-114.1].forEach((x,i)=>{cylM(negro,.26,.26,.05,x,.975,-61.1,12);if(i%2)cylM(S(0xd0d4d8,.3,{metalness:.9}),.3,.27,.16,x,1.06,-61.1,14)});
  ib(acero,-111.4,-109.6,0,2.1,IZ0+.02,IZ0+1.3);ib(acero,-109.4,-107.6,0,2.1,IZ0+.02,IZ0+1.3);
  ib(acero,-112,-104,0,.88,-59.9,-58.9);ib(topA,-112.1,-103.9,.88,.93,-60,-58.8);ib(S(0xf3efe2,.8),-110,-108,.93,1.05,-59.6,-59.1);ib(S(0xb5651d,.8),-107,-105.5,.93,1.03,-59.6,-59.1);
  ib(topA,-106,-90,1.4,1.44,IZ0+.02,IZ0+.6);ib(topA,-106,-90,2.3,2.34,IZ0+.02,IZ0+.6);
  for(let k=0;k<8;k++){ib(S([0xd62f2f,0xf5b700,0x3a9a5a,0xf1ece0][k%4],.7),-105.5+k*2,-104.5+k*2,1.44,1.8,IZ0+.1,IZ0+.5);ib(S(0xf1ece0,.7),-105.5+k*2,-104.5+k*2,2.34,2.7,IZ0+.1,IZ0+.5)}
  ib(acero,-88.6,-81.4,0,.9,IZ0+.02,IZ0+1.1);ib(topA,-88.6,-81.4,.9,.95,IZ0+.02,IZ0+1.15);ib(acero,-88.5,-81.5,3.1,3.8,IZ0+.02,IZ0+1.6);
  for(const x of[-88,-86,-84])ib(negro,x,x+1.6,.95,1.1,-61.4,-60.8);
  ib(acero,-80.9,-79.1,0,2.1,IZ0+.02,IZ0+1.3);ib(acero,-78.9,-77.1,0,2.1,IZ0+.02,IZ0+1.3);ib(acero,-76.6,-72.6,0,.9,IZ0+.02,IZ0+1.1);ib(topA,-76.6,-72.6,.9,.95,IZ0+.02,IZ0+1.15);

  /* sala: 18 mesas con 72 sillas (se pueden usar con E) */
  const silla=(x,z,c)=>{ib(amarillo,x-.23,x+.23,.43,.48,z-.23,z+.23);ib(amarillo,x-.23,x+.23,.48,.95,z-c*.23-.025,z-c*.23+.025);ib(pata,x-.21,x-.19,0,.43,z-.2,z+.2);ib(pata,x+.19,x+.21,0,.43,z-.2,z+.2);
    ASIENTOS.push({x,z,y:.45+EL,yaw:c>0?Math.PI:0,kind:'silla del comedor'})};
  for(const tz of[-49.5,-44.5,-39.5])for(const tx of[-101,-107,-113,-91,-85,-79]){
    ib(mesa,tx-.95,tx+.95,.72,.78,tz-.45,tz+.45);ib(pata,tx-.84,tx-.78,0,.72,tz-.35,tz+.35);ib(pata,tx+.78,tx+.84,0,.72,tz-.35,tz+.35);ib(pata,tx-.8,tx+.8,.3,.34,tz-.02,tz+.02);
    for(const dx of[-.45,.45]){silla(tx+dx,tz-.7,1);silla(tx+dx,tz+.7,-1)}}
  /* mural, plantas y bebederos */
  P(24,6,IX0+.03,3.4,-47,Math.PI/2,new THREE.MeshBasicMaterial({map:tex(2048,512,(c,w,h)=>{c.fillStyle='#123f8f';c.fillRect(0,0,w,h);const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,255,255,.25)');g.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=g;c.fillRect(0,0,w,h);
    logo(c,260,h/2,150,'#ffffff');c.fillStyle='#fff';c.font='900 190px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.textBaseline='middle';c.fillText('COMEDOR SENATI',470,h*.40);c.fillStyle='#ffe9a8';c.font='600 84px "Barlow Condensed",Arial Narrow,Arial';c.fillText('Buen provecho · come bien, estudia mejor',470,h*.74)})}));
  [[-118.4,-38.2],[-73.6,-38.2],[-118.4,-55],[-73.6,-55]].forEach(a=>plant(a[0],a[1],1.3));
  for(const x of[-117.5,-74.5]){ib(blanco,x-.3,x+.3,0,1.1,-38.8,-38.2);cylM(S(0x7fb8e0,.2,{metalness:.3}),.22,.22,.45,x,1.3,-38.5,12)}
  volcar();
  moveZone(zComedor,0,0).position.y=EL;
  /* colisiones: muros con el hueco de la puerta + barra. Los vehículos no pasan por la puerta (círculos sólidos). */
  obst(X0,X1,Z0,Z0+T);obst(X0,X0+T,Z0,Z1);obst(X1-T,X1,Z0,Z1);obst(X0,dl,Z1-T,Z1);obst(dr,X1,Z1-T,Z1);obst(X0,X1,CB0,CB1);
  solid(dl-.2,Z1-.15,.75);solid(dr+.2,Z1-.15,.75);
  window.__comedor={x0:IX0+1.2,x1:IX1-1.2,zf:CB1+.2,xo:XO,xp:XP,zp:(CB0+CB1)/2,yMesa:TY+EL};
  /* personal y comensales */
  campus.push([XO,-59.3,'persona',0,false],[XP,-59.3,'persona',0,false],[-113,-60.2,'profesor',Math.PI,false],[-85,-60.2,'profesor',Math.PI,false],
    [-98,-54.6,'alumno',Math.PI,false],[-94.6,-53.2,'persona',Math.PI,false],
    [-101.45,-50.2,'alumno',0,true],[-100.55,-48.8,'persona',Math.PI,true],[-113.45,-45.2,'alumno',0,true],[-112.55,-43.8,'alumno',Math.PI,true],
    [-85.45,-45.2,'persona',0,true],[-84.55,-43.8,'alumno',Math.PI,true],[-91.45,-40.2,'alumno',0,true],[-78.55,-48.8,'alumno',Math.PI,true],[-107.45,-40.2,'persona',0,true]);
  /* las mesas de afuera frente a la puerta ya no estorban: se retiraron arriba */
});
/* ───────── 5 · NIVEL ELEVADO (1.20 m): paseo, estadio, loza, comedor y plaza del auditorio ─────────
   Según las fotos: el estadio, la loza, el comedor y el auditorio están a ~1.20 m sobre la vereda y se sube por escaleras
   (muro de piedra negra, peldaños con borde amarillo y barandas de acero inoxidable) hasta un paseo que llega al fondo. */
const N_ESC=6,RISE=EL/N_ESC,RUN=.32;
const stoneT=tex(256,256,(c,w,h)=>{c.fillStyle='#23262a';c.fillRect(0,0,w,h);noise(c,w,h,2600,.55,8,70);noise(c,w,h,900,.35,70,120);
  c.strokeStyle='rgba(0,0,0,.55)';c.lineWidth=3;for(let y=0;y<h;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();for(let x=((y/64)%2)*64;x<w;x+=128){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+64);c.stroke()}}});
stoneT.wrapS=stoneT.wrapT=THREE.RepeatWrapping;
const stone=(len,hh)=>{const t=stoneT.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(Math.max(.5,len/1.4),Math.max(.3,hh/1.4));t.needsUpdate=true;return new THREE.MeshStandardMaterial({map:t,roughness:.95,metalness:.05,envMapIntensity:.2})};
const inox=S(0xd3d8dc,.22,{metalness:.9,envMapIntensity:1.2}),yelM=S(0xf2b800,.5),treadM=S(0xb9bdc0,.9);
const tileT=tex(128,128,(c,w,h)=>{c.fillStyle='#d6d9db';c.fillRect(0,0,w,h);noise(c,w,h,500,.05,170,225);c.strokeStyle='#aeb3b7';c.lineWidth=3;c.strokeRect(1.5,1.5,w-3,h-3)});
const tileMat=(w,d)=>{const t=tileT.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/2.4,d/2.4);t.needsUpdate=true;return new THREE.MeshStandardMaterial({map:t,roughness:.9,metalness:.02,envMapIntensity:.2})};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
/* sube todo lo que está sobre el suelo dentro de un rectángulo (cajas completas dentro del área) */
const elevar=(x0,x1,z0,z1)=>{const bb=new THREE.Box3();let n=0;
  scene.children.slice().forEach(o=>{if(o.isInstancedMesh||o.isLight||!(o.isMesh||o.isGroup))return;bb.setFromObject(o);if(!isFinite(bb.min.x))return;
    if(bb.min.x>=x0&&bb.max.x<=x1&&bb.min.z>=z0&&bb.max.z<=z1&&bb.min.y<1.0){o.position.y+=EL;n++}});return n};
/* barra de acero inoxidable (horizontal) */
const barraX=(x0,x1,y,z,r=.03)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,Math.abs(x1-x0),8),inox);m.rotation.z=Math.PI/2;m.position.set((x0+x1)/2,y,z);m.castShadow=true;scene.add(m)};
const barraZ=(z0,z1,y,x,r=.03)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,Math.abs(z1-z0),8),inox);m.rotation.x=Math.PI/2;m.position.set(x,y,(z0+z1)/2);m.castShadow=true;scene.add(m)};
/* escalera de N_ESC peldaños. eje 'x': avanza en X desde xb (borde del nivel alto) hacia dir; centrada en z=c. eje 'z': análogo. */
const escalera=(eje,base,dir,c,ancho)=>{
  const d=k=>base+dir*k*RUN,put=(a,b,y0,y1,c0,c1,m)=>{const lo=Math.min(a,b),hi=Math.max(a,b);return eje==='x'?boxM(m,lo,hi,y0,y1,c0,c1):boxM(m,c0,c1,y0,y1,lo,hi)};
  for(let i=0;i<N_ESC;i++){const top=(i+1)*RISE,a=d(N_ESC-i-1),b=d(N_ESC-i);
    put(a,b,0,top,c-ancho/2,c+ancho/2,treadM);put(b-dir*.09,b,top,top+.012,c-ancho/2,c+ancho/2,yelM);                      /* borde amarillo */
    for(const s of[-1,1]){const c0=c+s*ancho/2,c1=c0+s*.35;put(a,b,0,top+.1,Math.min(c0,c1),Math.max(c0,c1),stone(RUN,top))}}      /* mejillas de piedra */
  const aOut=d(N_ESC),lo=Math.min(aOut,base),hi=Math.max(aOut,base);
  for(const s of[-1,1]){const c0=c+s*ancho/2,c1=c0+s*.35,cc=c0+s*.175;
    if(eje==='x')obst(lo,hi,Math.min(c0,c1),Math.max(c0,c1));else obst(Math.min(c0,c1),Math.max(c0,c1),lo,hi);
    for(const [h,r] of[[.95,.035],[.5,.022]]){const y0=h+RISE*.5+.1,y1=h+EL+.1,L=Math.hypot(base-aOut,y1-y0);
      const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,8),inox);m.castShadow=true;
      if(eje==='x'){m.position.set((aOut+base)/2,(y0+y1)/2,cc);m.rotation.z=Math.atan2(-(base-aOut),y1-y0)}else{m.position.set(cc,(y0+y1)/2,(aOut+base)/2);m.rotation.x=Math.atan2(base-aOut,y1-y0)}
      scene.add(m)}
    for(let i=0;i<N_ESC;i+=2){const pos=d(N_ESC-i-.5),top=(i+1)*RISE+.1,yr=.95+RISE*.5+.1+(EL-RISE*.5)*((pos-aOut)/(base-aOut));
      if(eje==='x')cylM(inox,.03,.03,yr-top,pos,(top+yr)/2,cc,8);else cylM(inox,.03,.03,yr-top,cc,(top+yr)/2,pos,8)}
    const pt=base-dir*.1;if(eje==='x')cylM(inox,.03,.03,1.05,pt,EL+.1+.525,cc,8);else cylM(inox,.03,.03,1.05,cc,EL+.1+.525,pt,8)}
  window.RAISED.push(eje==='x'?{x0:lo,x1:hi,z0:c-ancho/2,z1:c+ancho/2,h:EL,ax:aOut,bx:base}:{x0:c-ancho/2,x1:c+ancho/2,z0:lo,z1:hi,h:EL,az:aOut,bz:base})};
/* muro de piedra fino (cara exterior) */
const muroP=(x0,x1,z0,z1)=>{const len=Math.max(x1-x0,z1-z0);boxM(stone(len,EL),x0,x1,0,EL-.02,z0,z1)};

/* 5a · limpieza: plantas sobre la calzada/pista y el arbusto sobre la vereda del parque */
ok('Limpieza de plantas',()=>{
  const verdes=new Set([0x356f3c,0x7c4f30,0x87a93a,0x6f9130,0x2b5c30,0x35683a,0x244c29,0x3c6e35,0x2c4a26,0x2e5c33,0x5d4028,0x3a6b3a]);
  const esPlanta=o=>{let r=false;o.traverse(q=>{if(q.isMesh&&q.material&&q.material.color&&verdes.has(q.material.color.getHex()))r=true});return r};
  const calles=[[-9.6,9.6,7,61],[-123.6,-8,30.8,37.6],[-131,-123.4,-165,66]];     /* calzada de ingreso, calle E-O y pista oeste */
  let n=0;
  scene.children.slice().forEach(o=>{if(!(o.isMesh||o.isGroup)||o.isInstancedMesh)return;const p=o.position;if(p.y>1.5)return;
    if(calles.some(r=>p.x>r[0]&&p.x<r[1]&&p.z>r[2]&&p.z<r[3])&&esPlanta(o)){quitar(o);n++;for(let i=SOL.length-1;i>=0;i--)if(Math.hypot(SOL[i][0]-p.x,SOL[i][1]-p.z)<.8)SOL.splice(i,1)}});
  const b=scene.children.find(o=>o.isGroup&&near(o.position.x,-39,.05)&&near(o.position.z,-34.5,.05));if(b)quitar(b);   /* arbusto verde-amarillo sobre la vereda del parque */
  console.info('[04c-ajustes] plantas retiradas de las pistas:',n);
});

/* 5b · paseo elevado entre el comedor y el estadio + estadio/loza/comedor a 1.20 m */
ok('Paseo y estadio elevados',()=>{
  const R0=window.RAISED&&window.RAISED[0],CA=window.__cancha;if(!R0||!CA)throw new Error('falta la plataforma del estadio');
  const DX0=-120,DX1=R0.x1,DZ0=-36,DZ1=R0.z0;                                       /* paseo: del comedor (x −120) al borde este del estadio, z −36…−30.4 */
  tocar([114,.07,5.1,-66,.035,-33.45],quitar);                                        /* vereda baja de esa franja */
  tocar([R0.x1-R0.x0+.24,.1,.22,(R0.x0+R0.x1)/2,EL-.05,DZ1-.01],quitar);                      /* sardinel norte del estadio (queda dentro del paseo) */
  const mover=elevar(DX0-1.6,DX1+1.6,DZ0-.4,DZ1-.05);                                /* mesas, sillas, faroles y bancas del paseo suben con él */
  for(const a of ASIENTOS)if(a.x>DX0-1.6&&a.x<DX1+1.6&&a.z>DZ0-.4&&a.z<DZ1&&a.y<1)a.y+=EL;
  /* vereda baja que se retiró: queda solo al este del paseo */
  {const t=tileMat(18.4,5.1);const q=new THREE.Mesh(new THREE.BoxGeometry(-9-(DX1+.1),.07,5.1),t);q.position.set((DX1+.1-9)/2,.035,-33.45);q.receiveShadow=true;scene.add(q)}
  /* losa del paseo: piedra negra en los costados, loseta clara arriba */
  const L=DX1-DX0,Wd=DZ1-DZ0,sm=stone(L,EL),em=stone(Wd,EL);
  const slab=new THREE.Mesh(new THREE.BoxGeometry(L,EL,Wd),[em,em,tileMat(L,Wd),em,sm,sm]);slab.position.set((DX0+DX1)/2,EL/2,(DZ0+DZ1)/2);slab.receiveShadow=slab.castShadow=true;scene.add(slab);
  window.RAISED.push({x0:DX0,x1:DX1,z0:DZ0-.4,z1:DZ1+.05,h:EL,ramp:.02});
  /* escaleras del paseo: oeste (desde la vereda de la pista), este y norte (hacia el parque) */
  const zc=(DZ0+DZ1)/2;escalera('x',DX0,-1,zc,4);escalera('x',DX1,1,zc,4);escalera('z',DZ0,-1,-34,4);
  /* baranda inox del lado del parque (con hueco en la escalera norte) */
  const nz=DZ0+.12;
  for(const [a,b] of[[-72,-36.4],[-31.6,DX1-.1]]){for(let x=a;x<=b+.01;x+=2)cylM(inox,.03,.03,1.0,x,EL+.5,nz,8);for(const y of[1.05,.78,.5])barraX(a,b,EL+y,nz,y>1?.035:.022);obst(a,b,DZ0-.35,DZ0+.05)}
  /* estadio y loza: muro de piedra por el oeste, este y sur (el lado norte es el paseo) */
  const e=.12;muroP(R0.x0-e,R0.x0,R0.z0,R0.z1);muroP(R0.x1,R0.x1+e,R0.z0,R0.z1);muroP(R0.x0-e,R0.x1+e,R0.z1,R0.z1+e);
  /* reja negra alta con marcos (sobre la plataforma) */
  const FH=6,hh=FH-.2,negro=S(0x111316,.5,{metalness:.55,envMapIntensity:.8});
  const mt=tex(128,128,(c,w,h)=>{c.clearRect(0,0,w,h);c.strokeStyle='#15181b';c.lineWidth=4;for(let i=-h;i<=w+h;i+=24){c.beginPath();c.moveTo(i,0);c.lineTo(i+h,h);c.stroke();c.beginPath();c.moveTo(i,h);c.lineTo(i+h,0);c.stroke()}});
  mt.wrapS=mt.wrapT=THREE.RepeatWrapping;
  const malla=new THREE.MeshStandardMaterial({map:mt,alphaTest:.4,side:THREE.DoubleSide,roughness:.55,metalness:.5,envMapIntensity:.6});
  const posts=[],thin=[];
  (window.__fences||[]).forEach(([x0,z0,x1,z1])=>{
    const Ls=Math.hypot(x1-x0,z1-z0);if(Ls<.5)return;
    const ang=Math.atan2(-(z1-z0),x1-x0),cx=(x0+x1)/2,cz=(z0+z1)/2,ux=(x1-x0)/Ls,uz=(z1-z0)/Ls;
    const g=new THREE.PlaneGeometry(Ls,hh);{const uv=g.attributes.uv;for(let i=0;i<uv.count;i++){uv.setX(i,uv.getX(i)*Ls);uv.setY(i,uv.getY(i)*hh)}}
    const m=new THREE.Mesh(g,malla);m.position.set(cx,EL+.2+hh/2,cz);m.rotation.y=ang;scene.add(m);
    for(const [y,t,d] of[[.12,.3,.16],[2.9,.12,.16],[3.05,.12,.16],[4.4,.1,.14],[FH-.06,.16,.2]]){const b=new THREE.Mesh(new THREE.BoxGeometry(Ls,t,d),negro);b.position.set(cx,EL+y,cz);b.rotation.y=ang;b.castShadow=true;scene.add(b)}
    const n=Math.max(1,Math.round(Ls/4));
    for(let i=0;i<=n;i++){posts.push([x0+ux*Ls*i/n,z0+uz*Ls*i/n]);if(i<n)thin.push([x0+ux*Ls*(i+.5)/n,z0+uz*Ls*(i+.5)/n])}
    obst(Math.min(x0,x1)-.4,Math.max(x0,x1)+.4,Math.min(z0,z1)-.4,Math.max(z0,z1)+.4);
  });
  {const d=new THREE.Object3D();
   const a=new THREE.InstancedMesh(new THREE.BoxGeometry(.24,FH,.24),negro,posts.length);posts.forEach(([x,z],i)=>{d.position.set(x,EL+FH/2,z);d.updateMatrix();a.setMatrixAt(i,d.matrix)});a.castShadow=true;a.frustumCulled=false;scene.add(a);
   const b=new THREE.InstancedMesh(new THREE.BoxGeometry(.1,FH-3.1,.1),negro,thin.length);thin.forEach(([x,z],i)=>{d.position.set(x,EL+3.05+(FH-3.1)/2,z);d.updateMatrix();b.setMatrixAt(i,d.matrix)});b.frustumCulled=false;scene.add(b)}
  /* comedor a 1.20 m: zócalo de piedra, y el interior se pisa sobre ese nivel */
  {const X0=-120,X1=-72,Z0=-62,Z1=-36,e2=.12;
   muroP(X0-e2,X0,Z0-e2,Z1);muroP(X1,X1+e2,Z0-e2,Z1);muroP(X0,X1,Z0-e2,Z0);
   window.RAISED.push({x0:X0+.3,x1:X1-.3,z0:Z0+.3,z1:Z1+.4,h:EL,ramp:.02})}
  console.info('[04c-ajustes] objetos subidos al paseo:',mover);
});

/* 5c · plaza del auditorio a 1.20 m (la misma altura del comedor), con escalera hacia el sur */
ok('Plaza y auditorio elevados',()=>{
  const X0=-118.3,X1=-21.5,Z0=-111.8,Z1=-68.9;
  const n=elevar(X0,X1,Z0,Z1);console.info('[04c-ajustes] objetos de la plaza/auditorio subidos:',n);
  const e=.12,xs=-86,hw=3;
  muroP(X0-e,X0,Z0-e,Z1+e);muroP(X1,X1+e,Z0-e,Z1+e);muroP(X0,X1,Z0-e,Z0);
  muroP(X0,xs-hw-.35,Z1,Z1+e);muroP(xs+hw+.35,X1,Z1,Z1+e);
  escalera('z',Z1,1,xs,2*hw);
  obst(X0-e-.1,X0,Z0-e,Z1+e);obst(X1,X1+e+.1,Z0-e,Z1+e);obst(X0,X1,Z0-e-.1,Z0);obst(X0,xs-hw-.35,Z1,Z1+e+.1);obst(xs+hw+.35,X1,Z1,Z1+e+.1);
  window.RAISED.push({x0:X0,x1:X1,z0:Z0,z1:Z1,h:EL,ramp:.02});
});

/* 5d · parque: troncos pintados de blanco, caseta azul «CTA SENATI», senda de concreto y cordones */
ok('Parque: caseta CTA',()=>{
  const blanco=S(0xf4f3ee,.85);
  scene.children.slice().forEach(o=>{if(!o.isGroup||o.position.x<-62||o.position.x>-12||o.position.z<-66||o.position.z>-33)return;
    const t=o.children[0];if(!t||!t.geometry||t.geometry.type!=='CylinderGeometry')return;const gp=t.geometry.parameters;
    if(t.material&&t.material.color&&t.material.color.getHex()===0xf2f0ea)return;
    const palma=o.children.length<=3&&o.children.some(c=>c.isGroup&&c.children.length>=8),magnolia=o.children.length===6&&gp.height>5&&gp.height<6;
    if(!palma&&!magnolia)return;
    const h=magnolia?1.5:1.8,r0=gp.radiusBottom,r1=gp.radiusBottom+(gp.radiusTop-gp.radiusBottom)*(h/gp.height);
    const w=new THREE.Mesh(new THREE.CylinderGeometry(r1*1.04,r0*1.04,h,14),blanco);w.position.y=h/2;w.castShadow=true;o.add(w)});
  const KX0=-39.5,KX1=-32.5,KZ0=-58.5,KZ1=-53.5;
  /* senda de concreto desde la escalera norte hasta la caseta + plazoleta */
  {const t=tileMat(2.4,15);const p=new THREE.Mesh(new THREE.BoxGeometry(2.4,.06,15),t);p.position.set(-34,.03,(-37.95-53.5)/2);p.receiveShadow=true;scene.add(p);
   const t2=tileMat(10,4);const q=new THREE.Mesh(new THREE.BoxGeometry(10,.06,4),t2);q.position.set(-36,.03,-52);q.receiveShadow=true;scene.add(q)}
  /* caseta */
  const azul=S(0x1646a0,.4,{metalness:.5}),crist=new THREE.MeshStandardMaterial({color:0x1b2430,roughness:.12,metalness:.7,envMapIntensity:1.2});
  boxM(S(0xe9ebed,.8),KX0,KX1,.06,1.1,KZ0,KZ1);boxM(S(0xe9ebed,.8),KX0,KX1,2.7,3.0,KZ0,KZ1);boxM(azul,KX0-.1,KX1+.1,3.0,3.15,KZ0-.2,KZ1+.2);   /* zócalo blanco, dintel y techo azul */
  boxM(crist,KX0+.05,KX1-.05,1.1,2.7,KZ1-.1,KZ1+.01);boxM(crist,KX1-.1,KX1+.01,1.1,2.7,KZ0,KZ1);boxM(crist,KX0-.01,KX0+.1,1.1,2.7,KZ0,KZ1);boxM(S(0xe9ebed,.8),KX0,KX1,1.1,2.7,KZ0,KZ0+.1);
  for(let i=0;i<=4;i++){const x=KX0+i*(KX1-KX0)/4;boxM(azul,x-.05,x+.05,1.1,2.7,KZ1-.12,KZ1+.04)}
  boxM(azul,KX0,KX1,1.1,1.16,KZ1-.12,KZ1+.04);
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.7),new THREE.MeshBasicMaterial({map:tex(512,128,(c,w,h)=>{c.fillStyle='#1646a0';c.fillRect(0,0,w,h);logo(c,64,64,40,'#ffffff');c.fillStyle='#fff';c.font='800 62px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.textBaseline='middle';c.fillText('CTA_ SENATI',124,66)})}));
   m.position.set(-34,2.2,KZ1+.05);scene.add(m)}
  obst(KX0-.1,KX1+.1,KZ0-.1,KZ1+.1);
  /* cordones blancos con postes alrededor del césped, junto a la senda */
  {const pm=S(0xf4f3ee,.7),cm=S(0xdadad6,.5);
   const cord=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0);for(const y of[.45,.8]){const b=new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x1-x0)||.015,.015,Math.abs(z1-z0)||.015),cm);b.position.set((x0+x1)/2,y,(z0+z1)/2);scene.add(b)}
    const n=Math.max(1,Math.round(L/6));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,z=z0+(z1-z0)*i/n;cylM(pm,.04,.04,1.0,x,.5,z,6)}};
   cord(-35.6,-39,-35.6,-51);cord(-32.4,-39,-32.4,-51)}
});

if(campus.length)window.__pabellonCampus=window.__pabellonCampus.concat(campus);
})();

/* ════════════════════════════════════════════════════════════
   5 · COMEDOR · pedir y recoger comida (antes js/comedor.js, ahora en este mismo archivo).
   Junto a la barra: E = abrir la carta → elegir → pagar → "preparando…" → E en ENTREGA = recoger.
   También anima la puerta corrediza (se abre sola al acercarte). Todo va en try/catch: si falla, el visor sigue.
   ════════════════════════════════════════════════════════════ */
(()=>{
 const C=window.__comedor,CARTA=window.COMEDOR_CARTA,D=window.__comedorPuertas;
 if(!C||!CARTA){console.warn('[comedor.js] falta el comedor (¿cargó 04c-ajustes.js?)');return}
 const say=m=>{if(typeof toast==='function')toast(m)};
 const sol=n=>'S/ '+n.toFixed(2);
 const typing=e=>e.target&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
 const coarse=matchMedia('(pointer:coarse)').matches;
 const items=CARTA.flatMap(c=>c.items.map(i=>Object.assign({cat:c.nombre},i))),porId=Object.fromEntries(items.map(i=>[i.id,i]));
 let cart={},tab=0,orden=null,abierto=false,nro=Math.floor(10+Math.random()*60),bandeja=null;

 const css=document.createElement('style');
 css.textContent=`#com-hud{position:fixed;left:50%;bottom:calc(172px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:16;display:none;align-items:center;gap:9px;padding:9px 16px;border-radius:12px;background:rgba(6,12,28,.86);border:1px solid rgba(245,183,0,.7);color:#eaf4ff;font:600 14px Barlow,Arial,sans-serif;box-shadow:0 0 22px rgba(245,183,0,.22);pointer-events:none}
#com-hud kbd{display:inline-block;min-width:24px;padding:3px 8px;border-radius:6px;background:#f5b700;color:#1a1200;font:800 14px Arial;text-align:center}
#com-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(58px + env(safe-area-inset-top,0px));z-index:16;display:none;padding:7px 16px;border-radius:999px;background:rgba(6,12,28,.82);border:1px solid rgba(245,183,0,.6);color:#eaf4ff;font:600 13px Barlow,Arial,sans-serif;pointer-events:none;white-space:nowrap}
#com-chip.ok{border-color:#3fe08a;box-shadow:0 0 18px rgba(63,224,138,.35)}
#com-fondo{position:fixed;inset:0;z-index:40;display:none;align-items:center;justify-content:center;padding:10px;background:rgba(2,6,16,.62);backdrop-filter:blur(4px);font-family:Barlow,Arial,sans-serif;color:#eaf4ff}
#com-fondo.on{display:flex}
#com-caja{width:min(900px,100%);max-height:calc(100% - 10px);display:flex;flex-direction:column;border-radius:16px;background:#0a1426;border:1px solid rgba(94,214,255,.45);box-shadow:0 20px 60px rgba(0,0,0,.6);overflow:hidden}
#com-caja header{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:linear-gradient(90deg,#1646a0,#0d2f6b)}
#com-caja header b{display:block;font:800 22px "Barlow Condensed",Arial Narrow,Arial;letter-spacing:.06em}#com-caja header span{font-size:12px;color:#ffe9a8}
#com-caja button{font:600 14px Barlow,Arial,sans-serif;color:#eaf4ff;background:#16233b;border:1px solid #2c4468;border-radius:9px;padding:8px 12px;cursor:pointer}
#com-caja button:hover{border-color:#38e1ff}#com-x{padding:4px 10px!important;font-size:18px!important}
.com-cuerpo{display:grid;grid-template-columns:1.5fr 1fr;gap:0;min-height:0;overflow:hidden}
.com-carta{padding:12px 16px;overflow:auto;max-height:70vh}.com-pedido{padding:12px 16px;background:#0d1b33;border-left:1px solid #1c2f50;overflow:auto;max-height:70vh}
#com-tabs{display:flex;gap:6px;margin-bottom:10px}#com-tabs button.on{background:#f5b700;color:#1a1200;border-color:#f5b700}
.com-it{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #16233b}.com-it div{flex:1}.com-it b{display:block;font-size:15px}.com-it small{color:#8fa6cf}
.com-it .p{color:#f5b700;font-weight:700;min-width:62px;text-align:right}.com-it .q{display:flex;align-items:center;gap:6px}.com-it .q button{padding:2px 10px}
.com-pedido h3{margin:0 0 8px;font:800 18px "Barlow Condensed",Arial Narrow,Arial;letter-spacing:.06em}
.com-lin{display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:14px}.com-total{display:flex;justify-content:space-between;margin:10px 0;padding-top:8px;border-top:1px solid #2c4468;font-size:18px}.com-total b{color:#f5b700}
.com-pago{display:grid;gap:7px}.com-pago button{background:#1646a0;border-color:#38e1ff}.com-pago button:disabled{opacity:.4;cursor:default}
.com-ticket{grid-column:1/-1;padding:22px;text-align:center}.com-ticket h2{margin:0;font:800 34px "Barlow Condensed",Arial Narrow,Arial;color:#f5b700}.com-ticket .lin{max-width:420px;margin:10px auto;text-align:left}
.com-bar{height:8px;border-radius:5px;background:#16233b;overflow:hidden;max-width:420px;margin:12px auto}.com-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#38e1ff,#3fe08a)}
@media(max-width:700px){.com-cuerpo{grid-template-columns:1fr;overflow:auto}.com-carta,.com-pedido{max-height:none}.com-pedido{border-left:0;border-top:1px solid #1c2f50}}`;
 document.head.append(css);
 const hud=document.createElement('div');hud.id='com-hud';document.body.append(hud);
 const chip=document.createElement('div');chip.id='com-chip';document.body.append(chip);
 const fondo=document.createElement('div');fondo.id='com-fondo';
 fondo.innerHTML='<div id="com-caja" role="dialog" aria-modal="true" aria-label="Carta del comedor"><header><div><b>COMEDOR SENATI</b><span>Carta de hoy · atención 7:00 – 20:00</span></div><button id="com-x" aria-label="Cerrar">✕</button></header><div class="com-cuerpo" id="com-cuerpo"></div></div>';
 document.body.append(fondo);
 const cuerpo=fondo.querySelector('#com-cuerpo');

 const total=()=>Object.entries(cart).reduce((s,[id,n])=>s+porId[id].precio*n,0),cuenta=()=>Object.values(cart).reduce((s,n)=>s+n,0);
 function vista(){
  const t=CARTA.map((c,i)=>'<button data-tab="'+i+'" class="'+(i===tab?'on':'')+'">'+c.nombre+'</button>').join('');
  const l=CARTA[tab].items.map(i=>'<div class="com-it"><div><b>'+i.nombre+'</b><small>'+(i.desc||'')+'</small></div><span class="p">'+sol(i.precio)+'</span><span class="q"><button data-sub="'+i.id+'">−</button><span>'+(cart[i.id]||0)+'</span><button data-add="'+i.id+'">+</button></span></div>').join('');
  const p=Object.entries(cart).map(([id,n])=>'<div class="com-lin"><span>'+n+' × '+porId[id].nombre+'</span><span>'+sol(porId[id].precio*n)+'</span></div>').join('')||'<p style="color:#8fa6cf;margin:6px 0">Aún no eliges nada.</p>';
  cuerpo.innerHTML='<section class="com-carta"><nav id="com-tabs">'+t+'</nav>'+l+'</section><aside class="com-pedido"><h3>TU PEDIDO</h3>'+p+'<div class="com-total"><span>Total</span><b>'+sol(total())+'</b></div><div class="com-pago"><button data-pago="Efectivo" '+(cuenta()?'':'disabled')+'>Pagar en caja · efectivo</button><button data-pago="Yape / Plin" '+(cuenta()?'':'disabled')+'>Pagar con Yape / Plin</button><button data-vaciar="1">Vaciar pedido</button></div></aside>'}
 function ticket(){
  const lin=orden.items.map(i=>'<div class="com-lin"><span>'+i.cant+' × '+i.nombre+'</span><span>'+sol(i.precio*i.cant)+'</span></div>').join('');
  cuerpo.innerHTML='<div class="com-ticket"><h2>PEDIDO N° '+orden.n+'</h2><div class="lin">'+lin+'<div class="com-total"><span>Total · '+orden.metodo+'</span><b>'+sol(orden.total)+'</b></div></div><div id="com-estado" style="font-weight:700"></div><div class="com-bar"><i id="com-prog"></i></div><p style="color:#8fa6cf;font-size:13px">Puedes seguir recorriendo: cuando esté listo, recógelo en <b>ENTREGA</b> (tecla E).</p><button id="com-ok">Seguir recorriendo</button></div>'}
 cuerpo.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.tab!==undefined){tab=+d.tab;vista()}
  else if(d.add){cart[d.add]=Math.min(9,(cart[d.add]||0)+1);vista()}
  else if(d.sub){if(cart[d.sub]){cart[d.sub]--;if(!cart[d.sub])delete cart[d.sub]}vista()}
  else if(d.vaciar){cart={};vista()}
  else if(d.pago)pagar(d.pago);
  else if(b.id==='com-ok')cerrar()});
 fondo.addEventListener('pointerdown',e=>{if(e.target===fondo)cerrar()});
 fondo.querySelector('#com-x').onclick=()=>cerrar();

 let ac=null;
 const beep=()=>{try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const t=ac.currentTime;
  [880,1175].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.16);g.gain.exponentialRampToValueAtTime(.16,t+i*.16+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.16+.3);o.connect(g).connect(ac.destination);o.start(t+i*.16);o.stop(t+i*.16+.32)})}catch(e){}};

 function abrir(){abierto=true;for(const k in keys)keys[k]=0;if(window.PJ){PJ.busy=true;PJ.busyHud='<b>Comedor</b> · eligiendo tu pedido <i>· Esc cerrar</i>'}
  if(orden)ticket();else vista();fondo.classList.add('on')}
 function cerrar(){abierto=false;fondo.classList.remove('on');if(window.PJ&&!(window.INT&&INT.mode!=='foot')){PJ.busy=false;PJ.busyHud=''}}
 function pagar(metodo){
  if(!cuenta())return;beep();
  const its=Object.entries(cart).map(([id,n])=>Object.assign({cant:n},porId[id])),n=its.reduce((s,i)=>s+i.cant,0);
  orden={n:nro++,items:its,total:total(),metodo,t0:performance.now(),dur:Math.min(16,5+2*n)*1000,listo:false};cart={};ticket();say('Pago recibido · pedido N° '+orden.n)}

 function crearBandeja(o){
  const g=new THREE.Group(),m=(geo,c,x,y,z,r=.6)=>{const q=new THREE.Mesh(geo,S(c,r));q.position.set(x,y,z);q.castShadow=true;g.add(q);return q};
  m(new THREE.BoxGeometry(.9,.04,.6),0x3a3f47,0,.02,0);
  const cats=new Set(o.items.map(i=>i.cat));
  if(cats.has('Almuerzos')){m(new THREE.CylinderGeometry(.2,.17,.03,16),0xf6f6f6,-.2,.055,0,.3);m(new THREE.SphereGeometry(.13,10,8),0xf3efe2,-.24,.1,.03,.9).scale.y=.55;m(new THREE.BoxGeometry(.16,.06,.12),0x7a3f1d,-.14,.09,-.08,.8)}
  if(cats.has('Snacks')){const e=m(new THREE.CylinderGeometry(.09,.09,.22,10),0xd9a24a,.12,.1,.2,.8);e.rotation.z=Math.PI/2}
  if(cats.has('Bebidas')){m(new THREE.CylinderGeometry(.06,.05,.15,12),0xb0173f,.3,.115,-.12,.4);m(new THREE.CylinderGeometry(.06,.05,.15,12),0xf2c038,.36,.115,.08,.4)}
  g.position.set(C.xp,C.yMesa,C.zp);scene.add(g);return g}

 const cerca=()=>mode==='walk'&&P.y<1.5&&P.x>C.x0&&P.x<C.x1&&P.z>C.zf-.5&&P.z<C.zf+3.4;
 const enEntrega=()=>Math.abs(P.x-C.xp)<3.2;
 function accion(){
  if(!cerca()||abierto)return;
  if(orden&&orden.listo&&enEntrega()){if(bandeja){scene.remove(bandeja);bandeja=null}const r=orden.items.map(i=>i.cant+' × '+i.nombre).join(', ');say('Provecho 🍽 · recogiste: '+r);orden=null;return}
  if(orden){say('Tu pedido N° '+orden.n+' aún se está preparando');return}
  abrir()}
 addEventListener('keydown',e=>{
  if(typing(e)||e.ctrlKey||e.metaKey||e.altKey)return;
  if(abierto){if(e.code==='Escape'||e.code==='KeyE'){e.preventDefault();cerrar()}
   else if(/^(w|a|s|d|arrowup|arrowdown|arrowleft|arrowright|shift|c|v| )$/.test(e.key.toLowerCase())){e.stopImmediatePropagation();e.preventDefault()}return}
  if(e.code==='KeyE'&&!e.repeat&&mode==='walk'&&!(window.INT&&(INT.mode!=='foot'||INT.nearby))){e.preventDefault();accion()}
 },true);
 hud.addEventListener('click',accion);if(coarse)hud.style.pointerEvents='auto';

 let t0=performance.now(),ab=0,ult='';
 requestAnimationFrame(function bucle(){requestAnimationFrame(bucle);
  try{
   const now=performance.now(),dt=Math.min(.1,(now-t0)/1000);t0=now;
   if(abierto&&mode!=='walk')cerrar();
   if(D){const c=mode==='walk'&&Math.hypot(P.x-D.x,P.z-D.z)<4.8;ab+=((c?1:0)-ab)*Math.min(1,dt*6);D.izq.position.x=D.xi-D.paso*ab;D.der.position.x=D.xd+D.paso*ab}
   if(orden&&!orden.listo){const f=(now-orden.t0)/orden.dur;
    if(f>=1){orden.listo=true;bandeja=crearBandeja(orden);beep();say('¡Pedido N° '+orden.n+' listo! Recógelo en ENTREGA')}}
   if(abierto&&orden){const est=fondo.querySelector('#com-estado'),pr=fondo.querySelector('#com-prog');
    if(est){est.textContent=orden.listo?'✅ ¡Listo! Recógelo en ENTREGA':'👨‍🍳 Preparando… '+Math.max(0,Math.ceil((orden.dur-(now-orden.t0))/1000))+' s';pr.style.width=Math.min(100,(now-orden.t0)/orden.dur*100)+'%'}}
   if(orden&&mode==='walk'){chip.style.display='block';chip.classList.toggle('ok',orden.listo);
    chip.textContent=orden.listo?'✅ Pedido N° '+orden.n+' listo · recógelo en ENTREGA':'🧾 Pedido N° '+orden.n+' · preparando… '+Math.max(0,Math.ceil((orden.dur-(now-orden.t0))/1000))+' s'}else chip.style.display='none';
   let h='';
   if(mode==='walk'&&!abierto&&(!window.INT||INT.mode==='foot')&&cerca()){
    h=orden&&orden.listo&&enEntrega()?'<kbd>E</kbd> Recoger pedido N° '+orden.n:orden?'Pedido N° '+orden.n+' en preparación…':'<kbd>E</kbd> Pedir comida · ver la carta'}
   if(h!==ult){ult=h;hud.innerHTML=h;hud.style.display=h?'flex':'none'}
  }catch(err){}
 });
})();
