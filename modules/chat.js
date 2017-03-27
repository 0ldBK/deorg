var Url = window.location.href+"";

console.debug('chat');

var CHTML = function(){/*
<table class='headhunter' id='hht' cellpadding="2" cellspacing="0">
	<tr>
		<th id='hbutton' class='hbutton' rowspan=4>«</th>
		<th class='hmess' id='tdhmess'>
			<img src='{server}i/rld.png' title='Обновить список нападалок' id='hrefresh'>
			<div id='hcounter'>?</div> <div id='hmess'>Загрузка...</div>
		</th>
	</tr>
	<tr>
		<th id='hauto'>
			<select name='headhunter.type'>
				<option value=''>Нападать по списку (ники + кланы)</option>
				<option value='1'>Нападать по фильтрам</option>
				<option value='2'>Нападать на ник в поле ввода</option>
			</select>&nbsp;&nbsp;<div id='autobatl' class='uses dis'>Загружаю</div>
            <br>
            <span id='filter0' style='display: none;'>
				<textarea name='headhunter.enemies' placeholder='Список ников и/или кланов(включите в настройках) через запятую'></textarea>
			</span>
			<span id='filter1' style='display: none;'>
				<label><input name="headhunter.aligns.0" type="checkbox" value="1" checked>Серые</label>
				<label><input name="headhunter.aligns.3" type="checkbox" value="1" checked>Тёмные</label>
				<label><input name="headhunter.aligns.2" type="checkbox" value="1" checked>Нейтралы</label>
				<label><input name="headhunter.aligns.6" type="checkbox" value="1" checked>Светлые</label>
				| Уровни: <label><input name='headhunter.level.min' type='text' maxlength='2' value='0'></label> -
	            <label><input name='headhunter.level.max' type='text' maxlength='2' value='21'></label>
			</span>
		</th>
	</tr>
    <tr>
		<td id='ascrolls'>
			<table class='scrolls' border='0' cellpadding='2' cellspacing='0' align="center">
			<tr>
				<th>Свитки/Встройки</th><th>ДП/ЦП</th><th>Клановые</th>
			</tr>
			<tr>
				<td>
					<div class='buimg' name='scrollb' id='scrollb' title='Нападение'><span class='attacka'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='scrollf' id='scrollf' title='Кулачное нападение'><span class='attackf'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='scrollbb' id='scrollbb' title='Кровавое нападение'><span class='attackb'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='scrollz' id='scrollz' title='Разбойное нападение'><span class='attackz'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='scrollzb' id='scrollzb' title='Кровавое Разбойное нападение'><span class='attackzb'>&nbsp;</span><b>?</b></div>
                    <div class='buimg' name='scrollv' id='scrollv' title='Кровавое нападение «Вендетта»'><span class='attackv'>&nbsp;</span><b>?</b></div>

				    <div class='buimg' name='heall' id='heall' title='Лечение легких травм'><span class='heall'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='healm' id='healm' title='Лечение средних травм'><span class='healm'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='healh' id='healh' title='Лечение тяжелых травм'><span class='healh'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='healzl' id='healzl' title='Лечение легких  травм за городом'><span class='healzl'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='healzm' id='healzm' title='Лечение средних  травм за городом'><span class='healzm'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='healzh' id='healzh' title='Лечение тяжелых  травм за городом'><span class='healzh'>&nbsp;</span><b>?</b></div>
				</td>
				<td>
					<div class='buimg' name='scrollop' id='scrollop' title='Нападалка противостояния'><span class='attackop'>&nbsp;</span><b>&infin;</b></div>
					<div class='buimg' name='scrollcp' id='scrollcp' title='Нападалка на Центральной Площади'><span class='attackcp'>&nbsp;</span><b>&infin;</b></div>
				</td>
				<td>
					<div class='buimg' name='clanb' id='clanb' title='Клан: абилка нападения'><span class='attacka'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='clanbb' id='clanbb' title='Клан: абилка кровавого нападения'><span class='attackb'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='wara' id='wara' title='Клан: военный аркан'><span class='arkanw'>&nbsp;</span><b>?</b></div>
					<div class='buimg' name='warb' id='warb' title='Клан: военная нападалка'><span class='attackw'>&nbsp;</span><b>?</b></div>
				</td>
			</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td id='hinput'>
			<img id='hclean' src='{server}i/x.png'>
			<form onsubmit="useScroll(); return false;">
				<input type="text" name="target" value="" id="victim" placeholder="Введите ник или кликните по нему в чате..."><input type="submit" class='uses def' id='huse' value="напасть">
		    </form>
		</td>
	</tr>
</table>
<div id='tactics'>
	<div id='thead'>
		<div id="bkill"></div>
	    <div id="bhp"></div>
		<div id="bhplim"></div>
		<div id="bstlim"></div>
		<div id="btime"></div>
	</div>
	<div id='tdata'>Требуется бой. Фильтрация работает только в режиме автохаотов.</div>
</div>
<div id='hijack'>
	<div id='hjdata'>



	</div>
</div>
*/}.toString();
CHTML = CHTML.replace("function (){/*","");
CHTML = CHTML.replace("*/}","");
CHTML = CHTML.replace(/{server}/ig, SERVER);

