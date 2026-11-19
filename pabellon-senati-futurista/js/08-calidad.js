/* ════════════════════════════════════════════════════════════
   08 · CALIDAD GRÁFICA — Alta · Media · Baja
   Cada nivel ajusta de verdad el costo del render:
   resolución (supermuestreo), sombras, desenfoque de cámara (DoF),
   bloom, grano de película y resolución de la captura PNG.
   Se guarda la elección; también acepta ?calidad=alta|media|baja
   ════════════════════════════════════════════════════════════ */
(function(){
  /* ¿GPU real o render por software? (en software, Alta se limita sola) */
  const SW=(()=>{try{const gl=renderer.getContext(),d=gl.getExtension('WEBGL_debug_renderer_info');
    return !!d&&/swiftshader|llvmpipe|software|basic render/i.test(String(gl.getParameter(d.UNMASKED_RENDERER_WEBGL)))}catch(e){return false}})();
  const dpr=Math.max(window.devicePixelRatio||1,1);

  const Q={
    high:{name:'Alta',
      pr:SW?1:Math.min(Math.max(dpr,1.75),2),        /* supermuestreo: bordes limpios y texto nítido */
      shadow:2048,nb:.03,live:true,                   /* sombras finas, actualizadas en cada cuadro */
      dof:!SW,bloom:true,grain:.055,vig:.36,          /* profundidad de campo + bloom + grano fílmico */
      cap:SW?[1920,1080]:[3840,2160],capName:SW?'Full HD':'4K',
      badge:'PBR · BLOOM · ACES · DoF',
      txt:'Resolución ×2, sombras finas, desenfoque de cámara, bloom y grano. Ideal para PC con GPU dedicada.'},
    medium:{name:'Media',
      pr:Math.min(Math.max(dpr,1),1.25),
      shadow:1024,nb:.05,live:true,
      dof:false,bloom:true,grain:.035,vig:.32,
      cap:[1920,1080],capName:'Full HD',
      badge:'PBR · BLOOM · ACES',
      txt:'Resolución ×1.25, sombras medias y bloom. Sin desenfoque de cámara. Equilibrio para laptops y celulares.'},
    low:{name:'Baja',
      pr:.8,                                          /* menos píxeles = máxima fluidez */
      shadow:1024,nb:.06,live:false,                  /* sombras que se refrescan 4 veces por segundo */
      dof:false,bloom:false,grain:0,vig:.3,
      cap:[1280,720],capName:'HD',
      badge:'PBR · ACES',
      txt:'Resolución reducida, sombras ligeras y sin efectos de post-proceso. Para equipos modestos.'}
  };
  const IDS={high:'qHigh',medium:'qMed',low:'qLow'};
  const ALIAS={alta:'high',high:'high',media:'medium',medium:'medium',baja:'low',low:'low'};
  let cur='high';

  function apply(k,notify){
    const q=Q[k];if(!q)return;cur=k;
    /* 1 · resolución interna (render + post-proceso) */
    renderer.setPixelRatio(q.pr);composer.setPixelRatio(q.pr);size();
    /* 2 · sombras */
    sun.shadow.mapSize.set(q.shadow,q.shadow);
    if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}
    sun.shadow.normalBias=q.nb;
    renderer.shadowMap.autoUpdate=q.live;renderer.shadowMap.needsUpdate=true;
    /* 3 · post-proceso */
    bokehPass.enabled=q.dof;bloomPass.enabled=q.bloom;
    gradePass.uniforms['uGrain'].value=q.grain;gradePass.uniforms['uVig'].value=q.vig;
    /* 4 · interfaz */
    Object.keys(IDS).forEach(i=>{const b=document.getElementById(IDS[i]);if(b)b.classList.toggle('on',i===k)});
    const t=document.getElementById('qTxt');if(t)t.textContent=q.txt;
    const lb=document.querySelector('#livebadge span');if(lb)lb.textContent='· '+q.badge;
    const sh=document.getElementById('shot');if(sh)sh.textContent='Capturar imagen (PNG · '+q.capName+')';
    try{localStorage.setItem('senatiCalidad',k)}catch(e){}
    if(notify&&typeof toast==='function')toast('Calidad '+q.name+' aplicada');
  }

  /* Sombras de Calidad Baja: se refrescan a 4 Hz y al interactuar (personas, pisos, ambiente) */
  const poke=()=>{if(!Q[cur].live)renderer.shadowMap.needsUpdate=true};
  setInterval(poke,250);
  ['click','change','keyup'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(poke,40),true));

  /* Captura PNG a la resolución de cada nivel (4K · Full HD · HD) */
  window.captureFrame=function(){
    const q=Q[cur],CW=q.cap[0],CH=q.cap[1];
    renderer.setPixelRatio(1);composer.setPixelRatio(1);
    renderer.setSize(CW,CH,false);composer.setSize(CW,CH);
    camera.aspect=CW/CH;camera.updateProjectionMatrix();
    renderer.shadowMap.needsUpdate=true;composer.render();
    const url=renderer.domElement.toDataURL('image/png');
    renderer.setPixelRatio(q.pr);composer.setPixelRatio(q.pr);size();composer.render();
    return url;
  };

  /* Selector */
  Object.keys(IDS).forEach(k=>{const b=document.getElementById(IDS[k]);if(b)b.onclick=()=>{if(k!==cur)apply(k,true)}});

  /* Medidor de cuadros por segundo: sirve para comparar los niveles */
  const fps=document.getElementById('fps');
  if(fps){let last=performance.now(),acc=0,n=0;
    (function f(t){requestAnimationFrame(f);acc+=t-last;last=t;n++;if(acc>=700){fps.textContent=Math.round(n*1000/acc)+' FPS';acc=0;n=0}})(last)}

  /* Nivel inicial: ?calidad= → guardado → automático (software = Baja, táctil = Media, resto = Alta) */
  let ini=null;
  try{ini=ALIAS[(new URLSearchParams(location.search).get('calidad')||'').toLowerCase()]||ALIAS[localStorage.getItem('senatiCalidad')]||null}catch(e){}
  if(!ini)ini=SW?'low':(matchMedia('(pointer:coarse)').matches?'medium':'high');
  apply(ini,false);
  window.setCalidad=k=>apply(ALIAS[String(k).toLowerCase()]||k,true);
})();
