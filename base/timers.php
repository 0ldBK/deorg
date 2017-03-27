<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
//    header("Access-Co ntrol-Allow-Credentials: true");
    header("Access-Control-Allow-Origin: *");
}
header("Connection: keep-alive");
date_default_timezone_set( 'Europe/Moscow' );
define('MAIN', true);
session_start();
print_r($_SESSION);
file_put_contents("sess.txt", json_encode((object)[
	'session' => (object)$_SESSION,
	'get' => (object)$_GET
]));

if(isset($_SESSION['uid']) > 0) {
    $uid = (int) $_SESSION['uid'];
    $bid = isset($_GET['bid']) ? (int) $_GET['bid'] : '';
    $uip = $_SERVER['REMOTE_ADDR'];
    $_SESSION['lastuse'] = time();

    include "../PluginUser.php";
    $user = new PluginUser($uid, $uip);
    $user->updateUser((object)[
    	'bid' => $bid,
		'lastuse' => $_SESSION['lastuse']
	]);

    if ($user->blocked()) {
    	$_SESSION['access'] = 0;
    	die("blocked");
	}
}

die();
