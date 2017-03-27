function refreshPeriodic() {}
if(typeof timerID !== 'undefined') {
	clearTimeout(timerID);
}
timerID=setTimeout(function() {
	window.location.href=window.location.href
}, 60000);

var html = document.body.innerHTML;
var ids = document.getElementsByName('gocombat');

if (typeof confirm_fight === 'undefined') {
    var confirm_fight = function confirm_fight() {
        top.$('[name="confirm2"]', document).click()
    }
}

function markbtl() {

	var checked = false;
	//[0:автоудар, 1:7=ёлка|3=велик, 2:3=группа|6=кровь, 3:таймаут, 4:время до начала, 5:случайный?, 6:сейчас в заявке, 7:общее кол-во]
	var battles = config.searchAll("<font[^>]+>([^<]+)<\\/font>.+?<(?:b|i)>([^<]+)<\\/(?:b|i)>.+?тип боя: (?:<IMG[^>]+(achaos)[^>]+>)?(?:<IMG[^>]+fight[^0-9]+([0-9]+)[^>]+>)?(?:<IMG[^>]+fight[^0-9]+([0-9]+)[^>]+>)?\\(таймаут ([0-9]+) мин.\\).+?начнется через ([0-9\.]+)(.+?)(<u>случайно</u>)?\\s*\\(в заявке ([0-9]+)\\/([0-9]+)", html);
	console.debug('list of battles');
	console.debug(battles);

	var btypes = config.get('settings.haot.btype', {});
	var bloods = +config.get('settings.haot.withblood', 3);
	var randonly = +config.get('settings.haot.israndom', 0);
	var filterby = config.get('settings.haot.bcreators', []);
	var tostart = +config.get('settings.haot.tostart', 666);
	var peoples = 0;

	for(var b in battles) {
		var battle = battles[b];
		//группа набрана
		if(+battle[8] >= +battle[9]) continue;
		if(config.get('settings.haot.bfilter')) {
			var ok = false, creator = battle[1].toLowerCase();
			for(var f in filterby) {
				var filter = filterby[f].toLowerCase();
				if(filter == creator) {
					ok = true;
					break;
				}
			}
			if(ok) {
           		ids[b].checked = true;
           		checked = true;
           		break;
           	}
		continue;
		}
		//плохой таймаут
		if(+battle[5] > 5) continue;
		//плохой таймаут
		if(+battle[6] > tostart) {
			console.debug('leave battle if '+battle[6]+' > '+tostart);
			continue;
		}
		//заявка не случайная
		if(typeof(battle[8]) != 'string' && randonly == 2) continue;
		//заявка случайная
		if(typeof(battle[8]) == 'string' && randonly == 1) continue;
		var btype = 1, blood = false, btext = battle[7]+'';
                if (battle[3] === 7) {
                        btype = 21;
                } else if(+battle[10] >= 150 || btext.indexOf('Великий Хаотический Бой') > -1) {
			btype = 23;
		} else if(btext.indexOf('Автозаявка') > -1) {
			btype = 24;
		} else if((battle[3] == 8 || battle[4] == 8) && +battle[10] >= 100) {
	       	btype = 21;
		} else if((battle[3] == 20 || battle[4] == 20) && +battle[10] >= 100) {
	       	btype = 22;
		}
		if(+battle[3] == 6 || +battle[4] == 6) blood = true;
		if((blood && bloods == 3) || (!blood && bloods == 6)) continue;
		if(!btypes[btype]) continue;

		console.debug('selected '+btype);
        //выбираем с бОльшим числом тел
		if(peoples < 1 || +battle[9] > peoples) {
		   	peoples = +battle[9];
		   	ids[b].checked = true;
		   	checked = true;
		}
	}

	return checked;
}

