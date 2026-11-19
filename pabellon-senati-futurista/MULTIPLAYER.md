Multijugador online y autenticacion (Laragon)

1. Importa database.sql en MySQL.
2. Sirve esta carpeta con Apache y PHP 8+ con PDO MySQL. Abre auth/register.php para crear una cuenta.
3. Configura DB_HOST, DB_NAME, DB_USER y DB_PASSWORD si tu Laragon no usa los valores locales por defecto.
4. Secreto compartido PHP/Node: no necesitas configurar nada. La primera vez PHP (o Node) crea auth/secret.local.php con un secreto aleatorio y ambos lo leen de ahi; el archivo esta en .gitignore. Si prefieres variables de entorno, define MULTIPLAYER_SECRET (32+ caracteres) igual en PHP y Node.
5. Ejecuta npm install y npm start en esta carpeta (Socket.io en el puerto 3001). Si el visor se abre desde un dominio de Laragon (localhost, 127.0.0.1 o *.test) el origen se acepta solo; para otro dominio define CLIENT_ORIGIN. Si Node corre en otra direccion, define window.MULTIPLAYER_SOCKET_URL antes de cargar js/multiplayer.js.
6. Despues de iniciar sesion el visor te lleva de vuelta con el aviso "Sesion iniciada como ..." y el panel de chat muestra "Cuenta: <usuario>". Si ves "Sesion iniciada, pero..." el mensaje explica que falta (normalmente ejecutar npm start).

El endpoint auth/session.php responde 401 solo si no hay sesion; con sesion activa siempre entrega username y un token HMAC de corta duracion (el cliente pide uno nuevo en cada reconexion). Node valida el token antes de admitir conexiones. El login usa password_hash/password_verify y registra hora, IP y agente en historial_sesiones. El chat conserva los ultimos 50 mensajes durante la vida del proceso. Los movimientos se emiten como maximo cada 60 ms, solo si cambiaron; jugadores remotos interpolan posiciones.

Abrir index.html directamente conserva el visor original; autenticacion y multijugador requieren Apache/PHP/MySQL y Node.js. En despliegue publico usa HTTPS y configura el origen y el secreto.
