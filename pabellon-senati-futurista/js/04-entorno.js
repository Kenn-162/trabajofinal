const fol=[0x2b5c30,0x35683a,0x244c29,0x3c6e35];const palmLeaf=[0x235528,0x2d5f33,0x1c4423];
/* ════════════════════════════════════════════════════════════
   04 · ENTORNO — Sede Independencia (SENATI): campus completo
   Mapa oficial: Panamericana Norte / ingreso, playa de
   estacionamiento, auditorio, comedor, parque, cancha, loza,
   pirámide histórica (oeste), Esc. de Mecánica de Mantenimiento
   (este), Esc. de Artes Gráficas (sur) y Torres A/B/C.
   ════════════════════════════════════════════════════════════ */

/* Concreto con juntas de dilatación y manchas */
const gt=tex(512,512,(c,w,h)=>{c.fillStyle='#a7a9ad';c.fillRect(0,0,w,h);
  for(let i=0;i<2600;i++){const v=110+Math.random()*80|0;c.fillStyle=`rgba(${v},${v},${v},.10)`;c.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*3,1+Math.random()*3)}
  for(let i=0;i<14;i++){c.fillStyle='rgba(70,72,76,.10)';c.beginPath();c.ellipse(Math.random()*w,Math.random()*h,20+Math.random()*60,10+Math.random()*30,Math.random()*3,0,7);c.fill()}
  c.strokeStyle='rgba(52,54,58,.75)';c.lineWidth=3;c.strokeRect(0,0,w,h);
  c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=1;c.strokeRect(3,3,w-6,h-6)});
gt.wrapS=gt.wrapT=THREE.RepeatWrapping;gt.repeat.set(46,32);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(430,300),new THREE.MeshStandardMaterial({map:gt,roughness:.96,metalness:.02,envMapIntensity:.18}));
ground.rotation.x=-Math.PI/2;ground.position.set(0,-.121,-15);ground.receiveShadow=true;scene.add(ground);

function box(c,x0,x1,y0,y1,z0,z1){const m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),S(c,.9));m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.castShadow=m.receiveShadow=true;scene.add(m);return m}
function boxM(mat,x0,x1,y0,y1,z0,z1){const m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),mat);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.castShadow=m.receiveShadow=true;scene.add(m);return m}
function cylM(mat,r0,r1,h,x,y,z,seg=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;scene.add(m);return m}
function plane(mat,w,h,x,y,z,rx=-Math.PI/2,ry=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.rotation.x=rx;m.rotation.y=ry;m.position.set(x,y,z);m.receiveShadow=true;scene.add(m);return m}
const lineY=(x0,x1,z,c=0xe8e9e6,op=.8,w=.18)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,w),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,.012,z);scene.add(m)};
const lineX=(x,z0,z1,c=0xe8e9e6,op=.8,w=.18)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,z1-z0),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.012,(z0+z1)/2);scene.add(m)};

/* ── ASFALTO + TEXTOS PINTADOS ─────────────────────────────── */
const asphaltTex=tex(256,256,(c,w,h)=>{c.fillStyle='#3c3f45';c.fillRect(0,0,w,h);
  for(let i=0;i<1800;i++){const v=52+Math.random()*70|0;c.fillStyle=`rgba(${v},${v},${v+4},.35)`;c.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}});
asphaltTex.wrapS=asphaltTex.wrapT=THREE.RepeatWrapping;
const asphalt=(x0,x1,z0,z1,rep=14)=>{const t=asphaltTex.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set((x1-x0)/rep,(z1-z0)/rep);t.needsUpdate=true;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({map:t,roughness:.95,metalness:.02,envMapIntensity:.12}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,.004,(z0+z1)/2);m.receiveShadow=true;scene.add(m)};
const medallion=(x,z,r)=>{const t=tex(256,256,(c,w,h)=>{c.fillStyle='rgba(0,0,0,0)';c.clearRect(0,0,w,h);c.fillStyle='#17705f';c.beginPath();c.arc(128,128,124,0,7);c.fill();c.strokeStyle='#0e554a';c.lineWidth=10;c.beginPath();c.arc(128,128,116,0,7);c.stroke();logo(c,128,128,74,'#eef3ee')});
  const m=new THREE.Mesh(new THREE.CircleGeometry(r,40),new THREE.MeshStandardMaterial({map:t,transparent:true,roughness:.9,metalness:.02,envMapIntensity:.15}));m.rotation.x=-Math.PI/2;m.position.set(x,.018,z);m.receiveShadow=true;scene.add(m)};

/* ZONA DE SEGURIDAD (pintura amarilla/verde gastada) */
const zonaTex=tex(512,512,(c,w,h)=>{c.fillStyle='#d8b400';c.beginPath();c.arc(256,256,256,0,7);c.fill();c.fillStyle='#17705f';c.beginPath();c.arc(256,256,230,0,7);c.fill();
  for(let i=0;i<260;i++){c.fillStyle='rgba(216,180,0,.5)';c.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*4,2+Math.random()*4)}
  c.fillStyle='#f4f1e6';c.font='bold 54px Arial';c.textAlign='center';c.fillText('ZONA DE',256,222);c.font='bold 72px Arial';c.fillText('SEGURIDAD',256,310)});
const circ=new THREE.Mesh(new THREE.CircleGeometry(3.4,48),new THREE.MeshStandardMaterial({roughness:.92,metalness:.02,map:zonaTex}));
circ.rotation.x=-Math.PI/2;circ.position.set(0,.018,13);circ.receiveShadow=true;scene.add(circ);

/* ── Césped con franjas de corte y moteado ─────────────────── */
const grassTex=tex(256,256,(c,w,h)=>{c.fillStyle='#4c8442';c.fillRect(0,0,w,h);
  for(let x=0;x<w;x+=64){c.fillStyle='rgba(255,255,255,.06)';c.fillRect(x,0,32,h)}
  for(let i=0;i<2400;i++){const g2=62+Math.random()*82|0;c.fillStyle=`rgba(${g2*.55|0},${g2},${g2*.42|0},.3)`;c.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*3)}
  for(let i=0;i<34;i++){c.fillStyle='rgba(28,56,24,.2)';c.beginPath();c.ellipse(Math.random()*w,Math.random()*h,6+Math.random()*18,4+Math.random()*10,Math.random()*3,0,7);c.fill()}});
grassTex.wrapS=grassTex.wrapT=THREE.RepeatWrapping;grassTex.repeat.set(10,7);
const gm=new THREE.MeshStandardMaterial({map:grassTex,roughness:1,metalness:0,envMapIntensity:.18});
/* moveZone(i,dx,dz): reúne todo lo que se añadió a la escena desde el índice i en un grupo y lo desplaza (reubicar edificios según el plano) */
function moveZone(i,dx,dz){const grp=new THREE.Group();scene.children.slice(i).forEach(o=>grp.add(o));grp.position.set(dx,0,dz);scene.add(grp);return grp}
const lawn=(x0,x1,z0,z1,y=-.1,mat=gm)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),mat);m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,y,(z0+z1)/2);m.receiveShadow=true;scene.add(m)};
lawn(-127,-95,-158,42);        /* camellón de la pirámide */
lawn(-62,-12,-66,-30);         /* parque */
lawn(8,128,66,101);            /* franja de torres sur */

/* ── PANAMERICANA NORTE + calzada de ingreso ───────────────── */
asphalt(-215,215,-186,-160,26);
lineY(-215,215,-162.5,0xdcd9cf,.85,.35);lineY(-215,215,-183.5,0xdcd9cf,.85,.35);
for(let x=-212;x<215;x+=16){lineY(x,x+8,-176.5,0xe8e9e6,.7,.3);lineY(x,x+8,-169.5,0xe8e9e6,.7,.3)}
box(0x6f7a55,-215,215,0,.14,-174.4,-171.6);             /* separador de sentido */
asphalt(-9,9,-160,8,9);                                 /* calzada de ingreso */
lineX(-8.3,-158,6.5,0xe3b93c,.9,.3);lineX(8.3,-158,6.5,0xe3b93c,.9,.3);
{const m=new THREE.Mesh(new THREE.PlaneGeometry(5.6,7),new THREE.MeshBasicMaterial({map:tex(128,192,(c)=>{c.clearRect(0,0,128,192);c.fillStyle='#f2f2f0';c.beginPath();c.moveTo(64,8);c.lineTo(116,88);c.lineTo(82,88);c.lineTo(82,184);c.lineTo(46,184);c.lineTo(46,88);c.lineTo(12,88);c.closePath();c.fill()}),transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(0,.02,-138);scene.add(m)}  /* flecha pintada */
asphalt(-175,175,60,66,24);                            /* pista sur */
lineY(-175,175,61.1,0xe3b93c,.8,.28);lineY(-175,175,64.9,0xe3b93c,.8,.28);
/* pista oeste (plano del usuario): misma sección que la pista sur (6 m, bordes amarillos). Va entre el podio de la pirámide y el comedor/cancha
   y baja hasta empalmar con la pista sur; arriba se une al estacionamiento. */
asphalt(-129,-123,-152,60,12);asphalt(-129,-118,-152,-146,12);
lineX(-127.9,-150.5,58.5,0xe3b93c,.8,.28);lineX(-124.1,-150.5,58.5,0xe3b93c,.8,.28);

/* ── CIELO ──────────────────────────────────────────────── */
const skyT=n=>tex(1024,512,(c,w,h)=>{
  const q=c.createLinearGradient(0,0,0,h);
  const stops=n===2
    ?[[0,'#01040f'],[.34,'#050d24'],[.56,'#0c1836'],[.72,'#141f3d'],[.84,'#1a2340'],[.93,'#101830'],[1,'#0b1224']]
    :n===1
    ?[[0,'#2b2140'],[.22,'#452a47'],[.4,'#63303f'],[.55,'#8a3f33'],[.68,'#b25a28'],[.8,'#d98032'],[.89,'#eda24a'],[.95,'#ffbf63'],[1,'#ffd98a']]
    :[[0,'#245aa6'],[.22,'#3f7fc0'],[.45,'#74acd6'],[.62,'#a9cbe2'],[.76,'#dcdcc8'],[.88,'#f5e3a6'],[.96,'#eed28a'],[1,'#dcc287']];
  stops.forEach(s=>q.addColorStop(s[0],s[1]));c.fillStyle=q;c.fillRect(0,0,w,h);
  if(n===0){ const sg=c.createRadialGradient(w*.30,h*.17,4,w*.30,h*.17,h*.42);
    sg.addColorStop(0,'rgba(255,250,224,.98)');sg.addColorStop(.25,'rgba(255,240,190,.6)');sg.addColorStop(1,'rgba(255,240,190,0)');
    c.fillStyle=sg;c.fillRect(0,0,w,h);
    [[.56,.05],[.63,.035],[.71,.09],[.8,.06]].forEach(([y,a])=>{const g2=c.createLinearGradient(0,h*y,w,h*y);g2.addColorStop(0,'rgba(255,255,255,0)');g2.addColorStop(.5,`rgba(255,255,255,${a})`);g2.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g2;c.fillRect(0,h*y-3,w,8)});
  } else if(n===1){
    const sg=c.createRadialGradient(w*.42,h*.64,6,w*.42,h*.64,h*.62);
    sg.addColorStop(0,'rgba(255,240,178,1)');sg.addColorStop(.2,'rgba(255,198,116,.9)');sg.addColorStop(.5,'rgba(255,148,74,.42)');sg.addColorStop(1,'rgba(255,148,74,0)');
    c.fillStyle=sg;c.fillRect(0,0,w,h);
    const band=c.createLinearGradient(0,h*.55,0,h*.8);band.addColorStop(0,'rgba(255,206,126,0)');band.addColorStop(.5,'rgba(255,220,146,.55)');band.addColorStop(1,'rgba(255,206,126,0)');c.fillStyle=band;c.fillRect(0,h*.55,w,h*.26);
  } else { const cg=c.createRadialGradient(w*.5,h*.98,10,w*.5,h*.98,h*.62);
    cg.addColorStop(0,'rgba(255,172,94,.48)');cg.addColorStop(.4,'rgba(130,150,235,.2)');cg.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=cg;c.fillRect(0,0,w,h);
  }});
const skyTex=[skyT(0),skyT(1),skyT(2)],skyM=new THREE.MeshBasicMaterial({map:skyTex[0],side:THREE.BackSide,fog:false,depthWrite:false});
const sky=new THREE.Mesh(new THREE.SphereGeometry(430,32,20),skyM);sky.renderOrder=-1;scene.add(sky);
const sp=[];for(let i=0;i<900;i++){const a=Math.random()*6.28,e=Math.random()*1.25+.12;sp.push(Math.cos(a)*Math.cos(e)*400,Math.sin(e)*400,Math.sin(a)*Math.cos(e)*400)}
const stars=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(sp,3)),new THREE.PointsMaterial({color:0xffffff,size:1.5,sizeAttenuation:false,fog:false,transparent:true,opacity:.95}));stars.visible=false;scene.add(stars);
const moon=new THREE.Mesh(new THREE.SphereGeometry(11,24,16),new THREE.MeshBasicMaterial({color:0xf3f1e0,fog:false}));moon.position.set(-130,228,-215);moon.visible=false;scene.add(moon);
const glowTex=tex(128,128,(c)=>{const r=c.createRadialGradient(64,64,2,64,64,62);r.addColorStop(0,'rgba(235,240,255,.9)');r.addColorStop(.4,'rgba(210,225,255,.28)');r.addColorStop(1,'rgba(210,225,255,0)');c.fillStyle=r;c.fillRect(0,0,128,128)});
const moonGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,opacity:.9,fog:false,depthWrite:false,blending:THREE.AdditiveBlending}));moonGlow.scale.set(90,90,1);moonGlow.position.copy(moon.position);moonGlow.visible=false;scene.add(moonGlow);
const ct=tex(128,128,(c,w,h)=>{const r=c.createRadialGradient(64,64,4,64,64,62);r.addColorStop(0,'rgba(255,255,255,.88)');r.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=r;c.fillRect(0,0,w,h)});
const clouds=new THREE.Group();for(let i=0;i<12;i++){const cx=Math.random()*500-250,cz=Math.random()*400-300,cy=96+Math.random()*40;for(let k=0;k<7;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:ct,transparent:true,opacity:.55,fog:false,depthWrite:false})),z=26+Math.random()*22;s.scale.set(z,z*.58,1);s.position.set(cx+(k-3)*23+Math.random()*10,cy+Math.random()*7,cz+Math.random()*14);clouds.add(s)}}scene.add(clouds);

