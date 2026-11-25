/* ════════════════════════════════════════════════════════════
   04b · Estacionamiento de pérgolas (más verde y más autos)
        + CERCO METÁLICO AZUL perimetral (como en las fotos reales:
          paños de malla con marco azul, portón de ingreso 3540 y
          enredadera con florecitas lilas)
   ════════════════════════════════════════════════════════════ */

/* ── 1 · Playa de pérgolas (oeste de la calzada de ingreso) ── */
{
  /* área verde: franja norte con árboles y arbustos */
  lawn(-95,-16.5,-158.6,-152.3);
  box(0xd2d5d7,-95,-16.5,0,.13,-152.45,-152.25);
  for(let x=-90;x<-18;x+=9.5)tree(x,-155.4,(x/9.5|0)%2?.8:.95);
  for(let x=-86;x<-18;x+=14)bushY(x,-157.2,.85);
  palm(-20,-155.6,.95);

  /* isletas verdes entre las dos filas de pérgolas (dejan libre el medallón "S") */
  const gmW=new THREE.MeshStandardMaterial({color:0x4a8a40,roughness:1,metalness:0,envMapIntensity:.18});
  for(const [xa,xb] of [[-114,-74],[-60,-22]]){
    box(0xd2d5d7,xa-.3,xb+.3,0,.17,-136.1,-133.9);boxM(gmW,xa-.2,xb+.2,0,.19,-136,-134);
    for(let x=xa+4;x<xb;x+=8)tree(x,-135,.6);
    for(let x=xa+8;x<xb;x+=16)bushY(x+3,-135,.55);
  }
  /* isleta redonda con arbusto junto al medallón */
  cylM(S(0xd2d5d7,.9),2.1,2.1,.17,-67,.085,-125.6,20);cylM(gmW,1.9,1.9,.2,-67,.1,-125.6,20);bushY(-67,-125.6,.6);

  /* más autos: bajo las pérgolas y en una hilera sur */
  const cc=[0xe8e8e8,0x7e1f1f,0x22304a,0x3a3f4a,0xd8d8d5,0x1d3f2a,0xb7bcc2,0x8a6f4d,0xc4231a,0x1646a0];let k=0;
  const nx=()=>cc[(k++*7)%cc.length];
  [-96,-86,-62,-52,-47,-42].forEach(x=>car(x,-146.1,nx(),0));                         /* pérgolas norte */
  [-104,-94,-89,-84,-62,-58,-53,-43].forEach(x=>car(x,-124,nx(),Math.PI));            /* pérgolas sur */
  for(let x=-114;x<-24;x+=6.2){if(x>-70&&x<-62)continue;car(x,-114.6,nx(),(k%2)?0:Math.PI)}  /* hilera sur */
}