var newDiv = document.createElement('span');
newDiv.setAttribute('id', 'hhtable');
newDiv.innerHTML = CHTML;
document.body.appendChild(newDiv);


//очистка текущей вкладки
function clrsub() {
	var newmsgarray = new Array();
	for (key in MsgArray) {
		var tab = MsgArray[key][1];
	    if(tab != 8 && currenttab == 8) {
			newmsgarray.push(MsgArray[key]);
		} else if(tab == 8 && currenttab != 8) {
			newmsgarray.push(MsgArray[key]);
		}
	}
	MsgArray = newmsgarray;
	if (currenttab != 99) document.getElementById('mes').innerHTML = '';
}

//новости и война
config.broadcast("{server}/base/news.php?"+Math.random(), function(data) {
	data = JSON.parse(data);
	if(data) {
		p(data.join("<hr>"), 1);
		var newField = document.createElement('fieldset');
		newField.className = 'field';
		newField.setAttribute('id', 'warnews');
		document.getElementById('mes').appendChild(newField);
		
        if(!config.get('user.clan')) {
        	return;
        }

		config.broadcast('/klan.php?razdel=wars&rnd='+Math.random(), function(html) {
		   	var wardata = config.searchAll("<font color=red>(.+?)</font>", html);
		   	var text = "Ошибка получения информации о текущей войне! Сообщите разработчику. Желательно скинуть HTML код фрейма клан - войны. ["+wardata+"]";
		   	var color = "red";
		   	if(wardata[0]) {
		   		var sides = html.split('> против <');
		   		var warwith = config.searchAll("<img.+?align_([0-9]+)[^>]+>\s*<img[^>]+><b>([^<]+)</b><a[^>]+><img.+?inf.gif[^>]*></a", sides[0]);
           		var warwith2 = config.searchAll("img.+?align_([0-9]+)[^>]+>\s*<img[^>]+><b>([^<]+)</b><a[^>]+><img.+?inf.gif[^>]*></a>", sides[1]);

            	if(wardata[0].indexOf('Альянсовая война') > -1 || wardata[0].indexOf('Дуэльная война') > -1) {
            		var timer = wardata[1].indexOf('Война') > -1 ? wardata[2] : wardata[1];
            		text = wardata[0].trim();
            		text = text.replace("<br>","")+" "+timer+"<br>";
            		var clans = {}, i0 = 0, i1 = 0;
            		for(var c in warwith) {
            			var align = warwith[c][0], clan = warwith[c][1];
            			if(!clans[clan]) {
            				clans[clan] = [align, 0];
            				i0++;
            			}
            		}
            		for(var c in warwith2) {
            			var align = warwith2[c][0], clan = warwith2[c][1];
            			if(!clans[clan]) {
            				clans[clan] = [align, 1];
            				i1++;
            			}
            		}
            		for(var cl in clans) {
            			if(clans[cl][1] == 1) continue;
            			i0--;
            			text += "<img src='http://i.oldbk.com/i/align_"+clans[cl][0]+".gif'><img src='http://i.oldbk.com/i/klan/"+cl+".gif'>";
            			text += "<a href='http://oldbk.com/encicl/klani/clans.php?clan="+cl+"' target=_blank>"+cl+"</a>&nbsp;&nbsp;";
            			if(i0 > 0) text += " <b>+</b> ";
            		}
             		text += "<hr>";
            		for(var cl in clans) {
            			if(clans[cl][1] == 0) continue;
            			i1--;
            			text += "<img src='http://i.oldbk.com/i/align_"+clans[cl][0]+".gif'><img src='http://i.oldbk.com/i/klan/"+cl+".gif'>";
            			text += "<a href='http://oldbk.com/encicl/klani/clans.php?clan="+cl+"' target=_blank>"+cl+"</a>&nbsp;&nbsp;";
            			if(i1 > 0) text += " <b>+</b> ";
            		}

            		text += "<br>";
            		color = "#FF0000";
            	} else {
            		text = "Что-то неизвестное с войной", color = "red";
            	}
            } else {
            	var nowar = config.search("(<tr><td align=middle valign=top></td></tr></table></fieldset>|<td>Объявить войну клану|>Клановое перемирие до)", html);
	           	if(nowar[0]) {
            		text = "Сейчас войны нет. В багдаде всё спокойно ;)", color = "green";
            	} else {
            		var allywith = config.search("<br> Приглашение в альянс с <img.+?align_([0-9]+)[^>]+>\s*<img[^>]+><b>([^<]+)</b>", html);
            		if(allywith[0]) {
	           			text = "Сейчас войны нет. ";
	           			text += "Ожидается приглашение в альянс к <img src='http://i.oldbk.com/i/align_"+allywith[0]+".gif'><img src='http://i.oldbk.com/i/klan/"+allywith[1]+".gif'><a href='http://oldbk.com/encicl/klani/clans.php?clan="+allywith[1]+"' target=_blank>"+allywith[1]+"</a>";
	           			color = "green";
	           		}
            	}
            }
			var warlog = config.search("towerlog\\.php\\?war=([0-9]+)", html);
            var warlink = +warlog > 0 ? " <a href='http://capitalcity.oldbk.com/towerlog.php?war="+warlog+"' target=_blank>(лог войны)</a>" : "";
			document.getElementById('warnews').innerHTML +="<legend><b>Текущие события"+warlink+"</b></legend><span style='color: "+color+";font-size: 11px;'>"+text+"</span>";
		});
 	}
}, false, true);

