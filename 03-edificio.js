/* classroom */
function room(f,i,s,lab){
 const x0=sx(i),x1=x0+W,X=u=>s>0?x1-u:x0+u,Z=v=>s*(CW+v);
 const Q=(m,u0,u1,y0,y1,v0,v1)=>R(f,m,X(u0),X(u1),y0,y1,Z(v0),Z(v1));
 const gp=(u0,u1,...r)=>[Math.min(X(u0),X(u1)),Math.max(X(u0),X(u1)),...r];
 wallX(f,x0,x1,s*CW,[gp(.4,1.3,0,2.1)]);
 wallX(f,x0,x1,s*D,[gp(1,2.4,1,2.1,1),gp(3.1,4.5,1,2.1,1)].sort((a,b)=>a[0]-b[0]));
 wallZ(f,s*CW,s*D,x1);if(i%2==0)wallZ(f,s*CW,s*D,x0);
 Q(lab?'floorL':'floorR',0,W,0,.012,0,D-CW);
 [1.8,4.2].forEach(v=>Q('light',2.4,3,H-.04,H-.01,v-.6,v+.6));
 [1.8,4.2].forEach(v=>Q('acon',.07,.27,2.2,2.5,v-.45,v+.45));           /* 2 split ACs on left wall */
 [1.7,3.8].forEach(u=>R(f,'acout',X(u)-.4,X(u)+.4,2.15,2.75,s*(D+.06),s*(D+.34)));
 Q('metal',5.38,5.44,.95,2.05,1.3,4.7);Q('white',5.34,5.38,1,2,1.35,4.65);   /* whiteboard */
 Q('door',.4,.45,0,2.05,.08,1);                                               /* open door leaf */
 const n=(f+1)*100+i*2+(s>0?1:2),name=(lab?'CÓMPUTO ':'AULA ')+n,seats=[];
 label(f,name,X(.85),2.45,s*(CW-.09),s>0?Math.PI:0,.95,.24,lab?'#b98200':'#0d3b9c');
 const chair=(m,u,v)=>{Q(m,u-.2,u+.2,.43,.47,v-.2,v+.2);Q(m,u-.22,u-.18,.47,.85,v-.2,v+.2)};
 if(!lab){Q('wood',4.8,5.3,0,.75,.4,1.6);
  for(const u of[1.7,2.6,3.5,4.4])for(const v of[1.3,2.25,3.2,4.15,5.1]){chair('chair',u,v);Q('metal',u-.18,u-.14,0,.43,v-.18,v-.14);Q('metal',u+.14,u+.18,0,.43,v+.14,v+.18);
   Q('wood',u+.05,u+.45,.72,.75,v-.05,v+.35);Q('metal',u+.18,u+.22,.47,.72,v+.15,v+.19);seats.push({u,v})}}
 else for(const ub of[2.3,3.4,4.5]){Q('top',ub-.35,ub+.35,.72,.76,.3,5.7);Q('desk',ub-.33,ub+.33,0,.72,.3,.34);Q('desk',ub-.33,ub+.33,0,.72,5.66,5.7);Q('desk',ub+.1,ub+.14,.2,.72,.3,5.7);
  for(let k=0;k<5;k++){const v=.95+k*1.05,cu=ub-.62;Q('screen',ub+.1,ub+.14,.95,1.27,v-.26,v+.26);   /* monitor con glow cian */Q('metal',ub+.08,ub+.12,.76,.95,v-.03,v+.03);Q('black',ub-.25,ub-.07,.76,.775,v-.2,v+.2);
   chair('black',cu,v);Q('metal',cu-.03,cu+.03,.08,.43,v-.03,v+.03);Q('metal',cu-.25,cu+.25,.04,.08,v-.03,v+.03);seats.push({u:cu,v})}}
 const ex=s>0?-1:1;rooms.push({name,f,s,lab,X,Z,seats,ex});
}
/* bathroom (right side) */
function bathOld(f){wallX(f,33,37,CW,[[34,35,0,2.1]]);wallX(f,33,37,D,[[34.6,35.6,1.2,2,1]]);
 R(f,'tile',33,37,0,.012,CW,D);R(f,'light',34.4,35.6,H-.04,H-.01,3.5,4);
 R(f,'desk',36.3,36.9,0,.8,2,4.2);for(let k=0;k<3;k++)R(f,'white',36.45,36.85,.8,.87,2.2+k*.7,2.6+k*.7);R(f,'mirror',36.93,36.94,1.2,2,2.1,4.1);
 for(let k=0;k<4;k++)R(f,'white',33.06,34.3,.15,1.85,4.6+k*.85-.015,4.6+k*.85+.015);for(let k=0;k<3;k++)R(f,'white',33.1,33.5,0,.4,5+k*.85-.2,5+k*.85+.2);
 label(f,'SS.HH.',34.5,2.45,CW-.09,Math.PI,.8,.24,'#1a7a8c');}
