<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();


if($_SESSION['access'] < 1) die('{"err":"Только для пользователей плагина"}');

if($_GET['id'] > 0) {
	$id = $_GET['id'];
} elseif(preg_match('#log=([0-9]+)#i', $_GET['id'], $match)) {
	$id = $match[1];
}
if(!$id) die('{"err":"введите корректный лог боя"}');

if(strlen($_GET['login']) > 3 && strlen($_GET['login']) < 30) {
	$login = $_GET['login'];
} else {	die('{"err":"введите корректный логин"}');
}


$logdata = file_get_contents("http://capitalcity.oldbk.com/logs.php?page=0&log=$id");
$logdata = mb_convert_encoding($logdata, "utf-8", "cp-1251");

if(strpos($logdata, "value='".$id."'") > 0) {
	if(preg_match_all("#<B><i>([^<]+)</i></B>.+?<a href=inf.php\?([0-9]+)#i", $logdata, $matches)) {		$invlist = $matches[2];

		$uexists = file_get_contents("http://capitalcity.oldbk.com/logs.php?page=0&log=$id&flogin=$login");
		if(strpos($uexists, "class=date") > 0) {			$out = array('login' => $login, 'exists' => true);
			foreach($invlist as $i => $iid) {
				$out['id'][$iid] = true;
			}
			echo json_encode($out);
		} else {			$out = array('login' => $login, 'exists' => false);
			foreach($invlist as $i => $iid) {
				$out['id'][$iid] = true;
			}
			echo json_encode($out);
		}
	} else die('{"err":"В логе нет невидимок"}');} else die('{"err":"Некорректный лог боя или он еще идет"}');

?>