function fit(eid) {
	console.debug(eid);
	var now = document.getElementById(eid).getAttribute('s');
	if(+now == 1) {
		document.getElementById(eid).setAttribute('s', 0);
		document.getElementById(eid).className = 'fit';
		config.set("battle.list."+eid+".fit", false);
	} else {
		document.getElementById(eid).setAttribute('s', 1);
		document.getElementById(eid).className = 'fit on';
		config.set("battle.list."+eid+".fit", true);
	}
}

//смена игрока
function ChangeEnemy(login, id) {
	if(top.frames[2].document.all("hint3").style.visibility == "visible" && top.frames[2].document.getElementById("enterlogin") != null) {
		 top.frames[2].document.getElementById('enterlogin').value = login;
	} else {
		if(id) config.set('battle.changes.'+id, true);
		config.set('battle.lastchangeid', id);
		top.frames[2].window.location.href = 'http://capitalcity.oldbk.com/fbattle.php?login_target='+login+'&rnd='+Math.random();
	}
}

function tactics(type) {
	if(type == 2 || type == 3) {

		//$('#tdata').find('div.enemy').remove();

		var enems = document.getElementById('tdata').getElementsByTagName('div');
		for(var e in enems) {
			var el = enems[el];
			if(typeof(el) == 'object' && el.className.indexOf('enemy') > -1) {
				el.remove();
			}
		}
        config.set('battle.id', 0);
		document.getElementById('tdata').innerHTML = 'Требуется бой. Фильтрация работает только в режиме автохаотов...';
		document.getElementById('bkill').innerHTML = '';
		document.getElementById('btime').innerHTML = '';
		document.getElementById('bhp').innerHTML = '';
		document.getElementById('bhplim').innerHTML = '';
		document.getElementById('bstlim').innerHTML = '';
		config.sound('eattack');
		return;
	} else if(type == 1) {
		config.sound('attack');
	}

	var battle = config.get('battle'), lvl = config.get('user.level');
	var last = Math.ceil((+new Date() - battle['laststrike'])/1000);
	var auto = Math.ceil(battle['striketime']/1000);
	var wait = (config.get('settings.battle.marinad', 0) - last);
	var changes = config.get('battle.changes', {});

	var kill = "<b style='color: green'>Фильтры работают</b>";
	if(battle['autokill']) {
		kill = "<b style='color: #000040'>Самоубиваемся</b>";
	} else if(!config.eq('settings.battle.atype', 1)) {
		kill = "<b style='color: red'>Фильтры отключены</b>";
	}

	var tpanel = ['','','',''];

	var UTypes = {'ac': 'ак', 'ad': 'ау', 'false': '??'};
	var UClasses = {'crit': 'Крит', 'dodge': 'Уворот', 'tank': 'Танк', 'ac': 'анти-крит', 'ad': 'анти-уворот', 'false': '??'};
    var showDied = config.get('settings.battle.showdied', false);

	for(var eid in battle['list']) {
		if(!battle['list'][eid]) continue;
        if(!showDied && battle['list'][eid]['died']) continue;

		var e = battle['list'][eid];
		var i = 2, cl = 'low', tst = '-';
		if(e['like']) i = 0, cl = 'mid';
		if(e['hard']) i = 1, cl = 'top';
		if(e['vop']) i = 0, cl = 'vop';
		if(e['died']) i = 2, cl = 'die';


		if(e['attack'] > 0) {
			tst = Math.ceil((+new Date() - e['attack']) / 1000);
			if(tst >= auto - 10) tst = "<b style='color: red'>"+tst+"</b>";
		}
		var chp = e['hp'][2] <= 33 ? '#400000' : (e['hp'][2] <= 66 ? '#804000' : '#004000');
		var clogin = ""+e['rlogin']+"";
		if(e['clon']) {
			clogin = ""+e['rlogin']+"<sup>"+e['clonnum']+"</sup>";
		} else if(e['inv']) {
			clogin = "<i>"+e['rlogin']+"</i>";
		}

        var ucl = e['uclass']+"-"+e['utype'];
		var now = e['now'] ? ' now' : '';
        var simg = changes[eid] && e['fit'] ? "<img src='http://i.oldbk.com/i/fighttype1.gif' width=12 height=11>" : "";

        var aimg = "<img src='http://i.oldbk.com/i/align_"+(+e['align']>0?e['align']:0)+".gif' align='"+e['align']+"' width=12 height=11>";

		var uhp = e['inv'] > 0 ? e['id'] : ""+e['hp'][0]+"/"+e['hp'][1]+"";

		tpanel[i] += "<div class='enemy "+cl+"'>";
		tpanel[i] += "<div class='fit"+(e['fit']?' on':'')+"' s='"+(e['fit']?1:0)+"' id='"+eid+"' onclick='fit(this.id);' title='Бьём?'>&nbsp;</div>";
		tpanel[i] += "<div class='tuser' title="+UClasses[e['uclass']]+" onclick='ChangeEnemy(\""+e['login']+"\", \""+eid+"\");'>";
		tpanel[i] += aimg+"&nbsp;&nbsp;<sup>"+UTypes[e['utype']]+"</sup><span class='"+ucl+""+now+"'>"+clogin+"</span> ["+e['level']+"] "+simg;
		tpanel[i] += "</div>";
		tpanel[i] += "<div class='chp' style='color: "+chp+";'>"+uhp+"</div>";
		tpanel[i] += "<div class='timer'>"+tst+"</div>";
		tpanel[i] += "</div>";
 	}
	var enems = document.getElementById('tdata').getElementsByTagName('div');
	for(var e in enems) {
		var el = enems[el];
		if(typeof(el) == 'object' && el.className.indexOf('enemy') > -1) {
			el.remove();
		}
	}
	var enemies = tpanel.join('');
    document.getElementById('tdata').innerHTML = enemies;
	tpanel = null, html = null;

    document.getElementById('bkill').innerHTML = kill;
	document.getElementById('btime').innerHTML = "Таймаут: "+battle['timeout']+" / Автоответ: "+auto+" / Бил: "+last+" / Ждем: "+(wait > 0 ? wait : 0);
	document.getElementById('bhp').innerHTML = "Набил: "+Math.ceil(battle['damage'])+"HP";
	document.getElementById('bhplim').innerHTML = "Свитки: "+Math.ceil(battle['hcures'])+"HP";
	document.getElementById('bstlim').innerHTML = "Встройки: "+Math.ceil(battle['icures'])+" шт.";
	config.title();
}