/* ── CORDILLERA ANDINA (2 capas con filos y nieve) ───────── */
const ridgeTex=(far)=>tex(1024,256,(c,w,h)=>{c.clearRect(0,0,w,h);
  const pts=[];const seed=far?2.7:5.3;let walk=far?.52:.68;
  for(let x=0;x<=w;x+=4){
    walk+=(Math.random()-.5)*.055;
    walk=Math.max(.16,Math.min(.88,walk));
    const jag=Math.abs(Math.sin(x*.021+seed))*.20+Math.abs(Math.sin(x*.053+seed*2))*.12+Math.abs(Math.sin(x*.11+seed*3))*.06+Math.abs(Math.sin(x*.23+seed*4))*.03;
    pts.push([x,Math.max(.14,Math.min(.9,walk*.55+jag*.8+.12))]);
  }
  c.beginPath();c.moveTo(0,h);pts.forEach(p=>c.lineTo(p[0],p[1]*h));c.lineTo(w,h);c.closePath();
  const rg=c.createLinearGradient(0,0,0,h);
  if(far){rg.addColorStop(0,'rgba(158,172,198,.92)');rg.addColorStop(1,'rgba(102,114,144,.92)')}else{rg.addColorStop(0,'rgba(92,104,130,.97)');rg.addColorStop(1,'rgba(50,59,80,.97)')}
  c.fillStyle=rg;c.fill();
  if(far){c.fillStyle='rgba(240,244,250,.8)';pts.forEach(([x,yy],i)=>{if(yy<.30&&i%2==0){c.beginPath();c.moveTo(x-13,yy*h+14);c.lineTo(x,yy*h);c.lineTo(x+13,yy*h+14);c.closePath();c.fill()}})}
  else{ /* torres de alta tensión SILUETEADAS sobre la cresta (siempre ancladas) */
    const pylon=(cx)=>{let best=pts[0],bd=1e9;for(const p of pts){const d=Math.abs(p[0]-cx);if(d<bd){bd=d;best=p}}
      const baseY=Math.min(h-2,Math.max(8,best[1]*h+6));
      const topY=Math.max(4,baseY-88-((cx*7)%17));
      c.strokeStyle='#232a35';c.lineCap='round';
      c.lineWidth=4;c.beginPath();c.moveTo(cx-4,baseY);c.lineTo(cx-1,topY);c.moveTo(cx+4,baseY);c.lineTo(cx+1,topY);c.stroke();
      for(const[fy,arm]of[[.22,13],[.46,10],[.70,7]]){const y=topY+(baseY-topY)*fy;c.lineWidth=3;c.beginPath();c.moveTo(cx-arm,y);c.lineTo(cx+arm,y);c.stroke()}
      c.lineWidth=1.5;for(let y0=baseY-6;y0>topY+10;y0-=11){c.beginPath();c.moveTo(cx-3.4,y0);c.lineTo(cx+3.4,y0-11);c.moveTo(cx+3.4,y0);c.lineTo(cx-3.4,y0-11);c.stroke()}};
    pylon(396);pylon(693);        /* corresponden a x = -78 y x = 96 en el mundo */
  }
});
const mFar=new THREE.Mesh(new THREE.PlaneGeometry(680,88),new THREE.MeshBasicMaterial({map:ridgeTex(true),transparent:true,fog:false,depthWrite:false}));
mFar.position.set(0,25,-258);scene.add(mFar);
const mNear=new THREE.Mesh(new THREE.PlaneGeometry(600,60),new THREE.MeshBasicMaterial({map:ridgeTex(false),transparent:true,fog:false,depthWrite:false}));
mNear.position.set(-10,11,-218);scene.add(mNear);
/* ── SKYLINE TRAS PANAMERICANA (Comas/Independencia real) ──── */
const facadeTex=tex(128,256,(c,w,h)=>{c.fillStyle='#454e5c';c.fillRect(0,0,w,h);
  for(let y=8;y<h;y+=16){c.fillStyle='rgba(255,255,255,.05)';c.fillRect(0,y-2,w,1);
    for(let x=6;x<w;x+=18){c.fillStyle=Math.random()<.5?'#262f3a':'#303a46';c.fillRect(x,y,11,9)}}});
const facadeGlow=tex(128,256,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);
  for(let y=8;y<h;y+=16)for(let x=6;x<w;x+=18){if(Math.random()<.5){c.fillStyle=Math.random()<.82?'#ffd092':'#a5ddff';c.fillRect(x,y,11,9)}}});
const cityMat=new THREE.MeshStandardMaterial({map:facadeTex,emissive:0xffffff,emissiveMap:facadeGlow,emissiveIntensity:0,roughness:.9,metalness:.05,envMapIntensity:.2});
[[-180,10,-206,18,16,10],[-150,8,-212,16,12,9],[-120,13,-204,14,20,9],[-60,9,-214,17,14,9],[-25,11,-206,15,17,10],[30,12,-216,16,18,9],[70,9,-204,13,14,9],[140,12,-212,15,18,10],[185,10,-204,17,15,9]].forEach(([x,y,z,w,h,d],i)=>{
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),cityMat);m.position.set(x,y/2,z);m.rotation.y=(i%3-1)*.08;scene.add(m)});
/* 2 losas residenciales altas (como en las fotos) */
[[-105,-220,24,58,12,0x868e99],[158,-218,22,46,12,0x333a45]].forEach(([x,z,w,h,d,c])=>{
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:c,map:facadeTex,roughness:.85,metalness:.04,envMapIntensity:.25}));m.position.set(x,h/2,z);scene.add(m)});

/* ── LETREROS (canvas) ───────────────────────────────────── */
const signBlue=(txt,sub,logoSide='left',fontScale=1)=>tex(2048,256,(c,w,h)=>{
  c.fillStyle='#123f8f';c.fillRect(0,0,w,h);
  const g1=c.createLinearGradient(0,0,0,h);g1.addColorStop(0,'rgba(255,255,255,.32)');g1.addColorStop(.4,'rgba(255,255,255,.05)');g1.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=g1;c.fillRect(0,0,w,h);
  c.fillStyle='#0d2f6b';c.fillRect(0,h-14,w,14);
  const tx=logoSide==='left'?430:w-430;
  logo(c,logoSide==='left'?150:w-150,h*.52,74,'#ffffff');
  c.fillStyle='#ffffff';c.font='900 '+(sub?118:150)*fontScale+'px "Barlow Condensed",Arial Narrow,Arial Black,Arial';c.textAlign='center';c.textBaseline='middle';
  c.fillText(txt,tx,sub?h*.40:h*.53);
  if(sub){c.font='600 74px "Barlow Condensed",Arial Narrow,Arial';c.fillStyle='#ffe9a8';c.fillText(sub,tx,h*.78)}});
const SENATI_FACE=signBlue('SENATI');
const AUDITORIO_FACE=signBlue('AUDITORIO',null,'left',1.02);
const COMEDOR_FACE=signBlue('COMEDOR',null,'left',1.05);
const INGRESO_FACE=signBlue('INGRESO SENATI',null,'left',.92);

/* ── PIRÁMIDE (torre histórica de la sede, oeste) — réplica según las fotos ──
   Rasgos de la foto real: tronco trapezoidal de concreto bronce, ventanas en
   ranuras horizontales, aletas verticales profundas en la cara derecha,
   núcleo central que sobresale con capitel, caja de concreto blanco colgada
   en la fachada, receso azul profundo, gran panel-truss (aleta reticulada)
   y el enorme letrero azul SENATI sobre la azotea. */
const concreteTowerTex=tex(512,512,(c,w,h)=>{c.fillStyle='#8b7f70';c.fillRect(0,0,w,h);noise(c,w,h,700,.14,70,175);
  for(let y=0;y<h;y+=32){c.fillStyle='rgba(52,46,40,.6)';c.fillRect(0,y,w,6);c.fillStyle='rgba(255,255,255,.10)';c.fillRect(0,y+6,w,2)}
  for(let y=13;y<h;y+=32)for(let x=14;x<w;x+=42){c.fillStyle='#201d1a';c.fillRect(x,y,30,13);c.fillStyle='rgba(255,255,255,.09)';c.fillRect(x,y,30,3)}});
const towerLitTex=tex(512,512,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);
  for(let y=13;y<h;y+=32)for(let x=14;x<w;x+=42){if(Math.random()<.34){c.fillStyle=Math.random()<.85?'#ffd694':'#9fd8ff';c.fillRect(x,y,30,13)}}});
const towerMat=new THREE.MeshStandardMaterial({map:concreteTowerTex,emissive:0xffffff,emissiveMap:towerLitTex,emissiveIntensity:0,roughness:.85,metalness:.06,envMapIntensity:.3});
const slabMat=new THREE.MeshStandardMaterial({color:0x57504a,roughness:.8,metalness:.1,envMapIntensity:.25});
const podiumTex=tex(512,256,(c,w,h)=>{c.fillStyle='#7a6c5f';c.fillRect(0,0,w,h);noise(c,w,h,380,.14,70,160);
  for(let x=0;x<w;x+=42){c.fillStyle='#241f1b';c.fillRect(x,70,30,120);c.fillStyle='rgba(255,255,255,.10)';c.fillRect(x,70,30,8)}
  c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,h-12,w,12)});
const podiumMat=new THREE.MeshStandardMaterial({map:podiumTex,roughness:.85,metalness:.08,envMapIntensity:.3});
/* basamento largo (las alas beige de la foto) */
const podium=new THREE.Mesh(new THREE.BoxGeometry(38,10.5,178),podiumMat);podium.position.set(-150,5.25,-52);podium.castShadow=podium.receiveShadow=true;scene.add(podium);
boxM(slabMat,-170.5,-129.5,10.5,11.1,-142,38);            /* losa del podio */
obst(-169,-131,-142,38);                                  /* sin atravesar la pirámide */
/* la "pirámide" troncopiramidal de 8 pisos */
const pyr=new THREE.Mesh(new THREE.CylinderGeometry(14.6,25,36,4,1),towerMat);pyr.rotation.y=Math.PI/4;pyr.scale.set(1,1,.76);pyr.position.set(-150,10.5+18,-52);pyr.castShadow=pyr.receiveShadow=true;scene.add(pyr);
const pyrTop=new THREE.Mesh(new THREE.CylinderGeometry(11.6,14.9,6.5,4,1),towerMat);pyrTop.rotation.y=Math.PI/4;pyrTop.scale.set(1,1,.78);pyrTop.position.set(-150,10.5+36+3.25,-52);pyrTop.castShadow=true;scene.add(pyrTop);
boxM(slabMat,-161,-139,52.8,53.6,-61.5,-42.5);            /* azotea plana (azotea real) */
/* inclinación real de la fachada respecto a la vertical */
const faceLean=Math.atan2(25*.7071-14.6*.7071,36);         /* ≈ 0.203 rad */
/* ── núcleo central que sobresale (como la foto) ── */
const coreTex=tex(256,512,(c,w,h)=>{c.fillStyle='#85796b';c.fillRect(0,0,w,h);noise(c,w,h,420,.13,70,165);
  for(let y=24;y<h-16;y+=64){const x=((y/64|0)%2)?150:66;c.fillStyle='#2a2724';c.fillRect(x,y,32,22);c.fillStyle='rgba(255,255,255,.10)';c.fillRect(x,y,32,5)}});
const coreMat=new THREE.MeshStandardMaterial({map:coreTex,roughness:.85,metalness:.06,envMapIntensity:.3});
const core=new THREE.Mesh(new THREE.BoxGeometry(6.2,46.5,8),coreMat);core.position.set(-133.4,34.25,-44);core.castShadow=core.receiveShadow=true;scene.add(core);
boxM(slabMat,-137,-130,57.5,58.3,-48.3,-39.7);              /* capitel del núcleo */
/* ── caja de concreto blanco colgada de la fachada (foto: arriba-izquierda) ── */
const pentBox=new THREE.Mesh(new THREE.BoxGeometry(4.4,7.4,8),new THREE.MeshStandardMaterial({color:0xcdc7bb,roughness:.82,metalness:.04,envMapIntensity:.35}));
pentBox.position.set(-137.6,39.6,-51.75);pentBox.castShadow=true;scene.add(pentBox);
/* ── receso azul profundo (paño central de la foto) ── */
{const recess=new THREE.Mesh(new THREE.BoxGeometry(1.15,13.6,7.6),new THREE.MeshStandardMaterial({color:0x14335f,roughness:.55,metalness:.25,envMapIntensity:.5}));
 recess.rotation.z=faceLean;recess.position.set(-134.4,19.8,-50.6);recess.castShadow=true;scene.add(recess)}
/* ── aletas verticales profundas en la mitad derecha de la fachada ── */
for(const fz of[-49.8,-53.1,-56.4,-59.3]){
  const finV=new THREE.Mesh(new THREE.BoxGeometry(1.25,37,.6),towerMat);
  finV.rotation.z=faceLean;finV.position.set(-135.94,28.1,fz);finV.castShadow=true;scene.add(finV)}
/* ── panel-truss gigante en la azotea (la "aleta reticulada" de la foto) ── */
const finShape=new THREE.Shape();finShape.moveTo(0,0);finShape.lineTo(13,0);finShape.lineTo(13,10);finShape.closePath();
const finTex=tex(512,384,(c,w,h)=>{c.fillStyle='#33373e';c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(178,186,196,.9)';c.lineWidth=8;
  for(let x=-40;x<w;x+=58){c.beginPath();c.moveTo(x,h);c.lineTo(x+120,0);c.stroke()}
  c.lineWidth=4;for(let y=0;y<h;y+=46){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}
  c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,h-24,w,24)});
const finMatT=new THREE.MeshStandardMaterial({map:finTex,roughness:.7,metalness:.42,envMapIntensity:.4});
const fin=new THREE.Mesh(new THREE.ExtrudeGeometry(finShape,{depth:1.15,bevelEnabled:false}),finMatT);
fin.position.set(-156,52.8,-45.5);fin.rotation.y=Math.PI/2;fin.castShadow=true;scene.add(fin);
/* ── gran letrero azul SENATI, apoyado sobre la azotea (nada flota) ── */
const bbSide=new THREE.MeshStandardMaterial({color:0x0d2f6b,roughness:.55,metalness:.35});const bbMats=[bbSide,bbSide,bbSide,bbSide,bbSide,bbSide];
const billboard=new THREE.Mesh(new THREE.BoxGeometry(1.4,10,15),bbMats);billboard.position.set(-140.4,58.6,-53);billboard.castShadow=true;scene.add(billboard);
{const bbPlane=new THREE.Mesh(new THREE.PlaneGeometry(14.6,1.85),new THREE.MeshBasicMaterial({map:SENATI_FACE}));bbPlane.position.set(-139.65,58.4,-53);bbPlane.rotation.y=Math.PI/2;scene.add(bbPlane)}
/* puntales blancos diagonales del letrero (como en la foto: cableados a la azotea) */
const braceMat=new THREE.MeshStandardMaterial({color:0xe8e6df,roughness:.6,metalness:.3});
for(const bz of[-57.5,-48.5]){const len=9.5;const br=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,len,6),braceMat);
  br.position.set(-145.4,56.1,bz);br.rotation.z=-1.04;br.castShadow=true;scene.add(br)}
/* ingreso de la pirámide (cara este) */
boxM(new THREE.MeshStandardMaterial({color:0x141a22,roughness:.25,metalness:.7,envMapIntensity:1.1}),-130.6,-129.2,0,5.5,-64,-40);
boxM(S(0x1646a0,.4,{metalness:.55,envMapIntensity:.9}),-131.4,-130.2,5.5,6.6,-65,-39);      /* dintel azul */
const pyrSign=new THREE.Mesh(new THREE.PlaneGeometry(6,1.5),new THREE.MeshBasicMaterial({map:tex(512,128,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#eef2f6';c.font='900 88px Arial Black,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('SENATI',w/2+30,h/2+4);logo(c,56,h/2,42,'#eef2f6')}),transparent:true}));
pyrSign.position.set(-129.1,4.35,-52);pyrSign.rotation.y=Math.PI/2;scene.add(pyrSign);
/* beacons de aviación (apoyados sobre estructuras reales) */
const beacons=[];
const beaconGlowTex=tex(64,64,(c)=>{const r=c.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'rgba(255,80,60,1)');r.addColorStop(.4,'rgba(255,60,45,.5)');r.addColorStop(1,'rgba(255,60,45,0)');c.fillStyle=r;c.fillRect(0,0,64,64)});
function beacon(x,y,z,s=1){const m=new THREE.Mesh(new THREE.SphereGeometry(.22*s,8,6),new THREE.MeshBasicMaterial({color:0xff3b30}));m.position.set(x,y,z);scene.add(m);
  const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:beaconGlowTex,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));gs.scale.set(2.4*s,2.4*s,1);gs.position.set(x,y,z);scene.add(gs);
  beacons.push({m,gs,phase:Math.random()*6})}
beacon(-156.4,63.05,-58.3,1.0);                             /* cima del panel-truss */
beacon(-133.4,58.45,-44,.7);                               /* capitel del núcleo */

/* ── ESCUELA DE MECÁNICA DE MANTENIMIENTO (este) ──────────── */
const mecanicaTex=tex(2048,512,(c,w,h)=>{c.fillStyle='#eceff1';c.fillRect(0,0,w,h);noise(c,w,h,900,.08,150,235);
  c.fillStyle='#dde2e6';for(let y=128;y<h-40;y+=92)c.fillRect(0,y,w,26);
  for(let x=60;x<w-60;x+=128){c.fillStyle='#10151d';c.fillRect(x,140,88,52);c.fillStyle='rgba(255,255,255,.09)';c.fillRect(x,140,88,7)}
  for(let x=60;x<w-60;x+=128){c.fillStyle='#10151d';c.fillRect(x,300,88,52);c.fillStyle='rgba(255,255,255,.09)';c.fillRect(x,300,88,7)}
  /* SENATI + hex a la izquierda, título centrado */
  logo(c,96,66,42,'#1646a0');c.fillStyle='#1646a0';c.font='900 64px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.textBaseline='middle';c.fillText('SENATI',156,70);
  c.fillStyle='#20262e';c.font='700 46px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='center';c.fillText('ESCUELA DE MECÁNICA DE MANTENIMIENTO',w*.575,66);
  c.fillStyle='#1646a0';c.fillRect(0,h-34,w,14)});
const mecanicaGlow=tex(2048,512,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);
  for(let x=60;x<w-60;x+=128){if(Math.random()<.4){c.fillStyle='#ffd694';c.fillRect(x,140,88,52)}if(Math.random()<.4){c.fillStyle='#ffd694';c.fillRect(x,300,88,52)}}});