/* baños: hombres al frente, mujeres a la izquierda */
function bath2(f){const G0=33,G1=43,Zd=3.8,XM=37.2;   /* Zd: pasillo de acceso ahora de 1.7 m (antes 0.7 m); XM: divisoria hombres/mujeres (mujeres más amplio) */
 wallX(f,G0,G1,CW,[[33.3,34.4,0,2.1]]);wallX(f,G0,G1,D,[[34.8,36,1.9,2.6,1],[40,41.2,1.9,2.6,1]]);
 wallX(f,G0,G1,Zd,[[33.3,34.3,0,2.1],[37.5,38.5,0,2.1]]);wallZ(f,Zd,D,XM);
 R(f,'tile',G0,G1,0,.012,CW,D);R(f,'light',35,41,H-.04,H-.01,CW+.5,CW+.7);
 label(f,'SS.HH.',33.85,2.45,CW-.09,Math.PI,.8,.24,'#1a7a8c');label(f,'HOMBRES',33.8,2.45,Zd-.09,Math.PI,.9,.24,'#1a4fc4');label(f,'MUJERES',38,2.45,Zd-.09,Math.PI,.9,.24,'#b5336f');
 /* orden invertido: inodoros al frente (junto a la puerta), lavamanos al fondo */
 [[G0,XM,1,3],[XM,G1,0,4]].forEach(([a,b,men,n])=>{const xs=a+1.45,xe=b-.06,w=(xe-xs)/n,zf=Zd+1.5;
  R(f,'light',xs+.3,xe-.3,H-.04,H-.01,(Zd+D)/2-.1,(Zd+D)/2+.1);
  for(let k=0;k<=n;k++)R(f,'white',xs+k*w-.015,xs+k*w+.015,.15,1.85,Zd+.06,zf);
  for(let k=0;k<n;k++){const xc=xs+(k+.5)*w;R(f,'door',xc-w/2+.08,xc+w/2-.08,.2,1.8,zf-.02,zf+.02);R(f,'white',xc-.2,xc+.2,0,.4,Zd+.23,Zd+.68);R(f,'white',xc-.17,xc+.17,.4,.8,Zd+.08,Zd+.23)}
  R(f,'desk',xs,xe,0,.8,D-.56,D-.06);R(f,'mirror',xs,xe,1.05,1.8,D-.07,D-.06);
  for(let k=0;k<n;k++){const x=xs+(k+.5)*(xe-xs)/n;R(f,'white',x-.2,x+.2,.8,.87,D-.5,D-.14);R(f,'metal',x-.02,x+.02,.87,1,D-.2,D-.16)}
  if(men)for(const z of[5.5,6.1,6.7]){R(f,'white',a+.06,a+.3,.55,1.2,z-.15,z+.15);R(f,'white',a+.06,a+.4,.5,1.3,z+.2,z+.22)}});}
