/* ════════════════════════════════════════════════════════════
   02 · MATERIALES — PBR procedural (nada de colores planos)
   Texturas generadas en canvas: yeso, zinc, porcelanato, concreto
   ════════════════════════════════════════════════════════════ */
function tex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=8;t.encoding=THREE.sRGBEncoding;return t}
const noise=(c,w,h,n,alpha,lo,hi)=>{for(let i=0;i<n;i++){const v=lo+Math.random()*(hi-lo)|0;c.fillStyle=`rgba(${v},${v},${v},${alpha})`;c.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2.5,1+Math.random()*2.5)}};

/* Yeso / estuco micro-granulado para muros */
const plasterTex=tex(256,256,(c,w,h)=>{c.fillStyle='#eef0f2';c.fillRect(0,0,w,h);noise(c,w,h,1500,.10,120,205);
  for(let i=0;i<24;i++){c.fillStyle='rgba(255,255,255,.20)';c.fillRect(Math.random()*w,0,1+Math.random()*2,h)}});
plasterTex.wrapS=plasterTex.wrapT=THREE.RepeatWrapping;

/* Zinc / costanera metálica para techos */
const roofTex=tex(256,256,(c,w,h)=>{c.fillStyle='#99a1aa';c.fillRect(0,0,w,h);noise(c,w,h,700,.12,70,140);
  for(let x=0;x<w;x+=32){c.fillStyle='rgba(40,46,54,.55)';c.fillRect(x,0,3,h);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x+3,0,2,h)}
  for(let i=0;i<8;i++){c.fillStyle='rgba(255,255,255,.028)';c.fillRect(0,Math.random()*h,w,8+Math.random()*20)}});
roofTex.wrapS=roofTex.wrapT=THREE.RepeatWrapping;roofTex.repeat.set(14,5);

/* Porcelanato claro (labs y baños) */
const tileTex=tex(128,128,(c,w,h)=>{c.fillStyle='#dfe4e8';c.fillRect(0,0,w,h);noise(c,w,h,320,.10,150,215);
  c.strokeStyle='#aeb6bd';c.lineWidth=3;c.strokeRect(0,0,w,h);c.beginPath();c.moveTo(w/2,0);c.lineTo(w/2,h);c.moveTo(0,h/2);c.lineTo(w,h/2);c.stroke()});
tileTex.wrapS=tileTex.wrapT=THREE.RepeatWrapping;tileTex.repeat.set(2,2);

/* Loseta cálida para aulas */
const aulaTex=tex(128,128,(c,w,h)=>{c.fillStyle='#c8c0b1';c.fillRect(0,0,w,h);noise(c,w,h,380,.12,120,200);
  c.strokeStyle='#a29a8c';c.lineWidth=3;c.strokeRect(0,0,w,h)});
aulaTex.wrapS=aulaTex.wrapT=THREE.RepeatWrapping;aulaTex.repeat.set(3,3);

/* Concreto pulido oscuro (pasillos) */
const pasilloTex=tex(128,128,(c,w,h)=>{c.fillStyle='#33363d';c.fillRect(0,0,w,h);noise(c,w,h,520,.16,40,120);
  for(let i=0;i<6;i++){c.fillStyle='rgba(255,255,255,.04)';c.fillRect(0,Math.random()*h,w,2)}});
pasilloTex.wrapS=pasilloTex.wrapT=THREE.RepeatWrapping;pasilloTex.repeat.set(6,2);