//переключение на старый дизайн или удаление вкладок
if(config.get('settings.base.chatolddesign')) {
	if(!top.OnlineOld) toold();
} else if(!top.OnlineOld) {
    var el = document.getElementById('fixednew').getElementsByTagName('table')[0].getElementsByTagName('tr')[0];
 	el.getElementsByTagName('td')[0].setAttribute('style', 'width: 2px');
    el.getElementsByTagName('td')[3].setAttribute('style', 'width: 5px');
    el.getElementsByTagName('td')[2].removeAttribute('style');

 	console.debug('clear4');

	var newTd = document.createElement('td');
	newTd.setAttribute('id', 'tactics-show');
	newTd.setAttribute('title', 'Тактический бой');
	newTd.setAttribute('style', 'width: 30px;');
	newTd.onclick = function() {
		var t = document.getElementById('tactics');
		if(t && t.style.display == 'block') {
			t.style.display = 'none';
		} else {
			t.style.display = 'block';
		}
	};
	newTd.innerHTML = "<img src='http://i.oldbk.com/i/fighttype3.gif'>";
	el.insertBefore(newTd, el.children[0]);

	var tabs = config.get('settings.base.chatdeltab');
	var set = 0;
	for(var tab in tabs) {
		if(tabs[tab]) {
			set++;
			document.getElementById('ctab'+tab).style['display'] = 'none';
		}
	}
	if(set > 0) {
 		var newTd = document.createElement('td');
		newTd.setAttribute('id', 'rbuttons');
		newTd.innerHTML = "<div onclick='clrsub();'>Очистить чат</div>";
 		document.getElementById('fixednew').getElementsByTagName('table')[0].getElementsByTagName('tr')[0].appendChild(newTd);
	} else if(document.body.clientWidth < 1300) {
		el.getElementsByTagName('td')[5].setAttribute('width', '75px');
    	el.getElementsByTagName('td')[6].setAttribute('width', '75px');
    	el.getElementsByTagName('td')[7].setAttribute('width', '75px');
    }
}

