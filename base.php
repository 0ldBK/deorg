<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start();

if(!isset($_SESSION['access'])) {
	die("
		var newDiv = document.createElement('div');
		newDiv.setAttribute('id', 'noauth');
		newDiv.setAttribute('style', 'display: block');
		newDiv.innerHTML = '<div>".$_SESSION['login']." (".$_SESSION['uid']."|".$_SESSION['access'].") <br> Не удалось проверить подлинность персонажа попробуйте обновить страницу.</div>';
		newDiv.onclick = function(elem) {
			var id = elem.target.getAttribute ? elem.target.getAttribute('id') : false;
			if(id == 'noauth') this.remove();
		}
		document.head.parentNode.appendChild(newDiv);
	");
}
if($_SESSION['access'] < 1) {
	die("
		var newDiv = document.createElement('div');
		newDiv.setAttribute('id', 'noauth');
		newDiv.setAttribute('style', 'display: block');
		newDiv.innerHTML = '<div>Для активации доступа к плагину пишите в скайп serg.mikhailovsky</div>';
		newDiv.onclick = function(elem) {
			var id = elem.target.getAttribute ? elem.target.getAttribute('id') : false;
			if(id == 'noauth') this.remove();
		}
		document.head.parentNode.appendChild(newDiv);
	");
}

include("show.php");

show(basename(__FILE__, '.php'));

?>
