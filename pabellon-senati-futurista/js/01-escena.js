/* ════════════════════════════════════════════════════════════
   01 · ESCENA — Render cinematográfico (ACES + PBR + Bloom)
   ════════════════════════════════════════════════════════════ */
const W=5.5,GAP=10,H=2.85,CW=2.1,D=8.1,L=66,sx=i=>i*W+(i>=2?6:0)+(i>=4?6:0)+(i>=6?10:0);

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
const PR=Math.min(Math.max(window.devicePixelRatio||1,1.75),2);renderer.setPixelRatio(PR);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;               /* la conversión final la aplica gammaPass */
renderer.toneMapping=THREE.ACESFilmicToneMapping;          /* curva fílmica: negros ricos, altas luces suaves */
renderer.toneMappingExposure=1.04;
document.body.prepend(renderer.domElement);

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xcfd9e4);
scene.fog=new THREE.Fog(0xd4dee9,105,340);                 /* bruma atmosférica tipo foto aérea */

const camera=new THREE.PerspectiveCamera(58,1,.1,900);scene.add(camera);
const lamp=new THREE.PointLight(0xfff1d6,0,9);camera.add(lamp);

/* Luces: sol cálido + cielo frío + relleno opuesto (modela el volumen) */
const hemi=new THREE.HemisphereLight(0xdfeaf7,0x87816e,.66);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffedd6,1.14);sun.position.set(-24,52,38);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-125,right:125,top:125,bottom:-125,near:1,far:280});
sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;sun.target.position.set(0,0,0);scene.add(sun,sun.target);
const fill=new THREE.DirectionalLight(0xbfd4ff,.34);fill.position.set(46,20,-38);scene.add(fill);   /* contraluz frío */

/* Entorno PBR: un "estudio" procedural (PMREM) para reflejos reales en vidrio y metal */
(function buildEnvironment(){
  const env=new THREE.Scene();
  const c=document.createElement('canvas');c.width=16;c.height=128;const x=c.getContext('2d');
  const q=x.createLinearGradient(0,0,0,128);
  q.addColorStop(0,'#8fb6e2');q.addColorStop(.46,'#dfe7ee');q.addColorStop(.52,'#99a0a8');q.addColorStop(1,'#565b63');
  x.fillStyle=q;x.fillRect(0,0,16,128);
  const skyTex=new THREE.CanvasTexture(c);skyTex.encoding=THREE.sRGBEncoding;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(60,16,12),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide}));env.add(dome);
  const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(5,10,8),new THREE.MeshBasicMaterial({color:0xfff3cf}));sunDisc.position.set(-26,34,20);env.add(sunDisc);
  const pm=new THREE.PMREMGenerator(renderer);
  scene.environment=pm.fromScene(env,0.03).texture;       /* mip blur suave, sin reflejos "de videojuego" */
  pm.dispose();
})();

const orbit=new THREE.OrbitControls(camera,renderer.domElement);
orbit.enableDamping=true;orbit.dampingFactor=.06;orbit.maxPolarAngle=1.52;orbit.minDistance=8;orbit.maxDistance=340;
function view(p,t){camera.position.set(...p);orbit.target.set(...t);orbit.update()}view([46,13,20],[-12,2.5,-3]);

/* Post-procesado: Bloom sutil (brillos, lámparas, letreros) + corrección sRGB */
const composer=new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene,camera));
/* Profundidad de campo óptica (estilo 35 mm f/2.8): enfoque dinámico al punto de órbita */
const bokehPass=new THREE.BokehPass(scene,camera,{focus:63,aperture:0.0022,maxblur:0.0075});
composer.addPass(bokehPass);
const bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.3,.6,.8);
composer.addPass(bloomPass);
/* Grado fotográfico editorial: curva S, saturación contenida, split-toning, grano y viñeta */
const PhotoGradeShader={uniforms:{'tDiffuse':{value:null},'uTime':{value:0},'uGrain':{value:.055},'uVig':{value:.36}},
vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
fragmentShader:[
 'uniform sampler2D tDiffuse;uniform float uTime,uGrain,uVig;varying vec2 vUv;',
 'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+uTime*13.0)*43758.5453);}',
 'void main(){',
 ' vec4 col=texture2D(tDiffuse,vUv);vec3 c=col.rgb;',
 ' c=(c-0.5)*1.09+0.5; c=clamp(c,0.0,1.0);',                 /* curva S editorial */
 ' float l=dot(c,vec3(0.2126,0.7152,0.0722));',
 ' c=mix(vec3(l),c,1.14);',                                    /* saturación rica */
 ' float sh=smoothstep(0.45,0.05,l),hi=smoothstep(0.55,0.95,l);',
 ' c+=vec3(-0.014,0.024,0.034)*sh+vec3(0.034,0.022,-0.012)*hi;',/* sombras teal · luces doradas */
 ' float g=hash(vUv*vec2(1920.0,1080.0));c+=(g-0.5)*uGrain;',  /* grano de película */
 ' float d=distance(vUv,vec2(0.5,0.46));',
 ' c*=1.0-uVig*smoothstep(0.42,0.92,d);',                      /* viñeta editorial */
 ' gl_FragColor=vec4(c,col.a);}'].join('\n')};
const gradePass=new THREE.ShaderPass(PhotoGradeShader);
composer.addPass(gradePass);
composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
/* Calidad adaptativa: en GPUs reales DoF + supermuestreo; en render por software, desactivar el pase pesado */
try{const _gl=renderer.getContext();const _dbg=_gl.getExtension('WEBGL_debug_renderer_info');const _rs=_dbg?String(_gl.getParameter(_dbg.UNMASKED_RENDERER_WEBGL)):'';
  if(/swiftshader|llvmpipe|software|basic render/i.test(_rs)){bokehPass.enabled=false;renderer.setPixelRatio(1);gradePass.uniforms['uGrain'].value=.035;}}catch(e){}

/* Resplandor solar (bloom + halo aditivo) — se reposiciona según el ambiente en setTime() */
const sunGlowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const r=x.createRadialGradient(64,64,2,64,64,62);r.addColorStop(0,'rgba(255,248,218,1)');r.addColorStop(.28,'rgba(255,231,165,.8)');r.addColorStop(1,'rgba(255,231,165,0)');x.fillStyle=r;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t})();
const sunGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:sunGlowTex,transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
sunGlow.scale.set(148,148,1);scene.add(sunGlow);

/* Captura PNG exacta de lo que se ve (la usa js/features.js) */
window.captureFrame=function(){
  let SW=false;try{const _gl=renderer.getContext();const _dbg=_gl.getExtension('WEBGL_debug_renderer_info');const _rs=_dbg?String(_gl.getParameter(_dbg.UNMASKED_RENDERER_WEBGL)):'';SW=/swiftshader|llvmpipe|software|basic render/i.test(_rs)}catch(e){}
  const CW=SW?1920:3840,CH=SW?1080:2160;
  const PRC=Math.min(Math.max(window.devicePixelRatio||1,1.75),2);
  renderer.setPixelRatio(1);renderer.setSize(CW,CH,false);
  camera.aspect=CW/CH;camera.updateProjectionMatrix();composer.setSize(CW,CH);composer.render();
  const url=renderer.domElement.toDataURL('image/png');
  renderer.setPixelRatio(PRC);renderer.setSize(innerWidth,innerHeight);
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();composer.setSize(innerWidth,innerHeight);composer.render();
  return url;
};
