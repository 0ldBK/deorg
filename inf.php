<?php
error_reporting(0);
session_start();

include("show.php");

$file = basename(__FILE__, '.php');

show($file, $_SESSION['access'], $_SESSION['vip']);

?>