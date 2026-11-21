/* Capa multijugador aditiva; los controles de movimiento ignoran campos editables. */
(()=>{
 const panel=document.createElement('section');
 panel.id='mp';
 panel.innerHTML='<b>CHAT GLOBAL</b><div id="mplog" aria-live="polite"></div><div id="mpstatus">Inicia sesión en el visor 3D para poder hablar por el chat.</div><form><input maxlength="240" placeholder="Inicia sesión para hablar" autocomplete="off" disabled><button type="submit" disabled>Enviar</button></form><p id="mpuser"></p>';
 document.body.append(panel);
 const css=document.createElement('style');
 css.textContent='#mp{position:fixed;right:16px;bottom:16px;z-index:30;width:290px;height:290px;background:#081321ed;color:white;border:1px solid #456;border-radius:10px;padding:10px;font:13px Arial;display:flex;flex-direction:column}#mplog{overflow:auto;flex:1;margin:8px 0}#mpstatus{font-size:12px;color:#ffd56b;background:#2b2414;border:1px solid #765d1c;border-radius:6px;padding:7px;margin-bottom:6px}#mp form{display:flex;gap:5px}#mp input{min-width:0;flex:1;padding:8px}#mp button{padding:6px 10px}#mpuser{margin:6px 0 0}#mpuser a{color:#59d8ff}.mplabel{font:bold 14px Arial;color:white;text-shadow:0 1px 4px black}';
 document.head.append(css);
 const log=document.querySelector('#mplog'),status=document.querySelector('#mpstatus'),input=panel.querySelector('input'),send=panel.querySelector('button'),userline=document.querySelector('#mpuser');
 let so=null,last=null,lastLook='',lastAt=0,lastFrame=performance.now();
 const rem=new Map(),bubs=new Map(),timers=new Map();
 function setState(message,connected){status.textContent=message;input.disabled=!connected;send.disabled=!connected}
 function line(m){const d=document.createElement('div'),b=document.createElement('b'),t=document.createElement('span');b.textContent=m.username+': ';t.textContent=m.text;d.append(b,t);log.append(d);while(log.children.length>50)log.firstChild.remove();log.scrollTop=log.scrollHeight}
 function sprite(txt){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='rgba(5,12,24,.86)';x.fillRect(0,0,512,128);x.fillStyle='white';x.textAlign='center';x.font='bold 32px Arial';x.fillText(txt.slice(0,32),256,70);const tex=new THREE.CanvasTexture(c);return new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}))}
 /* Los demás jugadores usan el mismo avatar que el tuyo (jugador.js): el aspecto sale de su nombre de usuario,
    así que todos ven a cada persona igual, y camina/corre según la velocidad que se calcula entre cuadros. */
 function add(p){let a=rem.get(p.id);if(!a){const g=window.crearAvatar(p.username,true,p.look);
   g.name='mp-jugador';g.position.set(p.x,p.y,p.z);g.rotation.y=p.yaw;scene.add(g);a={g,t:{},sp:0,px:p.x,pz:p.z,lk:claveAspecto(p.look)};rem.set(p.id,a)}
  /* si ese jugador cambió de género/skin, se rehace su modelo (sin look = aspecto por defecto según su nombre) */
  else if(claveAspecto(p.look)!==a.lk){a.lk=claveAspecto(p.look);window.cambiarAspecto(a.g,p.username,p.look)}
  Object.assign(a.t,{x:p.x,y:p.y,z:p.z,yaw:p.yaw,c:p.c?1:0})}
  function del(id) {
  clearTimeout(timers.get(id));
  timers.delete(id);

  const b = bubs.get(id);
  if (b) {
   if (b.parent) b.parent.remove(b);
   b.material.map.dispose();
   b.material.dispose();
   bubs.delete(id);
  }

  const avatar = rem.get(id);
  if (!avatar) return;

  scene.remove(avatar.g);
  window.liberarAvatar(avatar.g);
  rem.delete(id);
 }
 function bubble(id,txt){const a=rem.get(id);if(!a)return;const old=bubs.get(id);if(old){a.g.remove(old);old.material.map.dispose();old.material.dispose()}const b=sprite(txt);b.scale.set(2.3,.6,1);b.position.y=2.75;a.g.add(b);bubs.set(id,b);clearTimeout(timers.get(id));timers.set(id,setTimeout(()=>{if(bubs.get(id)===b){a.g.remove(b);b.material.map.dispose();b.material.dispose();bubs.delete(id);timers.delete(id)}},6000))}
 const socketURL=window.MULTIPLAYER_SOCKET_URL||((location.protocol==='file:'?'http://localhost':location.protocol+'//'+location.hostname)+':3001');
 const loginLinks='<a href="auth/login.php">Iniciar sesión</a> · <a href="auth/register.php">Crear cuenta</a>';
 let started=false;
 function toast(txt){const el=document.createElement('div');el.textContent=txt;el.style.cssText='position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:40;background:#0b3d24ee;color:#fff;border:1px solid #3ddc84;border-radius:10px;padding:10px 16px;font:14px Arial;box-shadow:0 4px 18px #0008';document.body.append(el);setTimeout(()=>el.remove(),4500)}
 function getSession(){return fetch('auth/session.php',{credentials:'same-origin',cache:'no-store'}).then(r=>r.json().catch(()=>({})).then(d=>({status:r.status,data:d})))}
 function loadIO(){return window.io?Promise.resolve():new Promise((ok,fail)=>{const s=document.createElement('script');s.src=socketURL+'/socket.io/socket.io.js';s.onload=ok;s.onerror=fail;document.head.append(s)})}
 function showAccount(name){window.PLAYER_NAME=name;   /* jugador.js dibuja tu avatar con el aspecto de este nombre */
  userline.textContent='Cuenta: '+name+' ';const a=document.createElement('a');a.href='auth/logout.php';a.textContent='Salir';userline.append(a)}
 function start(d){
  if(started)return;started=true;
  loadIO().then(()=>{
   setState('Conectando al servidor multijugador...',false);
   so=io(socketURL,{auth:cb=>{getSession().then(r=>cb({token:(r.data&&r.data.token)||''})).catch(()=>cb({token:''}))}});
   so.on('connect',()=>{setState('Conectado como '+d.username+'. Ya puedes enviar mensajes.',true);input.placeholder='Escribe un mensaje...'});
   so.on('disconnect',()=>{setState('Conexión perdida. Reconectando...',false);Array.from(rem.keys()).forEach(del);last=null});
   so.on('connect_error',e=>setState(e.message==='AUTH_REQUIRED'?'Sesión iniciada, pero el servidor rechazó el token: reinicia "npm start" para que lea el mismo secreto que PHP (auth/secret.local.php).':'Sesión iniciada, pero no hay servidor multijugador en '+socketURL+'. Ejecuta "npm start" en la carpeta del proyecto.',false));
   so.on('world:init',w=>{log.textContent='';w.players.filter(p=>p.id!==w.selfId).forEach(add);w.history.forEach(line)});
   so.on('player:joined',add);so.on('player:moved',add);so.on('player:left',del);
   /* Historial del chat para todos; el globo solo sobre los DEMAS (en 1ª persona no se dibuja el propio). */
   so.on('chat:message',m=>{line(m);if(m.playerId!==so.id)bubble(m.playerId,m.text)});
   function tick(){
    requestAnimationFrame(tick);
    const now=performance.now(),dt=Math.min((now-lastFrame)/1000,.1);lastFrame=now;
    if(!so||!so.connected)return;
    const p={x:P.x,y:P.y+(window.JUMP?JUMP.h:0),z:P.z,yaw:window.PJ?PJ.bodyYaw:P.yaw};   /* y incluye el salto; yaw = hacia dónde mira tu cuerpo */
    if(window.PJ&&PJ.look)p.look=PJ.look;                              /* género + skin: el servidor lo valida y lo reenvía a los demás */
    if(window.PJ&&PJ.crouching)p.c=1;                                   /* agachado: los demás también te ven agachado */
    const lookKey=(window.PJ?claveAspecto(PJ.look):'')+(p.c?'c':'');
    const diff=last?Math.max(Math.abs(p.x-last.x),Math.abs(p.y-last.y),Math.abs(p.z-last.z),Math.abs(p.yaw-last.yaw)):1;
    const moved=!last||lookKey!==lastLook||Math.abs(p.x-last.x)>.015||Math.abs(p.y-last.y)>.015||Math.abs(p.z-last.z)>.015||Math.abs(p.yaw-last.yaw)>.02;
    /* throttle: como mucho cada 60 ms (~16/s) y solo con cambio real; si quedo un resto sin enviar, un ultimo envio exacto al parar */
    if((moved||diff>0)&&now-lastAt>=(moved?60:150)){so.volatile.emit('player:move',p);last=p;lastLook=lookKey;lastAt=now}
    const k=1-Math.exp(-14*dt);                                        /* lerp suave, igual a cualquier FPS */
    rem.forEach(a=>{const g=a.g;g.position.x+=(a.t.x-g.position.x)*k;g.position.y+=(a.t.y-g.position.y)*k;g.position.z+=(a.t.z-g.position.z)*k;
     g.rotation.y+=Math.atan2(Math.sin(a.t.yaw-g.rotation.y),Math.cos(a.t.yaw-g.rotation.y))*k;
     /* velocidad real entre cuadros (suavizada) → mueve piernas y brazos; un salto de teletransporte no cuenta como correr */
     const inst=Math.min(Math.hypot(g.position.x-a.px,g.position.z-a.pz)/Math.max(dt,.001),8);a.sp+=(inst-a.sp)*(1-Math.exp(-8*dt));a.px=g.position.x;a.pz=g.position.z;
     window.animarAvatar(g,a.sp,dt,0,a.t.c)});
   }
   tick();
  }).catch(()=>setState('Sesión iniciada, pero no se pudo cargar el cliente de Socket.io desde '+socketURL+'. Ejecuta "npm start".',false));
 }
 getSession().then(({status,data:d})=>{
  if(status===401||!d.authenticated){setState('Inicia sesión en una cuenta del visor 3D para poder hablar por el chat.',false);userline.innerHTML=loginLinks;return}
  showAccount(d.username);
  if(/[?&]sesion=ok/.test(location.search)){toast('Sesión iniciada como '+d.username);history.replaceState(null,'',location.pathname+location.hash)}
  if(!d.token){setState('Sesión iniciada como '+d.username+', pero el multijugador no está configurado: '+(d.error||'falta el secreto compartido')+'.',false);return}
  start(d);
 }).catch(()=>{setState('No se pudo consultar la sesión. Abre el visor desde Laragon (http://localhost/...), no con doble clic en index.html.',false);userline.innerHTML=loginLinks});
 panel.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;if(!so||!so.connected){setState('Conéctate al multijugador para enviar.',false);return}so.emit('chat:send',text);input.value='';input.focus()});
 addEventListener('beforeunload',()=>{Array.from(rem.keys()).forEach(del);timers.forEach(t=>clearTimeout(t));if(so)so.disconnect()});
})();
