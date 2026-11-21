Multijugador online y autenticacion (Laragon)

1. Importa database.sql en MySQL.
2. Sirve esta carpeta con Apache y PHP 8+ con PDO MySQL. Abre auth/register.php para crear una cuenta.
3. Configura DB_HOST, DB_NAME, DB_USER y DB_PASSWORD si tu Laragon no usa los valores locales por defecto.
4. Secreto compartido PHP/Node: no necesitas configurar nada. La primera vez PHP (o Node) crea auth/secret.local.php con un secreto aleatorio y ambos lo leen de ahi; el archivo esta en .gitignore. Si prefieres variables de entorno, define MULTIPLAYER_SECRET (32+ caracteres) igual en PHP y Node.
5. Ejecuta npm install y npm start en esta carpeta (Socket.io en el puerto 3001). Si el visor se abre desde un dominio de Laragon (localhost, 127.0.0.1 o *.test) el origen se acepta solo; para otro dominio define CLIENT_ORIGIN. Si Node corre en otra direccion, define window.MULTIPLAYER_SOCKET_URL antes de cargar js/multiplayer.js.
6. Despues de iniciar sesion el visor te lleva de vuelta con el aviso "Sesion iniciada como ..." y el panel de chat muestra "Cuenta: <usuario>". Si ves "Sesion iniciada, pero..." el mensaje explica que falta (normalmente ejecutar npm start).

El endpoint auth/session.php responde 401 solo si no hay sesion; con sesion activa siempre entrega username y un token HMAC de corta duracion (el cliente pide uno nuevo en cada reconexion). Node valida el token antes de admitir conexiones. El login usa password_hash/password_verify y registra hora, IP y agente en historial_sesiones. El chat conserva los ultimos 50 mensajes durante la vida del proceso. Los movimientos se emiten como maximo cada 60 ms, solo si cambiaron; jugadores remotos interpolan posiciones.

Abrir index.html directamente conserva el visor original; autenticacion y multijugador requieren Apache/PHP/MySQL y Node.js. En despliegue publico usa HTTPS y configura el origen y el secreto.

Salto y globos de chat
- Espacio salta (solo en el modo Recorrer y nunca mientras escribes en el chat). La logica esta en js/salto.js: impulso vertical + gravedad (~0.75 m) y solo se puede saltar desde el suelo. P.y sigue siendo la altura del suelo que calcula la navegacion; el salto es un desfase JUMP.h que se suma a la camara. En pantallas tactiles aparece un boton "Saltar".
- La posicion vertical enviada a los demas es y = suelo + salto, dentro del mismo envio limitado a ~16 por segundo y solo con cambios reales (al aterrizar se manda una ultima posicion exacta).
- El globo de texto se dibuja unicamente sobre los OTROS jugadores (6 s, y se reinicia si escriben otro mensaje). Tu propio mensaje aparece solo en el historial del chat global.
- El servidor limita ~25 movimientos/s y ~2 mensajes/s por jugador y acota las coordenadas.

## Aspecto del personaje
Cada `player:move` puede incluir `look: {f, o, t, h}` (género 0-1, skin 0-5, piel 0-3, cabello 0-5). El servidor lo valida (solo enteros en rango) y lo reenvía en `player:moved` / `player:joined` / `world:init`. Sin `look`, el cliente usa un aspecto por defecto derivado del nombre de usuario.

`player:move` también puede incluir `c: 1` cuando el jugador está agachado; el servidor lo reenvía tal cual (`player.c`).
