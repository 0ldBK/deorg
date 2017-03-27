console.debug('main panel loaded');
document.getElementsByTagName('ul')[0].setAttribute('id', 'ulbuttons');
document.getElementsByTagName('table')[0].setAttribute('id', 'maintable');
var PANEL = function(){/*
<img src='http://i.oldbk.com/i/fighttype3.gif' class='bimg' title='Перейти в заявки' onclick='top.frames[2].window.location.href="http://capitalcity.oldbk.com/zayavka.php?level=haos"'>
<img src='http://i.oldbk.com/llabb/s.gif' class='bimg' title='Личный сундук' onclick='top.frames[2].window.location.href="http://capitalcity.oldbk.com/bank.php?p=6&showinbox=1"'>
<div id='bswitch'>
	<div id='scroller' name='0'>
		<div id='scleft' title='Сменить на предыдущий'>&laquo;</div>
		<div id='sctext' title='Тип автобоя'>Автоудар</div>
	    <div id='scright' title='Сменить на следующий'>&raquo;</div>
	</div>
	<div id='switcher' title='Поставить/снять с паузы'>
		<div id='swpause'>на паузу</div>
	</div>
</div>
*/}.toString();
PANEL = PANEL.replace("function (){/*","");
PANEL = PANEL.replace("*/}","");

var ul = document.getElementById('ulbuttons');
ul.setAttribute('width', '');
ul.style['padding'] = '0px';

//настройки
var newLi = document.createElement('li');
newLi.setAttribute('id', 'setplugin');
newLi.className = 'btn1';
newLi.innerHTML = '&nbsp;';
newLi.onclick = function() {
	var set = top.document.getElementById('settings');
	if(set.style.display == 'block') {
		set.style.display = 'none';
	return;
	}
	set.style.display = 'block';
	config.load();
}
ul.insertBefore(newLi, ul.children[1]);

var newLi = document.createElement('li');
newLi.setAttribute('id', 'goto');
newLi.setAttribute('title', 'Быстрый переход');
newLi.className = 'btn1';
newLi.innerHTML = '&nbsp;';
ul.insertBefore(newLi, ul.children[ul.children.length-1]);

document.getElementById('goto').onclick = function() {
	var el = top.document.getElementById('goto');
	if(el.style.display != 'block') {
    	el.style.display = 'block';
	} else {
		el.style.display = 'none';
	}
}

//комплекты
var newLi = document.createElement('li');
newLi.setAttribute('id', 'armors');
newLi.setAttribute('title', 'Комплекты');
newLi.className = 'btn1';
newLi.innerHTML = '&nbsp;';
ul.insertBefore(newLi, ul.children[ul.children.length-1]);
document.getElementById('armors').onclick = function() {
	var pos = this.getBoundingClientRect();
	var el = top.document.getElementById('sets');
	top.document.getElementById('setscontent').style.left = +pos.right - 115;
	if(el.style.display != 'block') {
    	el.style.display = 'block';
    	var Sets = config.get('base.sets'), html = '';
    	var SS = config.get('settings.base.showsets');
    	//id,name
    	for(var s in Sets) {
    		if(SS != '' && +SS != +Sets[s][2]) continue;

        	html += '<div id="set'+Sets[s][0]+'" onclick="config.dressSet('+Sets[s][0]+');document.getElementById(\'sets\').style.display=\'none\'">[Вкладка '+Sets[s][2]+'] `'+Sets[s][1]+'`</div>';
    	}
    	top.document.getElementById('setscontent').innerHTML = html;
	} else {
		el.style.display = 'none';
	}
}

if(config.get('settings.ruines.enabled')) {
	//карта руин
	var newLi = document.createElement('li');
	newLi.setAttribute('id', 'ruins');
	newLi.setAttribute('title', 'Карта руин');
	newLi.className = 'btn1';
	newLi.innerHTML = '&nbsp;';
	ul.insertBefore(newLi, ul.children[ul.children.length-1]);
	document.getElementById('ruins').onclick = function() {
		var map = top.document.getElementById('rmap');
		if(map.style['display'] == 'block') {
			map.style['display'] = 'none';
		return;
		}
		var size = +config.get('settings.ruins.mapsize', 100);
		var w = 400 + size, h = 200 + (size / 2);
	    map.style['width'] = w;
	    map.style['height'] = h;
	    map.style['display'] = 'block';

	    var pmap = top.document.getElementById('ruinsmap');
	    var l = +config.get('settings.ruins.mappost', 0);
		var r = +config.get('settings.ruins.mapposr', 450);
		pmap.style['top'] = 58 + l;
	    pmap.style['right'] = r;
	}
}