const S=(c,r=.85,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,envMapIntensity:.45,...o});
const std=(o)=>new THREE.MeshStandardMaterial(o);
const mats={
  wall:   std({color:0xe9ebed,map:plasterTex,roughness:.92,metalness:.02,envMapIntensity:.28}),
  blue:   std({color:0x1646a0,roughness:.32,metalness:.62,envMapIntensity:1.0}),      /* azul SENATI, metal pintado */
  floorC: std({color:0xffffff,map:pasilloTex,roughness:.55,metalness:.12,envMapIntensity:.5}),
  floorR: std({color:0xffffff,map:aulaTex,roughness:.78,metalness:.02,envMapIntensity:.3}),
  floorL: std({color:0xffffff,map:tileTex,roughness:.38,metalness:.05,envMapIntensity:.45}),
  tile:   std({color:0xffffff,map:tileTex,roughness:.3,metalness:.06,envMapIntensity:.5}),
  slab:   std({color:0x878e97,roughness:.7,metalness:.28,envMapIntensity:.5}),
  roof:   std({color:0xffffff,map:roofTex,roughness:.42,metalness:.68,envMapIntensity:.95}),
  glass:  std({color:0xa8d4ee,roughness:.06,metalness:.78,transparent:true,opacity:.5,depthWrite:false,emissive:0xffd9a0,emissiveIntensity:0,envMapIntensity:1.65}),
  mirror: std({color:0xdcebf5,roughness:.06,metalness:.98,envMapIntensity:1.6}),
  door:   std({color:0x6d7884,roughness:.5,metalness:.55,envMapIntensity:.8}),
  desk:   std({color:0x2e3238,roughness:.6,metalness:.25,envMapIntensity:.4}),
  top:    std({color:0xc9cdd3,roughness:.32,metalness:.32,envMapIntensity:.7}),
  chair:  std({color:0x1f4fb5,roughness:.42,metalness:.1,envMapIntensity:.5}),
  wood:   std({color:0xb08252,roughness:.62,metalness:.05,envMapIntensity:.4}),
  metal:  std({color:0x4c525a,roughness:.38,metalness:.78,envMapIntensity:.9}),
  black:  std({color:0x14161a,roughness:.5,metalness:.3,envMapIntensity:.4}),
  white:  std({color:0xf6f6f6,roughness:.35,metalness:.02,envMapIntensity:.4}),
  light:  new THREE.MeshBasicMaterial({color:0xfff7e2}),                              /* paneles de luz cálidos → brillan con bloom */
  screen: std({color:0x0c141c,roughness:.3,metalness:.15,emissive:0x2bd7ff,emissiveIntensity:.55,envMapIntensity:.6}), /* monitores de cómputo */
  acon:   std({color:0xf2f4f6,roughness:.45,metalness:.35,envMapIntensity:.7}),
  acout:  std({color:0xc9ced4,roughness:.5,metalness:.5,envMapIntensity:.7}),
  stair:  std({color:0x2c3038,roughness:.5,metalness:.45,envMapIntensity:.6}),
  brown:  std({color:0x9a4a2a,roughness:.6,metalness:.15,envMapIntensity:.35}),
  dgreen: std({color:0x1d3b34,roughness:.6,metalness:.15,envMapIntensity:.35}),
  cream:  std({color:0xf1ece0,roughness:.6,metalness:.1,envMapIntensity:.35}),
  navy:   std({color:0x1b2f7a,roughness:.6,metalness:.15,envMapIntensity:.35}),
  bk:     std({color:0x222426,roughness:.6,metalness:.15,envMapIntensity:.35}),
  curtain:std({color:0xf3efe6,roughness:.95,metalness:0,envMapIntensity:.15}),
  seam:   std({color:0xaab1b8,roughness:.6,metalness:.4,envMapIntensity:.5}),
  red:    std({color:0xc4231a,roughness:.4,metalness:.12,envMapIntensity:.45}),
  pbl:    std({color:0x3aa0d8,roughness:.6,metalness:.1,envMapIntensity:.35}),
  pye:    std({color:0xf2c038,roughness:.6,metalness:.1,envMapIntensity:.35}),
  pgr:    std({color:0x3a9a5a,roughness:.6,metalness:.1,envMapIntensity:.35})
};

/* Grupos por piso y techo */
const g=[new THREE.Group(),new THREE.Group()],roofG=new THREE.Group();g[1].add(roofG);scene.add(g[0],g[1]);g[1].position.y=3;
const lists=[{},{},{}],cols=[[],[]],rooms=[];let OX=0;
const obstacles=[];                                        /* huellas de edificios (anti-atravesar paredes) */
function obst(x0,x1,z0,z1){obstacles.push([Math.min(x0,x1),Math.max(x0,x1),Math.min(z0,z1),Math.max(z0,z1)])}
function R(f,m,x0,x1,y0,y1,z0,z1){(lists[f][m]||(lists[f][m]=[])).push([(x0+x1)/2+OX,(y0+y1)/2,(z0+z1)/2,Math.abs(x1-x0),Math.abs(y1-y0),Math.abs(z1-z0)])}
function col(f,x0,x1,z0,z1){cols[f].push([Math.min(x0,x1)+OX,Math.max(x0,x1)+OX,Math.min(z0,z1),Math.max(z0,z1)])}
function wallX(f,x0,x1,z,gaps,t=.12){let c=x0;const a=z-t/2,b=z+t/2;
 for(const q of gaps){if(q[0]>c){R(f,'wall',c,q[0],0,H,a,b);col(f,c,q[0],a,b)}
  if(q[2]>0){R(f,'wall',q[0],q[1],0,q[2],a,b);col(f,q[0],q[1],a,b)}
  if(q[3]<H)R(f,'wall',q[0],q[1],q[3],H,a,b);
  if(q[4]){const zc=z-Math.sign(z)*.1;R(f,'curtain',q[0]+.02,q[0]+.3,q[2]-.1,q[3]+.05,zc-.01,zc+.01);R(f,'curtain',q[1]-.3,q[1]-.02,q[2]-.1,q[3]+.05,zc-.01,zc+.01);R(f,'glass',q[0],q[1],q[2],q[3],z-.02,z+.02);const m=(q[0]+q[1])/2;R(f,'blue',m-.025,m+.025,q[2],q[3],z-.04,z+.04)}c=q[1]}
 if(x1>c){R(f,'wall',c,x1,0,H,a,b);col(f,c,x1,a,b)}}
function wallZ(f,z0,z1,x,t=.12){R(f,'wall',x-t/2,x+t/2,0,H,z0,z1);col(f,x-t/2,x+t/2,z0,z1)}
function label(f,txt,x,y,z,ry,w,h,bg,fg='#fff'){const t=tex(256,64,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle='rgba(255,255,255,.14)';c.fillRect(0,0,W,10);c.fillStyle=fg;c.font='bold 34px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(txt,W/2,H/2+2)});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true}));m.position.set(x+OX,y,z);m.rotation.y=ry;g[f].add(m)}