//выключаем хх при загрузке
config.set('headhunter.run', false);
var Hint3Name = '', scrollsLoaded = false, scrollsLoad = 0, scrollsInUse = false;

var Scrolls = {
	'healh':{}, 'healm':{}, 'heall':{},'healzh':{}, 'healzm':{}, 'healzl':{},
	'scrollb':{},'scrollbb':{},'scrollv':{},'scrollz':{},'scrollzb':{},'scrollf':{},
	'clanb':{},'clanbb':{},'warb':{},'wara':{},
	'scrollop':{'i0':['opposition', 1, 'http://capitalcity.oldbk.com/myabil.php?', config.uid]},
	'scrollcp':{'i0':['', 0, 'http://capitalcity.oldbk.com/city.php?attack=1', 6]}
};
var ScrollsNames = {
	'Лечение тяжелых травм':'healh', 'Лечение средних травм':'healm', 'Лечение легких травм':'heall',
	'Лечение тяжелых  травм за городом':'healzh', 'Лечение средних травм за городом':'healzm', 'Лечение легких травм за городом':'healzl',
	'Кровавое нападение «Вендетта»':'scrollv', 'Кровавое нападение Вендетта':'scrollv',
	'Нападение':'scrollb', 'Кулачное нападение':'scrollf', 'Кровавое нападение':'scrollbb',
	'Разбойное нападение':'scrollz', 'Кровавое Разбойное нападение':'scrollzb'
};
var Aligns = ['серый','','нейтрал','темный','','','светлый'];
var Texts = [
	'На сегодня лимит исчерпан','Мазохист','Нападения в этой локации запрещены','Персонаж в другом городе',
	'Не так быстро','Тут это не работает', 'Персонаж тяжело травмирован','Жертва слишком слаба'
];

function hlog(text) {
	scrollsLoad = scrollsLoad > 0 ? scrollsLoad - 1 : 4;
	if(scrollsLoad > 0) {
    	var ties = new Array((scrollsLoad + 1) * 5 ).join('*');
    	document.getElementById('hcounter').innerHTML = ties;
    } else {
    	scrollsLoaded = true;
    	document.getElementById('hcounter').innerHTML = 'загружено';
    }
    if(typeof(text) == 'string') {
    	document.getElementById('hmess').innerHTML = text;
	}
}

function findAllScrolls(drop) {
	if(scrollsLoad > 0) return;
	hlog();
    //клан
	config.broadcast("http://capitalcity.oldbk.com/klan.php?razdel=main", function(html) {
		var tmp = config.search("&nbsp;Нападение:\s*([0-9]+)\s*\\/\s*([0-9]+)", html);
		var cnt = tmp && tmp.length > 0 ? +tmp[1] - tmp[0] : 0;
		if(cnt > 0) {
			Scrolls['clanb']['i0'] = [55, cnt, '/klan.php?razdel=main', config.uid, -1];
		}
		document.getElementById('clanb').getElementsByTagName('b')[0].innerHTML = cnt;

       	var tmp = config.search("&nbsp;Кровавое нападение:\s*([0-9]+)\s*\\/\s*([0-9]+)", html);
		var cnt = tmp && tmp.length > 0 ? +tmp[1] - tmp[0] : 0;
		if(cnt > 0) {
			Scrolls['clanbb']['i0'] = [56, cnt, '/klan.php?razdel=main', config.uid, -1];
		}
		document.getElementById('clanbb').getElementsByTagName('b')[0].innerHTML = cnt;
		hlog();
	});
	//война
	config.broadcast("http://capitalcity.oldbk.com/klan.php?razdel=wars", function(html) {
		var scrols = '-', arcans = 0;
		if(html.indexOf("runmagic1('Нападение'") > -1) {
			arcans = config.search('<img[^>]+?Аркан ([0-9]+)\\/([0-9]+)[^>]+>', html);
			arcans = (arcans[1]-arcans[0]), scrols = '+';
			Scrolls['wara']['i0'] = ['post_attack2', arcans, '/klan.php?razdel=wars', config.uid, -1];
			Scrolls['warb']['i0'] = ['post_attack', scrols, '/klan.php?razdel=wars', config.uid, -1];
		}
		document.getElementById('wara').getElementsByTagName('b')[0].innerHTML = +arcans;
		document.getElementById('warb').getElementsByTagName('b')[0].innerHTML = scrols;
		hlog();
	});

	if(config.get('battle.id') > 0 || config.get('user.rist') > 0) {
		scrollsLoad--;
		hlog('Обновите свитки после боя');
        return;
 	}
	document.getElementById('hmess').innerHTML = 'Проверка свитков...';
	document.getElementById('hmess').style['color'] = 'red';

	var SC = {
		'scrollb':0, 'scrollbb':0, 'scrollz':0, 'scrollzb':0, 'scrollv':0, 'scrollf':0,
		'healh':0, 'healm':0, 'heall':0, 'healzh':0, 'healzm':0, 'healzl':0
	};
    for(var i in SC) {
		Scrolls[i] = [];
	}
	config.parseInv(0, function(List){
		if(List && List['inserts']) {
			for(var i in List['inserts']) {
				var ins = List['inserts'][i];
				var name = ScrollsNames[ins[1]];
				if(!name) continue;
				var cnt = +ins[2];
				Scrolls[name]['i'+ins[0]] = [ins[0], cnt, '/main.php?edit=1&use='+ins[0], 6, 2];
				SC[name] += cnt;
			}
		}
		for(var i in SC) {
			if(document.getElementById(i)) {
				document.getElementById(i).getElementsByTagName('b')[0].innerHTML = SC[i];
			}
		}
		hlog();
		config.parseInv(1, function(List) {
			if(List) {
				for(var text in ScrollsNames) {
					var name = ScrollsNames[text];
					if(List[text]) {
						for(var i in List[text]) {
							var ins = List[text][i], cnt = +ins[4];
							Scrolls[name]['i'+ins[0]] = [ins[0], cnt, '/main.php?edit=1&use='+ins[0], 6, 1];
					    	SC[name] += cnt;
					    }
					}
				}
			}
			for(var i in SC) {
				if(document.getElementById(i)) {
					document.getElementById(i).getElementsByTagName('b')[0].innerHTML = SC[i];
				}
			}
			hlog('');
		});
	});

}