const mecanicaMat=new THREE.MeshStandardMaterial({map:mecanicaTex,emissive:0xffffff,emissiveMap:mecanicaGlow,emissiveIntensity:0,roughness:.8,metalness:.1,envMapIntensity:.35});
const mecanicaPlain=S(0xd7dcdf,.8);
const mecMats=[mecanicaMat,mecanicaMat,S(0xb9bfc5,.7),S(0xb9bfc5,.7),S(0xc9ced3,.75),S(0xc9ced3,.75)]; /* caras largas: fachada SENATI (+x calle / -x campus) */
const mec=new THREE.Mesh(new THREE.BoxGeometry(36,10,212),mecMats);mec.position.set(149,5,-49);mec.castShadow=mec.receiveShadow=true;scene.add(mec);
/* parapeto + baranda + tanques + A/C */
boxM(S(0xaab1b8,.6),130.2,167.8,10,10.7,-155,57);
for(const tz of[-140,-96,-30,8,44]){const r=cylM(S(0xf0f2f4,.5),1.25,1.35,1.9,149+((tz*7)%10)-5,11.65,tz,14)}
for(const az of[-122,-64,-12,28]){box(0xc9ced4,143,151.5,10.7,11.6,az,az+4.2)}
/* banner vertical luminoso SENATI MANTENIMIENTO (como la foto real) */
const bannerV=new THREE.Mesh(new THREE.PlaneGeometry(6.2,11),new THREE.MeshStandardMaterial({map:tex(256,512,(c,w,h)=>{c.fillStyle='#12324f';c.fillRect(0,0,w,h);const g2=c.createLinearGradient(0,0,0,h);g2.addColorStop(0,'#1a4a75');g2.addColorStop(1,'#0c2438');c.fillStyle=g2;c.fillRect(0,0,w,h);logo(c,w/2,86,52,'#3fa7d6');c.fillStyle='#58c1ef';c.font='900 64px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='center';c.fillText('SENATI',w/2,220);c.fillStyle='#9adcff';c.font='700 44px "Barlow Condensed",Arial Narrow,Arial';c.fillText('MANTENIMIENTO',w/2,300);c.fillStyle='#3fa7d6';c.fillRect(0,h-26,w,10)}),emissive:0x8ec9ff,emissiveIntensity:.25,emissiveMap:null,roughness:.6,metalness:.2,envMapIntensity:.5}));
bannerV.position.set(130.7,6.2,-8);bannerV.rotation.y=-Math.PI/2;scene.add(bannerV);
/* ingresos acristalados orientados al campus */
for(const ez of[-128,-84,-40,4,40]){boxM(new THREE.MeshStandardMaterial({color:0x10151d,roughness:.2,metalness:.75,envMapIntensity:1.2}),130.4,131.2,0,3.4,ez,ez+5);
  boxM(S(0x1646a0,.4,{metalness:.5,envMapIntensity:.9}),130.3,131.0,3.4,4.1,ez-.4,ez+5.4)}
/* cerco vivo (arbustos) frente a la fachada */
function hedge(x,z,w=4,d=1.4,h=1.1,c=0x2e5c33){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),S(c,.95,{envMapIntensity:.12}));m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;scene.add(m)}
for(const hz of[-146,-108,-70,-28,16,52])hedge(132.5,hz+4,3.4,1.6,1.25,hz%2?0x2e5c33:0x3a6b3a);
/* ── INGRESO SENATI (portal de la Panamericana) ───────────── */
const portalBlue=S(0x1646a0,.38,{metalness:.55,envMapIntensity:1.0});
boxM(portalBlue,-8.4,-5.6,0,5.4,-166.5,-164.5);boxM(portalBlue,5.6,8.4,0,5.4,-166.5,-164.5);
boxM(S(0x0d2f6b,.5,{metalness:.4}),-9.4,9.4,5.4,7.4,-167.3,-163.7);
const portalFace=new THREE.Mesh(new THREE.PlaneGeometry(17.6,1.9),new THREE.MeshBasicMaterial({map:INGRESO_FACE}));portalFace.position.set(0,6.4,-163.6);scene.add(portalFace);
box(0xe9ebed,-9.7,-4.3,5.3,5.55,-166.8,-164.2);box(0xe9ebed,4.3,9.7,5.3,5.55,-166.8,-164.2);   /* vierteaguas */
/* caseta de guardianía + plumas */
box(0xeef0f2,11.2,14,0,2.5,-166,-162.4);boxM(portalBlue,10.8,14.4,2.5,2.9,-166.4,-162);
boxM(new THREE.MeshStandardMaterial({color:0x10151d,roughness:.15,metalness:.7,envMapIntensity:1.3}),11.4,13.8,.7,1.9,-162.35,-162.3);
boxM(S(0xf2f4f6,.4),12.2,13.1,2.9,3.5,-164.6,-163.4);
{const post=box(0xd8d8d5,2.6,3.2,0,1.15,-160.8,-160.0);const arm=new THREE.Mesh(new THREE.BoxGeometry(6.4,.16,.16),new THREE.MeshStandardMaterial({map:tex(256,24,(c,w,h)=>{c.fillStyle='#f2f2f0';c.fillRect(0,0,w,h);c.fillStyle='#c4231a';for(let x=-h;x<w+h;x+=48){c.beginPath();c.moveTo(x,0);c.lineTo(x+24,0);c.lineTo(x+24+h,h);c.lineTo(x+h,h);c.closePath();c.fill()}}),roughness:.5,metalness:.3}));arm.position.set(-.6,1.06,-160.4);arm.rotation.z=.32;arm.castShadow=true;scene.add(arm)}
/* banderas en el portal: SENATI y Perú */
function poleAt(x,z){box(0xcfd3d8,x-.06,x+.06,0,9.4,z-.06,z+.06);const ball=cylM(S(0xd4af37,.3,{metalness:.85,envMapIntensity:1.3}),.17,.17,.3,x,9.5,z,10)}
poleAt(-6.3,-159.5);poleAt(6.3,-159.5);

/* ── PLAYA DE ESTACIONAMIENTO (con techos solares) ───────── */
asphalt(-118,-16,-152,-112,11);
medallion(-67,-132,2.5);
const solarTex=tex(512,256,(c,w,h)=>{c.fillStyle='#0e1c2e';c.fillRect(0,0,w,h);
  for(let y=8;y<h;y+=30)for(let x=6;x<w;x+=40){c.fillStyle='#16324f';c.fillRect(x,y,34,22);c.strokeStyle='#2c4a68';c.lineWidth=2;c.strokeRect(x,y,34,22)}
  c.fillStyle='rgba(120,190,255,.16)';c.fillRect(0,0,w,26)});
solarTex.wrapS=solarTex.wrapT=THREE.RepeatWrapping;
const solarMat=new THREE.MeshStandardMaterial({map:solarTex,roughness:.35,metalness:.55,envMapIntensity:1.1});
const solarFrame=S(0x17406b,.45,{metalness:.6,envMapIntensity:.8});
function carport(cx,cz,len=23){ /* pérgola fotovoltaica doble */
  for(const dx of[-len/2+1.1,0,len/2-1.1]){cylM(solarFrame,.28,.34,4.7,cx+dx,2.35,cz-2.3,10);cylM(solarFrame,.28,.34,4.7,cx+dx,2.35,cz+2.3,10);solid(cx+dx,cz-2.3,.36);solid(cx+dx,cz+2.3,.36)}
  const roof=new THREE.Mesh(new THREE.BoxGeometry(len,.16,5.6),solarMat);roof.position.set(cx,4.78,cz);roof.rotation.x=.10;roof.castShadow=true;scene.add(roof);
  const lip=new THREE.Mesh(new THREE.BoxGeometry(len,.5,.18),solarFrame);lip.position.set(cx,4.55,cz-2.72);scene.add(lip)}
carport(-95,-146);carport(-52,-146);carport(-95,-124);carport(-52,-124);
for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.PlaneGeometry(.16,5),new THREE.MeshBasicMaterial({color:0xe8e9e6,transparent:true,opacity:.75,depthWrite:false}));s.rotation.x=-Math.PI/2;s.position.set(-111+i*10.6,.012,-139);scene.add(s);
  const s2=s.clone();s2.position.z=-118.6;scene.add(s2)}
/* autos estacionados bajo pérgolas */
car(-101,-146,0xf2f2f2,0);car(-91,-146.2,0x7e1f1f,0);car(-57,-146,0x22304a,0);car(-48,-124,0x3a3f4a,Math.PI);car(-99,-124,0xd8d8d5,Math.PI);
/* postes rojos de doble brazo (como en la sede) */
const lampsL=[],lampGlows=[];
const lampHeadMat=new THREE.MeshBasicMaterial({color:0xf3e2ac});
const lampGlowTex=tex(64,64,(c)=>{const r=c.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'rgba(255,224,150,1)');r.addColorStop(.35,'rgba(255,214,120,.55)');r.addColorStop(1,'rgba(255,214,120,0)');c.fillStyle=r;c.fillRect(0,0,64,64)});
function lampPost(x,z,ry=0){const t=new THREE.Group();
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.13,.2,6.4,10),S(0x6e3527,.6,{envMapIntensity:.4}));pole.position.y=3.2;pole.castShadow=true;t.add(pole);
  const arm=new THREE.Mesh(new THREE.BoxGeometry(2.5,.13,.13),S(0x6e3527,.6));arm.position.set(0,6.25,0);t.add(arm);
  for(const dx of[-1.05,1.05]){const h=new THREE.Mesh(new THREE.BoxGeometry(.44,.12,.22),lampHeadMat);h.position.set(dx,6.18,0);t.add(h);
    const l=new THREE.PointLight(0xffd9a0,0,22,1.8);l.position.set(dx,5.9,0);t.add(l);lampsL.push(l);
    const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:lampGlowTex,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));gs.scale.set(3.8,3.8,1);gs.position.set(dx,6.15,0);t.add(gs);lampGlows.push(gs)}
  t.position.set(x,0,z);t.rotation.y=ry;scene.add(t);solid(x,z,.3)}
lampPost(-77,-157.5,0);lampPost(-29,-157.5,0);lampPost(-118,-132,Math.PI/2);lampPost(-13,-132,Math.PI/2);
/* ── AUDITORIO (muro de ladrillo rojo + gran banner) ─────── */
const brickTex=tex(512,512,(c,w,h)=>{c.fillStyle='#38201a';c.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=26){for(let x=0;x<w;x+=52){const off=(y/26)%2?26:0;const v=46+Math.random()*30|0;c.fillStyle=`rgba(${v+34},${v*.62|0},${v*.48|0},1)`;c.fillRect(x+off-26,y,48,22)}}
  noise(c,w,h,500,.16,20,90)});
brickTex.wrapS=brickTex.wrapT=THREE.RepeatWrapping;brickTex.repeat.set(7,2.4);
const brickMat=new THREE.MeshStandardMaterial({map:brickTex,roughness:.92,metalness:.02,envMapIntensity:.22});
boxM(brickMat,-112,-24,0,9.4,-98,-70);                                   /* cuerpo (retranqueado) */
boxM(portalBlue,-112,-24,-.02,.06,-98.2,-69.8);                          /* sobrecimiento */
/* pórtico azul + columnas blancas */
boxM(portalBlue,-113.5,-22.5,9.4,12.6,-104.5,-68.5);
/* fachada norte (lado estacionamiento): letras AUDITORIO como la foto (la cara nz mirrorea la UV → clonar invertida) */
const AUDITORIO_FACE_NZ=AUDITORIO_FACE.clone();AUDITORIO_FACE_NZ.wrapS=THREE.RepeatWrapping;AUDITORIO_FACE_NZ.repeat.x=-1;AUDITORIO_FACE_NZ.offset.x=1;AUDITORIO_FACE_NZ.needsUpdate=true;
{const af=new THREE.Mesh(new THREE.BoxGeometry(91.5,2.6,36.5),[S(0x0d2f6b,.5,{metalness:.4}),S(0x0d2f6b,.5,{metalness:.4}),S(0x0d2f6b,.5,{metalness:.4}),S(0x0d2f6b,.5),S(0x0d2f6b,.5,{metalness:.4}),new THREE.MeshStandardMaterial({map:AUDITORIO_FACE_NZ,roughness:.4,metalness:.35,envMapIntensity:.9})]);af.position.set(-67.75,11,-86.5);af.castShadow=true;scene.add(af)}
for(const cx of[-103,-80,-57,-34])cylM(S(0xf2f2ee,.6,{envMapIntensity:.5}),.72,.8,9.4,cx,4.7,-102.2,16);
/* fachada posterior (sur): muro corrugado + vano oscuro + cruz */
const corrugTex=tex(256,256,(c,w,h)=>{c.fillStyle='#e3e6ea';c.fillRect(0,0,w,h);for(let x=0;x<w;x+=16){c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x,0,3,h);c.fillStyle='rgba(70,76,84,.45)';c.fillRect(x+8,0,4,h)}noise(c,w,h,180,.08,120,200)});
corrugTex.wrapS=corrugTex.wrapT=THREE.RepeatWrapping;corrugTex.repeat.set(10,2);
boxM(new THREE.MeshStandardMaterial({map:corrugTex,roughness:.6,metalness:.25,envMapIntensity:.5}),-112,-24,0,6.8,-69.6,-68.8);
boxM(new THREE.MeshStandardMaterial({color:0x0b0e14,roughness:.2,metalness:.6,envMapIntensity:.8}),-84,-48,0,4.6,-69.9,-69.2);
boxM(S(0x1646a0,.4),-84.8,-47.2,4.6,5.3,-69.9,-69.1);
{const cross=new THREE.Group();const cm=S(0x3a3f47,.45,{metalness:.6,envMapIntensity:.7});
 const v=new THREE.Mesh(new THREE.BoxGeometry(.34,2.6,.18),cm);v.position.set(-66,3.4,-68.65);cross.add(v);
 const hz=new THREE.Mesh(new THREE.BoxGeometry(1.5,.34,.18),cm);hz.position.set(-66,3.75,-68.65);cross.add(hz);cross.castShadow=true;scene.add(cross)}
/* gran banner de la Semana de Innovaciones */
const bannerTex=tex(2048,512,(c,w,h)=>{c.fillStyle='#14419c';c.fillRect(0,0,w,h);
  const g1=c.createLinearGradient(0,0,0,h);g1.addColorStop(0,'rgba(255,255,255,.22)');g1.addColorStop(.45,'rgba(255,255,255,0)');g1.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=g1;c.fillRect(0,0,w,h);
  /* slashes diagonales blanco/teal/verde */
  c.fillStyle='#f4f4f2';c.beginPath();c.moveTo(0,h);c.lineTo(300,0);c.lineTo(392,0);c.lineTo(92,h);c.closePath();c.fill();
  c.fillStyle='#27c3e0';c.beginPath();c.moveTo(150,h);c.lineTo(450,0);c.lineTo(505,0);c.lineTo(205,h);c.closePath();c.fill();
  c.fillStyle='#3fd08a';c.beginPath();c.moveTo(258,h);c.lineTo(558,0);c.lineTo(592,0);c.lineTo(292,h);c.closePath();c.fill();
  c.fillStyle='#ffffff';c.font='900 118px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.textBaseline='middle';
  c.fillText('SEMANA DE INNOVACIONES',650,h*.30);
  c.fillText('TECNOLÓGICAS  MECATRÓNICA',650,h*.58);
  c.fillStyle='#ffe9a8';c.fillText('AUTOMOTRIZ',650,h*.84);
  logo(c,w-118,h*.46,88,'#ffffff')});