function dep(f){wallX(f,36,43,-D,[]);wallZ(f,-CW,-D,36);wallX(f,36,43,-CW,[[39,40,0,2.1]]);R(f,'floorR',36,43,0,.012,-D,-CW);R(f,'light',39,40,H-.04,H-.01,-4,-3.5);label(f,'DEPÓSITO',39.5,2.45,-CW+.09,0,.9,.24,'#555b63')}
/* logos, escaleras, barandas */
function logo(c,x,y,r,col){c.strokeStyle=col;c.fillStyle=col;c.lineWidth=r*.16;c.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;c.lineTo(x+r*Math.cos(a),y+r*Math.sin(a))}c.closePath();c.stroke();c.font='bold '+r*1.3+'px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('S',x,y+r*.05)}
function sign(f,x,y,z,ry,w=2.4,h=.62){const t=tex(512,128,(c,W,H)=>{c.fillStyle='#e2b24a';c.fillRect(0,0,W,H);c.fillStyle='rgba(90,60,10,.18)';for(let i=0;i<60;i++)c.fillRect(Math.random()*W,Math.random()*H,20,3);c.strokeStyle='#b88a2a';c.lineWidth=6;c.strokeRect(3,3,W-6,H-6);logo(c,80,64,44,'#1b2a5c');c.fillStyle='#1b2a5c';c.font='bold 74px Arial';c.textAlign='left';c.textBaseline='middle';c.fillText('SENATI',150,68)});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.position.set(x,y,z);m.rotation.y=ry;g[f].add(m)}
const zones=[];
function rail(f,x0,x1,z){R(f,'blue',x0,x1,.95,1.03,z-.03,z+.03);R(f,'blue',x0,x1,.5,.56,z-.03,z+.03);R(f,'blue',x0,x1,.1,.16,z-.03,z+.03);for(let x=x0;x<=x1+.01;x+=1.5)R(f,'blue',x-.04,x+.04,0,1.03,z-.04,z+.04);col(f,x0,x1,z-.05,z+.05)}
function flight(xa,xb,s,zb){for(let k=0;k<15;k++){const t=-3+(k+1)*.2,z0=s*(zb-k*.36),z1=s*(zb-(k+1)*.36);R(1,'stair',xa,xb,t-.05,t,z0,z1);for(const x of[xa+.02,xb-.02]){R(1,'blue',x-.03,x+.03,t-.4,t,z0,z1);R(1,'blue',x-.025,x+.025,t,t+.95,z0,z0-s*.05);R(1,'blue',x-.025,x+.025,t+.9,t+.95,z0,z1)}}}
function stairs(gx,s){flight(gx+.08,gx+2.92,s,D);zones.push([gx+.3,gx+2.7,s,D]);col(0,gx+2.95,gx+3.05,s*CW,s*D);col(1,gx+2.95,gx+3.05,s*CW,s*D)}
function gaps2(){stairs(11,-1);stairs(28,1);stairs(45,-1);rail(1,14,17,-CW);rail(1,11,17,CW);rail(1,28,34,-CW);rail(1,31,34,CW)}
function endStairs(e){const s=e?1:-1,xa=e?L:-2.4,xb=e?L+2.4:0,fx=e?xb:xa,zb=CW+5.4;
 R(1,'slab',xa,xb,-.15,0,-CW,CW);R(1,'floorC',xa,xb,0,.012,-CW,CW);flight(xa+.06,xb-.06,s,zb);
 R(1,'blue',fx-.04,fx+.04,.95,1.03,-CW,CW);R(1,'blue',fx-.04,fx+.04,.5,.56,-CW,CW);col(1,fx-.1,fx+.1,-CW,CW);rail(1,xa,xb,-s*CW);
 [[xa+.08,-s*(CW+.05),0],[xb-.08,-s*(CW+.05),0],[xa+.08,s*(CW+3),-1.7],[xb-.08,s*(CW+3),-1.7]].forEach(p=>R(1,'blue',p[0]-.06,p[0]+.06,p[2],H,p[1]-.06,p[1]+.06));
 R(2,'roof',xa-.2,xb+.2,H,H+.1,-s*(CW+.1),s*(CW+3.2));R(2,'blue',xa-.2,xb+.2,H,H+.14,s*(CW+3.2)-.05,s*(CW+3.2)+.05);
 zones.push([xa+.3,xb-.3,s,zb]);for(const x of[xa,xb])col(0,x-.05,x+.05,s*CW,s*zb);col(0,xa,xb,s*CW-.05,s*CW+.05)}
function deco(f){[8,25,40,58].forEach(x=>{R(f,'red',x-.1,x+.1,0,.55,CW-.35,CW-.15);R(f,'black',x-.04,x+.04,.55,.65,CW-.28,CW-.22);R(f,'red',x-.17,x+.17,1.5,1.9,CW-.075,CW-.06)});
 [3,20,26,37,43,58,64].forEach((x,i)=>{R(f,'white',x-.4,x+.4,1.15,1.8,-CW+.06,-CW+.075);R(f,['pbl','pye','pgr'][i%3],x-.35,x+.35,1.2,1.75,-CW+.075,-CW+.09)})}
