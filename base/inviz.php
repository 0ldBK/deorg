<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();


if($_SESSION['access'] < 1) die('for users only');


$datafile = 'tops.dat'; $tops = array();
if(time() - filemtime($datafile) >= 1) {	$topdata = file_get_contents("http://mibs.info/levelrating.html?level=13");
	if(preg_match_all("#<b>([^<]+)</b>\[([0-9]+)\]</span>#i", $topdata, $matches)) {
		foreach($matches[1] as $k => $login) {			$tops[$login] = true;
			$out = json_encode($tops);
			if($file = fopen($datafile, 'w')) {
				fwrite($file, $out);
				fclose($file);
			}
		}
	}
}

if($file = fopen($datafile, 'r')) {
	$out = fread($file, filesize($datafile));
	fclose($file);
}

$tops = json_decode($out);
echo "
<style>
#scaner {	float: left;
	width: 58%;
}
#errors {
	color: red;
	font-weight: bold;
	float: right;
	width: 40%;
}
#data {	width: 100%;
	color: green;
}
.user {	display: table;
	width: 100%;
	text-align: center;
	border: 1px solid #DEDEDE;
}
.user > div {
	display: table-cell;
	border: 1px solid #DEDEDE;
}
.user > div:nth-child(1) {
	width: 250px;
}
#status {
	color: green;
}

textarea {	width: 100%;
	height: 50px;
}
input[type=text] {
	width: 75%;
}
input[type=submit] {
	width: 24%;
}

</style>
<script>
var Scanned = {}, counter = 0;

function getdata(log, login, all) {	var url = 'inviz.ajax.php?id='+log+'&login='+login+'&rand='+Math.random();
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.withCredentials = true;
	xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {			counter++;
			if(counter == all) {                document.getElementById('status').value = '»';
                document.getElementById('status').removeAttribute('disabled');
			} else {
				document.getElementById('status').value = login+' +';
			}

			var data = JSON.parse( this.responseText );
			if(data['err']) {				var newErr = document.createElement('li');
				newErr.innerHTML = '['+login+'] '+data['err'];
				document.getElementById('errors').appendChild(newErr);
			} else {				console.debug(data);
				var user = data['login'], ids = data['id'], exists = data['exists'];
				if(!Scanned[user]) {
					if(exists) Scanned[user] = ids;
				} else {                    if(exists) {						for(var eid in Scanned[user]) {							if(!ids[eid]) {								delete Scanned[user][eid];
								console.debug('EX nomatch '+eid);
							} else {								console.debug('EX match '+eid);
							}
						}
					} else {						for(var eid in Scanned[user]) {
							if(ids[eid]) {
								delete Scanned[user][eid];
								console.debug('NO match '+eid);
							} else {
								console.debug('NO nomatch '+eid);
							}
						}
					}
				}
				document.getElementById('data').innerHTML = '';
				for(var user in Scanned) {					var out = '<div>'+user+'</div>';					for(var uid in Scanned[user]) {						out += '<div>'+uid+'</div>';
					}
					var newUs = document.createElement('div');
				    newUs.className = 'user';
					newUs.innerHTML = out;					document.getElementById('data').appendChild(newUs);
				}
			}

		}
	}
	xhr.send(null);

}

function scan() {	document.getElementById('errors').innerHTML = '';
	document.getElementById('status').value = 'Проверка...';
	document.getElementById('status').setAttribute('disabled', false);	var log = parseInt(document.getElementById('log').value);	var logins = document.getElementById('logins').value;
	logins = logins.split(',');
	counter = 0;
	for(var i in logins) {		var login = logins[i];		console.debug(login+'/'+log);
        getdata(log, login, logins.length);
	}
}
</script>
<div id='errors'></div>
<form method='get' action='' id='scaner' onsubmit='scan(); return false;'>
<ul>
	<li>Вводим несколько ников (чем меньше тем лучше)
	<li>Вводим лог боя. Жмём проверить. Если в этом логе были такие персы, покажет их возможные ID.
	<li>Не обновляя страницы вводим еще один лог боя, id отфильтруются.
	<li>Продолжаем вводить логи боёв, пока у персонажей не станет по одному ID
</ul>

Введите ники персонажей, которых будем проверять(через запятую):<br>
<textarea name='logins' id='logins'>Camazer,Мурро,KotoPEC,El Camino,PoJluK,Mano,Юстас Алекс,Powerhouse</textarea>
<br>
<input name='lid' type='text' value='235322661' id='log' placeholder='введите id лога боя'>
<input type='submit' value='&raquo;' id='status'>
</form>
<div class='user'><div>Логин</div><div>Возможные ID</div></div>
<div id='data'> </div>
";


?>
