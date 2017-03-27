var GHTML = function(){/*

	<div id='gifter' style='display: none;'>
		<table>
		<tr>
			<td style='width: 200px;'>Щедрая душа <b id='gcount'>...</b></td>
			<td id='gstatus'>Загрузка данных...</td>
			<td style='width: 200px;'><input id='victim' name='victim' value='' placeholder='Введите ник кому дарить'></td>
		    <td style='width: 100px;'>
				<div id='gsender' onclick='gifter.giftOn("Ручное отключение");' class='uses' disabled>Дарить</div>
			</td>
		</tr>
		<tr>
			<td>Плюшкин <b id='scount'>...</b></td>
			<td id='sstatus'>Загрузка данных...</td>
			<td>
				<input id='giftname' name='giftname' value='' placeholder='Фильтр по подарку. Пусто = любые'>
			</td>
		    <td>
				<div id='gsaver' onclick='gifter.saveOn("Ручное отключение");' class='uses' disabled>Сохранить</div>
			</td>
		</tr>

		</table>
    </div>

*/}.toString();
GHTML = GHTML.replace("function (){/*","");
GHTML = GHTML.replace("*/}","");

var newDiv = document.createElement('span');
newDiv.innerHTML = GHTML;
document.body.appendChild(newDiv);

document.getElementById('giftname').value = config.get('settings.gifter.giftname', '');
document.getElementById('victim').value = config.get('settings.gifter.victim', '');

config.set('settings.gifter.active', false);

console.debug('gift++');

