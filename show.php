<?php
//error_reporting(E_ALL);
//session_start();
date_default_timezone_set( 'Europe/Moscow' );
if(isset($_SESSION['uid']) > 0) {
    $uid = (int) $_SESSION['uid'];
    $bid = isset($_GET['bid']) ? (int) $_GET['bid'] : '';
    $uip = $_SERVER['REMOTE_ADDR'];
    $_SESSION['lastuse'] = time();

    define('MAIN', 1);

    include "PluginUser.php";
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

function show($file) {
	if($_SESSION['access'] < 1) die('bad user');

	if($_SESSION['access'] == 2) {
		$filename = "dev/$file.js";
	} else {
		$filename = "modules/$file.js";
	}

	header("Content-Type: text/javascript");
//	header("Access-Control-Allow-Origin: *");
	header("Cache-Control: max-age=1800");
	header("Pragma: cache");

	if(file_exists($filename)) {
		$modify = filemtime($filename);
		header("Last-Modified: ".gmdate("D, d M Y H:i:s  \G\M\T", $modify));
		header("Expires: ".gmdate("D, d M Y H:i:s  \G\M\T", ($modify + 86400)));

		$filename = file_get_contents($filename);
//                $filename = mb_convert_encoding($filename, 'cp1251');
		$filedata = $filename;
//($_SESSION['access'] == 2?$filename:"eval(b6d('".base64_encode($filename)."'));");
		header("Content-Length: ".strlen($filedata));
		echo $filedata;
	}

	die();

}

?>
