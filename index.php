<?php
error_reporting(0);
session_start();
if($_GET['!u']) {
	$_SESSION['url'] = $_GET['!u'];
	$url = $_SESSION['url'];
} else if($_GET['!f']) {
    $url = $_SESSION['url']."/".$_GET['!f'];
} else {
	$out = array();
	foreach($_GET as $k => $v) {
		$out[] = "$k=$v";
	}
	$url = $_SESSION['url']."?".implode('&',$out);
}

echo "$url<br>";
$data = file_get_contents($url);

$data = preg_replace("#(/video[0-9]+)#i", "/plugin/?!f=$1", $data);
$data = preg_replace("#(/\?k=)#i", "/plugin$1", $data);
$data = preg_replace("#(action=\"/\")#i", "action=\"/plugin/\"", $data);
echo $data;
?>