var Gifter = function() {	this.gifts = new Array();
	this.saves = new Array();
	this.gcount = 0;
    this.scount = 0;
    this.gneed = 0;
    this.sneed = 0;

    this.init = function() {    	var This = this;    	config.timers(function(ok) {    		if(!ok) {    			setTimeout(function() {
					This.init();
				}, 13);
				return;
    		}
    		var needsave = config.get('cooldowns.giftssave');
    		var needgive = config.get('cooldowns.giftsgive');

            if(typeof(needgive) == 'number') {
    			document.getElementById('gsender').removeAttribute('disabled');
    			document.getElementById('gsender').className ='uses def';
    			document.getElementById('gcount').innerHTML = '['+(500 - needgive)+'/500]';
    			document.getElementById('gstatus').innerHTML = 'Можно начинать';
    		} else {    			document.getElementById('gstatus').innerHTML = 'Квест не взят!';
    			document.getElementById('gcount').innerHTML = '[---/---]';
    		}
    		if(typeof(needsave) == 'number') {
    			document.getElementById('gsaver').removeAttribute('disabled');
    			document.getElementById('gsaver').className ='uses def';
    			document.getElementById('scount').innerHTML = '['+(200 - needsave)+'/200]';
    			document.getElementById('sstatus').innerHTML = 'Можно начинать';
    		} else {
    			document.getElementById('sstatus').innerHTML = 'Квест не взят!';
    			document.getElementById('scount').innerHTML = '[---/---]';
    		}
    	});
    }

    this.broadcast = function(url, callback, data) {
		var xhr = new XMLHttpRequest();
		xhr.open((data?"POST":"GET"), url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4) {
		        if (this.status == 200) {
		        	var html = this.responseText;
		        	html = html.replace(/(\n|\r|\t)/g, "");
					if(callback) callback(html);
					html = null;
		        } else {
		        	if(callback) callback(false);
		        }
		        callback = null;
		  	}
		}
		xhr.send((data ? data : null));
		xhr = null;
	}

    this.giftOn = function(message) {    	this.gcount = 0;
    	if(config.get('settings.gifter.active')) {    		config.set('settings.gifter.active', false);
    		document.getElementById('gsender').className ='uses def';			config.message(message, 'Автодарилка');
    	return;
    	}
    	config.set('settings.gifter.active', true);
		document.getElementById('gstatus').innerHTML = 'Начинаем дарить...';
		document.getElementById('gsender').className ='uses run';
		this.giveGifts();
	}

	this.saveOn = function(message) {
		this.scount = 0;
    	if(config.get('settings.gifter.active')) {
    		config.set('settings.gifter.active', false);
    		document.getElementById('gsaver').className ='uses def';
			config.message(message, 'Автодарилка');
    	return;
    	}
    	config.set('settings.gifter.active', true);
		document.getElementById('sstatus').innerHTML = 'Начинаем сохранять...';
		document.getElementById('gsaver').className ='uses run';
		this.saveGifts();
	}

	this.saveGifts = function() {		if(!config.get('settings.gifter.active')) return false;

		var This = this;
		if(this.scount < 1) {
			document.getElementById('sstatus').innerHTML = 'Получаем кол-во свитков...';
			config.parseInv(1, function(inv) {				This.saves = new Array();
				var savers = ['Сохранение подарка 10', 'Сохранение подарка 50', 'Сохранение подарка 100'];
                for(var i in savers) {                	var name = savers[i], scrolls = inv[name];
                	if(scrolls && scrolls.length > 0) {                		for(var s in scrolls) {                        	var id = scrolls[s][0], count = +scrolls[s][4];
                        	while(count) {                        		This.saves.push([id, name]);                        		count--;
                        	}
                		}

                	}
                }

                This.broadcast('/itemschoice.php?get=1&del_time=1', function(list) {
		        	var savelist = config.searchAll("selecttarget\\(\"?'?([0-9]+)\"'?\\).+?<a[^>]+>([^<]+)<\\/a>", list);
		        	var giftname = document.getElementById('giftname').value;
		        	giftname = giftname ? giftname.toLowerCase() : giftname;
		        	config.set('settings.gifter.giftname', giftname);
		        	var count = 0;
		        	for(var i in savelist) {
		        		if(!This.saves[count]) {
		        			break;
		     			}
		        		var id = savelist[i][0], name = savelist[i][1].toLowerCase();
		        		if(giftname != '' && giftname != name) continue;
		        		This.saves[count][2] = id;
		        		count++;
		        	}
		        	This.saves.splice(count);
		        	console.debug('list '+count);
		        	//answer("1","2");

		        	This.scount = count;
		        	if(count > 0) {
			        	document.getElementById('sstatus').innerHTML = 'Доступно для сохранения '+This.scount+'...';
	                    setTimeout(function() {
							This.saveGifts();
						}, 100);
					} else {						document.getElementById('sstatus').innerHTML = 'Нечего сохранять... проверьте наличие свитков и подарков';
						This.saveOn('Ошибка');
					}
				});

			});
		return;
		}
        var needsave = config.get('cooldowns.giftssave');
		if(!needsave || needsave < 1) {
			this.saveOn('Квест готов');
			this.broadcast('/quest_get.php?q=1&s=2', function(data) {
				window.location.href = window.location.href;
			});
		return;
		} else {			document.getElementById('scount').innerHTML = '['+(200 - needsave)+'/200]';
		}
		if(this.saves.length < 1) {
        	this.saveOn('Кончились свитки/подарки для сохранения');
		return;
        }

        var save = this.saves.shift();
        var id = save[0], name = save[1], target = save[2];
        document.getElementById('sstatus').innerHTML = '['+needsave+'>'+(needsave-1)+']['+target+'] Работаем...';

        this.broadcast('/main.php?edit=1&use='+id, function(list) {
        	if(list && list.indexOf("<b>Время стерто с ")) {        		document.getElementById('sstatus').innerHTML = '['+needsave+'>'+(needsave-1)+']['+target+'] Удачно сохранено';
        		var num = +config.get('cooldowns.giftssave', 0);
        		config.set('cooldowns.giftssave', num-1);
        		This.broadcast('main.php?edit=1&destruct='+target, function(drop) {        			if(drop && drop.indexOf('выброшен.</b>') > -1) {        				document.getElementById('sstatus').innerHTML = '['+needsave+'>'+(needsave-1)+']['+target+'] Удачно выброшено';
        			}        			setTimeout(function() {
						This.saveGifts();
					}, 800);
        		});
        	} else {
        		document.getElementById('sstatus').innerHTML = 'Ошибка сохранения!';
        		setTimeout(function() {
					This.saveGifts();
				}, 800);
        	}

		}, 'target='+target);
	}

	this.giveGifts = function() {		if(!config.get('settings.gifter.active')) return false;

		var victim = top.convert(document.getElementById('victim').value);
        if(!victim || victim.length < 3) {
			This.giftOn('Введите ник, кому будем дарить');
		return;
		} else {
			config.set('settings.gifter.victim', victim);
		}


		var This = this;		if(this.gcount < 1) {			document.getElementById('gstatus').innerHTML = 'Получаем список подарков';
			this.broadcast('/fshop.php?present=1', function(list) {				if(!list) {                	setTimeout(function() {
						This.giveGifts();
					}, 1000);
					return;
				}
				This.gifts = new Array();
				var gifts = config.searchAll("<tr[^>]+>.+?<input.+?([0-9]+)[^>]+?>.+?<td valign='?\"?top'?\"?>\\s?<a[^>]+>([^<]+)<\\/a>.+?<b>Цена: ([0-9]+)([^<]+)<\\/b>", list);
				for(var i in gifts) {
					var name = gifts[i][1], price = gifts[i][2], tprice = gifts[i][3], id = gifts[i][0];
					if(+price > 1 || tprice.indexOf('екр') > -1) continue;
	            	This.gifts.push([id, name]);
				}
				This.gcount = This.gifts.length;
				if(This.gcount > 0) {
			        document.getElementById('gstatus').innerHTML = 'Доступно для дарения '+This.gcount+'...';
					setTimeout(function() {
						This.giveGifts();
					}, 100);
				} else {					document.getElementById('gstatus').innerHTML = 'Нечего дарить... купите подарки с ценой 1кр';
					This.giftOn('Ошибка');
				}
			});
		return;
		}

        if(this.gifts.length < 1) {        	this.giftOn('Кончились подарки для дарения');
		return;
        }
        var needgive = config.get('cooldowns.giftsgive', 0);
        if(!needgive || needgive < 1) {
			this.giftOn('Квест готов');
			this.broadcast('/quest_get.php?q=1&s=2', function(data) {
				window.location.href = window.location.href;
			});
		return;
		} else {
			document.getElementById('gcount').innerHTML = '['+(500 - needgive)+'/500]';
		}

		var time = new Date();
		var day = top.preZero(time.getDate())+'.'+top.preZero(time.getMonth()+1)+'.'+(time.getYear()+1900);
        var gift = this.gifts.shift();
		var reason = top.convert(gift[1]);
		var data = "sid=&present=1&itemid="+gift[0]+"&to_login="+victim+"&podarok2="+reason+"&txt=&from=1&f_date="+day;

		document.getElementById('gstatus').innerHTML = '['+needgive+'>'+(needgive-1)+']['+gift[1]+'] Работаем...';

        this.broadcast('/fshop.php?present=1', function(list) {        	if(list && list.indexOf("Подарок будет доставлен в течение минуты.</font>")) {        		document.getElementById('gstatus').innerHTML = '['+needgive+'>'+(needgive-1)+']['+gift[1]+'] Удачно подарено';
        		var num = +config.get('cooldowns.giftsgive', 0);
        		config.set('cooldowns.giftsgive', num-1);
        	} else {        		document.getElementById('gstatus').innerHTML = '['+needgive+'>'+(needgive-1)+']['+gift[1]+'] Ошибка дарения!';
        	}
        	setTimeout(function() {
				This.giveGifts();
			}, 800);
		}, data);	}
}

var gifter = new Gifter();
gifter.init();