const bannerMat=new THREE.MeshStandardMaterial({map:bannerTex,roughness:.55,metalness:.15,envMapIntensity:.6,emissive:0xffffff,emissiveMap:bannerTex,emissiveIntensity:0});
const banner=new THREE.Mesh(new THREE.PlaneGeometry(46,6.6),bannerMat);banner.position.set(-68,4.75,-98.2);banner.rotation.y=Math.PI;banner.castShadow=true;scene.add(banner);
/* zigzag de trusas azules sobre la fachada frontal (firma del auditorio) */
for(let i=0;i<9;i++){const zz=new THREE.Mesh(new THREE.BoxGeometry(5.8,.72,.5),S(0x2e3a47,.6,{metalness:.55,envMapIntensity:.5}));zz.position.set(-108+i*10.4,12.82,-104.2);zz.rotation.z=i%2?-.42:.42;zz.castShadow=true;scene.add(zz)}
box(0xe9ebed,-104,-30,12.6,12.95,-103.2,-102);
/* escalinata + cadena amarilla posterior */
box(0xd8b400,-72,-60,0,.24,-68.5,-66.4);box(0xe8b400,-72,-60,.24,.48,-67.8,-66.4);
/* estudiantes sentados bajo el pórtico */
window.__pabellonCampus=[[-88,-96.5,'alumno',Math.PI/2,true],[-72,-96.5,'alumno',-Math.PI/2,true],[-52,-96.5,'persona',Math.PI/2,true],[-38,-49,'alumno',1.2,true],[-18.5,-44,'persona',-1.8,false]];

/* ── COMEDOR (bloque azul con COMEDOR y barandal) ────────── */
const __zCom=scene.children.length;
box(0xdfe3e6,-124,-76,0,6.2,-62,-36);
{const glassT=tex(1024,256,(c,w,h)=>{c.fillStyle='#10151d';c.fillRect(0,0,w,h);
  for(let x=0;x<w;x+=86){c.fillStyle='#1b2735';c.fillRect(x+5,18,76,h-36);c.fillStyle='rgba(255,255,255,.10)';c.fillRect(x+5,18,76,9);
    c.fillStyle='#e8e9e6';for(let k=0;k<3;k++)c.fillRect(x+16+k*24,h-58,14,20)}
  c.fillStyle='rgba(255,255,255,.75)';c.fillRect(0,h-12,w,5)});
 const comedorGlow=tex(1024,256,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);
  for(let x=20;x<w;x+=86){if(Math.random()<.55){c.fillStyle='#ffdf9e';c.fillRect(x,h*.35,66,h*.5)}}});
 const glassMat=new THREE.MeshStandardMaterial({map:glassT,emissive:0xffffff,emissiveMap:comedorGlow,emissiveIntensity:.3,roughness:.16,metalness:.7,envMapIntensity:1.35});window.__comedorGlassMat=glassMat;
 const gf=new THREE.PlaneGeometry(47.4,4.4);const mN=new THREE.Mesh(gf,glassMat);mN.position.set(-100,3.1,-35.92);scene.add(mN);   /* sur mirando al pabellón */
 const gfE=new THREE.PlaneGeometry(24.6,4.4);{const uv=gfE.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*24.6/47.4)}   /* el vidrio este mide lo mismo que el muro (antes sobresalía ~11 m) */
 const mE=new THREE.Mesh(gfE,glassMat);mE.position.set(-75.92,3.1,-49);mE.rotation.y=Math.PI/2;scene.add(mE)}
boxM(portalBlue,-125,-75,6.2,8.7,-63,-35);
{const cf=new THREE.Mesh(new THREE.BoxGeometry(50.5,1.9,28.5),[S(0x0d2f6b,.5,{metalness:.4}),S(0x0d2f6b,.5,{metalness:.4}),S(0x0d2f6b,.5),S(0x0d2f6b),new THREE.MeshStandardMaterial({map:COMEDOR_FACE,roughness:.4,metalness:.35,envMapIntensity:.9}),S(0x0d2f6b,.5,{metalness:.4})]);cf.position.set(-100,7.45,-49);cf.castShadow=true;scene.add(cf)}
/* baranda de azotea + tanques + A/C + ventilación */
for(const [x0,x1] of [[-124.4,-75.6]]){box(0x9aa1a8,x0,x0+.12,8.7,9.6,-62.6,-35.4);box(0x9aa1a8,x1-.12,x1,8.7,9.6,-62.6,-35.4);
  for(let x=x0;x<=x1;x+=4)box(0x9aa1a8,x-.06,x+.06,8.7,9.1,-62.6,-62.45)}
cylM(S(0xf0f2f4,.5),1.35,1.45,2.2,-115,9.8,-52,14);cylM(S(0xf0f2f4,.5),1.1,1.2,1.7,-88,9.6,-45,14);
box(0xc9ced4,-108,-102.5,8.7,9.5,-57,-53.5);box(0xc9ced4,-95,-91,8.7,9.4,-41,-38);
cylM(S(0x8a8f96,.6),.32,.32,2.6,-120,10,-58,8);
/* amarillo de protección en el vidrio (tubos dobles) */
box(0xe8b400,-124,-76,1.02,1.13,-35.82,-35.68);box(0xe8b400,-124,-76,.68,.79,-35.82,-35.68);
moveZone(__zCom,4,0);                                    /* plano: el comedor se corre 4 m al este para dejar la pista oeste junto a la pirámide */

/* ── PARQUE (gran árbol + obelisco con busto) ────────────── */
{const dirt=tex(256,256,(c,w,h)=>{c.fillStyle='#7d6547';c.fillRect(0,0,w,h);noise(c,w,h,900,.2,40,120)});
 const pathMat=new THREE.MeshStandardMaterial({map:dirt,roughness:1,metalness:0,envMapIntensity:.1,side:THREE.DoubleSide});
 /* sendero de tierra CURVO tipo "Y" como en la foto (bifurca alrededor del obelisco) */
 function ribbon(pts,width,mat,y=.014){
  const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1])));
  const N=72,pos=[],idx=[];
  for(let i=0;i<=N;i++){const t=i/N;const p=curve.getPoint(t),tan=curve.getTangent(t);
   let nx=-tan.z,nz=tan.x;const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;
   pos.push(p.x-nx*width/2,0,p.z-nz*width/2, p.x+nx*width/2,0,p.z+nz*width/2);
   if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
  const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g2.setIndex(idx);g2.computeVertexNormals();
  const m=new THREE.Mesh(g2,mat);m.position.y=y;m.receiveShadow=true;scene.add(m)}
 /* rama principal: este → suroeste (una "S" suave) */
 ribbon([[-11.5,-33.5],[-20,-37.5],[-28.5,-43],[-36.5,-48.5],[-45,-53.5],[-53,-59.5],[-60.5,-64.5]],2.9,pathMat,.013);
 /* bifurcación norte: la "Y" alrededor del obelisco */
 ribbon([[-30.5,-44.2],[-29.5,-51.5],[-27,-58.5],[-24.5,-66]],2.4,pathMat,.017);
 ribbon([[-30.5,-44.2],[-37,-40.5],[-45,-36.5],[-55,-32.5]],2.0,pathMat,.021);
}
/* el árbol magnolia gigante frente al comedor */
function bigTree(x,z){const t=new THREE.Group();
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.8,1.15,5.4,10),S(0x4f3a26,.95));trunk.position.y=2.7;trunk.castShadow=true;t.add(trunk);
  [[0,6.6,0,3.2],[-2,5.6,1,2.4],[2.2,5.8,-.8,2.5],[-.8,7.8,-1,2.3],[1.2,7.6,1.1,2.1]].forEach(([dx,dy,dz,r])=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),S(0x2c4a26,1,{envMapIntensity:.15}));m.position.set(dx,dy,dz);m.castShadow=true;t.add(m)});
  t.position.set(x,0,z);scene.add(t)}
bigTree(-50,-53);
/* obelisco blanco con busto de bronce sobre cama circular con arbustos */
{const bed=new THREE.Mesh(new THREE.CircleGeometry(2.5,26),new THREE.MeshStandardMaterial({color:0x6b5638,roughness:1,metalness:0,envMapIntensity:.08}));bed.rotation.x=-Math.PI/2;bed.position.set(-28,.013,-46);bed.receiveShadow=true;scene.add(bed);
 for(let i=0;i<6;i++){const a=i*Math.PI/3+.4;const bsh=new THREE.Mesh(new THREE.IcosahedronGeometry(.42,1),S(0x2e5c33,1,{envMapIntensity:.15}));bsh.position.set(-28+Math.cos(a)*2.15,.32,-46+Math.sin(a)*2.15);bsh.scale.y=.75;bsh.castShadow=true;scene.add(bsh)}}
cylM(S(0xd8d5cc,.55,{envMapIntensity:.6}),2.1,2.3,.4,-28,.2,-46,20);
box(0xcfccc2,-29.35,-26.65,.4,.75,-47.35,-44.65);
box(0xe4e1d6,-29.05,-26.95,.75,1.15,-47.05,-44.95);
cylM(S(0xefede4,.42,{envMapIntensity:.75}),.36,.64,3.5,-28,2.9,-46,4);
cylM(S(0x2a2c30,.32,{metalness:.88,envMapIntensity:.9}),.34,.34,.22,-28,4.8,-46,12);
{const bust=new THREE.Mesh(new THREE.SphereGeometry(.34,10,8),S(0x2a2c30,.32,{metalness:.88,envMapIntensity:.9}));bust.scale.set(1,1.18,.85);bust.position.set(-28,5.18,-46);bust.castShadow=true;scene.add(bust)}
/* dátil silvestre: tronco grueso con anillos + copa grande y gacha, verde oscuro */
function datePalm(x,z,s=1){const t=new THREE.Group();
 const tTex=tex(128,128,(c,w,h)=>{c.fillStyle='#6e5236';c.fillRect(0,0,w,h);for(let y=0;y<h;y+=14){c.fillStyle='rgba(30,20,10,.5)';c.fillRect(0,y,w,5);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(0,y+5,w,2)}noise(c,w,h,120,.15,40,110)});
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.34*s,.5*s,5.6*s,10),new THREE.MeshStandardMaterial({map:tTex,roughness:.95,envMapIntensity:.15}));trunk.position.y=2.8*s;trunk.castShadow=true;t.add(trunk);
 const crown=new THREE.Group();crown.position.y=5.6*s;t.add(crown);
 for(let k=0;k<16;k++){const pivot=new THREE.Group();pivot.rotation.y=k*Math.PI/8+Math.random()*.2;crown.add(pivot);
  const fg=new THREE.PlaneGeometry(4.1*s,.62*s);fg.translate(2.05*s,0,0);
  const f=new THREE.Mesh(fg,new THREE.MeshStandardMaterial({color:k%3?0x1e4023:0x2a5230,roughness:.85,side:THREE.DoubleSide,envMapIntensity:.12}));
  f.rotation.z=-(.32+Math.random()*.5);f.rotation.x=(Math.random()-.5)*.3;f.castShadow=true;pivot.add(f)}
 t.position.set(x,0,z);t.rotation.y=Math.random()*6.28;scene.add(t)}
/* royal: tronco gris liso con base pintada de blanco (como frente al comedor) */
function royalPalm(x,z,s=1){const t=new THREE.Group();
 const lower=new THREE.Mesh(new THREE.CylinderGeometry(.21*s,.25*s,1.7*s,10),S(0xf2f0ea,.85));lower.position.y=.85*s;lower.castShadow=true;t.add(lower);
 const upper=new THREE.Mesh(new THREE.CylinderGeometry(.17*s,.21*s,4.9*s,10),S(0x9aa39d,.9));upper.position.y=1.7*s+2.45*s;upper.castShadow=true;t.add(upper);
 const crown=new THREE.Group();crown.position.y=6.7*s;t.add(crown);
 for(let k=0;k<12;k++){const pivot=new THREE.Group();pivot.rotation.y=k*Math.PI/6+Math.random()*.25;crown.add(pivot);
  const fg=new THREE.PlaneGeometry(3.3*s,.72*s);fg.translate(1.65*s,0,0);
  const f=new THREE.Mesh(fg,new THREE.MeshStandardMaterial({color:palmLeaf[k%3],roughness:.8,side:THREE.DoubleSide,envMapIntensity:.14}));
  f.rotation.z=-(.2+Math.random()*.42);pivot.add(f)}
 t.position.set(x,0,z);t.rotation.y=Math.random()*6.28;scene.add(t)}
datePalm(-44,-38.5,1.05);datePalm(-36.5,-47,.9);datePalm(-24,-39.5,.95);
royalPalm(-56,-37.4,1.0);royalPalm(-48.5,-37.6,.92);
palm(-21,-37.6,1.05);palm(-23,-62,.9);palm(-44,-37.7,.8);
function bushY(x,z,s=1){const t=new THREE.Group();
 const b1=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05*s,1),S(0x87a93a,1,{envMapIntensity:.14}));b1.position.y=.78*s;b1.scale.y=.72;t.add(b1);
 const b2=new THREE.Mesh(new THREE.IcosahedronGeometry(.68*s,1),S(0x6f9130,1,{envMapIntensity:.12}));b2.position.set(.55*s,.55*s,.28*s);b2.scale.y=.66;t.add(b2);
 t.position.set(x,0,z);t.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(t)}
bushY(-39,-34.5,1.7);bushY(-16.5,-46.5,1.15);bushY(-30,-63.5,1.25);
hedge(-36,-64,5,1.6,1.2,0x3a6b3a);hedge(-17,-45,4,1.4,1.05,0x2e5c33);
/* franja de arbustos oscuros bajo la fachada este (como en la foto de la mecánica) */
for(const hz of[-58,-52,-46,-40]){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),S(0x2c4a26,1,{envMapIntensity:.12}));b.position.set(-13.6,.4,hz);b.scale.y=.8;b.castShadow=true;scene.add(b)}
/* magnolia: sombra densa como en la foto */

bench(-45,-40);bench(-20,-55);

/* ════════════════════════════════════════════════════════════
   JARDÍN DE ESCUELA DE MANTENIMIENTO — el "espacio en blanco"
   frente a la fachada (como en las fotos reales de la sede:
   césped, sendero de tierra en curva, dátiles, palmeras reales,
   magnolia, busto sobre pedestal blanco y brocha gorda)
   ════════════════════════════════════════════════════════════ */
