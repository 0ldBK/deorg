<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();

$messages[] = "

<br>
<br>
&raquo; <b style='color: red'>Всем спасибо за проведенные вместе почти 7 лет в проекте! Теперь работа над плагином будет продолжаться без персонажа в Oldbk ))</b></a></b>
<br>
&raquo; <b style='color: #004080'>Сотрудничество с админами Завершено. Спасибо Арху, а так же Сержанту Тарасову и ещё нескольким персам в его лице - (Дэйвину)! Будьте аккуратны в общении, очень много сейчас развелось \"ботов\" администрации! Теперь плагин работает НЕ ОФИЦИАЛЬНО!!!</b>
<br>
&raquo; <b style='color: red'>Доступ к плагину БЕЗ ОГРАНИЧЕНИЙ (не нужен Platinum-аккаунт). По всем вопросам и предложениям обращайтесь ко мне в скайп, найти его не сложно )</b>
<br>
&raquo; <b style='color: red'>Отправьте нашему мультоводу SMS сообщение \"Убирайся\" на номер +7(921)1894975 или в скайп dawincheg в качестве благодарности за работу над плагином :-)</b>
<br>
&raquo; <b style='color: green'>Приглашаем Вас на улицу мастеров пользоваться Массовым Крафтом БЕСПЛАТНО! )) </b>
<br>
&raquo; <b style='color: red'>Добро пожаловать на Улицы! Запуск в 20х ноября! Уже работает <a href=\"http://streets.world/#/forum/section-1?page=1\" target=\"_blank\">ФОРУМ(кликабельно) где Все ваши друзья и где можем общаться с Вами СВОБОДНО!</b>
<br>
";

$message[] = "hello world";

echo json_encode($messages);


?>
