<?php
error_reporting(0);
session_start();
if(!isset($_SESSION['access']) || $_SESSION['access'] < 1) {
	die("console.error('noauth')");
}

include("show.php");

show('online');

?>