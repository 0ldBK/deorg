<html>
<head>
	<title>Админка</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf8">
	<META Http-Equiv=Cache-Control Content=no-cache>
	<meta http-equiv=PRAGMA content=NO-CACHE>
	<link rel="SHORTCUT ICON" href="/favicon.ico">
	<link rel="stylesheet" href="index.css" type="text/css">
	<script type="text/javascript" src="index.js"></script>
</head>
<body>

<?php
define('MAIN', true);
session_start();
@include("../mysql.php");
$url = dirname($_SERVER['PHP_SELF'])."/";
if(!isset($_SESSION['admin']) || $_SESSION['admin'] == '') {	$text = "Превед 0_о!";
	if(isset($_POST['login'])) {    	$login = preg_replace("#([^A-Za-z]+)#", "", substr($_POST['login'], 0, 25));
        $password = preg_replace("#([^A-Za-z0-9_-]+)#", "", substr($_POST['pwd'], 0, 25));
        $password = md5(md5($password));
        if(strlen($login) > 3 && strlen($password) > 3) {        	$auth = $db->sql_query("SELECT * FROM vip WHERE `password` != '' AND `login` = '$login' AND `password` = '$password'");
        	if($db->sql_numrows($auth) == 1) {        		$auth = $db->sql_fetchrow($auth);
        		$_SESSION['admin'] = $auth['login'];
        		$_SESSION['level'] = $auth['level'];
        		$_SESSION['aid'] = $auth['uid'];
        		$db->sql_query("INSERT INTO actions (`who`, `atime`, `what`) VALUES('".$auth['uid']."', '".time()."', 'Login')");
        		//echo "ok";
        		header("location: $url");
        		exit;
        	} else {        		$text = "<b style='color: red'>Неправильынй логин однако! $password</b>";//$text = "$text SELECT * FROM vip WHERE `password` != '' AND `login` = '$login' AND `password` = '$password'";
        	}
        } else {        	$text = "<b style='color: red'>Shoo shoo go away :(</b>";
        }
	}
	echo "
	<form method='post'>
		<div id='loginform'>
			<div>$text</div>
			<input name='login' type='text' value='".$_POST['login']."' placeholder='Ваш логин'><br>
			<input name='pwd' type='password' value=''  placeholder='Пароль'><input type='submit' value='войти'>
		</div>
	</form>
	";
exit;
}

$stime = mktime(0,0,0,date('m'),date('d'),date('y'));


