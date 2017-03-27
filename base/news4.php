<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();

$messages[] = "

<br>
&raquo; <b style='color: #004080'>Будьте внимательны и аккуратны в общении, очень много сейчас развелось \"ботов\" администрации!</b>
<br>
&raquo; <b style='color: blue'>Функционал плагина не требует Platinum и работает БЕЗ ОГРАНИЧЕНИЙ. Функционал плагина постоянно пополняется! По всем вопросам и предложениям обращайтесь ко мне в скайп, найти его не сложно )</b>
<br>
&raquo; <b style='color: red'>Отправляйте, нашему главному балаболу ОЛДБК - Дэйвину, SMS сообщение \"Убирайся\" на номер +7(921)1894975 в качестве благодарности за работу над плагином :-)</b>
<br>
&raquo; <b style='color: green'>Приглашаем Вас на улицу мастеров пользоваться Массовым Крафтом БЕЗ платины!!! )) </b>
<br>
&raquo; <b style='color: blue'>Приглашаю Вас в новый проект Тринити - Улицы! Запуск в 20х ноября! Уже работает <a href=\"http://streets.world/#/forum/section-1?page=1\" target=\"_blank\">ФОРУМ(кликабельно)</a> где уже Все ваши друзья и где можем общаться с Вами СВОБОДНО!</b>
<br>
&raquo; <b style='color: red'>Внимание:</b> <b style='color: blue'>Рекомендуем переустановить плагин по <a href=\"http://134.17.25.92/plug/\" target=\"_blank\">ссылке(кликабельно)</a> Мы постоянно работаем, чтобы Вам было комфортно!</b>
<br>
";

$message[] = "hello world";

echo json_encode($messages);


?>
