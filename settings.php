<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
define('MAIN', true);
include "PluginUser.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
//    header("Access-Control-Allow-Credentials: true");
//    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
//} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Access-Control-Allow-Origin: *");
}
#header("Connection: keep-alive");
//error_reporting(E_ALL);
session_start();
date_default_timezone_set('Europe/Moscow');

$uid = isset($_SESSION['uid']) ? $_SESSION['uid'] : ceil($_GET['uid']);
$ip = $_SERVER['REMOTE_ADDR'];
$user = new PluginUser($uid, $ip);

if ($user->invalid) {
    session_destroy();
    die("Access denied");
}

if ($user->blocked()) {
    $_SESSION['access'] = 0;
    die("blocked");
} else {
    $_SESSION['access'] = 1;
    $_SESSION['uid'] = $user->uid;
    $_SESSION['login'] = $user->login;
    $_SESSION['timeleft'] = date('d.m.Y 23:59:59', $user->vip);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if (!$user->complete) {
        $_SESSION['access'] = 1;
        die("console.debug('new user({$user->uid})');");
    }

    exit(0);
}

if (isset($_GET['load'])) {
    $data = (object)json_decode(file_get_contents('php://input'), true);
    $user->updateUser($data);
    $_SESSION['access'] = $user->complete && !$user->blocked();
    $config = $user->getConfig();
    $config->account = 'Platinum';
    echo json_encode($config);
    exit(0);
}

if (isset($_GET['drop'])) {
    echo $user->resetConfig();
    exit(0);
}

if (isset($_GET['save'])) {
    $config = file_get_contents('php://input');
    $user->setConfig($config);
    $user->saveConfig();
    exit(0);
}

die('?');
