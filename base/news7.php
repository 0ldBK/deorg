<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();

$messages[] = "

<br>
&raquo; <b style='color: blue'>Совершенно БЕСПЛАТНЫЙ плагин от Sage и очень хорошей компании :) Мы лучшие! :)</b>
<br>
&raquo; <b style='color: red'>Отправляйте, нашему главному балаболу ОЛДБК - Дэйвину, SMS сообщение \"Убирайся\" на номер +7(921)1894975 в качестве благодарности за работу над плагином :-)</b>
<br>
<br>
&raquo; <b style='color: blue'>Приглашаю Вас в новый проект Тринити - Улицы! Запуск в 20х ноября! Уже работает <a href=\"http://streets.world/#/forum/section-1?page=1\" target=\"_blank\">ФОРУМ(кликабельно)</a> где уже Все ваши друзья и где можем общаться с Вами СВОБОДНО!</b>
<br>
<br>
&raquo; <b style='color: red'>Внимание:</b> <b style='color: blue'>Рекомендуем переустановить плагин по <a href=\"http://134.17.25.92/plug/\" target=\"_blank\">ссылке(кликабельно)</a> Мы постоянно работаем, чтобы Вам было комфортно! Актуальная версия 2.0.2</b>
<br>
&raquo; <b style='color: green'>В плагине запущена <b style='color: red'>АВТОКАПЧА</b> - Смотрите настройки, Обновлен список быстрых переходов по клубу, Добавлен Крафт БЕЗ платины!!! :) Не забываем чистить КЭШ: (ctrl+Shift+Del ставим птичку кэш, выбираем за всё время и жмём очистить) </b>
<br>
&raquo; <b style='color: blue'>Понравился плагин? - <a href=\"https://chrome.google.com/webstore/detail/sage-oldbk-extension/mnngpobocddmcicpnogaiheecpglnmjb?hl=ru\" target=\"_blank\">оцените его в Google магазине!(кликабельно)</a> Спасибо.</b>
<br>

";

$message[] = "hello world";

echo json_encode($messages);


?>
