<?php
error_reporting(0);
session_start();
if(!isset($_SESSION['access']) || $_SESSION['access'] < 1) {	die('Только для пользователей плагина.');
}

echo "
<style>
	input[type=number] {		width: 150px;
		font-size: 12px;
		text-align: center;
	}
	input[type=submit] {
		width: 150px;
		font-size: 12px;
		text-align: center;
	}
	label {		cursor: pointer;
	}


</style>
<form onsubmit='return false;' id='runner' name='runner' method=post>
	<input name='period' type='number' value='300'> Введите частоту переходов в мс (1 секунда = 1000мс, минимум 300)
	<br>
	<label><input name='1' type='checkbox' value=1 checked> Комната для новичков 1</label>
	<label><input name='2' type='checkbox' value=1 checked> Комната для новичков 2</label>
	<label><input name='3' type='checkbox' value=1 checked> Комната для новичков 3</label>
	<label><input name='4' type='checkbox' value=1 checked> Комната для новичков 4</label>
	<br>
	<label><input name='5' type='checkbox' value=1 checked> Зал воинов 1</label>
	<label><input name='6' type='checkbox' value=1 checked> Зал воинов 2</label>
	<label><input name='7' type='checkbox' value=1 checked> Зал воинов 3</label>
	<label><input name='8' type='checkbox' value=1 checked> Торговый зал</label>
	<br>
	<label><input name='9' type='checkbox' value=1 checked> Рыцарский зал</label>
	<label><input name='10' type='checkbox' value=1 checked> Башня рыцарей-магов</label>
	<label><input name='11' type='checkbox' value=1> Колдовской мир</label>
	<label><input name='12' type='checkbox' value=1> Этаж духов</label>
	<label><input name='57' type='checkbox' value=1 checked> Зал Клановых Войн</label>

	<input type='button' value='Пабижали!' id='action' onclick='run();'>
</form>
<div id='status'></div>
<iframe name='obk' id='obk' src='http://capitalcity.oldbk.com/main.php' style='width: 100%; height: 500px; overflow: hidden; display: none;'></iframe>

<script>
var active = false, Runner = false, step = 0, rooms = [], time = 300;
function run() {	if(active) {		active = false		document.getElementById('action').value = 'Пабижали!';
	return;
	}
	document.getElementById('action').value = 'Бежыыыым!';
	active = true;	var form = document.forms['runner'];
	var i = 0;
	rooms = [], time = 300;
	for (i = form.elements.length - 1; i >= 0; i--) {		if(form.elements[i].type == 'checkbox') {			if (form.elements[i].checked) {
            	rooms.push(form.elements[i].getAttribute('name'));
			}
			continue;
		}
		if(form.elements[i].type == 'number') {
			time = form.elements[i].value > 300 ? form.elements[i].value : 300;
		}
	}
	console.debug(rooms);
	console.debug(time);
    goto();
}
function goto() {	if(!active) return false;
    console.debug(step);
	var newroom = Math.ceil(Math.random() * rooms.length-1);
	while(newroom == step) {
		newroom = Math.ceil(Math.random() * rooms.length-1);
	}
	console.debug(newroom);
    step = newroom;
    var room = rooms[step];
    document.getElementById('status').innerHTML = newroom+'/'+room;
    document.getElementById('obk').src = 'http://capitalcity.oldbk.com/main.php?setch=1&got=1&room'+room+'=1249';
    setTimeout(function() {    	goto();
	}, time);
}
</script>
";


?>