var Counter = 0;
//авто хх
function autoAttack(status) {
	if(!status) {
		status = '+';
		Counter = 0;
	} else Counter++;
	document.getElementById('hcounter').innerHTML = 'work['+status+'] ('+Counter+')';
	if(!config.get('headhunter.run')) {
		//console.error('Автонапа офнута...');
		return;
	}
	if(scrollsInUse) {
		//console.error('Юзается свиток нападалки...');
		setTimeout('autoAttack()', 300);
		return;
	}
	if(top.frames[2] && typeof(top.frames[2].location.href) == 'string' && top.frames[2].location.href.indexOf('/fbattle') > -1) {
		if(!config.get('settings.headhunter.nextbattle')) {
			document.getElementById('hmess').innerHTML = 'Вы в бою...';
			document.getElementById('hmess').style['color'] = 'red';
			top.frames[2].location.href = '/fbattle.php';
			run();
		} else {
			setTimeout('autoAttack("battle")', 5000);
		}
		return;
	}
	if(
		!config.get('headhunter.selected') ||
		config.eq('headhunter.selected', 'healh') ||
		config.eq('headhunter.selected', 'healm') ||
		config.eq('headhunter.selected', 'heall')
	) {
		document.getElementById('hmess').innerHTML = 'Выберите <u>нападалку</u> из кнопок ниже!';
		document.getElementById('hmess').style['color'] = 'red';
		run();
		return;
	}
	var aligns = config.get('settings.headhunter.aligns', {});
	var type = +config.get('settings.headhunter.type', 0);
	var en = config.get('settings.headhunter.enemies', []);
	var withclan = config.get('settings.headhunter.withclan', false);
	var enemies = {};
	for(var e in en) {
		var l = en[e].toLowerCase();
    	enemies[l] = true;
	}
    var min = config.get('settings.headhunter.level.min', 0);
    var max = config.get('settings.headhunter.level.max', 21);
	var victim = document.getElementById('victim').value;
	if(type == 2) {
		if(victim) {
			useScroll(function(status) {
        		if(!status) setTimeout('autoAttack()', 1000);
			});
		} else {
			document.getElementById('hmess').innerHTML = 'Введите ник жертвы в поле!';
			document.getElementById('hmess').style['color'] = 'red';
			run();
		}
	} else {
		document.getElementById('hmess').style['color'] = 'green';
		var request = new XMLHttpRequest();
		request.open('GET', "http://chat.oldbk.com/ch.php?online="+Math.random(), true);
		request.onreadystatechange = function(e) {
		    if (this.readyState == 4) {
		        if (this.status == 200) {
		            var data = this.responseText;
		            if(data && data.length > 0) {
						var selected = false;
		            	var users = config.searchAll("w\\(([^\\)]+)\\);", data);
						for(var u in users) {
							users[u] = users[u].replace(/(')/g, ''); //'
							var user = users[u].split(',');
							var enemy = user[0].toLowerCase(), align = +user[2], clan = user[3].toLowerCase(), level = +user[4];
							var uclan = config.get('user.clan', '');
							if(config.eq('user.login', enemy) || (uclan != '' && uclan.toLowerCase() == clan) || +users[u][6] > 0 || +users[u][8] > 0) continue;
			                if(type == 0) {
          	                	if(enemies[enemy] || (withclan && enemies[clan])) {
                                    console.debug('selected');
			                		selected = enemy;
			                		document.getElementById('hmess').innerHTML = 'Список: ('+Aligns[align]+')'+enemy+'['+level+']. Пробуем напасть...';
			                	    break;
			                	}
			                } else if(type == 1 && aligns[align] && level >= min && level <= max) {
								selected = enemy;
								document.getElementById('hmess').innerHTML = 'Фильтр: ('+Aligns[align]+')'+enemy+'['+level+']. Пробуем напасть...';
								break;
							}

						}
						if(!selected) {
							document.getElementById('hmess').innerHTML = 'Пока никого подходящего, ждем...';
							setTimeout('autoAttack(1)', 500);
			        		document.getElementById('victim').value = '';
						} else {
							document.getElementById('hmess').innerHTML = 'Нашли жертву '+selected;
		                    document.getElementById('victim').value = selected;
							useScroll(function(status) {
								document.getElementById('victim').value = '';
					        	if(!status) {
					        		setTimeout('autoAttack(2)', 1000);
								} else {
									if(!config.get('settings.headhunter.nextbattle')) {
										run();
									} else {
										setTimeout('autoAttack("battle")', 5000);
									}
								}
							});
						}
					} else {
						setTimeout('autoAttack(3)', 300);
			        }
		        } else {
					setTimeout('autoAttack(4)', 300);
		        }
		    }
		}
		request.send(null);
	}
}

function useScroll(callback) {
	var name = config.get('headhunter.selected');
	var login = document.getElementById('victim').value;
	document.getElementById('hmess').style['color'] = 'red';
	if(!login) {
		document.getElementById('hmess').innerHTML = 'А логин мне за вас вписывать?)';
		return;
	}
	if(!name) {
		document.getElementById('hmess').innerHTML = 'Выберите тип свитка!';
		return;
	}
	if(scrollsInUse) {
		document.getElementById('hmess').innerHTML = 'Уже используется!';
		return;
	}
	var sname = document.getElementById(name).getAttribute('title');
	if(!Scrolls[name] || Object.keys(Scrolls[name]).length < 1) {
		console.error(Scrolls[name]);
		document.getElementById('hmess').innerHTML = 'У вас нет `'+sname+'`';
		return;
	}
	if(config.get('battle.id') > 0 || config.get('user.rist') > 0) {
		if(!config.get('settings.headhunter.nextbattle')) {
			document.getElementById('hmess').innerHTML = 'Вы уже в бою.';
		} else {
			callback(false);
		}
		return;
	}
	scrollsInUse = true;
	document.getElementById('hmess').style['color'] = 'green';
	document.getElementById('hmess').innerHTML = 'Используем `'+sname+'`';

	var first = config.get('settings.headhunter.priority', 0);
	var use = [], selected = false;
	for(var id in Scrolls[name]) {
		if(name != 'scrollop' && name != 'scrollcp' && name != 'warb' && Scrolls[name][id][1] < 1) continue;

		if(first == 1 && Scrolls[name][id][4] == 2) {
           	use = Scrolls[name][id], selected = id;
           	break;
		} else if(first == 0 && Scrolls[name][id][4] == 1) {
           	use = Scrolls[name][id], selected = id;
           	break;
		}
		use = Scrolls[name][id], selected = id;
	}

	config.use({'url':use[2], 'sd4':use[3], 'id':use[0], 'login':login}, function(data, p) {
		scrollsInUse = false, scname = p[0], scid = p[1], whoa = p[2];
		if(data.indexOf('value="Вперед') > -1 || data.indexOf('исцелен!') > -1) {
			if(scname != 'scrollop' && scname != 'scrollcp' && scname != 'warb') {
                var item = Scrolls[scname][scid], count = +item[1];
                Scrolls[scname][scid][1]--;
				count--;
				document.getElementById(scname).getElementsByTagName('b')[0].innerHTML = count;
			}
			document.getElementById('hmess').innerHTML = 'Успешно ['+scname+'#'+scid+']('+count+')';
			document.getElementById('victim').value = '';
			if(callback) callback(true);
			if(scname.substr(0, 4) != 'heal') {
				top.frames[2].location.href = '/fbattle.php';
			} else {
				config.chatsend('private ['+whoa+'] +', 1);
			}
		} else {
			var error = '';
			var effects = config.searchAll("(?:<font color=red>|</fieldset>)\s*(?:<b>)?([^<'\"\+]+)(?:</b>)?\s*(?:</font>|<br>\s*<br>\s*<filedset>)?", data);
			for(var e in effects) {
				if(effects[e].indexOf('Данную вещь') < 0 && effects[e].indexOf('ойна') < 0 && effects[e].indexOf('начнется') < 0) {
					error += effects[e]+' ';
				}
			}
			for(var i in Texts) {
				if(error.indexOf(Texts[i]) > -1) {
					error = Texts[i];
					break;
				}
			}
			document.getElementById('hmess').style['color'] = 'red';
			if(!error) {
				document.getElementById('hmess').innerHTML = 'Неизвестная ошибка!';
        		//console.error(data);
			} else {
				document.getElementById('hmess').innerHTML = error;
			}
			if(callback) callback(false);
		}
	}, [name, selected, login]);
}

function run() {
	if(config.get('headhunter.run')) {
		config.set('headhunter.run', false);
		document.getElementById('autobatl').className = 'uses def';
		document.getElementById('autobatl').innerHTML = 'Нажмите для старта';
	} else {
		config.set('headhunter.run', true);
		document.getElementById('autobatl').className = 'uses run';
		document.getElementById('autobatl').innerHTML = 'Поиск...';
		autoAttack();
	}
}
//хх
var inputs = ['input', 'textarea', 'select'];
for(var i in inputs) {
	var nodes = document.getElementById('hauto').getElementsByTagName(inputs[i]);
	for(var n in nodes) {
		if(typeof(nodes[n]) != 'object' || nodes[n].getAttribute('type') == 'button') continue;
		var sname = nodes[n].getAttribute('name');
	    var value = config.get('settings.'+sname);
	    if(nodes[n].getAttribute('type') == 'checkbox') {
			if(!value) nodes[n].removeAttribute('checked');
		} else {
			nodes[n].value = value;
		}
		if(sname == 'headhunter.type') {
			value = +value;
			if(value < 2) document.getElementById('filter'+value).style.display = 'block';
		}

		nodes[n].onchange = function() {
		    var ename = this.getAttribute('name'), etype = this.getAttribute('type'),
		    value = (etype == 'checkbox') ? this.checked : this.value;
			if(this.nodeName == 'TEXTAREA') {
				value = value.split(',');
				for(var i in value) {
					value[i] = value[i].trim();
				}
			}
			config.set('settings.'+ename, value);
			if(ename == 'headhunter.type') {
				value = +value;
				console.debug('show '+value);
				document.getElementById('filter0').style.display = 'none';
				document.getElementById('filter1').style.display = 'none';
				if(+value < 2) document.getElementById('filter'+value).style.display = 'block';
			}
		}
	}
}

//хх работает?
if(config.get('settings.headhunter.enabled')) {
	document.getElementById('hht').style['display'] = 'table';
    document.getElementById('mes').style['margin-right'] = '20px';

	document.getElementById('hclean').onclick = function() {
		document.getElementById('victim').value = '';
	};

	document.getElementById('hbutton').onclick = function() {
		var display = 'block';
		if(this.innerHTML == '»') {
			this.innerHTML = '«';
			this.style['border-right'] = '0px';
			display = 'none';
		} else {
			this.innerHTML = '»';
			this.style['border-right'] = '1px outset #999999';
			if(!scrollsLoaded) {
				console.debug('first load scrolls by open hh window');
				findAllScrolls();
			}
		}
		document.getElementById('hinput').style['display'] = display;
		document.getElementById('ascrolls').style['display'] = display;
		document.getElementById('hauto').style['display'] = display;
		document.getElementById('tdhmess').style['display'] = display;
	};
	document.getElementById('hrefresh').onclick = function() {
		console.debug('load scrolls by refresh button');
		findAllScrolls();
	};
	var divs = document.getElementById('ascrolls').getElementsByTagName('div');
	for(var d in divs) {
		divs[d].onclick = function() {
			for(var x in divs) {
				divs[x].className = 'buimg';
			}
			this.className = 'buimg active';
			var sname = this.getAttribute('name');
			config.set('headhunter.selected', sname);
	        document.getElementById('hmess').innerHTML = this.getAttribute('title');
			document.getElementById('hmess').style['color'] = 'green';
			if(sname.substr(0,4) == 'heal') {
            	document.getElementById('huse').value = 'Вылечить';
			} else {
                document.getElementById('huse').value = 'Напасть';
			}
		}
	}
	if(config.get('headhunter.selected')) {
		document.getElementById(config.get('headhunter.selected')).click();
	}
}

document.getElementById('autobatl').className = 'uses def';
document.getElementById('autobatl').innerHTML = 'Нажмите для старта!';
document.getElementById('autobatl').onclick = run;