var lis = ul.children.length-1;
var table = document.getElementById('maintable');
table.getElementsByTagName('td')[0].removeAttribute('width');
table.getElementsByTagName('td')[0].style['padding-left'] = '5px';
table.getElementsByTagName('td')[0].style['min-width'] = '5px';
table.getElementsByTagName('td')[0].innerHTML = '';
table.getElementsByTagName('td')[1].setAttribute('width', '390px');
table.getElementsByTagName('td')[1].style['min-width'] = '390px';
table.getElementsByTagName('td')[1].getElementsByTagName('table')[0].setAttribute('width', '100%');
table.getElementsByTagName('td')[5].setAttribute('width', '580px');
table.getElementsByTagName('td')[5].style['min-width'] = '580px';

var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'potion');
newDiv.className = 'ubutton';
newDiv.setAttribute('title', 'Выпить зелье пьяного мага');
newDiv.innerHTML = config.Counts['potion'];
newDiv.onclick = function() {
	config.useBut('potion');
}
table.getElementsByTagName('td')[0].appendChild(newDiv);

var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'buff');
newDiv.className = 'ubutton';
newDiv.setAttribute('title', 'Бафнуться магией');
newDiv.innerHTML = config.Counts['buff'];
newDiv.onclick = function() {
	config.useBut('buff');
}
table.getElementsByTagName('td')[0].appendChild(newDiv);

var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'sump');
newDiv.className = 'ubutton';
newDiv.setAttribute('title', 'Похлебать из колодца жизней');
newDiv.innerHTML = config.Counts['sump'];
newDiv.onclick = function() {
	config.useBut('sump');
}
table.getElementsByTagName('td')[0].appendChild(newDiv);

var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'icure');
newDiv.className = 'ubutton';
newDiv.setAttribute('title', 'Вылечить травму');
newDiv.innerHTML = config.Counts['icure'];
newDiv.onclick = function() {
	config.useBut('icure');
}
table.getElementsByTagName('td')[0].appendChild(newDiv);

var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'buter');
newDiv.className = 'ubutton';
newDiv.setAttribute('title', 'Зохавать калорий 0_о');
newDiv.innerHTML = config.Counts['but'];
newDiv.onclick = function() {
	config.useBut('but');
}
table.getElementsByTagName('td')[0].appendChild(newDiv);

var radio = document.getElementById('flashContent');
radio.innerHTML = PANEL;
radio.style['left'] = '0px';
radio.style['top'] = '6px';
radio.style['width'] = '100%';

//, 'тактика №1', 'тактика №2', 'тактика №3'
var bstypes = ['автоудары', 'автохаоты', 'авториста'];

document.getElementById('scright').onclick = function() {
	var i = +document.getElementById('scroller').getAttribute('name');
	bswitch(((i >= bstypes.length-1 ? 0 : i + 1)));
}
document.getElementById('scleft').onclick = function() {
	var i = +document.getElementById('scroller').getAttribute('name');
	bswitch((i < 1 ? bstypes.length-1 : (i - 1)));
}
document.getElementById('swpause').onclick = function() {
	var ispause = config.get('settings.battle.pause');
	var newp = ispause ? false : true;
	document.getElementById('swpause').innerHTML = (newp ? 'on pause' : 'work');
	document.getElementById('swpause').style['background'] = (newp ? '#8A282B' : '#008000');
	config.set('settings.battle.pause', newp);
	top.frames[2].location.href = "http://capitalcity.oldbk.com/fbattle.php?rnd="+Math.random();
}

function bswitch(i) {

	var bsheal = ['curehp', 'curehpah', 'curehprs', 'curehptc'];
	var bscolor = ['#FF0000', '#001FFF', '#000000', '#00750E'];
	if(+i > -1) {
		config.set('settings.battle.atype', i);
	} else i = config.get('settings.battle.atype');

	if(+config.get('settings.battle.'+bsheal[i]) > 0) {
    	document.getElementById('sctext').className = 'aheal';
	} else {
		document.getElementById('sctext').className = 'noheal';
	}
	document.getElementById('scroller').setAttribute('name', i);
    document.getElementById('sctext').style['color'] = bscolor[i];
    document.getElementById('sctext').innerHTML = bstypes[i];
    document.getElementById('swpause').innerHTML = (config.get('settings.battle.pause') ? 'on pause' : 'work');
    document.getElementById('swpause').style['background'] = (config.get('settings.battle.pause') ? '#8A282B' : '#008000');
}
bswitch();

function toDay(dayonly) {
	var day =new Date(), time_zone = (day.getTimezoneOffset()/60) + 3;
	time_zone *= 3600000;
	day.setTime( day.getTime() + time_zone );
	if(dayonly) day.setHours( 6 );
    return day.getTime();
}

function preZero(num) {
	num = +num > 0 ? +num : 0;;
    return num > 9 ? num : '0'+num;
}