lawn(14,124,-82,-24);                                     /* césped continuo frente a la fachada y hasta el Centro de Formación (contenedores sobre la loseta) */
{
  const dirtJ=tex(256,256,(c,w,h)=>{c.fillStyle='#7d6547';c.fillRect(0,0,w,h);noise(c,w,h,900,.2,40,120)});
  const pathMatJ=new THREE.MeshStandardMaterial({map:dirtJ,roughness:1,metalness:0,envMapIntensity:.1,side:THREE.DoubleSide});
  const ribbonJ=(pts,width,y)=>{const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1])));
    const N=80,pos=[],idx=[];
    for(let i=0;i<=N;i++){const t=i/N,p=curve.getPoint(t),tan=curve.getTangent(t);
      let nx=-tan.z,nz=tan.x;const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;
      pos.push(p.x-nx*width/2,0,p.z-nz*width/2, p.x+nx*width/2,0,p.z+nz*width/2);
      if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
    const g3=new THREE.BufferGeometry();g3.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g3.setIndex(idx);g3.computeVertexNormals();
    const m=new THREE.Mesh(g3,pathMatJ);m.position.y=y;m.receiveShadow=true;scene.add(m)};
  /* sendero principal de tierra: entra por el suroeste y llega al ingreso z=-40 */
  ribbonJ([[23,-22.5],[36,-33],[50,-27.5],[64,-37],[80,-31],[98,-37.5],[114,-32.5],[128.6,-38.8]],2.7,.013);
  /* espiral que rodea al busto (como en la foto) */
  ribbonJ([[86,-32.6],[88,-43],[94,-52],[106,-55.5],[122.4,-52.5]],2.1,.017);
  /* busto de bronce sobre pedestal blanco en una cama circular de tierra */
  {const bed=new THREE.Mesh(new THREE.CircleGeometry(2.3,26),new THREE.MeshStandardMaterial({color:0x6b5638,roughness:1,metalness:0,envMapIntensity:.08}));bed.rotation.x=-Math.PI/2;bed.position.set(99,.011,-44.5);bed.receiveShadow=true;scene.add(bed);
   for(let i=0;i<6;i++){const a=i*Math.PI/3+.4;const bsh=new THREE.Mesh(new THREE.IcosahedronGeometry(.34,1),S(0x2e5c33,1,{envMapIntensity:.15}));bsh.position.set(99+Math.cos(a)*1.95,.26,-44.5+Math.sin(a)*1.95);bsh.scale.y=.75;bsh.castShadow=true;scene.add(bsh)}}
  box(0xcfccc2,97.6,100.4,0,.32,-46.1,-42.9);               /* zócalo */
  cylM(S(0xefede4,.42,{envMapIntensity:.7}),.33,.56,1.5,99,.32+.75,-44.5,4);   /* pedestal troncocónico */
  box(0xe4e1d6,98.35,99.65,1.78,1.94,-45.15,-43.85);        /* capitel */
  {const bm=S(0x2a2c30,.32,{metalness:.88,envMapIntensity:.9});
   const head=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),bm);head.scale.set(1,1.2,.9);head.position.set(99,2.32,-44.5);head.castShadow=true;scene.add(head);
   const shoulders=new THREE.Mesh(new THREE.SphereGeometry(.34,12,10),bm);shoulders.scale.set(1.25,.55,.78);shoulders.position.set(99,1.97,-44.5);shoulders.castShadow=true;scene.add(shoulders)}
}
/* arboleda: magnolia grande al noroeste + fila de dátiles frente a la fachada + palmeras reales de tronco blanco */
bigTree(47,-56);
datePalm(116,-57,.95);datePalm(116,-44,1.0);datePalm(116,-30,.9);
datePalm(64,-55,1.05);datePalm(40,-30,.85);datePalm(88,-58,.8);
datePalm(76,-27.5,.8);datePalm(29.5,-45.5,.9);datePalm(104,-52.5,.75);
royalPalm(31,-37,1.05);royalPalm(26.5,-53,.92);royalPalm(40,-45.5,1.12);royalPalm(29.5,-30.5,.88);
/* brocha gorda (arbustos verde-amarillento grandes) */
bushY(56,-25,1.5);bushY(34,-62.5,1.35);bushY(107,-45,1.15);bushY(121.5,-18.5,1.45);bushY(74,-24.5,1.1);
bushY(48,-36,2.0);bushY(118,-44,1.5);
/* matas amarillo-verdosas pequeñas junto al zócalo (como en la fachada real) */
bushY(123.5,-34,.68);bushY(123.5,-49.5,.72);bushY(123.5,-12,.7);
/* cartel rojo de aviso junto al sendero (como el tablero metálico de la foto) */
{boxM(S(0x8c1f16,.5),20.1,20.35,1.25,2.15,-33.9,-30.9);boxM(S(0x5d130c,.55),20.05,20.4,2.15,2.3,-34.0,-30.8);box(0x2b2b2b,20.15,20.3,0,1.25,-32.7,-32.2);box(0x2b2b2b,20.15,20.3,0,1.25,-33.5,-33.0)}
/* arbustos oscuros bajo la fachada */
for(const hz of[-60,-48,-34,-24,-12,12]){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),S(0x2c4a26,1,{envMapIntensity:.12}));b.position.set(128.2,.4,hz);b.scale.y=.8;b.castShadow=true;scene.add(b)}
/* bolardos blancos bajos del borde suroeste (como los postes del sendero real) */
for(const px of[26,36,46,56])cylM(S(0xf2f0ea,.55),.07,.085,.62,px,.31,-21.6,8);
bench(52,-35.5);
/* vallas publicitarias apoyadas en el parapeto oeste (como en las fotos) */
function azoteaBillboard(z,kind){
  const t=kind===0
    ? tex(512,342,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#cfe7f4');g.addColorStop(.6,'#9cc4dd');g.addColorStop(1,'#7aa8c4');c.fillStyle=g;c.fillRect(0,0,w,h);const r=c.createRadialGradient(w*.72,h*.32,4,w*.72,h*.32,90);r.addColorStop(0,'rgba(255,255,238,.95)');r.addColorStop(1,'rgba(255,255,238,0)');c.fillStyle=r;c.fillRect(0,0,w,h)})
    : tex(512,342,(c,w,h)=>{c.fillStyle='#e9ebe4';c.fillRect(0,0,w,h);for(let i=0;i<26;i++){c.fillStyle=`rgba(70,90,110,${.08+Math.random()*.1})`;c.fillRect(Math.random()*w,h*.55+Math.random()*h*.4,60+Math.random()*140,8+Math.random()*26)}const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(120,130,140,.35)');c.fillStyle=g;c.fillRect(0,0,w,h)});
  for(const dz of[-1.9,1.9]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.2,3.7,.2),S(0x4a4f56,.6));leg.position.set(133.0,11.8,z+dz);leg.castShadow=true;scene.add(leg)}
  const frame=new THREE.MeshStandardMaterial({color:0x39414d,roughness:.6,metalness:.4,envMapIntensity:.3});
  const ad=new THREE.MeshStandardMaterial({map:t,roughness:.55,metalness:.15,envMapIntensity:.4});
  const panel=new THREE.Mesh(new THREE.BoxGeometry(.2,4.3,5.6),[frame,ad,frame,frame,frame,frame]);
  panel.position.set(131.9,12.6,z);panel.rotation.z=-.34;panel.castShadow=true;scene.add(panel)}
azoteaBillboard(-70,0);azoteaBillboard(30,1);

/* ════════════════════════════════════════════════════════════
   CENTRO DE FORMACIÓN N°2 — bloque hermano del Mecánica;
   completa la explanada norte que estaba vacía (idéntica al
   costado) y más zonas verdes alrededor (como en las fotos)
   ════════════════════════════════════════════════════════════ */
const hallWall=tex(512,256,(c,w,h)=>{c.fillStyle='#e8ebee';c.fillRect(0,0,w,h);noise(c,w,h,420,.06,120,235);
  for(let y=30;y<h;y+=34){c.fillStyle='rgba(70,76,84,.32)';c.fillRect(0,y,w,2)}
  for(let x=0;x<w;x+=64){c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x,0,2,h)}});
hallWall.wrapS=hallWall.wrapT=THREE.RepeatWrapping;hallWall.repeat.set(10,1);
boxM(new THREE.MeshStandardMaterial({map:hallWall,roughness:.8,metalness:.12,envMapIntensity:.3}),20,120,0,7.6,-98,-84);
boxM(S(0x1646a0,.42,{metalness:.55,envMapIntensity:.9}),19.7,120.3,0,1.15,-98.15,-83.85);        /* zócalo azul */
box(0xb9bfc5,19.5,120.5,7.6,7.95,-98.3,-83.7);                                                  /* losa de azotea */
box(0x8f979f,19.5,120.5,7.95,8.55,-98.3,-97.6);box(0x8f979f,19.5,120.5,7.95,8.55,-84.4,-83.7);   /* parapetos */
box(0x8f979f,19.5,20.2,7.95,8.55,-98.3,-83.7);box(0x8f979f,119.8,120.5,7.95,8.55,-98.3,-83.7);
/* franja de ventanas con glow cálido (se enciende en el ambiente Noche) */
const hallWinMat=new THREE.MeshStandardMaterial({color:0x0d1219,roughness:.18,metalness:.7,emissive:0xffd9a0,emissiveIntensity:0,envMapIntensity:1.1});
boxM(hallWinMat,24,116,4.6,6.4,-83.92,-83.74);
for(let x=27;x<116;x+=5)box(0x39414d,x-.09,x+.09,4.55,6.45,-83.9,-83.72);                        /* montantes */
/* ingresos acristalados + marquesinas azules */
for(const ex of[46,94]){boxM(new THREE.MeshStandardMaterial({color:0x10151d,roughness:.2,metalness:.75,envMapIntensity:1.2}),ex-2.2,ex+2.2,0,3.1,-83.94,-83.72);
  boxM(portalBlue,ex-3.1,ex+3.1,3.1,3.5,-84.4,-82.6);boxM(portalBlue,ex-2.6,ex+2.6,0,.28,-84.2,-83.8)}
/* letras SENATI + hexágono en la fachada sur */
{const signH=tex(1024,256,(c,w,h)=>{c.clearRect(0,0,w,h);c.strokeStyle='#1646a0';c.lineWidth=17;c.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;const px=150+92*Math.cos(a),py=128+92*Math.sin(a);i?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();c.stroke();
  c.fillStyle='#1646a0';c.font='900 118px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('S',150,131);
  c.fillStyle='#12324f';c.font='800 148px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.fillText('S E N A T I',322,130)});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(17,4.25),new THREE.MeshBasicMaterial({map:signH,transparent:true}));m.position.set(70,5.35,-83.71);scene.add(m)}
/* azotea: tanques + casetas + valla publicitaria apoyada en el parapeto */
for(const tx of[36,70,104])cylM(S(0xe9ebed,.5),1.15,1.25,1.8,tx,8.85,-91,12);
box(0xc9ced4,54,62,7.95,8.9,-95.5,-88.5);box(0xc9ced4,84,92,7.95,8.9,-95.5,-88.5);
{const bt=tex(512,342,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#cfe7f4');g.addColorStop(.6,'#9cc4dd');g.addColorStop(1,'#7aa8c4');c.fillStyle=g;c.fillRect(0,0,w,h);const r=c.createRadialGradient(w*.7,h*.3,4,w*.7,h*.3,95);r.addColorStop(0,'rgba(255,255,238,.95)');r.addColorStop(1,'rgba(255,255,238,0)');c.fillStyle=r;c.fillRect(0,0,w,h)});
 for(const bx of[66.2,73.8]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.2,2.7,.2),S(0x4a4f56,.6));leg.position.set(bx,9.3,-92.6);leg.castShadow=true;scene.add(leg)}
 const frame=new THREE.MeshStandardMaterial({color:0x39414d,roughness:.6,metalness:.4,envMapIntensity:.3});
 const ad=new THREE.MeshStandardMaterial({map:bt,roughness:.55,metalness:.15,envMapIntensity:.4});
 const panel=new THREE.Mesh(new THREE.BoxGeometry(7.4,3.9,.2),[frame,frame,frame,frame,frame,ad]);
 panel.position.set(70,10.35,-89.1);panel.rotation.x=.30;panel.castShadow=true;scene.add(panel)}
/* sendero de tierra que une la espiral del busto con el ingreso del nuevo bloque */
{const dirtT2=tex(256,256,(c,w,h)=>{c.fillStyle='#7d6547';c.fillRect(0,0,w,h);noise(c,w,h,900,.2,40,120)});
 const pm=new THREE.MeshStandardMaterial({map:dirtT2,roughness:1,metalness:0,envMapIntensity:.1,side:THREE.DoubleSide});
 const rb=(pts,width,y)=>{const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1])));const N=64,pos=[],idx=[];
  for(let i=0;i<=N;i++){const t=i/N,p=curve.getPoint(t),tan=curve.getTangent(t);let nx=-tan.z,nz=tan.x;const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;pos.push(p.x-nx*width/2,0,p.z-nz*width/2,p.x+nx*width/2,0,p.z+nz*width/2);if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
  const g3=new THREE.BufferGeometry();g3.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g3.setIndex(idx);g3.computeVertexNormals();const m=new THREE.Mesh(g3,pm);m.position.y=y;m.receiveShadow=true;scene.add(m)};
 rb([[58,-34.2],[56.5,-47],[55,-60],[55.5,-72],[56,-83.3]],2.3,.019)}
/* más verde en la explanada: hilera de dátiles frente al bloque + palmeras reales + árboles y brocha gorda */
bigTree(70,-75.5);
datePalm(28,-75.5,.9);datePalm(52,-78,.85);datePalm(76,-75.5,.9);datePalm(100,-78,.85);
royalPalm(23,-66,.95);royalPalm(117,-66,.95);
tree(24,-57,1.1);tree(116,-57.5,1.0);
bushY(30,-71,1.15);bushY(46,-78.5,1.25);bushY(84,-77,1.2);bushY(108,-76,1.1);bushY(60,-70,.95);
/* arbustos oscuros junto al zócalo del bloque (deja libres los ingresos) */
for(const hz of[28,38,62,78,88,112]){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),S(0x2c4a26,1,{envMapIntensity:.12}));b.position.set(hz,.4,-83.3);b.scale.y=.8;b.castShadow=true;scene.add(b)}
/* bolardos blancos del nuevo sendero */
for(const [bx,bz] of[[58,-50],[56.8,-60],[56.2,-70.5]])cylM(S(0xf2f0ea,.55),.07,.085,.62,bx,.31,bz,8);
/* postes rojos de doble brazo (como los del sendero real en la foto) */
lampPost(42,-68.5,0);lampPost(98,-68.5,Math.PI);
obst(19,121,-99.2,-83.8);                        /* Centro de Formación N°2: sin atravesar muros */
obst(-112,-24,-98,-70);       /* auditorio */
obst(-120,-72,-62,-36);       /* comedor (ya desplazado) */
obst(-122.6,-80.6,16.2,27.8);   /* anexo Estudios Generales (junto al pabellón; deja libre la escalera exterior oeste) */
obst(-122,-8,34,58);           /* escuela de Artes Gráficas */
obst(131,167,-155,57);        /* escuela de Mecánica de Mantenimiento */
obst(58,70.4,-22,-9);         /* contenedores */

/* ── ESTADIO: CANCHA DE FÚTBOL + LOZA DEPORTIVA, sobre una plataforma elevada 1.20 m y cercada con rejas ──
   Plano del usuario: la plataforma está al nivel del comedor y el auditorio (sobresale ~50 cm de la pista y las veredas).
   El largo de la loza = el ancho de la cancha (38 m). Se entra por dos portones al norte (lado de la vereda). */
const PL={x0:-105,x1:-13,z0:-30.4,z1:10.8,h:1.2};      /* el borde este queda a 4 m de la calzada (el ancho de una vereda) */
window.RAISED=[{x0:PL.x0,x1:PL.x1,z0:PL.z0,z1:PL.z1,h:PL.h,ramp:.02}];       /* se sube por las escaleras de los portones (js/04c-ajustes.js, bloque «Estadio elevado») */       /* la navegación sube/baja suavemente en los portones */
const fieldLineMat=new THREE.MeshBasicMaterial({color:0xf2f4ee,transparent:true,opacity:.92,depthWrite:false});
const FC={x:PL.x0+32.5,z:-9.8},HL=30,HW=19;                                 /* centro de la cancha, mitad de largo y de ancho (60 × 38 m) */
window.__cancha={x:FC.x,z:FC.z,hl:HL,hw:HW,y:PL.h};
const DIV=FC.x+HL+2.5;                                               /* reja que separa cancha y loza */
box(0xc3c7ca,PL.x0,PL.x1,0,PL.h,PL.z0,PL.z1);                        /* losa de concreto */
box(0xe1e4e6,PL.x0-.12,PL.x1+.12,PL.h-.1,PL.h,PL.z0-.12,PL.z0+.1);box(0xe1e4e6,PL.x0-.12,PL.x1+.12,PL.h-.1,PL.h,PL.z1-.1,PL.z1+.12);   /* sardinel claro */
box(0xe1e4e6,PL.x0-.12,PL.x0+.1,PL.h-.1,PL.h,PL.z0,PL.z1);box(0xe1e4e6,PL.x1-.1,PL.x1+.12,PL.h-.1,PL.h,PL.z0,PL.z1);
const __zStad=scene.children.length;
const pitchTex=tex(256,256,(c,w,h)=>{for(let i=0;i<8;i++){c.fillStyle=i%2?'#4f8c45':'#437d39';c.fillRect(i*32,0,32,h)}noise(c,w,h,1200,.05,60,130)});   /* franjas de corte cada 8 m */
pitchTex.wrapS=pitchTex.wrapT=THREE.RepeatWrapping;
lawn(PL.x0,DIV,PL.z0,PL.z1,.012,new THREE.MeshStandardMaterial({map:pitchTex,roughness:1,metalness:0,envMapIntensity:.18}));
const line=(w,l,x,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,l),fieldLineMat);m.rotation.x=-Math.PI/2;m.position.set(x,.03,z);scene.add(m)};
line(2*HL,.32,FC.x,FC.z-HW);line(2*HL,.32,FC.x,FC.z+HW);line(.32,2*HW,FC.x,FC.z);line(.32,2*HW,FC.x-HL,FC.z);line(.32,2*HW,FC.x+HL,FC.z);
{const ring=new THREE.Mesh(new THREE.RingGeometry(4.3,5,44),fieldLineMat);ring.rotation.x=-Math.PI/2;ring.position.set(FC.x,.03,FC.z);scene.add(ring);
 const dot=new THREE.Mesh(new THREE.CircleGeometry(.32,12),fieldLineMat);dot.rotation.x=-Math.PI/2;dot.position.set(FC.x,.03,FC.z);scene.add(dot);
 for(const s of[-1,1]){const bx=FC.x+s*HL;line(.32,22,bx-s*10,FC.z);line(10,.32,bx-s*5,FC.z-11);line(10,.32,bx-s*5,FC.z+11);        /* área grande */
   line(.32,10,bx-s*4,FC.z);line(4,.32,bx-s*2,FC.z-5);line(4,.32,bx-s*2,FC.z+5);                                                     /* área chica */
   const d=new THREE.Mesh(new THREE.CircleGeometry(.3,10),fieldLineMat);d.rotation.x=-Math.PI/2;d.position.set(bx-s*6.6,.03,FC.z);scene.add(d)}}