/* ── 2 · CERCO METÁLICO AZUL PERIMETRAL ───────────────────── */
{
  const FH=3.1,XW=-171.5,XE=169,ZN=-159.8,ZS=100,GAP=9.6;   /* perímetro y ancho del portón de ingreso */
  const frameM=S(0x1646a0,.42,{metalness:.6,envMapIntensity:.9});
  const darkM=S(0x0d2f6b,.5,{metalness:.5,envMapIntensity:.7});
  /* malla romboidal azul con marco (textura con alfa) */
  const meshT=tex(128,128,(c,w,h)=>{c.clearRect(0,0,w,h);c.strokeStyle='#3d7fe6';c.lineWidth=4;
    for(let i=-h;i<=w+h;i+=32){c.beginPath();c.moveTo(i,0);c.lineTo(i+h,h);c.stroke();c.beginPath();c.moveTo(i,h);c.lineTo(i+h,0);c.stroke()}
    c.strokeStyle='#1a53b8';c.lineWidth=2;
    for(let i=-h;i<=w+h;i+=32){c.beginPath();c.moveTo(i+1,0);c.lineTo(i+h+1,h);c.stroke()}});
  meshT.wrapS=meshT.wrapT=THREE.RepeatWrapping;
  const meshM=new THREE.MeshStandardMaterial({map:meshT,alphaTest:.4,side:THREE.DoubleSide,roughness:.5,metalness:.45,envMapIntensity:.8});

  const posts=[],vines=[],flowers=[];
  let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

  /* segmento recto: (x0,z0)→(x1,z1) */
  function seg(x0,z0,x1,z1,collide){
    const L=Math.hypot(x1-x0,z1-z0),ang=Math.atan2(-(z1-z0),x1-x0),cx=(x0+x1)/2,cz=(z0+z1)/2,ux=(x1-x0)/L,uz=(z1-z0)/L,nxv=-uz,nzv=ux;
    /* paño de malla (una sola malla por lado) */
    const hh=FH-.6,g=new THREE.PlaneGeometry(L,hh);
    {const uv=g.attributes.uv;for(let i=0;i<uv.count;i++){uv.setX(i,uv.getX(i)*L/1.1);uv.setY(i,uv.getY(i)*hh/1.1)}}
    const m=new THREE.Mesh(g,meshM);m.position.set(cx,.6+hh/2,cz);m.rotation.y=ang;scene.add(m);
    /* rieles: superior, intermedio y zócalo (plancha) */
    const rail=(y,t,d,mat)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(L,t,d),mat);b.position.set(cx,y,cz);b.rotation.y=ang;b.castShadow=true;b.receiveShadow=true;scene.add(b)};
    rail(FH-.04,.12,.14,frameM);rail(1.85,.07,.1,frameM);rail(.3,.6,.06,darkM);rail(.64,.05,.12,frameM);
    /* postes cada ~4 m */
    const n=Math.max(1,Math.round(L/4));for(let i=0;i<=n;i++)posts.push([x0+ux*L*i/n,z0+uz*L*i/n]);
    /* enredadera + florecitas lilas, sobre todo del lado de la calle */
    for(let s=0;s<L;s+=1.5){
      const wave=Math.sin(s*.045+cx*.02+cz*.03);if(wave<-.25&&rnd()<.75)continue;
      for(const side of[-1,1]){if(side===1&&rnd()<.4)continue;
        const t=s+rnd()*1.2,px=x0+ux*t+nxv*side*.14,pz=z0+uz*t+nzv*side*.14,py=.5+rnd()*(FH-.3)*(.55+.45*Math.max(wave,0));
        vines.push([px,py,pz,.55+rnd()*.7,ang,rnd()]);
        if(rnd()<.7)flowers.push([px+nxv*side*.2+(rnd()-.5)*.5,py+(rnd()-.5)*.5,pz+nzv*side*.2+(rnd()-.5)*.5])}}
    if(collide){const pad=.4;obst(Math.min(x0,x1)-pad,Math.max(x0,x1)+pad,Math.min(z0,z1)-pad,Math.max(z0,z1)+pad)}
  }
  seg(XW,ZN,-GAP,ZN,true);seg(GAP,ZN,XE,ZN,true);   /* norte (Panamericana) con portón al centro */
  seg(XE,ZN,XE,ZS);                                   /* este */
  seg(XE,ZS,XW,ZS);                                   /* sur */
  seg(XW,ZS,XW,ZN);                                   /* oeste */
  /* las rejas del estadio y la loza (window.__fences, definidas en 04-entorno.js) se dibujan en 04c-ajustes.js: negras, altas y sobre la plataforma */

  /* postes (instanciados) */
  {const pg=new THREE.BoxGeometry(.16,FH+.15,.16),im=new THREE.InstancedMesh(pg,frameM,posts.length),d=new THREE.Object3D();
   posts.forEach(([x,z],i)=>{d.position.set(x,(FH+.15)/2,z);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.castShadow=true;scene.add(im);
   const cg=new THREE.BoxGeometry(.24,.1,.24),ic=new THREE.InstancedMesh(cg,darkM,posts.length);
   posts.forEach(([x,z],i)=>{d.position.set(x,FH+.2,z);d.updateMatrix();ic.setMatrixAt(i,d.matrix)});scene.add(ic)}

  /* enredadera */
  {const ig=new THREE.IcosahedronGeometry(.45,0),im=new THREE.InstancedMesh(ig,new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,envMapIntensity:.15}),vines.length),d=new THREE.Object3D(),c=new THREE.Color();
   const gr=[0x2f5d2c,0x3a6b34,0x28502a,0x46783a];
   vines.forEach(([x,y,z,s,a,r],i)=>{d.position.set(x,y,z);d.rotation.set(r*3,a,r*5);d.scale.set(s*1.1,s*.9,s*.5);d.updateMatrix();im.setMatrixAt(i,d.matrix);c.setHex(gr[(r*4)|0]);im.setColorAt(i,c)});
   im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;scene.add(im);
   const fg=new THREE.SphereGeometry(.055,5,4),fi=new THREE.InstancedMesh(fg,new THREE.MeshStandardMaterial({color:0xb8a7ee,roughness:.6,emissive:0x3a2f66,emissiveIntensity:.25}),flowers.length);
   flowers.forEach(([x,y,z],i)=>{d.position.set(x,y,z);d.rotation.set(0,0,0);d.scale.set(1,1,1);d.updateMatrix();fi.setMatrixAt(i,d.matrix)});scene.add(fi)}

  /* ── Portón de ingreso (hojas abiertas contra el borde de la calzada) + postes altos + cartel SENATI ① 3540 ── */
  for(const s of[-1,1]){
    boxM(frameM,s*GAP-.2,s*GAP+.2,0,3.7,ZN-.2,ZN+.2);boxM(darkM,s*GAP-.28,s*GAP+.28,3.7,3.85,ZN-.28,ZN+.28);   /* poste alto */
    const x0=s*(GAP-.25),lf=new THREE.Mesh(new THREE.PlaneGeometry(4.6,2.5),meshM);lf.position.set(x0,1.5,ZN+2.5);lf.rotation.y=Math.PI/2;scene.add(lf);   /* hoja abierta */
    boxM(frameM,x0-.05,x0+.05,2.7,2.8,ZN+.2,ZN+4.8);boxM(frameM,x0-.05,x0+.05,.2,.3,ZN+.2,ZN+4.8);boxM(frameM,x0-.05,x0+.05,.2,2.8,ZN+4.75,ZN+4.85);
  }
  {const sg=tex(512,128,(c,w,h)=>{c.fillStyle='#1646a0';c.fillRect(0,0,w,h);c.strokeStyle='#8fb4f2';c.lineWidth=4;c.strokeRect(4,4,w-8,h-8);
      logo(c,70,64,34,'#ffffff');c.fillStyle='#fff';c.font='900 64px "Barlow Condensed",Arial Narrow,Arial';c.textAlign='left';c.textBaseline='middle';c.fillText('SENATI',122,66);
      c.beginPath();c.arc(338,64,32,0,7);c.fill();c.fillStyle='#1646a0';c.font='bold 44px Arial';c.textAlign='center';c.fillText('1',338,66);
      c.fillStyle='#fff';c.font='900 58px Arial';c.textAlign='left';c.fillText('3540',386,68)});
   const mk=()=>new THREE.MeshBasicMaterial({map:sg});
   const pn=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.1),mk());pn.position.set(14.2,2.55,ZN-.13);pn.rotation.y=Math.PI;scene.add(pn);   /* cara hacia la calle */
   boxM(darkM,11.95,16.45,1.95,3.15,ZN-.1,ZN-.05);}
}
