<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();

$messages[] = "
<b style='color: #0080C0; font-size: 16px;'>Аккаунт активен до: ".$_SESSION['timeleft']."</b>
<br>
&raquo; <b style='color: green'>В плагине запущена <b style='color: red'>АНТИКАПЧА</b> - Смотрите настройки, Обновлен список быстрых переходов по клубу :) Не забываем чистить КЭШ: (ctrl+Shift+Del ставим птичку кэш, выбираем за всё время и жмём очистить) </b>
<br>
&raquo; <b style='color: red'>Внимание, Акция! - Приведи друга и получи 7 дополнительных дней плагина совершенно БЕСПЛАТНО!</b>
<br>
<br>

";

echo json_encode($messages);


?>
