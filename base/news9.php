<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();

$messages[] = "

<br>
&raquo; <b style='color: red'>Отправляйте, нашему главному балаболу ОЛДБК - Дэйвину, SMS сообщение \"Убирайся\" на номер +7(921)1894975 в качестве благодарности за работу над плагином :-)  Такой проект УГРОБИТЬ - НУЖНО УМЕТЬ. Спасибо тебе, Дэйвин, Бро.</b>
<br>
&raquo; <b style='color: red'>Внимание:</b> <b style='color: blue'>Рекомендуем переустановить плагин по <a href=\"http://134.17.25.92/plug/\" target=\"_blank\">ссылке(кликабельно)</a> Мы постоянно работаем, чтобы Вам было комфортно! Актуальная версия 2.0.3</b>
<br>
&raquo; <b style='color: green'>В плагине запущена <b style='color: red'>АВТОКАПЧА</b> - Смотрите настройки, Обновлен список быстрых переходов по клубу, Добавлен Крафт БЕЗ платины!!! :) Не забываем чистить КЭШ: (ctrl+Shift+Del ставим птичку кэш, выбираем за всё время и жмём очистить) </b>
<br>
&raquo; <b style='color: blue'>Понравился плагин? - <a href=\"https://chrome.google.com/webstore/detail/sage-oldbk-extension/mnngpobocddmcicpnogaiheecpglnmjb?hl=ru\" target=\"_blank\">оцените его в Google магазине!(кликабельно)</a> Спасибо.</b>
<br>
&raquo; <b style='color: blue'>Приглашаю Вас в новый проект Тринити - Улицы! Запуск 29го ноября! Уже работает <a href=\"http://streets.world/#/forum/section-1?page=1\" target=\"_blank\">ФОРУМ(кликабельно)</a> где уже Все ваши друзья и где можем общаться с Вами СВОБОДНО!</b>
<br>
&raquo; <b style='color: red'><a href=\"http://fight-club.ml/puppetmaster/\" target=\"_blank\">Последние ОлдБК НОВОСТИ !!! (кликабельно)</a></b>
<br>
";

$message[] = "hello world";

echo json_encode($messages);


?>