const goalMat=new THREE.MeshStandardMaterial({color:0xf4f6f4,roughness:.35,metalness:.25,envMapIntensity:.7});
function goalAt(x,flip){const gM=new THREE.Group();
  [[-3.6],[3.6]].forEach(([dz])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,2.35,10),goalMat);p.position.set(0,1.18,dz);p.castShadow=true;gM.add(p)});
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,7.3,10),goalMat);bar.rotation.x=Math.PI/2;bar.position.set(0,2.32,0);bar.castShadow=true;gM.add(bar);
  [[-3.6],[3.6]].forEach(([dz])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.5,8),goalMat);p.rotation.z=Math.PI/2;p.position.set(flip*.75,.6,dz);gM.add(p)});
  gM.position.set(x,0,FC.z);gM.rotation.y=flip>0?0:Math.PI;gM.userData.keep=1;scene.add(gM)}
goalAt(FC.x-HL,1);goalAt(FC.x+HL,-1);
/* reflectores */
function floodPole(x,z){cylM(S(0x333840,.6),.16,.22,10.5,x,5.25,z,8);box(0x333840,x-.9,x+.9,10.3,10.7,z-.3,z+.3);for(const dx of[-.6,0,.6])box(0xd8d8d5,x+dx-.18,x+dx+.18,10.0,10.32,z-.22,z+.22)}
floodPole(FC.x-HL+2,PL.z0+.9);floodPole(FC.x+HL-2,PL.z1-.9);floodPole(FC.x+HL-2,PL.z0+.9);floodPole(FC.x-HL+2,PL.z1-.9);

/* loza deportiva: 22 × 38 m, cemento oscuro con DOS canchas de vóley (9 × 18 m) en fila */
const LZ={x:(DIV+PL.x1)/2};
asphalt(LZ.x-11,LZ.x+11,FC.z-HW,FC.z+HW,8);
{const cm=new THREE.MeshBasicMaterial({color:0xf2f4ee,transparent:true,opacity:.9,depthWrite:false});
 const L2=(w,l,x,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,l),cm);m.rotation.x=-Math.PI/2;m.position.set(x,.03,z);scene.add(m)};
 for(const cz of[FC.z-9.5,FC.z+9.5]){
  L2(9.2,.14,LZ.x,cz-9);L2(9.2,.14,LZ.x,cz+9);L2(.14,18.1,LZ.x-4.5,cz);L2(.14,18.1,LZ.x+4.5,cz);L2(9,.14,LZ.x,cz-3);L2(9,.14,LZ.x,cz+3);L2(9.2,.2,LZ.x,cz);
  for(const sx of[-4.9,4.9])cylM(S(0xf2f2f2,.4),.06,.075,2.5,LZ.x+sx,1.25,cz,8);
  const net=new THREE.Mesh(new THREE.PlaneGeometry(9.8,.95),std({color:0x14161a,roughness:.9,transparent:true,opacity:.78,side:THREE.DoubleSide,envMapIntensity:.2}));net.position.set(LZ.x,2.03,cz);net.castShadow=true;scene.add(net);
  const tp=new THREE.Mesh(new THREE.BoxGeometry(9.8,.09,.06),S(0xf2f2f2,.4));tp.position.set(LZ.x,2.52,cz);scene.add(tp)}}
{const st=moveZone(__zStad,0,0);st.position.y=PL.h}                  /* todo lo anterior sube 50 cm sobre la losa */
/* rejas: perímetro de la plataforma + reja medianera; portón de 4 m al norte de cada recinto (04b-cerco-verde.js las dibuja y las hace sólidas) */
{const e=.3,X0=PL.x0+e,X1=PL.x1-e,Z0=PL.z0+e,Z1=PL.z1-e,g1=FC.x,g2=LZ.x;
 window.__fences=[[X0,Z0,g1-2,Z0],[g1+2,Z0,DIV,Z0],[DIV,Z0,g2-2,Z0],[g2+2,Z0,X1,Z0],[X1,Z0,X1,Z1],[X1,Z1,X0,Z1],[X0,Z1,X0,Z0],[DIV,Z0,DIV,Z1]]}

/* ── VEREDAS por donde caminan los estudiantes (azul en el plano): losetas claras con juntas y sardinel ── */
{const vt=tex(128,128,(c,w,h)=>{c.fillStyle='#d6d9db';c.fillRect(0,0,w,h);noise(c,w,h,500,.05,170,225);c.strokeStyle='#aeb3b7';c.lineWidth=3;c.strokeRect(1.5,1.5,w-3,h-3)});
 vt.wrapS=vt.wrapT=THREE.RepeatWrapping;
 const vereda=(x0,x1,z0,z1)=>{const t=vt.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set((x1-x0)/2.4,(z1-z0)/2.4);t.needsUpdate=true;
  const m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,.07,z1-z0),new THREE.MeshStandardMaterial({map:t,roughness:.9,metalness:.02,envMapIntensity:.2}));
  m.position.set((x0+x1)/2,.035,(z0+z1)/2);m.receiveShadow=true;scene.add(m)};
 vereda(-123,-9,-36,PL.z0-.5);                 /* E-O: frente del comedor, entre el parque y el estadio, hasta la calzada */
 vereda(-72,-67.6,-62,-36);                    /* N-S: costado este del comedor */
 vereda(-123,-119.5,-62,PL.z1+1);            /* N-S: junto a la pista oeste */
 lawn(-119.5,PL.x0-.12,PL.z0,PL.z1,.012);       /* área verde entre la vereda oeste y el estadio */
 for(const [tx,tz] of[[-113,-22],[-113,-10],[-113,2],[-109,-16],[-109,-4]])tree(tx,tz,.85);
}
/* ── COMEDOR AL AIRE LIBRE: mesas y sillas amarillas frente a la fachada (amarillo del plano). Las sillas se pueden usar con E. ── */
{const wood=S(0xe9ebed,.6),leg=S(0x6b7078,.5,{metalness:.6}),yel=S(0xe8b400,.55),TZ=-33.6;
 const bx=(m,x0,x1,y0,y1,z0,z1)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),m);q.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);q.castShadow=q.receiveShadow=true;scene.add(q)};
 const chair=(x,z,face)=>{                        /* face=+1 mira al sur (+z), -1 al norte; el respaldo queda al lado contrario */
  bx(yel,x-.23,x+.23,.43,.48,z-.23,z+.23);bx(yel,x-.23,x+.23,.48,.95,z-face*.23-.025,z-face*.23+.025);
  for(const dx of[-.19,.19])for(const dz of[-.19,.19])bx(leg,x+dx-.015,x+dx+.015,0,.43,z+dz-.015,z+dz+.015);
  ASIENTOS.push({x,z,y:.45,yaw:face>0?Math.PI:0,kind:'silla del comedor'})};
 for(let i=0;i<8;i++){const tx=-115+i*5.5;
  bx(wood,tx-.95,tx+.95,.72,.78,TZ-.45,TZ+.45);bx(leg,tx-.8,tx-.74,0,.72,TZ-.05,TZ+.05);bx(leg,tx+.74,tx+.8,0,.72,TZ-.05,TZ+.05);bx(leg,tx-.8,tx+.8,.3,.34,TZ-.02,TZ+.02);
  for(const dx of[-.45,.45]){chair(tx+dx,TZ-.7,1);chair(tx+dx,TZ+.7,-1)}}
 lampPost(-118.5,-33.6,0);lampPost(-73.5,-33.6,0);bench(-61,-35.2);bench(-46,-35.2);}
