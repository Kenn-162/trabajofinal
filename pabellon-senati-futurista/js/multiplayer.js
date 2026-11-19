/* Capa multijugador aditiva; los controles de movimiento ignoran campos editables. */
(()=>{
 const panel=document.createElement('section');
 panel.id='mp';
 panel.innerHTML='<b>CHAT GLOBAL</b><div id="mplog" aria-live="polite"></div><div id="mpstatus">Inicia sesión para habilitar el chat.</div><form><input maxlength="240" placeholder="Escribe un mensaje..." autocomplete="off" disabled><button type="submit" disabled>Enviar</button></form><p id="mpuser"></p>';
 document.body.append(panel);
 const css=document.createElement('style');
 css.textContent='#mp{position:fixed;right:16px;bottom:16px;z-index:30;width:290px;height:290px;background:#081321ed;color:white;border:1px solid #456;border-radius:10px;padding:10px;font:13px Arial;display:flex;flex-direction:column}#mplog{overflow:auto;flex:1;margin:8px 0}#mpstatus{font-size:12px;color:#ffd56b;margin-bottom:6px}#mp form{display:flex;gap:5px}#mp input{min-width:0;flex:1;padding:8px}#mp button{padding:6px 10px}#mpuser{margin:6px 0 0}#mpuser a{color:#59d8ff}.mpbubble{position:absolute;background:#081321e8;color:white;padding:6px 10px;border:1px solid #9bdfff;border-radius:10px;white-space:normal;max-width:180px}.mplabel{font:bold 14px Arial;color:white;text-shadow:0 1px 4px black}';
 document.head.append(css);
 const log=document.querySelector('#mplog'),status=document.querySelector('#mpstatus'),input=panel.querySelector('input'),send=panel.querySelector('button'),userline=document.querySelector('#mpuser');
 let so=null,last=null,lastAt=0,localBubble=null,localTimer=null;
 const rem=new Map(),bubs=new Map(),timers=new Map();
 function setState(message,connected){status.textContent=message;input.disabled=!connected;send.disabled=!connected}
 function line(m){const d=document.createElement('div'),b=document.createElement('b'),t=document.createElement('span');b.textContent=m.username+': ';t.textContent=m.text;d.append(b,t);log.append(d);while(log.children.length>50)log.firstChild.remove();log.scrollTop=log.scrollHeight}
 function sprite(txt){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='rgba(5,12,24,.86)';x.fillRect(0,0,512,128);x.fillStyle='white';x.textAlign='center';x.font='bold 32px Arial';x.fillText(txt.slice(0,32),256,70);const tex=new THREE.CanvasTexture(c);return new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}))}
 function add(p){let a=rem.get(p.id);if(!a){const g=new THREE.Group(),body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,1,12),new THREE.MeshStandardMaterial({color:0x2d6cdf})),head=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),new THREE.MeshStandardMaterial({color:0xe9bd93}));body.position.y=.85;head.position.y=1.55;g.add(body,head);const n=sprite(p.username);n.scale.set(2.4,.6,1);n.position.y=2.08;g.add(n);scene.add(g);a={g,t:{}};rem.set(p.id,a)}Object.assign(a.t,{x:p.x,y:p.y,z:p.z,yaw:p.yaw})}
 function del(id){const a=rem.get(id);if(a){scene.remove(a.g);a.g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose()}});rem.delete(id)}const b=bubs.get(id);if(b){if(b.parent)b.parent.remove(b);b.material.map.dispose();b.material.dispose();bubs.delete(id)}clearTimeout(timers.get(id));timers.delete(id)}
 function bubble(id,txt){const a=rem.get(id);if(!a)return;const old=bubs.get(id);if(old){a.g.remove(old);old.material.map.dispose();old.material.dispose()}const b=sprite(txt);b.scale.set(2.3,.6,1);b.position.y=2.75;a.g.add(b);bubs.set(id,b);clearTimeout(timers.get(id));timers.set(id,setTimeout(()=>{if(bubs.get(id)===b){a.g.remove(b);b.material.map.dispose();b.material.dispose();bubs.delete(id);timers.delete(id)}},6000))}
 function showLocal(txt){if(localBubble)localBubble.remove();const el=document.createElement('div');el.className='mpbubble';el.textContent=txt;el.style.cssText='position:fixed;left:50%;top:calc(50% - 100px);transform:translateX(-50%);z-index:29';document.body.append(el);localBubble=el;clearTimeout(localTimer);localTimer=setTimeout(()=>{el.remove();if(localBubble===el)localBubble=null},6000)}
 fetch('auth/session.php',{credentials:'same-origin',cache:'no-store'}).then(r=>{if(!r.ok)throw Error('AUTH');return r.json()}).then(d=>{
  userline.textContent='Cuenta: '+d.username+' ';
  const logout=document.createElement('a');logout.href='auth/logout.php';logout.textContent='Salir';userline.append(logout);
  setState('Conectando al servidor multijugador...',false);
  so=io(window.MULTIPLAYER_SOCKET_URL||'http://localhost:3001',{auth:{token:d.token}});
  so.on('connect',()=>setState('Conectado: '+d.username,true));
  so.on('disconnect',()=>setState('Conexión perdida. Reconectando...',false));
  so.on('connect_error',e=>setState(e.message==='AUTH_REQUIRED'?'La sesión venció. Inicia sesión otra vez.':'Servidor multijugador no disponible.',false));
  so.on('world:init',w=>{w.players.filter(p=>p.id!==w.selfId).forEach(add);w.history.forEach(line)});
  so.on('player:joined',add);so.on('player:moved',add);so.on('player:left',del);
  so.on('chat:message',m=>{line(m);if(m.username===d.username)showLocal(m.text);else bubble(m.playerId,m.text)});
  function tick(){if(so&&so.connected){const now=performance.now(),p={x:P.x,y:P.y,z:P.z,yaw:P.yaw},moved=!last||Math.abs(p.x-last.x)>.015||Math.abs(p.y-last.y)>.015||Math.abs(p.z-last.z)>.015||Math.abs(p.yaw-last.yaw)>.02;if(moved&&now-lastAt>=60){so.volatile.emit('player:move',p);last=p;lastAt=now}rem.forEach(a=>{a.g.position.x+=(a.t.x-a.g.position.x)*.22;a.g.position.y+=(a.t.y-a.g.position.y)*.22;a.g.position.z+=(a.t.z-a.g.position.z)*.22;const q=Math.atan2(Math.sin(a.t.yaw-a.g.rotation.y),Math.cos(a.t.yaw-a.g.rotation.y));a.g.rotation.y+=q*.22})}requestAnimationFrame(tick)}tick();
 }).catch(()=>{setState('Inicia sesión o crea una cuenta para enviar mensajes.',false);userline.innerHTML='<a href="auth/login.php">Iniciar sesión</a> · <a href="auth/register.php">Crear cuenta</a>'});
 panel.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;if(!so||!so.connected){setState('Conéctate al multijugador para enviar.',false);return}so.emit('chat:send',text);input.value='';input.focus()});
 addEventListener('beforeunload',()=>{Array.from(rem.keys()).forEach(del);timers.forEach(t=>clearTimeout(t));clearTimeout(localTimer);if(so)so.disconnect()});
})();