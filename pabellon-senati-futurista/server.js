const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const { Server } = require('socket.io');

/* Secreto compartido con PHP: variable de entorno o el archivo auth/secret.local.php
   (lo crea PHP o, si no existe todavia, este servidor). Debe ser el mismo en ambos lados. */
function loadSecret() {
  const env = process.env.MULTIPLAYER_SECRET || '';
  if (env.length >= 32) return env;
  const file = path.join(__dirname, 'auth', 'secret.local.php');
  const read = () => {
    try {
      const m = /return\s+'([^']{32,})'/.exec(fs.readFileSync(file, 'utf8'));
      return m ? m[1] : null;
    } catch { return null; }
  };
  let secret = read();
  if (secret) return secret;
  try {
    fs.writeFileSync(file, "<?php return '" + crypto.randomBytes(32).toString('hex') + "';\n", { flag: 'wx' });
  } catch { /* otro proceso pudo crearlo primero */ }
  secret = read();
  if (secret) return secret;
  throw Error('No se pudo leer ni crear auth/secret.local.php. Define MULTIPLAYER_SECRET (32+ caracteres) igual en PHP y Node.');
}
const secret = loadSecret();

/* CORS: CLIENT_ORIGIN (lista separada por comas) si se define; si no, se aceptan los origenes locales
   tipicos de Laragon (localhost, 127.0.0.1 y dominios *.test / *.local en cualquier puerto). */
const allowed = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const localOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|[\w-]+\.(test|local|localhost))(:\d+)?$/i;
const originOk = o => !o || allowed.includes(o) || (!allowed.length && localOrigin.test(o));

const httpServer = http.createServer(express());
const io = new Server(httpServer, { cors: { origin: (o, cb) => cb(null, originOk(o)) } });
const players = new Map();
const history = [];

function b64urlDecode(s) {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

/* Valida el token HMAC que emite auth/session.php y devuelve el username (o null). */
function auth(token) {
  if (typeof token !== 'string') return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  const given = b64urlDecode(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(b64urlDecode(payload).toString('utf8'));
    return data.exp > Date.now() / 1000 ? data.username : null;
  } catch { return null; }
}

io.use((socket, next) => {
  socket.data.username = auth(socket.handshake.auth && socket.handshake.auth.token);
  next(socket.data.username ? undefined : Error('AUTH_REQUIRED'));
});

io.on('connection', socket => {
  const player = { id: socket.id, username: socket.data.username, x: 1.2, y: 0, z: 0, yaw: -Math.PI / 2 };
  players.set(socket.id, player);
  socket.emit('world:init', { selfId: socket.id, players: [...players.values()], history: history.slice(-50) });
  socket.broadcast.emit('player:joined', player);

  /* Anti-saturacion: maximo ~25 movimientos/s por jugador y valores acotados al mapa
     (y = suelo 0 / piso 2 en 3 m + salto, de ahi el limite). */
  let lastMove = 0, lastChat = 0;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  /* Aspecto del personaje {f genero 0-1, o skin 0-5, t piel 0-3, h cabello 0-5}: solo enteros dentro de rango. */
  const int = (n, max) => (Number.isInteger(n) && n >= 0 && n <= max ? n : 0);
  const cleanLook = l => (l && typeof l === 'object' ? { f: int(l.f, 1), o: int(l.o, 5), t: int(l.t, 3), h: int(l.h, 5) } : undefined);
  socket.on('player:move', v => {
    if (!v || ![v.x, v.y, v.z, v.yaw].every(Number.isFinite)) return;
    const now = Date.now();
    if (now - lastMove < 40) return;
    lastMove = now;
    const look = cleanLook(v.look);
    if (look) player.look = look;
    player.c = v.c ? 1 : 0;                                  // agachado
    Object.assign(player, { x: clamp(v.x, -200, 200), y: clamp(v.y, -1, 6), z: clamp(v.z, -200, 200), yaw: v.yaw % (Math.PI * 2) });
    socket.broadcast.volatile.emit('player:moved', player);
  });

  socket.on('chat:send', raw => {
    if (typeof raw !== 'string' || !raw.trim()) return;
    const now = Date.now();
    if (now - lastChat < 400) return;   /* maximo ~2 mensajes/s por jugador */
    lastChat = now;
    const msg = { id: crypto.randomUUID(), username: player.username, text: raw.trim().slice(0, 240), playerId: socket.id };
    history.push(msg);
    if (history.length > 50) history.shift();
    io.emit('chat:message', msg);
  });

  socket.on('disconnect', () => {
    players.delete(socket.id);
    socket.broadcast.emit('player:left', socket.id);
  });
});

const port = Number(process.env.PORT) || 3001;
httpServer.listen(port, '0.0.0.0', () => console.log('Multijugador SENATI escuchando en el puerto ' + port));
