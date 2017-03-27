<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();

$messages[] = "

<br>
&raquo; <b style='color: red'>Внимание:</b> <b style='color: blue'>Установить плагин под разные версии браузеров можно по <a href=\"http://134.17.25.92/plug/\" target=\"_blank\">ссылке(кликабельно)</a> Мы постоянно работаем, чтобы Вам было комфортно! Актуальная версия 2.0.3</b>
<br>
";

$message[] = "hello world";

echo json_encode($messages);


?>
