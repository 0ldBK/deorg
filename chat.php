<?php
error_reporting(0);
session_start();
if(!isset($_SESSION['access']) || $_SESSION['access'] < 1) {
	die("noauth");
}

include("show.php");

show(basename(__FILE__, '.php'));

?>