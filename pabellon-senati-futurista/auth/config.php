<?php
if(session_status()!==PHP_SESSION_ACTIVE){session_set_cookie_params(['httponly'=>true,'samesite'=>'Lax','path'=>'/']);session_start();}
function db(){static $p=null;if(!$p)$p=new PDO('mysql:host='.(getenv('DB_HOST')?:'127.0.0.1').';dbname='.(getenv('DB_NAME')?:'senati_multijugador').';charset=utf8mb4',getenv('DB_USER')?:'root',getenv('DB_PASSWORD')?:'', [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);return $p;}
function csrf(){if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32));return $_SESSION['csrf'];}
function formpage($t){echo '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#07101f;color:white;font:16px Arial;display:grid;place-items:center;min-height:90vh}.box{background:#142238;padding:28px;border-radius:12px;width:min(360px,90vw)}input{box-sizing:border-box;width:100%;padding:12px;margin:8px 0;background:#07101f;color:white}button{padding:12px;background:#f5b700}</style><main class="box"><h1>'.$t.'</h1>';}

/* Secreto compartido con Node. Orden: variable de entorno MULTIPLAYER_SECRET, luego auth/secret.local.php
   (se crea solo la primera vez; Node lo lee del mismo archivo, asi no hay que configurar nada en Laragon). */
function multiplayer_secret(&$error=null){
 $env=getenv('MULTIPLAYER_SECRET');
 if($env!==false&&strlen($env)>=32)return $env;
 $file=__DIR__.'/secret.local.php';
 if(!is_file($file)){
  $new=bin2hex(random_bytes(32));
  $fh=@fopen($file,'x');
  if($fh){fwrite($fh,"<?php return '".$new."';\n");fclose($fh);}
 }
 if(is_file($file)){$s=@include $file;if(is_string($s)&&strlen($s)>=32)return $s;}
 $error='no se pudo leer ni crear auth/secret.local.php (revisa permisos de escritura en la carpeta auth)';
 return null;
}