if(html.indexOf('>Ожидаем начала группового боя') < 0) {
	var typeofview = document.getElementsByName('view')[0].checked;
	if(!typeofview && config.eq('settings.launched', 'autobattle')) {
		document.getElementsByName('view')[0].checked = true;
		document.getElementsByName('tmp')[0].click();
		config.message('Выбран показ всех заявок. Исправляю...', 'Автохаоты');
	}
    var selected = markbtl();

	if(!config.get('settings.anticaptcha.key') && document.getElementsByName('securityCode1').length > 0) {

		document.getElementById('zay').onsubmit = function() {
			document.getElementsByName('tmp')[0].setAttribute('disabled', 'disabled');
			var codes = ['securityCode','securityCode1','securityCode2'];
			var code = false, name = false;
			for(var i in codes) {
				name = codes[i];
				code = document.getElementsByName(name)[0];
				code = code ? code.value : false;
				if(code) break;
			}
			var num = document.getElementsByName('gocombat')[0].value;
			if(code > 0) {
				if(name == 'securityCode') {
					document.getElementsByName('securityCode')[0].value = code;
				} else {
					document.getElementsByName('securityCode1')[0].value = code;
					document.getElementsByName('securityCode2')[0].value = code;
					document.getElementsByName('open')[0].setAttribute('disabled', 'disabled');
				}
			}
		};

		document.getElementsByName('securityCode1')[0].onkeyup = function() {
			if(this.value.length == 3 && selected) {
				document.getElementById('zay').submit();
			}
		};

		if(selected) {
		   	document.getElementsByName('securityCode1')[0].focus();
		} else {
		  	document.getElementsByName('securityCode1')[0].setAttribute('placeholder', '^_^');
		}
	} else if(config.eq('settings.launched', 'autobattle') && config.get('settings.autobattle.ready')) {

		var waithp = +config.get('user.hp.0') < config.get('settings.autobattle.minhp', 0) || html.indexOf('>Вы слишком ослаблены') > -1 ? true : false;
		//пробуем одеться
		if(html.indexOf('>У вас не одет') > -1) {
			config.dressSet('plugin-haot');
		//травма
		} else if(html.indexOf('поединки с оружием слишком тяжелы для вас...<') > -1) {
			if(!config.get('settings.autobattle.waitcure')) {
				config.set('settings.launched', false);
				config.message('У вас травма, остановка бота', 'Автохаоты');
			}
		} else if(!waithp) {
			console.debug('!start');
            //config.message('Готовимся к бою', 'Автохаоты');

			if(config.get('settings.autobattle.bcreate')) {
				if(document.getElementById('dv1')) {
                	dv1.style.display='';
                	dv2.style.display='none';
                }
                var test = 6;
                var belements = {
                	'levellogin1': config.get('settings.autobattle.ztype', 0),
                	'travma': config.get('settings.autobattle.btype', false),
                	'hrandom': config.get('settings.autobattle.israndom', false),
                  	'startime2': config.get('settings.autobattle.startime', 300),
                	'autoblow': true, 'k': 3
                };
				for(var e in belements) {
					var name = e, value = belements[e];
					var el = document.getElementsByName(name);
					console.debug(el);
				    if(el.length > 0) {
				    	test--;
				    	if(el[0].type == 'checkbox') {
                        	el[0].checked = value;
				    	} else {
				    		el[0].value = value;
				    	}
				    }
				}
				if(test < 1) {
					config.message('Создаем заявку на бой', 'Автохаоты');
					document.getElementsByName('open')[0].click();
				} else {
					config.message('Ошибка создания боя. Несовпадение элементов '+test, 'Автохаоты');
				}
			} else if(selected) {
				//config.message('Принимаем заявку на бой', 'Автохаоты');
				var securityCode = document.getElementsByName('securityCode1'),
					image = document.querySelector('img[src^="sec1.php"]');
				if (image && config.get('settings.anticaptcha.key')) {
					config.recognize(image.getAttribute('src'), function (error, code) {
						config.set('anticaptcha.image', null);
						if (error) {
							config.message(error.message || error, 'Антикапча', 'red');
						}
						securityCode = securityCode && securityCode[0];
						if (securityCode) {
							securityCode.value = code;
							confirm_fight();
						}
					});
				} else {
					confirm_fight();
				}
			}
		} else {
			console.debug('wait');
		}
	}

}