/* ── ANEXO: Estudios Generales (bloque azul bajo) ─────────── */
const __zAnexo=scene.children.length;
box(0xe9ebed,-82,-37,0,4.4,-5.4,5.4);
boxM(portalBlue,-82.4,-36.6,4.4,5.5,-5.8,5.8);
{const ef=new THREE.Mesh(new THREE.PlaneGeometry(44,1),new THREE.MeshBasicMaterial({map:tex(1024,64,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#ffffff';c.font='700 46px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('ESTUDIOS GENERALES',w/2,h/2+2)}),transparent:true}));ef.position.set(-59.5,4.95,5.85);scene.add(ef)}
for(const gx of[-74,-64,-54,-44]){boxM(new THREE.MeshStandardMaterial({color:0x10151d,roughness:.15,metalness:.7,envMapIntensity:1.15}),gx,gx+5,0,2.6,5.42,5.55)}
for(const gx of[-74,-64,-54,-44]){boxM(new THREE.MeshStandardMaterial({color:0x10151d,roughness:.15,metalness:.7,envMapIntensity:1.1}),gx,gx+5,0,2.6,-5.55,-5.42)}
{const efT=tex(1024,64,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#ffffff';c.font='700 46px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('ESTUDIOS GENERALES',w/2,h/2+2)});const efN=new THREE.Mesh(new THREE.PlaneGeometry(44,1),new THREE.MeshBasicMaterial({map:efT,transparent:true}));efN.position.set(-59.5,4.95,-5.85);efN.rotation.y=Math.PI;scene.add(efN)}
boxM(S(0x1646a0,.4),-82.4,-36.6,0,.5,-5.8,-5.4);box(0xb9bfc5,-60,-56,5.5,6.15,-2,2);

{const ga=moveZone(__zAnexo,-46.2,22);ga.scale.x=.931}                                  /* plano: en fila con el pabellón, a su oeste (con 2 m de paso hasta su escalera exterior) */
/* ── ESCUELA DE ARTES GRÁFICAS (sur) ──────────────────────── */
const __zGraf=scene.children.length;
const graficasTex=tex(2048,768,(c,w,h)=>{c.fillStyle='#dfe3e6';c.fillRect(0,0,w,h);noise(c,w,h,700,.10,140,225);
  /* 4 plantas con cintas de ventanas y parapetos azules */
  for(let f=0;f<4;f++){const y=560-f*150;
    c.fillStyle='#05070c';c.fillRect(60,y-52,w-120,86);
    for(let x=70;x<w-70;x+=64){c.fillStyle='rgba(255,255,255,.07)';c.fillRect(x,y-46,2,74)}
    c.fillStyle='rgba(255,255,255,.10)';c.fillRect(60,y-46,w-120,8);
    c.fillStyle='#0e2c55';c.fillRect(60,y+42,w-120,12)}
  /* mural azul de la planta baja con letras monumentales */
  c.fillStyle='#123a75';c.fillRect(0,h-150,w,150);
  const g2=c.createLinearGradient(0,h-150,0,h);g2.addColorStop(0,'rgba(80,200,255,.28)');g2.addColorStop(.5,'rgba(64,130,255,.12)');g2.addColorStop(1,'rgba(10,20,50,.4)');c.fillStyle=g2;c.fillRect(0,h-150,w,150);
  c.strokeStyle='rgba(90,220,255,.35)';c.lineWidth=5;for(let i=0;i<26;i++){c.beginPath();c.moveTo(Math.random()*w,h-20-Math.random()*110);c.lineTo(Math.random()*w,h-20-Math.random()*110);c.stroke()}
  c.fillStyle='#ffffff';c.font='900 128px "Arial Black",Arial';c.textAlign='center';c.textBaseline='middle';
  c.fillText('G R Á F I C A S',w/2,h-72);
  c.fillStyle='#8ad7ff';c.font='600 40px "Barlow Condensed",Arial Narrow,Arial';c.fillText('E S C U E L A   D E   A R T E S',w/2,h-140+20)});
const graficasEndTex=tex(512,768,(c,w,h)=>{c.fillStyle='#123a75';c.fillRect(0,0,w,h);const g3=c.createLinearGradient(0,0,0,h);g3.addColorStop(0,'rgba(255,255,255,.12)');g3.addColorStop(1,'rgba(0,0,0,.4)');c.fillStyle=g3;c.fillRect(0,0,w,h);logo(c,w/2,h*.45,120,'#3fa7d6')});
const graficasEndMat=new THREE.MeshStandardMaterial({map:graficasEndTex,roughness:.7,metalness:.15,envMapIntensity:.4});
const grafFace=new THREE.MeshStandardMaterial({map:graficasTex,roughness:.78,metalness:.1,envMapIntensity:.4});
const grafMats=[graficasEndMat,graficasEndMat,S(0xb9bfc5,.7),S(0xb9bfc5,.7),grafFace,grafFace];
boxM(grafMats,-88,26,0,14.6,26,50);
box(0x123a75,-88.6,26.6,14.6,15.25,25.4,50.6);
box(0xc9ced4,-60,-52,15.3,16.1,32,38);box(0xc9ced4,-20,-13.5,15.3,16,40,45);
for(let x=-80;x<24;x+=6)box(0x9aa1a8,x-.05,x+.05,15.3,16.15,49.6,50);
box(0xe8b400,-88.4,26.4,.1,.6,25.2,25.6);

moveZone(__zGraf,-34,8);                                     /* plano: al sur de la fila pabellón/anexo */
/* ── PALMERAS DEL BORDE SUR + TORRES A/B/C (diagrid) ─────── */
palm(-13,73,1.0);palm(2,73.5,1.1);palm(17,73,.95);palm(-6,81,1.15);palm(10,81,1.0);palm(24,80.5,.9);
/* Réplica de la torre SENATI de las fotos: volumen de concreto gris oscuro, una columna vertical ancha (con el
   logo hexagonal y la palabra SENATI) y otra delgada que sobresalen por encima de la azotea, fachada de vidrio
   con arriostres en X entre losas claras que salen del plano, y una corona abierta de vigas en la azotea.
   Las caras laterales son de concreto liso con ranuras verticales. */
const towerConcTex=tex(256,256,(c,w,h)=>{c.fillStyle='#6d6c6a';c.fillRect(0,0,w,h);noise(c,w,h,160,.045,80,125);
  c.fillStyle='rgba(0,0,0,.22)';c.fillRect(0,0,3,h);c.fillStyle='rgba(255,255,255,.07)';c.fillRect(3,0,2,h)});   /* ranura vertical cada 256 px */
towerConcTex.wrapS=towerConcTex.wrapT=THREE.RepeatWrapping;
/* un "tramo" = 3 vanos de 5 m × 1 piso (3.9 m): vidrio, cruz de acero y losa clara en la base */
const towerGlassTex=tex(768,200,(c,w,h)=>{
  const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#2b3a4b');gr.addColorStop(1,'#475a70');c.fillStyle=gr;c.fillRect(0,0,w,h);
  for(let i=0;i<7;i++){c.fillStyle='rgba(150,195,235,'+(.05+Math.random()*.07)+')';c.fillRect(Math.random()*w,0,16+Math.random()*60,h)}
  const bw=w/3,band=22,hb=h-band;
  for(let b=0;b<3;b++){const x0=b*bw;
   for(const [ax,ay,bx,by] of [[x0,0,x0+bw,hb],[x0+bw,0,x0,hb]]){
    c.strokeStyle='#161d29';c.lineWidth=25;c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();
    c.strokeStyle='#37465f';c.lineWidth=19;c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();
    c.strokeStyle='#9bb0cf';c.lineWidth=3;c.beginPath();c.moveTo(ax-4,ay);c.lineTo(bx-4,by);c.stroke()}
   c.fillStyle='#2b384f';c.fillRect(x0-4,0,8,hb)}
  c.fillStyle='#6f757e';c.fillRect(0,hb,w,band);c.fillStyle='#c3c7cd';c.fillRect(0,hb+3,w,band-8)});
towerGlassTex.wrapS=towerGlassTex.wrapT=THREE.RepeatWrapping;
const towerGlowTex=tex(768,200,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);const bw=w/3;
  for(let b=0;b<3;b++){const x0=b*bw;for(const [x,y,ww,hh] of [[x0+10,64,46,62],[x0+bw-56,64,46,62],[x0+bw/2-22,10,44,38]])
   if(Math.random()<.45){c.fillStyle=Math.random()<.85?'#ffd694':'#a8d8ff';c.fillRect(x,y,ww,hh)}}});
towerGlowTex.wrapS=towerGlowTex.wrapT=THREE.RepeatWrapping;
const towerLogoTex=tex(256,320,(c,w,h)=>{c.clearRect(0,0,w,h);logo(c,128,112,86,'#3b78ff');
  c.fillStyle='#4f86ff';c.font='bold 54px Arial,sans-serif';c.textAlign='center';c.fillText('SENATI',128,282)});
const diagridMats=[];                                               /* materiales de vidrio: de noche se encienden (ver diagridEvening) */
function diagridTower(cx,cz,h){
  const BASE=2.4,N=Math.max(4,Math.round((h-BASE)/3.9)),bandH=(h-BASE)/N;
  const conc=towerConcTex.clone();conc.wrapS=conc.wrapT=THREE.RepeatWrapping;conc.repeat.set(2.5,h/22);conc.needsUpdate=true;
  const concM=new THREE.MeshStandardMaterial({map:conc,roughness:.92,metalness:.04,envMapIntensity:.2});
  const gt=towerGlassTex.clone(),gl=towerGlowTex.clone();for(const t of[gt,gl]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,N);t.needsUpdate=true}
  const glassM=new THREE.MeshStandardMaterial({map:gt,emissive:0xffffff,emissiveMap:gl,emissiveIntensity:0,roughness:.3,metalness:.5,envMapIntensity:.8});diagridMats.push(glassM);
  const mesh=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;scene.add(m);return m};
  /* cuerpo de concreto + columnas altas a lo largo de todo el fondo (ancha a la izquierda, delgada a la derecha) */
  mesh(new THREE.BoxGeometry(23,h,23),concM,cx,h/2,cz);
  mesh(new THREE.BoxGeometry(6,h+4,24.8),concM,cx-8.5,(h+4)/2,cz);
  mesh(new THREE.BoxGeometry(2,h+2.5,24.8),concM,cx+10.5,(h+2.5)/2,cz);
  /* fachada de vidrio con cruces: una a cada lado (norte y sur), entre las dos columnas */
  const GW=15,GX=cx+2;
  for(const sg of[-1,1]){const gp=new THREE.Mesh(new THREE.PlaneGeometry(GW,h-BASE),glassM);gp.position.set(GX,BASE+(h-BASE)/2,cz+sg*11.52);if(sg<0)gp.rotation.y=Math.PI;scene.add(gp)}
  /* losas claras que sobresalen del vidrio, una por piso (InstancedMesh: una sola llamada de dibujo) */
  const sl=new THREE.InstancedMesh(new THREE.BoxGeometry(GW,.42,.9),new THREE.MeshStandardMaterial({color:0xb0b4ba,roughness:.6,metalness:.05}),(N+1)*2),m4=new THREE.Matrix4();let k=0;
  for(let i=0;i<=N;i++)for(const sg of[-1,1]){m4.makeTranslation(GX,i<N?BASE+i*bandH+.21:h-.21,cz+sg*11.95);sl.setMatrixAt(k++,m4)}
  sl.castShadow=sl.receiveShadow=true;sl.frustumCulled=false;scene.add(sl);
  /* corona abierta de la azotea: losa, vigas claras, pilares y cuarto técnico */
    box(0x7d8189,cx-5.5,cx+9.5,h,h+.35,cz-11.5,cz+11.5);
  for(const sg of[-1,1])box(0xb4b8be,cx-5.5,cx+9.5,h+2.7,h+3.3,cz+sg*11.7-.4,cz+sg*11.7+.4);
  for(const px of[-3.5,.5,4.5,8.2])for(const sg of[-1,1])box(0xb4b8be,cx+px-.25,cx+px+.25,h+.35,h+2.7,cz+sg*11.7-.25,cz+sg*11.7+.25);
  box(0x2b2e34,cx-3,cx+5,h+.35,h+3.1,cz-3.5,cz+3.5);
  cylM(S(0x30363f,.5),.14,.14,7,cx+3,h+4.2,cz-1,6);cylM(S(0x30363f,.5),.14,.14,9.5,cx+7,h+5,cz+2,6);
  /* logo hexagonal + SENATI en la columna ancha, en ambas caras */
  for(const sg of[-1,1]){const lg=new THREE.Mesh(new THREE.PlaneGeometry(4.6,5.75),new THREE.MeshBasicMaterial({map:towerLogoTex,transparent:true}));
   lg.position.set(cx-8.5,h-2.6,cz+sg*12.42);if(sg<0)lg.rotation.y=Math.PI;scene.add(lg)}
  box(0x2c2f35,cx-13,cx+13,0,BASE,cz-13,cz+13);                          /* basamento oscuro */
  const lobby=new THREE.Mesh(new THREE.PlaneGeometry(11,2.1),new THREE.MeshStandardMaterial({color:0x0b0e14,emissive:0xffd9a0,emissiveIntensity:.5,roughness:.3,metalness:.6,envMapIntensity:.9}));
  lobby.position.set(GX,1.3,cz-13.06);scene.add(lobby)}
diagridTower(36,87,44);diagridTower(76,87,52);diagridTower(114,87,40);
obst(24.5,47.5,75,99);   /* Torre A */
obst(64.5,87.5,75,99);   /* Torre B */
obst(102.5,125.5,75,99); /* Torre C */

/* ── ÁRBOLES Y PALMERAS ────────────────────────────────────── */
function tree(x,z,s=1){const t=new THREE.Group(),tr=new THREE.Mesh(new THREE.CylinderGeometry(.15*s,.24*s,2.5*s,8),S(0x5d4028,.95));tr.position.y=1.25*s;tr.castShadow=true;t.add(tr);
 for(let k=0;k<5;k++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry((1.35-k*.16)*s,1),S(fol[Math.abs(k+(x|0))%4],1,{envMapIntensity:.18}));m.position.set((Math.random()-.5)*.95*s,(2.9+k*.55)*s,(Math.random()-.5)*.95*s);m.castShadow=true;t.add(m)}t.position.set(x,0,z);scene.add(t);solid(x,z,.28*s+.1)}
for(const [tx,tz,ts] of [[-118,-68,.9],[-31,-70,.8],[-8,-64,1],[-120,30,1.1],[-100,44,.85],[-3,34,.7],[66,44,.9],[96,58,.75]])tree(tx,tz,ts);
function palm(x,z,s=1){const t=new THREE.Group();
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.15*s,.23*s,4.7*s,8),S(0x8a6f4d,.95));trunk.position.y=2.35*s;trunk.castShadow=true;t.add(trunk);
  const crown=new THREE.Group();crown.position.y=4.7*s;t.add(crown);
  for(let k=0;k<10;k++){const pivot=new THREE.Group();pivot.rotation.y=k*Math.PI/5+Math.random()*.34;pivot.rotation.x=(Math.random()-.5)*.18;crown.add(pivot);
    const frondGeo=new THREE.PlaneGeometry(3.15*s,.78*s);frondGeo.translate(1.55*s,0,0);
    const frond=new THREE.Mesh(frondGeo,new THREE.MeshStandardMaterial({color:palmLeaf[k%3],roughness:.8,metalness:0,side:THREE.DoubleSide,envMapIntensity:.14}));
    frond.rotation.z=-(.18+Math.random()*.5);frond.rotation.x=(Math.random()-.5)*.28;frond.castShadow=true;pivot.add(frond)}
  for(let k=0;k<3;k++){const nut=new THREE.Mesh(new THREE.SphereGeometry(.1*s,6,5),S(0x5a4632,.9));nut.position.set((Math.random()-.5)*.3*s,-.12*s,(Math.random()-.5)*.3*s);crown.add(nut)}
  t.position.set(x,0,z);t.rotation.y=Math.random()*6.28;scene.add(t);solid(x,z,.3*s)}
palm(-12.5,-157.5,1.15);palm(12.5,-157.5,1.15);         /* portal de ingreso */
palm(28.5,28.5,.9);palm(-96,29,.85);                     /* marco de artes gráficas */

/* ── VEHÍCULOS + CONOS ───────────────────────────────────── */
/* Carro con ruedas que giran/doblan, cabina con vidrios transparentes e interior (se ve al conductor), luces de freno.
   Frente = +x · conductor a la izquierda (lado -z, como en Perú: volante a la izquierda). Se registra en AUTOS. */
function car(x,z,color,ry=0,scl=1){
  const t=new THREE.Group(),body=new THREE.Group();t.add(body);
  const paint=S(color,.32,{metalness:.62,envMapIntensity:.95}),paint2=S(color,.24,{metalness:.55,envMapIntensity:.9});
  const add=(g,m,px,py,pz,par=body)=>{const q=new THREE.Mesh(g,m);q.position.set(px,py,pz);q.castShadow=true;par.add(q);return q};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  add(B(1.33,.68,1.78),paint,1.41,.62,0);                                      /* capó */
  add(B(.93,.68,1.78),paint,-1.61,.62,0);                                      /* maletero */
  for(const pz of[-.81,.81])add(B(1.9,.94,.16),paint,-.2,.75,pz);              /* puertas / costados (el interior queda abierto) */
  add(B(.1,.7,1.62),carDark,.75,.62,0);add(B(.1,.6,1.62),carDark,-1.15,.6,0);  /* mamparos delantero y trasero */
  add(B(.16,.3,1.74),carDark,2.07,.5,0);add(B(.16,.3,1.74),carDark,-2.07,.5,0); /* parachoques */
  add(B(.05,.2,.8),carDark,2.1,.74,0);                                         /* parrilla */
  /* cabina: techo + pilares + vidrios transparentes (el interior se ve) */
  add(B(2.1,.07,1.62),paint2,-.18,1.69,0);
  for(const [px,pz] of[[.78,.76],[.78,-.76],[-1.14,.76],[-1.14,-.76]])add(B(.09,.5,.09),paint2,px,1.43,pz);
  for(const pz of[.8,-.8])add(B(.08,.48,.07),paint2,-.2,1.43,pz);
  add(B(1.9,.42,1.56),carGlass,-.18,1.41,0);
  /* interior */
  add(B(2.3,.05,1.55),carDark,-.1,.32,0);
  add(B(.5,.3,1.56),carDark,.62,1.0,0);                                         /* tablero */
  for(const pz of[-.42,.42]){add(B(.5,.14,.46),carSeatM,-.3,.5,pz);add(B(.12,.62,.46),carSeatM,-.6,.86,pz)}
  add(B(.5,.14,1.4),carSeatM,-1.02,.5,0);add(B(.12,.55,1.4),carSeatM,-1.28,.84,0);
  /* volante (gira al doblar) */
  const steerG=new THREE.Group();steerG.position.set(.34,1.02,-.42);steerG.rotation.z=.42;body.add(steerG);
  const spin=new THREE.Group();steerG.add(spin);
  const ring=add(new THREE.TorusGeometry(.17,.022,8,18),carDark,0,0,0,spin);ring.rotation.y=Math.PI/2;
  add(B(.02,.3,.03),carDark,0,0,0,spin);add(B(.02,.03,.3),carDark,0,0,0,spin);
  /* faros, luces traseras (freno), placas, espejos */
  for(const pz of[-.62,.62])add(B(.06,.16,.36),carHead,2.1,.78,pz);
  const tailM=new THREE.MeshBasicMaterial({color:0x6a0d0d});
  for(const pz of[-.62,.62])add(B(.06,.15,.4),tailM,-2.1,.82,pz);
  add(B(.03,.14,.42),S(0xf2f2f2,.6),2.16,.56,0);add(B(.03,.14,.42),S(0xf2f2f2,.6),-2.16,.56,0);
  for(const pz of[-.97,.97])add(B(.12,.1,.18),paint2,.62,1.24,pz);
  /* ruedas: pivote (dirección) > giro > llanta + aro con rayos para que se note que giran */
  const wheels=[];
  for(const [wx,wz] of[[1.32,-.86],[1.32,.86],[-1.32,-.86],[-1.32,.86]]){
    const pv=new THREE.Group();pv.position.set(wx,.34,wz);t.add(pv);const sp=new THREE.Group();pv.add(sp);
    const w=add(carWheelG,carTire,0,0,0,sp);w.rotation.x=Math.PI/2;const r=add(carRimG,carRim,0,0,wz>0?.01:-.01,sp);r.rotation.x=Math.PI/2;
    add(B(.5,.07,.3),carDark,0,0,wz>0?.14:-.14,sp);add(B(.07,.5,.3),carDark,0,0,wz>0?.14:-.14,sp);
    wheels.push({pv,sp,front:wx>0})}
  const anchor=new THREE.Group();anchor.position.set(-.3,.25,-.42);body.add(anchor);       /* asiento del conductor */
  t.scale.setScalar(scl);t.position.set(x,0,z);t.rotation.y=ry;scene.add(t);
  t.userData.veh={kind:'car',color,scl,body,wheels,steerG:spin,tailM,anchor,eye:[-.3,1.32,-.42],hr:.95,hx:[-1.2,0,1.2],circ:.95,dooY:0};
  AUTOS.push(t);return t}

/* ── MOTOS LINEALES (instanciadas: una malla por pieza para todas las motos) ───────── */
const MOTO_COLORS=[0xc4231a,0x15171b,0x1646a0,0xe8e8e8,0xe8641e,0x1d6b3a,0x9aa1a8,0xd4af37];
function buildMotos(list){ /* list: [x,z,color,ry] — largo de la moto sobre su eje local x */
  const N=list.length;if(!N)return;
  const tire=S(0x101216,.85),dark=S(0x24282e,.55,{metalness:.5}),chrome=S(0xb9bfc5,.25,{metalness:.9,envMapIntensity:1.2}),seat=S(0x0c0d10,.8),
        paint=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.3,metalness:.55,envMapIntensity:.9}),
        lamp=new THREE.MeshBasicMaterial({color:0xf3e2ac});
  const R=(g,x,y,z,rx=0,ry=0,rz=0)=>({g,x,y,z,rx,ry,rz});
  const wheel=new THREE.CylinderGeometry(.31,.31,.13,14);
  const parts=[
    [R(wheel,.62,.31,0,Math.PI/2),tire],[R(wheel,-.62,.31,0,Math.PI/2),tire],
    [R(new THREE.CylinderGeometry(.14,.14,.15,10),.62,.31,0,Math.PI/2),chrome],[R(new THREE.CylinderGeometry(.14,.14,.15,10),-.62,.31,0,Math.PI/2),chrome],
    [R(new THREE.BoxGeometry(.52,.36,.24),0,.46,0),dark],                    /* motor */
    [R(new THREE.BoxGeometry(.56,.22,.3),.14,.8,0),paint,true],              /* tanque */
    [R(new THREE.BoxGeometry(.62,.1,.28),-.34,.78,0),seat],                  /* asiento */
    [R(new THREE.BoxGeometry(.46,.07,.22),-.76,.74,0,0,0,.18),paint,true],  /* guardabarro/cola */
    [R(new THREE.BoxGeometry(.05,.74,.07),.6,.62,.0,0,0,.32),chrome],        /* horquilla */
    [R(new THREE.BoxGeometry(.06,.06,.62),.5,1.02,0),dark],                  /* manubrio */
    [R(new THREE.SphereGeometry(.1,8,6),.6,.93,0),lamp],                     /* faro */
    [R(new THREE.BoxGeometry(.58,.07,.09),-.34,.3,-.17),chrome],             /* escape */
    [R(new THREE.BoxGeometry(.4,.05,.06),.42,.5,0,0,0,.42),paint,true]       /* guardafango delantero */
  ];
  const dummy=new THREE.Object3D(),mp=new THREE.Matrix4(),col=new THREE.Color();const ims=[];
  parts.forEach(([pr,mat,tinted])=>{
    const im=new THREE.InstancedMesh(pr.g,mat,N);im.castShadow=true;im.receiveShadow=true;
    list.forEach(([x,z,c,ry],i)=>{
      dummy.position.set(x,0,z);dummy.rotation.set(0,ry,0);dummy.scale.set(1,1,1);dummy.updateMatrix();
      const lp=new THREE.Object3D();lp.position.set(pr.x,pr.y,pr.z);lp.rotation.set(pr.rx,pr.ry,pr.rz);lp.updateMatrix();
      mp.multiplyMatrices(dummy.matrix,lp.matrix);im.setMatrixAt(i,mp);
      if(tinted){col.setHex(c);im.setColorAt(i,col)}
    });
    im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;
    ims.push(im);scene.add(im)});
  window.__motoSet={ims,list:list.map(a=>a.slice())};          /* interaccion.js saca de aquí la moto que subes */
}
function cone(x,z){const b=new THREE.Mesh(new THREE.BoxGeometry(.5,.07,.5),S(0xe8641e,.6));b.position.set(x,.035,z);b.castShadow=true;scene.add(b);
  const c1=new THREE.Mesh(new THREE.ConeGeometry(.24,.72,10),S(0xe8641e,.5));c1.position.set(x,.43,z);c1.castShadow=true;scene.add(c1);
  const band=new THREE.Mesh(new THREE.ConeGeometry(.165,.26,10),S(0xf5f5f5,.4));band.position.set(x,.46,z);scene.add(band)}