if(isset($_POST['uid'])) {	$uid = ceil($_POST['uid']);
	if(isset($_POST['vip']) && $uid > 1 && $uid != $_SESSION['aid']) {
	    $vip = ceil($_POST['vip']);
    	if($db->sql_query("UPDATE vip SET `access` = '$vip' WHERE uid = '$uid'")) {    		$db->sql_query("INSERT INTO actions (`who`, `atime`, `what`, `whom`) VALUES('".$_SESSION['aid']."', '".time()."', 'Change access to $vip', '$uid')");    		echo "<div style='color: green; font-weight: bold;'>Всё прошло успешно...</div>";
    	} else {    		echo "<div style='color: red; font-weight: bold;'>Ошибка структуры БД.</div>";
    	}

    } elseif(isset($_POST['timeleft']) && $uid > 1 && $uid != $_SESSION['aid']) {    	//Y-m-d    	$t = explode("-", $_POST['timeleft']);
    	$timeleft = mktime(23, 59, 59, $t[1], $t[2], $t[0]);
    	$status = $timeleft > time() ? 0 : 3;

    	if($db->sql_query("UPDATE vip SET `vip` = '$timeleft', `access` = '$status'  WHERE uid = '$uid' AND `access` != 2")) {
    		$db->sql_query("INSERT INTO actions (`who`, `atime`, `what`, `whom`) VALUES('".$_SESSION['aid']."', '".time()."', 'Change account timeleft to $timeleft', '$uid')");
    		echo "<div style='color: green; font-weight: bold;'>Всё прошло успешно...</div>";
    	} else {
    		echo "<div style='color: red; font-weight: bold;'>Ошибка структуры БД.</div>";
    	}
    }  else {
	    echo "<div style='color: red; font-weight: bold;'>Да как ты пасмел??? Фу таким быть :(</div>";
	}
}
if(isset($_POST['remove'])) {
	$uid = ceil($_POST['remove']);
	if($uid > 1) {		$flink = "../settings/$uid.config";		$file = file_get_contents($flink);
		if(unlink($flink)) {			$db->sql_query("INSERT INTO actions (`who`, `atime`, `what`, `whom`) VALUES('".$_SESSION['aid']."', '".time()."', 'Remove settings', '$uid')");
			echo "<div style='color: #004000; font-weight: bold;'>Настройки удалены</div>";
		} else {			echo "<div style='color: maroon; font-weight: bold;'>Настройки НЕ удалены</div>";
		}
	} else {
    	echo "<div style='color: red; font-weight: bold;'>Да как ты пасмел??? Фу таким быть :(</div>";
    }
}
if(isset($_GET['date'])) {
	$asc = $_GET['date'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `lastuse` $asc";
} else if(isset($_GET['date2'])) {
	$asc = $_GET['date2'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `firstuse` $asc";
} else if(isset($_GET['date3'])) {
	$asc = $_GET['date3'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `vip` $asc";
} else if(isset($_GET['login'])) {
	$asc = $_GET['login'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `login` $asc";
} else if(isset($_GET['access'])) {
	$asc = $_GET['access'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `access` $asc";
} else if(isset($_GET['silver'])) {
	$asc = $_GET['silver'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `silver` $asc";
} else if(isset($_GET['status'])) {
	$asc = $_GET['status'] == 'asc' ? 'asc' : 'desc';
	$order = "ORDER BY `access` $asc";
}
$uacc = -1;
$silv = '';

if(isset($_GET['user']) || isset($_GET['uip']) || isset($_GET['clan']) || isset($_GET['vip']) || isset($_GET['silv'])) {	$clan = preg_replace("#(`|\"|')#", "", substr($_GET['clan'], 0, 25));	$user = preg_replace("#(`|\"|')#", "", substr($_GET['user'], 0, 25));
	$uip = preg_replace("#([^0-9\.]+)#", "", substr($_GET['uip'], 0, 16));
    $uacc = $_GET['vip'];
    $silv = $_GET['silv'];
    $where = array();
    if(strlen($user) > 2) {    	$where[] = "`login` LIKE '%$user%'";
    }
    if(strlen($clan) > 2) {
    	$where[] = "`clan` LIKE '%$clan%'";
    }
    if(strlen($uip) > 2) {
    	$where[] = "`iplists` LIKE '%$uip%'";
    }
    if($uacc > -1) {
		$where[] = "`access` = '$uacc'";
	}
	if($silv != '') {
    	$where[] = "`silver` = '$silv'";
    }
    $where = count($where) > 0 ? "WHERE ".implode(' AND ', $where) : "";
}
$page = ceil($_GET['page']) > 0 ? ceil($_GET['page']) : 1;
$limit = 100;
$offset = ($page-1) * $limit;

$query = $db->sql_query("SELECT * FROM vip $where $order LIMIT $offset, $limit");
$found = $db->sql_numrows($db->sql_query("SELECT * FROM vip $where"));
$all = ceil($found/$limit);

$pageslist = '';
$geturl = geturl();
for($i = 1; $i <= $all; $i++) {	$pageslist .= $i == $page ? "<b>$i</b> " : "<a href='".$geturl."page=$i'>$i</a> ";
}

function geturl($sort = false) {	$geturl = '?';	foreach($_GET as $k => $v) {
		if($k == 'page') continue;
		if($sort && ($k == 'login' || $k == 'date' || $k == 'date2' || $k == 'silver' || $k == 'date3' || $k == 'status')) continue;
		$url[] = "$k=$v&";
	}

	return $geturl.join("", $url);
}

$all = $db->sql_query("SELECT * FROM vip");
$all = $db->sql_fetchrowset($all);
$stat = array(
	'all' => 0,
	'all2' => 0,
	'platinum' => 0,
	'platinum2' => 0,
	'gold' => 0,
	'gold2' => 0,
	'silver' => 0,
	'silver2' => 0,
	'other' => 0,
	'other2' => 0
);
foreach($all as $k => $suser) {	$ping = time() - $suser['lastuse'];
	$stat['all']++;
	if($ping < 300) {
		$stat['all2']++;
	}	if($suser['silver'] == 'Platinum') {		$stat['platinum']++;
		if($ping < 300) {			$stat['platinum2']++;
		}
	} elseif($suser['silver'] == 'Gold') {		$stat['gold']++;
		if($ping < 300) {
			$stat['gold2']++;
		}
	} elseif($suser['silver'] == 'Silver') {
		$stat['silver']++;
		if($ping < 300) {
			$stat['silver2']++;
		}
	} else {
		$stat['other']++;
		if($ping < 300) {
			$stat['other2']++;
		}
	}
}

echo "

<form method=get>
Вы вошли как <b>".$_SESSION['admin']."[".$_SESSION['level']."|".$_SESSION['aid']."]</b> |
<input name='user' type='text' value='$user' placeholder='Поиск по нику'>
<input name='clan' type='text' value='$clan' placeholder='Поиск по клану'>
<input name='uip' type='text' value='$uip' placeholder='Поиск по IP'>
<select name='vip'>
	<option value='-1'>Все пользователи</option>
	<option value='3'".($uacc==3?" selected":"").">Блокирован</option>
	<option value='0'".($uacc==0?" selected":"").">Активен</option>
	<option value='1'".($uacc==1?" selected":"").">Оплатил</option>
	<option value='2'".($uacc==2?" selected":"").">Разработчик</option>
	<option value='5'".($uacc==5?" selected":"").">Без платины</option>
</select>
<select name='silv'>
	<option value=''>Все аккаунты</option>
	<option value='Silver'".($silv=='Silver'?" selected":"").">Silver</option>
	<option value='Gold'".($silv=='Gold'?" selected":"").">Gold</option>
	<option value='Platinum'".($silv=='Platinum'?" selected":"").">Platinum</option>
</select>

<input type='submit' value='найти'>
<input type='button' value='сброс' onclick='window.location.href=\"$url\"'>
</form>
<hr>

<table border=0 cellpadding=3 cellspacing=2 style='font-size: 12px; font-family: Tahoma;width: 100%;'>
<tr bgcolor=#C0C0C0>
	<td colspan=7>Страницы: $pageslist</td>
	<th colspan=2>Найдено: $found</th>
</tr>
<tr bgcolor=#C0C0C0>
	<th>#</th>
	<th><a href='".geturl(true)."login=".($_GET['login'] == 'desc'?'asc':'desc')."'>Логин</a></th>
	<th><a href='".geturl(true)."date2=".($_GET['date2'] == 'desc'?'asc':'desc')."'>Подключился</a></th>
	<th><a href='".geturl(true)."date=".($_GET['date'] == 'desc'?'asc':'desc')."'>Когда был</a></th>
	<th><a href='".geturl(true)."date3=".($_GET['date3'] == 'desc'?'asc':'desc')."'>Активен до</a></th>
	<th><a href='".geturl(true)."silver=".($_GET['silver'] == 'desc'?'asc':'desc')."'>Аккаунт</a></th>
	<th>Последний IP</th>
	<th><a href='".geturl(true)."status=".($_GET['status'] == 'desc'?'asc':'desc')."'>Статус</a></th>
	<th>Удалить<br>настройки</th>
</tr>
";

$statuses_list = array('Активен','Оплатил','Разработчик','Блокирован','-','Без платины');

$i = $offset+1;
while(list($userid, $login, $level, $clan, $align, $lastip, $firstuse, $lastuse, $iplist, $access, $pwd, $vip, $silver, $bid) = $db->sql_fetchrow($query)) {	$color = ($i/2 == ceil($i/2)) ? "#E1E4FB" : "#FFFFFF";
	$uclan = $clan != '' ? "<img src='http://i.oldbk.com/i/klan/$clan.gif' title='$clan'>" : "";
	$uhtml = "($userid) <img src='http://i.oldbk.com/i/align_$align.gif'>$uclan$login [$level]<a href='http://capitalcity.oldbk.com/inf.php?$userid' target=_blank><img src='http://i.oldbk.com/i/inf.gif' width=12px></a>";	$ping = time() - $lastuse;
	$date = $ping < 300 ? "$ping с. назад" : date('d.m.Y H:i', $lastuse);
	$bid = $ping < 300 && $bid > 0 ? "<br><a href='http://capitalcity.oldbk.com/logs.php?log=$bid' target=_blank>$bid</a>" : "";
	$date2 = date('d.m.Y H:i', $firstuse);
	$iplist = explode(",", $iplist);
	$allip = count($iplist);
	if($allip > 1 && $uip == '') {		$subiplist = "";
		foreach($iplist as $k => $ip) {
	    	$subiplist .= "<a href='$url?uip=$ip'>$ip</a> <br>";
		}
		$showall = "
		<div style='width: 80%; display: none; float: left;' id='s$userid'>
  			$subiplist
		</div>
		<div style='width: 80%; display: inline-block; float: left;' id='l$userid'>
  			<a href='$url?uip=$lastip'>$lastip</a>
		</div>
		<div style='width: 18%; display: inline-block; float: right;'>
			<a onclick='show(this)' href='javascript://' id='$userid' num='$allip'>+$allip</a>
		</div>
		";
	} else if(strstr($lastip, $uip) > -1) {
		$showall = "<b style='color: green'>$lastip</b>";
	} else {
		$showall = "<a href='$url?uip=$lastip'>$lastip</a>";
	}
	$userslist[] = $login;



	echo "
		<tr bgcolor=$color>
			<th>$i</th>
			<td style='padding-left: 15px;'>$uhtml</td>
			<th>$date2</th>
			<th>$date $bid</th>
			<th>
				<form method=POST>
					<input name='uid' type='hidden' value='$userid'>
					<input name='timeleft' type='date' value='".date('Y-m-d', $vip)."'><input type='submit' value='»'>
				</form>
			</th>
			<th>$silver</th>
			<th>$showall</th>
			<td align=center>
            	".$statuses_list[$access]."
			</td>
			<th>
			<form method=POST onsubmit='if(!confirm(\"Уверены?\")){return false;}'>
				<input name='remove' type='hidden' value='$userid'>
				<input type='submit' value='x'>
			</form>
			</th>
		</tr>
	";
$i++;}


$userslist = implode(", ", $userslist);

echo "</table>
<br><br>
<table border=0 cellpadding=3 cellspacing=2 style='font-size: 12px; font-family: Tahoma;width: 100%;'>
<tr bgcolor=#C0C0C0>
	<th>Кто</th>
	<th>Когда</th>
	<th>Что</th>
	<th>Кому</th>
</tr>";
$actions = $db->sql_query("SELECT a.who, a.atime, a.what, a.whom, b.login FROM actions AS a  LEFT JOIN vip AS b ON ( a.whom = b.uid ) ORDER BY a.atime DESC LIMIT 10");
while($action = $db->sql_fetchrow($actions)) {	echo "<tr bgcolor=#C0C0C0>
		<th>$action[who]</th>
		<th>".date('d.m.Y H:i:s', $action['atime'])."</th>
		<th>$action[what]</th>
		<th>$action[login] ($action[whom])</th>
	</tr>";
}
echo "</table>";








?>
