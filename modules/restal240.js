function refreshPeriodic() {}
if(timerID) clearTimeout(timerID);
timerID=setTimeout(function() {	window.location.href=window.location.href
}, 30000);

//console.debug('Дристалище');

var html = document.body.innerHTML;
html = html.split('\n').join('');

var isactive = config.eq('settings.launched', 'autorist');

if(isactive && !config.get('settings.autorist.ready')) {
	console.debug('Ждём проверки магии...');
} else if(isactive && !config.get('settings.autorist.go')) {
	console.debug('Ждем проверки герба и еды ...');
} else if(isactive && html.indexOf('"Выйти из группы"') > -1) {	/*	//0 = обычный 1 = х2
	var coattype = +config.get('settings.autorist.familycoat', 0);
    config.broadcast('/restal240.php?getgerb=true&rnd='+Math.random(), function(data) {
		if(data.indexOf('У Вас не хватает кредитов на покупку Фамильного Герба') > -1) {
			config.message('`Фамильный Герб` недостаточно кредитов! Стопаем бота.', 'Авториста');
			return launcher('autorist no kredits for coat', false);
		}
	});
    */
	console.debug('Ждем начала');
	//если мы создаем
	if(config.get('settings.autorist.creator')) {		//стартуем
		if(html.indexOf('>Начать<') > -1) {			config.message('Всё готово, все собраны, стартуем.', 'Авториста');
			config.broadcast('/restal240.php', function(data) {				if(data.indexOf('Турнир не может начаться!') > -1) {					config.message('У кого-то нет герба, стопаем бота.', 'Авториста');
					config.set('settings.launched', false);
				} else {
					config.message('Группа собрана, начинаем.', 'Авториста');
					config.set('settings.autorist.inbattle', true);
					window.location.href = window.location.href;
				}
			}, 'startr=%CD%E0%F7%E0%F2%FC');
		} else {			//покупаем пустые места
			var listoffree = config.searchAll("document\\.getElementById\\('place'\\)\\.value=([0-9]+)", html);
			var freeplaces = listoffree.length;			var leaveplaces = +config.get('settings.autorist.pleaves', 0);
			if(leaveplaces > 0 && leaveplaces >= freeplaces) {				var nextplace = +listoffree[0];
				config.message('Покупаем место #'+nextplace, 'Авториста');				config.broadcast('/restal240.php', function(data) {
					if(data.indexOf('в Банк для авторизации...<') > -1) {						config.message('Нет авторизации в банке, стопаем бота!', 'Авториста');
						config.set('settings.launched', false);
					} else if(data.indexOf('>Докупить места можно только') > -1) {						config.message('У вас нет Platinum Account, стопаем бота!', 'Авториста');
						config.set('settings.launched', false);
					} else {
						config.message('Куплено место #'+nextplace, 'Авториста');
						window.location.href = window.location.href;
					}
				}, 'place='+nextplace);
			}
		}
	}

} else if(isactive) {
    var rgpass = config.get('settings.autorist.pass', '');

	//создаем заявку
	if(config.get('settings.autorist.creator')) {		config.message('Создаём группу.', 'Авториста');
		config.broadcast('/restal240.php', function(data) {			if(data.indexOf('>Группа создана!') > -1) {				config.message('Группа создана, ждём сбора.', 'Авториста');
				window.location.href = window.location.href;
			}
		}, 'nazv=go&mkcom=&mkpas='+rgpass+'&mknew=new');
	} else {		console.debug('Ищем автора для принятия заявки');
		var filterby = config.get('settings.autorist.bcreators', []);
		var groups = config.searchAll("<form[^>]+>\\s?<input[^>]+name=\"?'?grz\"?'?[^>0-9]+([0-9]+)[^>0-9]+>.+?<b>([^<]+)<\\/b>.+?<\\/form>", html);
        console.debug('!!');
        console.debug(groups);
		var ok = false;
		for(var g in groups) {			var gid = groups[g][0], creator = groups[g][1].toLowerCase();
			for(var f in filterby) {
				var filter = filterby[f].toLowerCase();
				if(filter == creator) {
					ok = true;
					break;
				}
			}
			if(ok) {				config.broadcast('/restal240.php', function(data) {
					if(data.indexOf('>Вы вошли в группу!') > -1) {
						config.message('Вошли в группу, ждём начала.', 'Авториста');
						window.location.href = window.location.href;
					} else if(data.indexOf('>Неверный пароль!') > -1) {						config.message('Неверный пароль, проверьте настройки!', 'Авториста');
					} else {						config.message('Что-то непонятное!', 'Авториста');
					}
				}, 'grz='+gid+'&turpass='+rgpass+'&gogr=yes');
				break;
			}
		}
		if(!ok) config.message('Пока нет никого из создающих, ждем.', 'Авториста');
	}
}