var Months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
function getCount(name) {
	var count = 0;
	for(var c in config.Abilities[name]) {
		if(config.Abilities[name][c]) {
			count += +config.Abilities[name][c][4];
		}
	}
	if(document.getElementById(name)) document.getElementById(name).innerHTML = count;
	config.Counts[name] = count;
	return count;
}
function updater() {
	var lastcall = config.get('lastcall', {});
	var flood = +config.get('settings.base.floodtime', 0);
	var ts = +new Date();
	var time = Math.ceil(ts / 1000);
	var level = config.get('user.level', 0);
	level = level > 13 ? 13 : level;

	//console.debug('updater');

    if(time - lastcall['abil'] >= 900) {
    	config.set('lastcall.abil', time);
    	config.broadcast("http://capitalcity.oldbk.com/myabil.php?"+Math.random(), function(data) {
            if(level > 8) {
				var day = data.match(/День Противостояния начнётся ([0-9]+)\/([0-9]+)\/([0-9]+) ([0-9]+):([0-9]+)/i);
				if(day && day.length > 0) {
					var day = new Date(+day[3], (+day[2] - 1), +day[1], +day[4], 0, 0, 0);
					config.set('settings.base.dayofstandoff', day.getTime());
					var dp = day.getDate()+' '+Months[day.getMonth()]+' в '+preZero(day.getHours())+':00';
					ul.children[ul.children.length-1].children[0].innerHTML = "<img src='"+SERVER+"i/dp.png' id='dp' title='ДП начнётся: "+dp+"'>";
				} else {
					var day = toDay(true);
					config.set('settings.base.dayofstandoff', day);
					ul.children[ul.children.length-1].children[0].innerHTML = "<img src='"+SERVER+"i/dp.png' id='dp' class='active' title='ДП сейчас!'>";
				}
			}
            var buff = data.match(/(Отравление ядом|Подлый удар|Потрясение|Огненный ожог)<\/td>.*?<td[^>]*>.*?:.*?([0-9]+).*?<\/td>.*?<td[^>]*>[^0-9]*([0-9]*)[^0-9]*([0-9]*)/i);
			if(buff && buff.length > 0) {
				var count = +buff[2] + +buff[3]; count = count > 0 ? count : 0;
				var ids = {'Отравление ядом': 5007155, 'Огненный ожог': 5007152, 'Подлый удар': 5007153, 'Потрясение': 5007154};
	            config.Abilities['buff'][0] = [ids[buff[1]], 666, 0, count, count, 9999999999, '/myabil.php'];
				getCount('buff');
            }

			var cure = data.match(/(Лечение травм)<\/td>.*?<td[^>]*>.*?:.*?([0-9]+).*?<\/td>.*?<td[^>]*>[^0-9]*([0-9]*)[^0-9]*([0-9]*)/i);
			if(cure && cure.length > 0) {
				var count = +cure[2] + +cure[3]; count = count > 0 ? count : 0;
	            config.Abilities['icure'][1] = [57, 666, 0, count, count, 9999999999, '/myabil.php'];
				getCount('icure');
            }

			var sump = data.match(/(Колодец здоровья)<\/td>.*?<td[^>]*>.*?:.*?([0-9]+).*?<\/td>.*?<td[^>]*>[^0-9]*([0-9]*)[^0-9]*([0-9]*)/i);
			if(sump && sump.length > 0) {
				var count = +sump[2] + +sump[3]; count = count > 0 ? count : 0;
				config.Abilities['sump'][1] = [54, 666, 0, count, count, 9999999999, '/myabil.php'];
				getCount('sump');
			}
			data = null;
		});
		config.broadcast("http://capitalcity.oldbk.com/klan.php?razdel=main&"+Math.random(), function(data) {
			//  &nbsp;Лечение травм:(бесплатных 6/8)(купленных:0 шт.)
			var cure = data.match(/&nbsp;(Лечение травм):(?:\(бесплатных )?([0-9]+)\/([0-9]+)(?:\)\(купленных:\d+ шт.\))?<br>/i);
			if(cure && cure.length > 0) {
				var count = +cure[3] - +cure[2]; count = count > 0 ? count : 0;
	            config.Abilities['icure'][0] = [57, 666, 0, count, count, 9999999999, '/klan.php?razdel=main'];
	            getCount('icure');
            }

            //  &nbsp;Колодец здоровья:(бесплатных 13/45)(купленных:0 шт.)
			var sump = data.match(/&nbsp;(Колодец здоровья):(?:\(бесплатных )?([0-9]+)\/([0-9]+)(?:\)\(купленных:\d+ шт.\))?<br>/i);
			if(sump && sump.length > 0) {
				var count = +sump[3] - +sump[2]; count = count > 0 ? count : 0;
				config.Abilities['sump'][0] = [54, 666, 0, count, count, 9999999999, '/klan.php?razdel=main'];
				getCount('sump');
			}
			data = null;
		});

		config.parseInv(1);
    }
    var lastflood = (time - +lastcall['flood']);
	if(flood > 299 && (!lastflood || lastflood >= flood)) {
		console.debug('flood');
		config.set('lastcall.flood', time);
		var channel = config.get('settings.base.channel', 8);
		var nextp = config.get('settings.base.nextphrase', 0);
		var textp = config.get('settings.base.flood'+nextp, false);
		if(textp) {
			nextp++;
		} else {
			nextp = 1;
			textp = config.get('settings.base.flood', false);
		}
        if(textp) {
        	config.set('settings.base.nextphrase', nextp);
        	if(channel == 666) {
				config.chatsend(textp, 1);
				config.chatsend(textp, 8);
			} else {
                config.chatsend(textp, channel);
			}

        }
	}

	if(time - lastcall['info'] >= 20) {
		config.set('lastcall.info', time);
		config.user(config.uid, function(user) {
			if(typeof(user) == 'object') {
				config.set('user',user);
				config.title();
				if(user.bid < 1 && user.inv < 1) {
					try {
						if(top.frames[2].location.href.indexOf('/fbattle') > 0) {
							console.error('Fix battle!');
							top.frames[2].document.forms['att'].submit();
							config.set('battle', null);
						} else if(config.get('battle.id') > 0) {
							console.error('Fix battle! by clean data');
							top.frames[2].location.href = top.frames[2].location.href;
							config.set('battle', null);
						}
					} catch(e) {}
				}
				if(user.bid < 1 && user.rist < 1 && config.get('battle.id') < 1) {
					if(time - lastcall['eat'] >= 900) {
						config.set('lastcall.eat', time);
						config.parseInv(2);
						config.parseBuff();
					}
					if(config.get('settings.base.redhp')) {
						config.undressAll(function(ok) {
							config.dressSet('redhp-tmp', function(ok) {
								if(!ok) {
									config.message('Не удалось переодеться...', 'Сброс HP', 'red');
								} else {
									//config.message('Не удалось переодеться...', 'Сброс HP', 'red');
								}
							}, true);
						}, true);
					}
				}
			}
		});
	}
	if(time - lastcall['timers'] >= 60) {
		config.set('lastcall.timers', time);
		config.doska(function (data) {
            var subtime = data['haos'][1], addtime = 0;

            if(+data['haos'][0] > level) {
                //addtime += (((level-8) + (data['haos'][0]-level)) * 3600);
                addtime += (8 - (data['haos'][0] - level)) * 3600;
            } else if(level > +data['haos'][0]) {
                addtime += (level - data['haos'][0]) * 3600;
            }
            config.set('cooldowns.haos', (subtime + addtime));
            if(level > 6) {
                if(data['arena'+level] && (!data['arena7-21'] || +data['arena'+level][1] < +data['arena7-21'][1])) {
                    config.set('cooldowns.arena', data['arena'+level][1]);
                    config.set('cooldowns.alevel', level);
                } else if(data['arena7-21']) {
                    config.set('cooldowns.arena', data['arena7-21'][1]);
                    config.set('cooldowns.alevel', '7-21');
                } else config.set('cooldowns.arena', 0);
            }
            config.timers();
        });

		if (config.get('settings.anticaptcha.key')) {
            config.recognize.getBalance(function (error, result) {
                if (error || !result || !result.hasOwnProperty('balance')) {
                    return;
                }
                var balanceEl = window.top.document.getElementById('ac-balance');
                if (!balanceEl) {
                	return;
				}
				balanceEl.innerText = result.balance.toFixed(1) + '$';
            });
		}
	}

	config.broadcast("{server}base/timers.php?bid="+config.get('battle.id')+"&"+Math.random(), null, null, false);
	setTimeout(function() {
		updater();
	}, 10000);
}

config.set('lastcall.eat',0);
config.set('lastcall.abil',0);
config.set('lastcall.timers',0);
config.set('lastcall.info',0);
updater();

/*
top.document.getElementById('iRait').src='http://darkrst.ru/';
setTimeout(function() {
	top.document.getElementById('iRait').src='/null.php';
	top.document.getElementById('iRait').src='http://darkrst.ru/';
	setTimeout(function() {
		top.document.getElementById('iRait').src='/null.php';
	}, 60000);
}, 600000);
*/

if(document.body.clientWidth < 1080) {
	document.getElementById('icure').style.display = 'none';
	document.getElementById('sump').style.display = 'none';
}
if(config.get('settings.base.buffname') == '') {
	document.getElementById('buff').style.display = 'none';
}
