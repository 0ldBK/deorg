<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();


if($_SESSION['access'] < 1) die('for users only');


$datafile = 'tops.dat'; $tops = array();
if(time() - filemtime($datafile) >= 1) {
	if(preg_match_all("#<b>([^<]+)</b>\[([0-9]+)\]</span>#i", $topdata, $matches)) {
		foreach($matches[1] as $k => $login) {
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
#scaner {
	width: 58%;
}
#errors {
	color: red;
	font-weight: bold;
	float: right;
	width: 40%;
}
#data {
	color: green;
}
.user {
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

textarea {
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

function getdata(log, login, all) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.withCredentials = true;
	xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			if(counter == all) {
                document.getElementById('status').removeAttribute('disabled');
			} else {
				document.getElementById('status').value = login+' +';
			}

			var data = JSON.parse( this.responseText );
			if(data['err']) {
				newErr.innerHTML = '['+login+'] '+data['err'];
				document.getElementById('errors').appendChild(newErr);
			} else {
				var user = data['login'], ids = data['id'], exists = data['exists'];
				if(!Scanned[user]) {
					if(exists) Scanned[user] = ids;
				} else {
								console.debug('EX nomatch '+eid);
							} else {
							}
						}
					} else {
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
				for(var user in Scanned) {
					}
					var newUs = document.createElement('div');
				    newUs.className = 'user';
					newUs.innerHTML = out;
				}
			}

		}
	}
	xhr.send(null);

}

function scan() {
	document.getElementById('status').value = 'Проверка...';
	document.getElementById('status').setAttribute('disabled', false);
	logins = logins.split(',');
	counter = 0;
	for(var i in logins) {
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