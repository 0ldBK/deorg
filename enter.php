<?php
error_reporting(0);
$file = basename(__FILE__, '.php');
$filename = "base/$file.js";
$modify = filemtime($filename);

header("Content-Type: text/javascript");
//header("Access-Control-Allow-Origin: *");
header("Cache-Control: max-age=84600");
header("Pragma: cache");

header("Last-Modified: ".gmdate("D, d M Y H:i:s  \G\M\T", $modify));
header("Expires: ".gmdate("D, d M Y H:i:s  \G\M\T", ($modify + 86400)));

if(file_exists($filename)) {
	$filename = file_get_contents($filename);
	header("Content-Length: ".strlen($filename));
	echo $filename;
	exit;
}

?>