cone(-15,-110.5);cone(-19,-111.6);cone(-11,-111.6);cone(24,13.5);cone(-24.5,13.4);
/* (carros dentro de las aulas eliminados: eran bugs) */car(118,-19,0xffffff,Math.PI/2,.8);
function van(x,z){box(0xf4f4f4,x,x+5,.5,2.1,z,z+2);box(0x222831,x+3.6,x+4.9,1.1,1.9,z-.01,z+2.01);box(0x15171b,x+.4,x+1,0,.5,z-.05,z+2.05);box(0x15171b,x+3.9,x+4.5,0,.5,z-.05,z+2.05)}van(14,11.6);
/* contenedores azules junto a la mecánica (como en las fotos) */
const contTex=tex(512,256,(c,w,h)=>{c.fillStyle='#1d4e89';c.fillRect(0,0,w,h);
  for(let x=0;x<w;x+=18){c.fillStyle='rgba(255,255,255,.09)';c.fillRect(x,0,3,h);c.fillStyle='rgba(0,0,0,.32)';c.fillRect(x+9,0,5,h)}
  noise(c,w,h,260,.22,20,70)});
const contMat=new THREE.MeshStandardMaterial({map:contTex,roughness:.6,metalness:.35,envMapIntensity:.5});
boxM(contMat,58,70,0,2.6,-22,-16.2);boxM(contMat,58.4,70.4,2.6,5.2,-21.6,-16.6);boxM(contMat,59,69,0,2.6,-14.8,-9);

/* ── MACETAS + BANCAS ────────────────────────────────────── */
function plant(x,z,s=1){const p=new THREE.Mesh(new THREE.CylinderGeometry(.3*s,.22*s,.5*s,10),S(0x7c4f30,.9));p.position.set(x,.25*s,z);p.castShadow=true;scene.add(p);const q=new THREE.Mesh(new THREE.IcosahedronGeometry(.5*s,1),S(0x356f3c,1));q.position.set(x,.95*s,z);q.castShadow=true;scene.add(q)}
[[16,7.8],[12,7.8],[29,-7.8],[33,-7.8],[69.6,-4],[69.6,-6],[44,-7.8],[71.5,-1.6]].forEach(a=>plant(a[0],a[1],1.1));
/* ── ESTACIONAMIENTO NORTE + ÁREAS VERDES (explanada entre el ingreso, la Panamericana, Mecánica y el Centro de Formación) ── */
{const X0=16,SW=2.6,NS=40,X1=X0+NS*SW;
 asphalt(9,125,-150.5,-103,24);
 lawn(9.6,128.5,-159.6,-150.7);lawn(125.2,128.5,-150.7,-100);lawn(9.6,125.2,-102.8,-100);   /* franjas verdes: norte, este y sur */
 box(0xd2d5d7,9,125.3,0,.13,-150.7,-150.5);box(0xd2d5d7,125,125.3,0,.13,-150.7,-102.8);box(0xd2d5d7,9,125.3,0,.13,-103,-102.8);
 const rows=[[-150,-145],[-138.8,-133.8],[-132.2,-127.2],[-121,-116],[-114.4,-109.4]];
 /* líneas de bahías (una sola malla) */
 {const P=[],I=[];const qd=(x0,x1,z0,z1)=>{const n=P.length/3;P.push(x0,.014,z0,x1,.014,z0,x1,.014,z1,x0,.014,z1);I.push(n,n+2,n+1,n,n+3,n+2)};
  rows.forEach(([z0,z1])=>{for(let k=0;k<=NS;k++)qd(X0+k*SW-.05,X0+k*SW+.05,z0,z1)});qd(X0,X1,-150.05,-149.95);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xe8e9e6,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide}));scene.add(m)}
 const gmI=new THREE.MeshStandardMaterial({color:0x4a8a40,roughness:1,metalness:0,envMapIntensity:.18});
 /* isletas verdes con árboles y postes de luz */
 for(const [z0,z1] of [[-133.8,-132.2],[-116,-114.4]]){const zc=(z0+z1)/2;
  box(0xd2d5d7,X0-.3,X1+.3,0,.17,z0-.1,z1+.1);boxM(gmI,X0-.2,X1+.2,0,.19,z0,z1);
  for(let k=2;k<NS;k+=5)tree(X0+k*SW,zc,.62);
  for(let k=4;k<NS;k+=10){cylM(S(0x4a4f56,.5,{metalness:.5}),.07,.09,5.6,X0+k*SW,2.8,zc,8);const h=new THREE.Mesh(new THREE.BoxGeometry(.9,.12,.3),lampHeadMat);h.position.set(X0+k*SW,5.66,zc);scene.add(h)}}
 /* árboles, palmeras y arbustos en las franjas verdes */
 for(let x=15;x<125;x+=11)tree(x,-155.2,(x/11|0)%2?.8:.95);
 palm(12.5,-153.2,1.0);palm(121,-153.2,1.0);palm(127,-128,.95);palm(127,-112,.95);
 for(let z=-146;z<-106;z+=9)tree(127,z,.8);
 for(let x=14;x<124;x+=7)bushY(x,-101.4,.9);
 /* letrero ESTACIONAMIENTO junto al ingreso */
 {const st=tex(512,128,(c,w,h)=>{c.fillStyle='#1646a0';c.fillRect(0,0,w,h);c.strokeStyle='#fff';c.lineWidth=6;c.strokeRect(5,5,w-10,h-10);c.fillStyle='#fff';c.fillRect(22,22,64,84);c.fillStyle='#1646a0';c.font='bold 70px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('P',54,66);c.fillStyle='#fff';c.font='800 52px "Barlow Condensed",Arial Narrow,Arial';c.fillText('ESTACIONAMIENTO',300,68)});
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(6.4,1.6),new THREE.MeshBasicMaterial({map:st}));sg.position.set(17,2.6,-153.4);scene.add(sg);
  for(const dx of[-2.8,2.8])cylM(S(0x4a4f56,.5,{metalness:.5}),.08,.08,2.6,17+dx,1.3,-153.45,8)}
 /* solo motos lineales estacionadas (1 o 2 por bahía) */
 {const mt=[];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  rows.forEach(([z0,z1],ri)=>{const zc=(z0+z1)/2;for(let k=0;k<NS;k++){if(rnd()<.32)continue;
    const cx=X0+(k+.5)*SW,two=rnd()<.55,face=rnd()<.5?Math.PI/2:-Math.PI/2;
    const c1=MOTO_COLORS[rnd()*MOTO_COLORS.length|0];
    if(two){mt.push([cx-.62,zc+(rnd()-.5)*.7,c1,face]);mt.push([cx+.62,zc+(rnd()-.5)*.7,MOTO_COLORS[rnd()*MOTO_COLORS.length|0],face])}
    else mt.push([cx,zc+(rnd()-.5)*.8,c1,face])}});
  buildMotos(mt)}}
function bench(x,z){ASIENTOS.push({x:x-.45,y:.5,z,yaw:0,kind:'banca'},{x:x+.45,y:.5,z,yaw:0,kind:'banca'});solid(x-.9,z,.3);solid(x,z,.3);solid(x+.9,z,.3);box(0xb98a58,x-.9,x+.9,.45,.5,z-.25,z+.25);box(0xb98a58,x-.9,x+.9,.7,.75,z+.2,z+.25);box(0x333840,x-.85,x-.8,0,.45,z-.2,z+.2);box(0x333840,x+.8,x+.85,0,.45,z-.2,z+.2)}
[8,28,48,64].forEach(x=>bench(x,10));
/* postes netos de madera con doble brazo (antiguos) retirados: ahora hay postes rojos */

/* ── BANDERAS: SENATI y PERÚ ondeando en el portal ───────── */
const flagTex=tex(256,160,(c,w,h)=>{c.fillStyle='#0e2a5e';c.fillRect(0,0,w,h);
  c.strokeStyle='#f5b700';c.lineWidth=10;c.strokeRect(6,6,w-12,h-12);
  logo(c,46,h/2,30,'#ffffff');
  c.fillStyle='#ffffff';c.font='900 42px Arial Black,Arial';c.textBaseline='middle';c.textAlign='left';c.fillText('SENATI',86,h/2+2)});
const peruTex=tex(256,160,(c,w,h)=>{c.fillStyle='#d91023';c.fillRect(0,0,w,h);c.fillStyle='#f5f5f5';c.fillRect(w/3,0,w/3,h)});
function makeFlag(texImg,x,y,z,ry=0){const fg=new THREE.PlaneGeometry(2.3,1.45,22,10);fg.translate(1.15,0,0);
  const f=new THREE.Mesh(fg,new THREE.MeshStandardMaterial({map:texImg,side:THREE.DoubleSide,roughness:.85,metalness:.02,envMapIntensity:.3}));
  f.position.set(x,y,z);f.rotation.y=ry;f.castShadow=true;scene.add(f);return f}
const flag=makeFlag(flagTex,-6.2,8.35,-159.5,0);
const flagPeru=makeFlag(peruTex,6.4,8.35,-159.5,Math.PI);
const flagBase=flag.geometry.attributes.position.array.slice();
const flagPeruBase=flagPeru.geometry.attributes.position.array.slice();

/* ── ANIMACIÓN AMBIENTE ── */
window.tickEnv=function(t){
  const p=flag.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const bx=flagBase[i*3],k=bx/2.3;
    p.setZ(i,Math.sin(bx*2.4+t*5.3)*.10*(k+.18)+Math.sin(bx*5.2+t*8.6)*.045*k);
    p.setY(i,flagBase[i*3+1]+Math.sin(bx*1.8+t*4.2)*.05*k)}
  p.needsUpdate=true;flag.geometry.computeVertexNormals();
  const p2=flagPeru.geometry.attributes.position;
  for(let i=0;i<p2.count;i++){const bx=flagPeruBase[i*3],k=bx/2.3;
    p2.setZ(i,Math.sin(bx*2.1+t*4.7+1.3)*.09*(k+.18)+Math.sin(bx*4.6+t*7.4+.7)*.04*k);
    p2.setY(i,flagPeruBase[i*3+1]+Math.sin(bx*1.6+t*3.8+.5)*.045*k)}
  p2.needsUpdate=true;flagPeru.geometry.computeVertexNormals();
  for(const b of beacons){const on=Math.sin(t*2.3+b.phase)>0;
    b.m.material.color.setHex(on?0xff3b30:0x4a120e);b.gs.material.opacity=on?.95:.05}
};

/* ── DÍA / ATARDECER / NOCHE ────────────────────────────── */
const SUN_DIR={d:new THREE.Vector3(-95,52,70),s:new THREE.Vector3(150,38,-215),n:new THREE.Vector3(34,46,-30)};
const diagridEvening=()=>(typeof diagridMats!=='undefined')?diagridMats:[];
function setTime(n){
  const DAY=n===0,DUSK=n===1;
  skyM.map=skyTex[n];skyM.needsUpdate=true;
  scene.fog.color.setHex(DAY?0xd4dee9:DUSK?0xe0b58c:0x0b1224);scene.fog.near=DAY?150:DUSK?100:80;scene.fog.far=DAY?760:DUSK?470:320;window.__fogBase={n:scene.fog.near,f:scene.fog.far};
  scene.background.setHex(DAY?0xd4dee9:DUSK?0xe0b58c:0x0b1224);
  hemi.intensity=DAY?.66:DUSK?.56:.4;hemi.color.setHex(DAY?0xdfeaf7:DUSK?0xffd2a4:0x6f86c4);hemi.groundColor.setHex(DAY?0x87816e:DUSK?0x5e4536:0x151b28);
  sun.intensity=DAY?1.14:DUSK?1.02:.24;sun.color.setHex(DAY?0xffedd6:DUSK?0xffa952:0x9db4ff);
  sun.position.copy(DAY?SUN_DIR.d:DUSK?SUN_DIR.s:SUN_DIR.n);
  fill.intensity=DAY?.34:DUSK?.3:.16;fill.color.setHex(DUSK?0xffd0a8:0xbfd4ff);
  renderer.toneMappingExposure=DAY?1.04:DUSK?1.1:.94;
  bloomPass.strength=DAY?.26:DUSK?.4:.48;bloomPass.radius=DAY?.6:DUSK?.68:.68;bloomPass.threshold=DAY?.84:DUSK?.8:.8;
  mats.glass.emissiveIntensity=DAY?0:DUSK?.5:1.15;
  mats.screen.emissiveIntensity=DAY?.55:DUSK?.85:1.2;
  cityMat.emissiveIntensity=DAY?0:DUSK?.5:1.15;
  towerMat.emissiveIntensity=DAY?0:DUSK?.45:1.15;
  mecanicaMat.emissiveIntensity=DAY?0:DUSK?.3:.85;
  if(typeof hallWinMat!=='undefined')hallWinMat.emissiveIntensity=DAY?0:DUSK?.35:1.05;
  if(window.__comedorGlassMat)window.__comedorGlassMat.emissiveIntensity=DAY?.18:DUSK?.6:1.25;
  diagridEvening().forEach(m=>m.emissiveIntensity=DAY?0:DUSK?.5:.95);
  bannerMat.emissiveIntensity=DAY?0:DUSK?.08:.16;
  bannerV.material.emissiveIntensity=DAY?.15:DUSK?.6:1.1;
  lampsL.forEach(l=>l.intensity=DAY?0:DUSK?1.25:1.35);
  lampHeadMat.color.setHex(DAY?0xc9bfa0:DUSK?0xffd98c:0xffe9a8);
  lampGlows.forEach(s=>s.material.opacity=DAY?0:DUSK?.8:.85);
  stars.visible=moon.visible=moonGlow.visible=(n===2);
  sunGlow.material.opacity=n===2?0:DUSK?1:.62;
  sunGlow.material.color.setHex(DUSK?0xffc98a:0xffffff);
  sunGlow.position.copy((DAY?SUN_DIR.d:SUN_DIR.s).clone().normalize().multiplyScalar(330));
  clouds.children.forEach(s=>{s.material.color.setHex(DAY?0xffffff:DUSK?0xffc9a8:0x46557c);s.material.opacity=DAY?.88:DUSK?.8:.38});
  ground.material.color.setHex(DAY?0xffffff:DUSK?0xffd9bd:0x707a92);gm.color.setHex(DAY?0xffffff:DUSK?0xffd0a8:0x27402f);
  mFar.material.opacity=n===2?.8:DUSK?.95:1;mNear.material.opacity=n===2?.82:DUSK?.95:1;
  mFar.material.color.setHex(n===2?0x9aa6cf:0xffffff);mNear.material.color.setHex(n===2?0x6d7796:0xffffff);
  if(typeof btn==='function'){btn('tDay').classList.toggle('on',n===0);btn('tSunset').classList.toggle('on',n===1);btn('tNight').classList.toggle('on',n===2)}
}
