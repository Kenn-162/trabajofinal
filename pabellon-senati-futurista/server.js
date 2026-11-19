const http=require('http'),crypto=require('crypto'),express=require('express'),{Server}=require('socket.io');
const secret=process.env.MULTIPLAYER_SECRET||'';if(secret.length<32)throw Error('Set MULTIPLAYER_SECRET (32 chars) in PHP and Node');
const io=new Server(http.createServer(express()),{cors:{origin:(process.env.CLIENT_ORIGIN||'http://localhost').split(',')}});
const players=new Map(),history=[];
function auth(t){if(typeof t!=='string')return null;const [p,s]=t.split('.');if(!p||!s)return null;const a=crypto.createHmac('sha256',secret).update(p).digest(),b=Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'),'base64');if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;try{const d=JSON.parse(Buffer.from(p.replace(/-/g,'+').replace(/_/g,'/'),'base64'));return d.exp>Date.now()/1000?d.username:null}catch{return null}}
io.use((s,n)=>{s.data.username=auth(s.handshake.auth.token);n(s.data.username?undefined:Error('AUTH_REQUIRED'))});
io.on('connection',s=>{const p={id:s.id,username:s.data.username,x:1.2,y:0,z:0,yaw:-Math.PI/2};players.set(s.id,p);s.emit('world:init',{selfId:s.id,players:[...players.values()],history:history.slice(-50)});s.broadcast.emit('player:joined',p);
s.on('player:move',v=>{if(!v||![v.x,v.y,v.z,v.yaw].every(Number.isFinite))return;Object.assign(p,v);s.broadcast.volatile.emit('player:moved',p)});
s.on('chat:send',raw=>{if(typeof raw!=='string'||!raw.trim())return;const m={id:crypto.randomUUID(),username:p.username,text:raw.trim().slice(0,240),playerId:s.id};history.push(m);if(history.length>50)history.shift();io.emit('chat:message',m)});
s.on('disconnect',()=>{players.delete(s.id);s.broadcast.emit('player:left',s.id)})});
io.listen(Number(process.env.PORT)||3001,'0.0.0.0');