/* floor skeleton */
function floor(f){
 if(f==0)R(0,'slab',-.3,L+.3,-.12,0,-D-.3,D+.3);else{[[-.3,11],[17,28],[34,45],[55,L+.3]].forEach(a=>R(1,'slab',a[0],a[1],-.15,0,-D-.3,D+.3));[[11,17],[28,34]].forEach(a=>R(1,'slab',a[0],a[1],-.15,0,-CW,CW));R(1,'slab',45,55,-.15,0,-CW,D+.3);R(1,'slab',48,55,-.15,0,-D-.3,-CW)}
 R(f,'floorC',0,L,0,.012,-CW,CW);
 for(let x=2;x<L;x+=4)R(f,'light',x-.6,x+.6,H-.06,H-.02,-.1,.1);
 const bx=[0,...[...Array(9).keys()].map(i=>sx(i)).slice(1),11,28,45].filter((v,i,a)=>a.indexOf(v)==i);
 for(const x of bx)for(const z of[-CW,CW,-D,D])R(f,'blue',x-.1,x+.1,0,H,z-.1,z+.1);
 for(const z of[-CW,CW])R(f,'blue',0,L,H-.18,H,z-.1,z+.1);
 for(const z of[-D,D]){R(f,'blue',-.06,L+.06,H-.2,H,z-.08,z+.08);R(f,'blue',-.06,L+.06,0,.12,z-.08,z+.08)}
 R(f,'blue',-.1,L+.1,H-.2,H,-D-.08,-D+.08);for(let x=1.1;x<L;x+=1.1)if(![[11,17],[28,34],[45,55]].some(q=>x>q[0]-.2&&x<q[1]+.2))for(const z of[-D,D])R(f,'seam',x-.01,x+.01,.12,H-.2,z-.07,z+.07);
 for(let i=0;i<8;i++)for(const s of[1,-1])room(f,i,s,f==0&&i>=6);
 OX=12;bath2(f);dep(f);OX=0;
 /* punto ecológico */
 deco(f);label(f,'♻ PUNTO ECOLÓGICO',18.3,1.25,CW-.09,Math.PI,2.1,.26,'#1fa6d6');col(f,17.2,19.4,CW-.4,CW-.06);
 ['brown','dgreen','cream','navy','bk'].forEach((m,k)=>{const x=17.45+k*.42;R(f,m,x-.18,x+.18,0,.72,CW-.38,CW-.07);R(f,m,x-.2,x+.2,.72,.8,CW-.4,CW-.06)});
 if(f==0){wallX(0,11,14,-CW,[]);wallX(0,28,31,CW,[]);wallX(0,45,48,-CW,[]);R(0,'blue',33,37,H-.18,H,-CW-.1,-CW+.1)}
 else{ gaps2();for(let k=0;k<0;k++){const t=-3+(k+1)*.2,z=-D+k*.36;R(1,'stair',33.06,36.94,-3,t,z,z+.36);for(const x of[33.1,36.9]){R(1,'blue',x-.03,x+.03,t,t+.95,z,z+.06);R(1,'blue',x-.03,x+.03,t+.9,t+.95,z,z+.36)}}
  endStairs(0);endStairs(1);for(const x of[]){R(1,'blue',x-.04,x+.04,.95,1.03,-CW,CW);R(1,'blue',x-.04,x+.04,.45,.5,-CW,CW);for(const z of[-CW,0,CW])R(1,'blue',x-.05,x+.05,0,1.03,z-.05,z+.05);col(1,x-.1,x+.1,-CW,CW)}
  R(2,'roof',-.5,L+.5,H,H+.15,-D-.5,D+.5);for(const z of[-D-.5,D+.5])R(2,'blue',-.5,L+.5,H,H+.2,z-.06,z+.06);for(const x of[-.5,L+.5])R(2,'blue',x-.06,x+.06,H,H+.2,-D-.5,D+.5);
  for(let x=0;x<L;x+=.6)R(2,'roof',x,x+.05,H+.15,H+.2,-D-.5,D+.5)}
 if(f==1){sign(1,6,1.9,D+.07,0);sign(1,L+.07,1.9,-4,Math.PI/2);sign(1,-.07,1.9,4,-Math.PI/2)}
}
floor(0);floor(1);
const q0=new THREE.Quaternion(),ub=new THREE.BoxGeometry(1,1,1),M4=new THREE.Matrix4();
lists.forEach((l,f)=>{const grp=f==2?roofG:g[f];for(const m in l){const a=l[m],im=new THREE.InstancedMesh(ub,mats[m],a.length);
 a.forEach((b,i)=>{M4.compose(new THREE.Vector3(b[0],b[1],b[2]),q0,new THREE.Vector3(b[3]||.001,b[4]||.001,b[5]||.001));im.setMatrixAt(i,M4)});
 im.frustumCulled=false;if(!['light','glass','mirror'].includes(m)){im.castShadow=im.receiveShadow=true}grp.add(im)}});
