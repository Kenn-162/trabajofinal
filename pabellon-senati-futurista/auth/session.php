<?php
require __DIR__.'/config.php';
header('Content-Type: application/json');
header('Cache-Control: no-store');

/* 401 = de verdad no hay sesion iniciada. */
if (empty($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['authenticated' => false]);
    exit;
}

/* Con sesion iniciada SIEMPRE se responde 200 con el username, aunque falle el token del multijugador:
   asi el visor puede mostrar "Cuenta: ..." y explicar el problema real en lugar de pedir login otra vez. */
$out = ['authenticated' => true, 'username' => $_SESSION['username'], 'token' => null];

$secretError = null;
$key = multiplayer_secret($secretError);
if ($key === null) {
    $out['error'] = $secretError;
} else {
    $b64 = fn($raw) => rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    $payload = $b64(json_encode(['username' => $_SESSION['username'], 'exp' => time() + 300]));
    $out['token'] = $payload . '.' . $b64(hash_hmac('sha256', $payload, $key, true));
}
echo json_encode($out);
