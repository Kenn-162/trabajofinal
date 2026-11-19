Multijugador online y autenticacion (Laragon)

1. Importa database.sql en MySQL.
2. Sirve esta carpeta con Apache y PHP 8+ con PDO MySQL. Abre auth/register.php para crear una cuenta.
3. Configura DB_HOST, DB_NAME, DB_USER y DB_PASSWORD si tu Laragon no usa los valores locales por defecto.
4. Define MULTIPLAYER_SECRET como un secreto aleatorio de al menos 32 caracteres en el entorno de PHP y Node.js, igual en ambos. No lo guardes en Git.
5. Ejecuta npm install y npm start en esta carpeta. Socket.io escucha en puerto 3001. Ajusta CLIENT_ORIGIN al origen del visor.

El endpoint auth/session.php solo entrega username con sesion activa y firma token HMAC de corta duracion. Node valida el token antes de admitir conexiones. El login usa password_hash/password_verify y registra hora, IP y agente en historial_sesiones. El chat conserva los ultimos 50 mensajes durante la vida del proceso. Los movimientos se emiten como maximo cada 60 ms, solo si cambiaron; jugadores remotos interpolan posiciones.

Abrir index.html directamente conserva el visor original; autenticacion y multijugador requieren Apache/PHP/MySQL y Node.js. En despliegue publico usa HTTPS y configura el origen y el secreto.
