/*document.getElementById('footer').innerHTML = '<h1><p>Доступ к плагину БЕЗ ОГРАНИЧЕНИЙ (не нужен Platinum-аккаунт) можно получить у меня по запросу совершенно БЕСПЛАТНО. Обращаться в скайп или приват. </p>'+
	'<p>Денис Фёдоров, причина ЧР смешна. По вопросам приобретения плага обращайтесь к Денису Фёдорову (Дэйвину) по телефону +7(921)1894975 или в скайп dawincheg </p></h2>'+
	'<h1><p>Добро пожаловать на Улицы! можно <a href="http://streets.world/" target="_blank">здесь(кликабельно).</a> </p></h1>';*/
var Url = window.location.href+"";
var uid = document.cookie.match(/battle=([^;]+)/i);
uid = uid ? Math.ceil(uid[1]) : 0;
var ses = document.cookie.match(/PHPSESSID=([^;]+)/i);
ses = ses ? ses[1] : false;

console.log('DVOK; Hello user '+uid+' ['+ses+']');

var firstLoad = false, scrollsLoad = 0, config = false;

var ObjectStorage = function ObjectStorage( name ) {
	var self, name = name || '_objectStorage';
	if ( ObjectStorage.instances[ name ] ) {
		self = ObjectStorage.instances[ name ];
	} else {
		self = this;
  		self._name = name;
  		self._init();
  		ObjectStorage.instances[ name ] = self;
	}
	return self;
};
ObjectStorage.instances = {};
ObjectStorage.prototype = {
	_save: function() {
		this[ 'local' ]['saved'] = (+new Date() / 1000);
		var stringified = JSON.stringify( this[ 'local' ] ), storage = window[ 'localStorage' ];
		if(!stringified || stringified == undefined ) {
			console.error('bad settings '+stringified);
			return;
		}
		console.log('save settings '+this._name);
		//console.log(stringified);
		storage.setItem( this._name, stringified );
	},
	_get: function() {
		this[ 'local' ] = JSON.parse( window[ 'localStorage' ].getItem( this._name ) ) || {};
	},
	_init: function() {
		var self = this;
		self._get();
		(function callee() {
			setTimeout.call(window, function () {
				self._save();
				callee();
			}, 300000 );
		})();
		if(window.addEventListener) {
	        window.addEventListener( 'beforeunload', function () {
	        	console.debug('save data before unload page');
	            self._save();
	        });
        } else {
	        window.onbeforeunload = function () {
	        	console.debug('save data before unload page 2');
	            self._save();
	        };
        }
	},
	local: {}, session: {}
};

var LocalSettings = new ObjectStorage( 'Special'+uid );

var BASEHTML = function(){/*
<table id='settings' class='settings' cellspacing=3 cellpadding=5 style='display: none;'>
<tr>
	<td align='center'>
	<img class='close' src='{server}/i/x.png' onclick="$('#settings').hide();">
	<div class='scrolled' id='main_settings' style='display: block;'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Включение модулей плагина</div>
			 	<label title='Включить модуль автоудара' style='padding: 5px;'>
					<input name='battle.enabled' type='checkbox' value='1'> Автоудары
				</label>
				<label title='Активировать модуль'>
					<input name='lab.enabled' type='checkbox' value='1'> Лабиринт
				</label>
				<label title='Автолаба  on/off'>
					<input name='lab.start' type='checkbox' value='1'> Автобот лабы
				</label>
				<label title='Активировать модуль' style='padding: 5px;'>
					<input name='ruines.enabled' type='checkbox' value='1'> Руины
				</label>
				<br>
				<label title='Активировать модуль' style='padding: 5px;'>
					<input name='headhunter.enabled' type='checkbox' value='1'> нападалка|лекарь
				</label>
                <br><br>
				<div class='header'>Сессия игры</div>
				<label title='Сессия'>
				 	<input name='PHPSESSID' type='text' value='' style='width: 100%'>
				</label>
	           	<div class='header'>Отображать комплекты д/одевания</div>
				<label title='В верхнем селекте'>
					<select name='base.showsets' style='width: 100%'>
						<option value=''>Все комплекты персонажа</option>
						<option value='1'>Основная вкладка</option>
						<option value='2'>Комплекты лабы</option>
						<option value='3'>Комплекты руин</option>
						<option value='4'>Комплекты замков</option>
						<option value='5'>Комплекты башни</option>
		           	</select>
	           	</label>
	           	<div class='header'>Предупреждения в чат</div>
				<label title='Инфо о ремонте'>
					<select name='base.repairalert' style='width: 100%'>
						<option value='0'>Не сообщать о поломке надетых вещей</option>
						<option value='2'>Сообщать когда осталось 2ед до поломки вещей</option>
						<option value='3'>Сообщать когда осталось 3ед до поломки вещей</option>
						<option value='5'>Сообщать когда осталось 5ед до поломки вещей</option>
						<option value='10'>Сообщать когда осталось 10ед до поломки вещей</option>
		           	</select>
				</label>
				<label title='Инфо о Исчадии Хаоса'>
					<select name='base.chaosalert' style='width: 100%'>
						<option value=''>Не сообщать об Исчадии Хаоса в чате</option>
						<option value='1'>Флудить об Исчадии Хаоса раз в минуту(пока он жив)</option>
		           	</select>
				</label>
				<div class='header'>Размер главного фрейма</div>
				<label title='Изменится после обновления ВСЕЙ страницы.' nowrap>
					<input style='height:  19px; width: 90%;' type='range' min='10' max='95' step='0.5' value='75' name='base.chatsize' id='bc' /> <i id='bci'>75.0%</i>
			    </label>
			    <div class='header' style='color: red;'>Бафф магией</div>
				<label title='Выберите бафф, которым вас обкастовывать' nowrap>
					<select name='base.buffname' style='width: 100%'>
						<option value=''>Выберите стихию</option>
						<option value='Гнев Ареса'>Гнев Ареса (огонь)</option>
						<option value='Укус Гидры'>Укус Гидры (вода)</option>
						<option value='Обман Химеры'>Обман Химеры (земля)</option>
						<option value='Вой Грифона'>Вой Грифона (воздух)</option>
		           	</select>
			    </label>
			    <label title='Обкаст зельем пьяного мага'>
					<input name='base.buffpotion' type='checkbox' value='1'> +Пить Зелье Пьяного Мага
				</label>
				<label title='Обкаст защитной магией'>
					<input name='base.buffshield' type='checkbox' value='1'> +Юз свитка «Защита от магии»
				</label>
				<br>
				<label title='Обкаст ярмарочной магией'>
					<input name='base.buffrage' type='checkbox' value='1'> +Юз свитка «Неукротимая ярость»
				</label>
				<label title='Обкаст ярмарочной магией'>
					<input name='base.buffskin' type='checkbox' value='1'> +Юз свитка «Каменная кожа»
				</label>
				<br>
				<div class='header' title='Список для отображения. После установки обновите страницу.'>Верхний статус бар.</div>
				<label title='Время до следующего квеста.'>
					<input name='base.nshowinfo.1' type='checkbox' value='1'> КД Загорода
				</label>
				<label title='Время до посещения руин.'>
					<input name='base.nshowinfo.2' type='checkbox' value='1'> КД Руин
				</label>
				<label title='Время до следующего Исчадия Хаоса вашего уровня.'>
					<input name='base.nshowinfo.4' type='checkbox' value='1'> КД Лабы
				</label>
				<br>
				<label title='Время до следующего Исчадия Хаоса вашего уровня.'>
					<input name='base.nshowinfo.6' type='checkbox' value='1'> Исчадие Хаоса
				</label>
				<label title='Опыт до апа/уровня.'>
					<input name='base.nshowinfo.0' type='checkbox' value='1'> Опыт до апа
				</label>
				<label title='КД свитков репутации и рунного опыта'>
					<input name='base.nshowinfo.9' type='checkbox' value='1'> КД свитков
				</label>
				<label title='Радио... :('>
					<input name='base.nshowinfo.10' type='checkbox' value='1'> <b>Радио</b>
				</label>
				<div class='header' title='Порядок в инвентаре.'>Ивентарь. Закладка по умолчанию/компоновка</div>
				<label title='Выберите закладку, которая будет по умолчанию при открытии инвентаря' nowrap>
					<select name='base.bookmark' style='width: 100%'>
						<option value='0'>Закладка по умолчанию: Обмундирование</option>
						<option value='1'>Закладка по умолчанию: Заклятия</option>
						<option value='2'>Закладка по умолчанию: Прочее</option>
						<option value='3'>Закладка по умолчанию: Карман</option>
		           	</select>
			    </label><br>
			    <label title='Обмундирование'>
			    	<input name='base.pack.0' type='checkbox' value='1'> <img src="http://i.oldbk.com/i/g1.gif" style="cursor: pointer;">Обмундирование
				</label>
				<label title='Заклятия'>
					<input name='base.pack.1' type='checkbox' value='1'> <img src="http://i.oldbk.com/i/g1.gif" style="cursor: pointer;"> Заклятия
				</label>
				<label title='Прочее'>
					<input name='base.pack.2' type='checkbox' value='1'> <img src="http://i.oldbk.com/i/g1.gif" style="cursor: pointer;">Прочее
				</label>
				<label title='Карман'>
					<input name='base.pack.3' type='checkbox' value='1'> <img src="http://i.oldbk.com/i/g1.gif" style="cursor: pointer;">Карман
				</label>
				<br>
				<small>Иначе никак, сожалею. Т.к. придется делать лишний запрос к инвентарю, что нагрузит сервер бк.</small>
			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='chatsound_settings'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Настройки чата</div>
	            <label title='Автообновление списка игроков' style='padding: 5px;'>
					<input name='base.chatupdate' type='checkbox' value='1'> Автообновление чата
				</label>
				<label title='Скрывать перса из списка на локации' style='padding: 5px;'>
					<input name='base.chatoff' type='checkbox' value='1'> Выключать чат
				</label>
				<label title='Автопереключение на старый дизайн чата' style='padding: 5px;'>
					<input name='base.chatolddesign' type='checkbox' value='1'> Переход на старый дизайн чата
				</label>
				<br><br>
				<div class='header'>Удалять закладки чата</div>
				<label style='padding: 5px;' title='Изменится после обновления ВСЕЙ страницы.'>
					<input name='base.chatdeltab.2' type='checkbox' value='1'> Приваты
				</label>
				<label style='padding: 5px;' title='Изменится после обновления ВСЕЙ страницы.'>
					<input name='base.chatdeltab.3' type='checkbox' value='1'> Клан
				</label>
				<label style='padding: 5px;' title='Изменится после обновления ВСЕЙ страницы.'>
					<input name='base.chatdeltab.4' type='checkbox' value='1'> Группы
				</label>
				<br>
				<label style='padding: 5px;' title='Изменится после обновления ВСЕЙ страницы.'>
					<input name='base.chatdeltab.5' type='checkbox' value='1'> Системные
				</label>
				<label style='padding: 5px;' title='Изменится после обновления ВСЕЙ страницы.'>
					<input name='base.chatdeltab.6' type='checkbox' value='1'> Помощь
				</label>
				<label style='padding: 5px;' title='Изменится после обновления ВСЕЙ страницы.'>
					<input name='base.chatdeltab.8' type='checkbox' value='1'> Торговый
				</label>
				<div class='header'>Автофлудер (торговый - только в новом дизайне чата)</div>
				<select name='base.floodtime' style='width: 49%'>
					<option value='-1'>Автофлуд выключен</option>
					<option value='300'>Раз в 5 минут</option>
					<option value='600'>Раз в 10 минут</option>
					<option value='900'>Раз в 15 минут</option>
					<option value='3600'>Раз в 60 минут</option>
				</select><select name='base.channel' style='width: 49%'>
					<option value='8'>Торговый чат</option>
					<option value='1'>Общий чат</option>
					<option value='666'>В оба чата</option>
				</select>

	           	<br>
	           	<input name='base.flood' style='width: 100%; margin-top: 2px; text-align: left; padding-left: 5px;' type='text' value='' placeholder='Введите текст сообщения'>
                <br>
	           	<input name='base.flood1' style='width: 100%; margin-top: 2px; text-align: left; padding-left: 5px;' type='text' value='' placeholder='Введите второй текст сообщения'>
				<br>
	           	<input name='base.flood2' style='width: 100%; margin-top: 2px; text-align: left; padding-left: 5px;' type='text' value='' placeholder='Введите третий текст сообщения'>

                <br><br>

				<div class='header'>Озвучивать</div>
				<label title='Громкость'>
					<input style='height:  19px; width: 82%;' type='range' min='0' max='100' step='10' value='0' name='base.sounds.volume' id='soundvolume' /> <i id='soundvolumei'>0%</i>
			    </label>
			    <br>
			    <img src='{server}i/play.png' style='cursor: pointer;' id='soundsystem' name='system' title='Проиграть'>
				<label>
					<input name='base.sounds.system' type='checkbox' value='1'> Получение системного сообщения
				</label>
				<br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundprivate' name='private' title='Проиграть'>
				<label>
					<input name='base.sounds.private' type='checkbox' value='1'> Получение приватного сообщения
				</label>
				<br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundfriend' name='friend' title='Проиграть'>
				<label>
					<input name='base.sounds.friend' type='checkbox' value='1'> Друг вошёл онлайн
				</label>
				<br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundheal' name='heal' title='Проиграть'>
				<label>
					<input name='base.sounds.heal' type='checkbox' value='1'> Ваши жизни полностью восстановлены
				</label>
				<br><br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundattack' name='attack' title='Проиграть'>
				<label>
					<input name='base.sounds.attack' type='checkbox' value='1'> У вас начался бой (любой)
				</label>
				<br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundeattack' name='eattack' title='Проиграть'>
				<label>
					<input name='base.sounds.eattack' type='checkbox' value='1'> У вас закончился бой (любой)
				</label>
				<br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundendlaba' name='endlaba' title='Проиграть'>
				<label>
					<input name='base.sounds.endlaba' type='checkbox' value='1'> Лабиринт Хаоса пройден
				</label>
				<br>
				<img src='{server}i/play.png' style='cursor: pointer;' id='soundtrap' name='trap' title='Проиграть'>
				<label style='color: rgb(182, 95, 0);'>
					<input name='base.sounds.trap' type='checkbox' value='1'> Персонаж попал в вашу ловушку
				</label>
			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='save_settings'>
    	<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Экспорт настроек (скопировать в блокнот(НЕ в БК!), хранить на чёрный день.)</div>
				<textarea name='export' style='width: 100%; height: 150px; background: #ddd;font-size: 10px;'></textarea>
				<br><br>
				<div class='header'>Импорт настроек (вставить из блокнота, радоваться.)</div>
				<textarea name='import' id='import' style='width: 100%; height: 150px; background: #ddd;font-size: 10px;'></textarea>
				<input type='button' id='importit' value='Перезаписать'>
				<br><br>
				<div class='header'>Сохранение/Сброс настроек</div>
				<input type='button' id='saveit' value='Сохранить настройки'> &nbsp;&nbsp;&nbsp; <input type='button' id='dropit' value='Сбросить настройки'>
			    <br><br>
			    <div class='header'>Лог последнего лабиринта</div>
				<textarea name='lastlab' style='width: 100%; height: 150px; background: #ddd;font-size: 10px;'></textarea>

			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='battle_settings'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div id='sub_auto' class='subblock'>
					<div class='header'>Автоудары</div>
		            <input name='battle.stophp' type='text' value='0' maxlength='4'> Остановить удары при HP менее
		            <br>
		            <input name='battle.curehp' type='text' value='0' maxlength='4'> Автохил при HP менее(опция ниже включится)
		            <br>
		            <select name='battle.curetype' style='width: 100%'>
						<option value='onlyscrolls'>Автохил: только свитки</option>
						<option value='onlyinstalls'>Автохил: только встройки</option>
						<option value='firstscrolls'>Автохил: сначала свитки</option>
						<option value='firstinstalls'>Автохил: сначала встройки</option>
					</select>
                </div>

                <div id='sub_haot' class='subblock'>
					<div class='header'>Автохаоты (не бьём при 0 - 0)</div>
					<label title='Автоответ врагам, которых не бьём, в секундах' style='color: red'>
						<input name='battle.autoanswer' type='text' value='0' maxlength='4'> Время автоответа в секундах (0 = авторасчет)
					</label>
		            <br>
		            <label title='Остановка автоударов если хп ниже указанного'>
		            	<input name='battle.stophpah' type='text' value='0' maxlength='4'> Остановить удары при HP менее
		            </label>
		            <br>
		            <label title='Автохил свитками и встройками если хп ниже указанного'>
		            	<input name='battle.curehpah' type='text' value='0' maxlength='4'> Автохил при HP менее(опция ниже включится)
		            </label>
		            <br>

		            <select name='battle.curetypeah' style='width: 100%'>
						<option value='onlyscrolls'>Автохил: только свитки</option>
						<option value='onlyinstalls'>Автохил: только встройки</option>
						<option value='firstscrolls'>Автохил: сначала свитки</option>
						<option value='firstinstalls'>Автохил: сначала встройки</option>
					</select>
					<br><br>
					<label title='Убиваемся в автохаотах, если врагов +-1 уровень уже не осталось' style='color: red'>
						<input name='battle.autokill' type='checkbox' value='1'> Убиваться, если некого бить (+-1 уровень)
					</label>
					<br>
					<label title='Убиваемся в автохаотах, если в нашей тиме больше никого' style='color: red'>
						<input name='battle.autodie' type='checkbox' value='1'> Убиваться, если остались одни (нет сюзников)
					</label>
					<br>
					<label title='Не бьём клонов' style='color: red'>
						<input name='battle.leaveclons' type='checkbox' value='1'> Не бить клонов (игнорит до конца боя)
					</label>
					<br>
					<label title='Отображение мёртвых в тактике' style='color: red'>
						<input name='battle.showdied' type='checkbox' value='1'> Показывать мертвых в тактической панели
					</label>
					<br><br>
		            <table>
		            <tr>
						<td style='font-size: 11px;' class='tank-ac'>
							Танки
						</td>
						<td class='tank-ac'>
							<input name='battle.style.tankac.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.tankac.max' type='text' value='0' maxlength='2'> АК
						</td>
						<td class='tank-ad'>
							<input name='battle.style.tankad.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.tankad.max' type='text' value='0' maxlength='2'> АУ
						</td>
					</tr>
					<tr>
			            <td style='font-size: 11px;' class='dodge-ac'>
							Уверты
						</td>
			            <td class='dodge-ac'>
							<input name='battle.style.dodgeac.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.dodgeac.max' type='text' value='0' maxlength='2'> АК
			            </td>
						<td class='dodge-ad'>
							<input name='battle.style.dodgead.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.dodgead.max' type='text' value='0' maxlength='2'> АУ
						</td>
					</tr>
					<tr>
						<td style='font-size: 11px;' class='crit-ac'>
							Криты
						</td>
						<td class='crit-ac'>
							<input name='battle.style.critac.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.critac.max' type='text' value='0' maxlength='2'> АК
						</td>
						<td class='crit-ad'>
							<input name='battle.style.critad.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.critad.max' type='text' value='0' maxlength='2'> АУ
			             </td>
					</tr>
					<tr>
						<td style='color:navy;font-weight:bold;border: 0px;padding:0px'>
							Невиды | Мобы
						</td>
						<td style='border: 0px;padding:0px'>
							<input name='battle.style.inviz.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.inviz.max' type='text' value='0' maxlength='2'>
			            </td>
			            <td style='border: 0px;padding:0px'>
							<input name='battle.style.bad.min' type='text' value='0' maxlength='2'> -
							<input name='battle.style.bad.max' type='text' value='0' maxlength='2'>
		            	</td>
					</tr>
					</table>
		            Персонажи, которых бьём только по тайму. Ники через запятую.
		            <textarea name='battle.listusers' style='width: 100%; height: 150px; background: #ddd;'></textarea>

				</div>
                <div id='sub_rist' class='subblock'>
					<div class='header'>Ристалище (мобы)</div>
					<input name='battle.stophprs' type='text' value='0' maxlength='4'> Остановить удары при HP менее
		            <br>
		            <input name='battle.curehprs' type='text' value='0' maxlength='4'> Автохил при HP менее(опция ниже включится)
		            <br>
		            <select name='battle.curetypers' style='width: 100%'>
						<option value='onlyscrolls'>Автохил: только свитки</option>
						<option value='onlyinstalls'>Автохил: только встройки</option>
						<option value='firstscrolls'>Автохил: сначала свитки</option>
						<option value='firstinstalls'>Автохил: сначала встройки</option>
					</select>
		            <br>
					<label><input name='battle.risthp' type='checkbox' value='1'> Сначала бить мобов с полными HP</label>
		            <br><br>
		            <input name='battle.ristlast' type='text' value='0' maxlength='4'> Номер клона, об которого убиться(если кончились по списку)
					<br>
		            Бьём только этих мобов(ИмяМоба MinHP maxHP). Ники через запятую.
		            <textarea name='battle.listmobs' style='width: 100%; height: 150px; background: #ddd;' placeholder='Фобос 100 1000, Сын Ареса, Арг 200, Эвриала, Бриарей 0 500'></textarea>
				</div>
			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='mbattle_settings'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
			    <div class='header'>Автоматика</div>
				<label title='Автоматически снимать с паузы автоудары' style='color: red'>
					<input name='battle.resetpause' type='checkbox' value='1'> <b>Снимать с паузы в начале боя</b>
				</label>
				<br>
				<select name='battle.wewin' style='width: 100%; color: #800000;'>
	            	<option value='0'>Действие при сообщении о тайме: ждем врага</option>
					<option value='1'>Действие при сообщении о тайме: ставим победу</option>
					<option value='2'>Действие при сообщении о тайме: ставим ничью</option>
				</select>
				<br>
				<div class='header'>Интерфейс</div>
				<label title='Показывать уровни и время когда бил враг'>
					<input name='battle.showinfo' type='checkbox' value='1'> Показывать уровни и время удара врага в хаотах
				</label>
				<br>
				<div class='header'>Маринад</div>
				<label title='Задержка перед ударом в секундах' style='color: red'>
					<input name='battle.marinad' type='text' value='300' maxlength='6' width=100px> <b>Бить раз в Х секунд (0 = выкл)</b>
				</label>
				<br>
				<table>
				<tr>
					<td>
						<div class='header'>Удары</div>
			            <input title='голова' type='range' min='0' max='100' step='5' value='100' name='battle.style.strike.head' id='ra1' in='strike' /> <i id='ra1i'>100%</i><br>
						<input title='корпус' type='range' min='0' max='100' step='5' value='100' name='battle.style.strike.body' id='ra2' in='strike' /> <i id='ra2i'>100%</i><br>
						<input title='почки' type='range' min='0' max='100' step='5' value='100' name='battle.style.strike.groin' id='ra3' in='strike' /> <i id='ra3i'>100%</i><br>
						<input title='ноги' type='range' min='0' max='100' step='5' value='100' name='battle.style.strike.legs' id='ra4' in='strike' /> <i id='ra4i'>100%</i><br>
					</td>
					<td>
						<div class='header'>Блоки</div>
			            <input title='голова' type='range' min='0' max='100' step='5' value='100' name='battle.style.block.head' id='rb1' in='block' /> <i id='rb1i'>100%</i><br>
						<input title='корпус' type='range' min='0' max='100' step='5' value='100' name='battle.style.block.body' id='rb2' in='block' /> <i id='rb2i'>100%</i><br>
						<input title='почки' type='range' min='0' max='100' step='5' value='100' name='battle.style.block.groin' id='rb3' in='block' /> <i id='rb3i'>100%</i><br>
						<input title='ноги' type='range' min='0' max='100' step='5' value='100' name='battle.style.block.legs' id='rb4' in='block' /> <i id='rb4i'>100%</i><br>
			    	</td>
				</tr>
				</table>
				<br><br>
				<div class='header'>Невидимки (формат: ник/id, ник/id, ник/id)</div>
				<label title='Введите сюда ай-ди невидимок в формате ник/id через запятую'>
					<textarea name='battle.invisibles' style='width: 100%; height: 100px;' placeholder='Ник/id,Ник/id,Ник/id'></textarea>
				</label>
			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='laba_settings'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
		<td>
			<div class='header'>Основные</div>
			<label><input name='lab.enter' type='checkbox' value='1'> Автоматический вход в лабу</label> <br>
			<label style='color: #400040;'>
				<input name='lab.autosettings' type='checkbox' value='1'> Автоматическая установка настроек в лабах(автохил, пауза)
			</label> <br>
			<label style='color: #0A00FF;' title='Если лаба в кд, и включен атвовход, бот попробует найти у вас ключ от лабы и заюзать его.'>
            	<input name='lab.uselabkey' type='checkbox' value='1'> Юз ключа лабиринта (только при автовходе)
            </label> <br>
            <label><input name='lab.questenter' type='checkbox' value='1'> Не входить в лабу если не взят квест</label> <br>
            <label><input name='lab.questtake' type='checkbox' value='1'> Автоматически сдавать и брать квесты</label>
            <br><br>
			<label><input name='lab.exit' type='checkbox' value='1'> Выход из лабы (героик, обычная)</label> <br>
			<label><input name='lab.heroic' type='checkbox' value='1'> Автоматический переход в героик</label> <br>
			<label><input name='lab.autodrop.0' type='checkbox' value='1'> Автоматический сбор дропа</label>
			<br><br>
			<label><input name='lab.dealer' type='checkbox' value='1'> Перед выходом посетить старьёвщика</label> <br>
			<label title='Раздеваемся для продажи одетых артов. За стриптиз могут дать денег ;)'>
				<input name='lab.dealerundress' type='checkbox' value='1'> Устроить стриптиз перед барыгой
			</label><br>
			<label><input name='lab.sellcheque' type='checkbox' value='1'> Автоматом продавать чеки</label> <br>
			<label><input name='lab.sellarts' type='checkbox' value='1'> Автоматом продавать артефакты</label><br>
			<label><input name='lab.sellfigures' type='checkbox' value='1'> Автоматом обменивать осколки </label><br>
			<label><input name='lab.sellcharms2' type='checkbox' value='1'> Автоматом обменивать Чарки I > II </label><br>
			<label><input name='lab.sellcharms3' type='checkbox' value='1'> Автоматом обменивать Чарки II > III </label>
			<br><br>
			<label><input name='lab.leave' type='checkbox' value='1'> Не посещать пустые комнаты</label> <br>
			<label><input name='lab.leavequest' type='checkbox' value='1'> Посещение всех комнат при квестах на сбор</label> <br>
			<label><input name='lab.leavedoor' type='checkbox' value='1'> Считать двери[пусто,лова] за пустую комнату</label> <br>
			<label><input name='lab.leaveheal' type='checkbox' value='1'> Считать Живую Воду за пустую комнату</label> <br>
            <br>
			<label><input name='lab.heroicheal' type='checkbox' value='1'> Отхил перед героиком (долго при лове на ХП!) </label>
			<br>
			<label><input name='lab.setenter' type='checkbox' value='1'> Одевать перед лабой комплект с названием <b style='color: red'>plugin-laba</b></label>
			<br>
			<label><input name='lab.setexit' type='checkbox' value='1'> Одевать после лабы комплект с названием <b style='color: red'>plugin-pvp</b></label>
			<br>
			<label><input name='lab.saveonserver' type='checkbox' value='1'> Сохранять карту лабы на сервере после каждого боя</label>
			<br>
			<label title='Абилка есть только у тёмных! За вопрос ко мне `что это такое` кидаю игнор навечно. Учитесь читать хинты.'>
	           <input name='lab.abilities.1' type='checkbox' value='1'> <img src='http://i.oldbk.com/i/align_3.gif'> Жажда наживы в обычной лабе
	        </label>
	        <br>
	        <label title='Абилка есть только у тёмных! За вопрос ко мне `что это такое` кидаю игнор навечно. Учитесь читать хинты.'>
	           <input name='lab.abilities.0' type='checkbox' value='1'> <img src='http://i.oldbk.com/i/align_3.gif'> Жажда наживы в героике
	        </label>
            <br>
            <div class='header'>Антидоты</div>
            <label>
				<input name='lab.antidot.1' type='checkbox' value='1'> Использовать при ловушке на статы и одеть упавший сет.
           	</label>
            <br>
            <input name='lab.antidot.0' type='text' value='0' maxlength='3'> больше или равно мин (лова на скорость, 0 = выкл).
            <br>
            <label title='Если на персонаже есть пустые слоты вещей, бот остановится'>
				<input name='lab.stopifundress' type='text' value='0' maxlength='2'> СТОП! Если в Х слотов нет одетых вещей (0 = выкл)
           	</label>
			<br>
			<div class='header'>Нападения на мобов</div>
			<label title='Одевать свитки хила.'>
	           <input name='lab.attack.2.0' type='checkbox' value='1'>Одевать найденные свитки хила (90 х 2 | 180 х 5).
	        </label>
	        <br>
			<label title='Не забудьте включить автохил в автоударах!!!'>
	           <input name='lab.attack.2.1' type='checkbox' value='1'>При атаке считать HP с надетыми свитками
	        </label>
	        <br><br>
           	<input name='lab.attack.0.0' type='text' value='' maxlength='4'> Обычная лаба - левая половина карты<br>
            <input name='lab.attack.0.1' type='text' value='' maxlength='4'> Обычная лаба - правая половина карты <br>
           	<input name='lab.attack.1.0' type='text' value='' maxlength='4'> Героик - левая половина карты <br>
            <input name='lab.attack.1.1' type='text' value='' maxlength='4'> Героик - правая половина карты <br>

            <input name='lab.hpbosses.0.1' type='text' value='' maxlength='4'> HP для атаки Аэлла <br>
            <input name='lab.hpbosses.1.1' type='text' value='' maxlength='4'> HP для атаки Грифон <br>
            <input name='lab.hpbosses.2.1' type='text' value='' maxlength='4'> HP для атаки Химера <br>
            <input name='lab.hpbosses.3.1' type='text' value='' maxlength='4'> HP для атаки Гидра <br>
            <input name='lab.hpbosses.4.1' type='text' value='' maxlength='4'> HP для атаки Пирагмон <br>
            <input name='lab.hpbosses.5.1' type='text' value='' maxlength='4'> HP для атаки Амфисбена <br>
            <input name='lab.hpbosses.6.1' type='text' value='' maxlength='4'> HP для атаки Сын Ареса <br>
			<br>
			<div class='header'>Открывать двери</div>
			<b style='color: #0A00FF'><small>Ставим минимальное кол-во ключей для открытия. <br>
			1 = открыть если есть хотя-бы 1 ключ, 0 - не открывать</small></b>
			<br>
			<br>
			<label><input name='lab.use666' type='checkbox' value='1'>Использовать ключи 666 если нет обычных</label>
			<br>
			<label><input name='lab.opendoors.0.1' type='text' maxlength='2' value=''> Ключей для дверей с Никого</label><br>
			<label><input name='lab.opendoors.1.1' type='text' maxlength='2' value=''> Ключей для дверей с Монстр</label><br>
			<label><input name='lab.opendoors.2.1' type='text' maxlength='2' value=''> Ключей для дверей с Пандора</label><br>
			<label><input name='lab.opendoors.3.1' type='text' maxlength='2' value=''> Ключей для дверей с Лечилка</label><br>
			<label><input name='lab.opendoors.4.1' type='text' maxlength='2' value=''> Ключей для дверей с Аэлла</label><br>
			<label><input name='lab.opendoors.5.1' type='text' maxlength='2' value=''> Ключей для дверей с Грифон</label><br>
			<label><input name='lab.opendoors.6.1' type='text' maxlength='2' value=''> Ключей для дверей с Химера</label><br>
			<label><input name='lab.opendoors.7.1' type='text' maxlength='2' value=''> Ключей для дверей с Гидра</label><br>
			<label><input name='lab.opendoors.8.1' type='text' maxlength='2' value=''> Ключей для дверей с Пирагмон</label><br>
			<label><input name='lab.opendoors.9.1' type='text' maxlength='2' value=''> Ключей для дверей с Амфисбена</label><br>
			<label><input name='lab.opendoors.10.1' type='text' maxlength='2' value=''> Ключей для дверей с Сын Ареса</label><br>
			<br>
			<div class='header'>Автохил и бутерброды </div>
			<select name='lab.autoheal.1' style='width: 100%'>
            	<option value='0'>Не использовать бутерброды (в опциях ниже)</option>
				<option value='1'>Использовать бутерброды в обеих лабах(в опциях ниже)</option>
				<option value='2'>Использовать бутерброды только в героике(в опциях ниже)</option>
			</select>
			<br>
			<select name='lab.autoheal.0' style='width: 100%'>
            	<option value='0'>Порядок юза: открывать карту, кушать бутеры, ходить за ЖВ</option>
				<option value='1'>Порядок юза: открывать карту, ходить за ЖВ, кушать бутеры</option>
				<option value='2'>Порядок юза: кушать бутеры, ходить за ЖВ, открывать карту</option>
				<option value='3'>Порядок юза: ходить за ЖВ, кушать бутеры, открывать карту</option>
				<option value='4'>Порядок юза: ходить за ЖВ, открывать карту, кушать бутеры</option>
			</select>
			<br>
			<input name='lab.autoheal.4' type='text' value='0' maxlength='2'> Пить ЖВ при HP < XX% (0 = автоматический расчёт)<br>
			<input name='lab.autoheal.5' type='text' value='0' maxlength='2'> Бутеры при HP < XX% (0 = автоматический расчёт)
			<br>
			<div class='header'>Одевать после поднятия</div>
			<label>
				<input name='lab.set.2' type='checkbox' value='1'> В героик только если АВТОМАТИЧЕСКИ одето оружие ниже
           	</label>
           	<br>
           	<table style='width: 100%'>
           	<tr>
				<td style='width: 50%; border: 0px; padding: 0px;'>
					<label><input name='lab.dress.0' type='checkbox' value='1'> Дубинка Радости</label> <br>
					<label><input name='lab.dress.1' type='checkbox' value='1'> Топор Вихря</label>
				</td>
				<td style='width: 50%; border: 0px; padding: 0px;'>
				 	<label><input name='lab.dress.2' type='checkbox' value='1'> Щит Пророчества</label> <br>
					<label><input name='lab.dress.3' type='checkbox' value='1'> Щит Откровения</label>
				</td>
			</tr>
           	<tr>
				<td style='width: 50%; border: 0px; padding: 0px;'>
					<label><input name='lab.dress.4' type='checkbox' value='1'> Кольцо Жизни (КЖ)</label> <br>
					<label><input name='lab.dress.5' type='checkbox' value='1'> Великое Кольцо Жизни (ВКЖ)</label>
					<br>
					<label><input name='lab.dress.6' type='checkbox' value='1'> Закрытый шлем Развития</label> <br>
					<label><input name='lab.dress.7' type='checkbox' value='1'> Шлем Ангела</label>
					<br>
					<label><input name='lab.dress.8' type='checkbox' value='1'> Лучшие Ботинки</label>
				</td>
				<td style='width: 50%; border: 0px; padding: 0px;'>
					<label><input name='lab.dress.9' type='checkbox' value='1'> Панцирь Злости</label> <br>
					<label><input name='lab.dress.10' type='checkbox' value='1'> Доспех Хаоса</label> <br>
					<label><input name='lab.dress.11' type='checkbox' value='1'> Броня Ангела</label> <br>
					<label><input name='lab.dress.12' type='checkbox' value='1'> Броня Титанов</label> <br>
				</td>
			</tr>
			</table>
			<div class='header'>Выбрасывать после поднятия</div>
			<small>только вещи с пометкой `пропадёт после выхода из лабиринта`</small>
			<table width="100%" cellspacing="0">
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.0" type="checkbox" value="1">Дубинка Радости</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.1" type="checkbox" value="1">Меч Кромуса</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.2" type="checkbox" value="1">Топор Вихря</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.3" type="checkbox" value="1">Меч Героев</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.4" type="checkbox" value="1">Кольцо Жизни</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.5" type="checkbox" value="1">Великое Кольцо Жизни</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.6" type="checkbox" value="1">Щит Пророчества</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.7" type="checkbox" value="1">Щит Откровения</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.8" type="checkbox" value="1">Панцирь Злости</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.9" type="checkbox" value="1">Доспех Хаоса</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.10" type="checkbox" value="1">Броня Ангела</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.11" type="checkbox" value="1">Доспех -Броня Титанов-</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.12" type="checkbox" value="1">Закрытый шлем Развития</label></td>
				<td style="width: 50%; border: 0px; padding: 0px;"><label><input name="lab.artefacts.13" type="checkbox" value="1">Шлем Ангела</label></td>
			</tr>
			<tr>
				<td style="width: 50%; border: 0px; padding: 0px;" colspan="2"><label><input name="lab.artefacts.14" type="checkbox" value="1">Лучшие Ботинки</label></td>
			</tr>
			</table>
		</td>
		</tr>
		</table>
	</div>


	<div class='scrolled' id='autohaot_settings' style='display: block;'>
    	<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Настройки Автохаотов</div>
				<label title='Минимальные хп, при которых лезем в бой'>
					<input name='autobattle.minhp' type='text' value='500' maxlength='4'> Минимальные HP, при которых лезем в бой (не лечимся)
				</label><br>
				<label title='HP персонажа, при которых он считается одетым'>
					<input name='autobattle.maxhp' type='text' value='1000' maxlength='4'> HP персонажа, при которых он считается одетым
				</label><br>
				<label title='Опция автолабы' style='color: red'>
					<input name='autobattle.gotolab' type='checkbox' value='1'> Идти в Лабиринт Хаоса как спадёт КД на посещение
				</label><br>
				<label title='Бот будет ждать пока перса не вылечат'>
					<input name='autobattle.waitcure' type='checkbox' value='1'> Не отключать бота при травмах
				</label><br>
				<label title='Только если травма не дает вести бои'>
					<input name='autobattle.injureheal' type='checkbox' value='1'> Вылечиться от травмы абилкой (клан, личная)
				</label><br>
				<label title='Только если травма не дает вести бои'>
					<input name='autobattle.healinbs' type='checkbox' value='1'> Вылечиться от травмы в БС
				</label>
				<br>
				<label title='Только если опция ниже активна'>
					<input name='autobattle.artrepair' type='checkbox' value='1'> Заодно ремонтировать артефакты
				</label><br>
				<select name='autobattle.autorepair' style='width: 100%; color: #004080;'>
	            	<option value='0'>Не ремонтировать вещи (при надетой синей вещи бот остановится)</option>
					<option value='1'>Автоматически бегать и полностью ремонтировать шмот</option>
					<option value='2'>Автоматически бегать ремонтировать только синий шмот</option>
				</select>
				<br>
				<select name='autobattle.room' style='width: 100%; color: #004080;'>
	            	<option value='Торговый зал'>Во время работы сидим в `Торговый зал`</option>
					<option value='Зал Стихий'>Во время работы сидим в `Зал Стихий`</option>
                    <option value='Зал Тьмы'>Во время работы сидим в `Зал Тьмы`</option>
                    <option value='Зал Света'>Во время работы сидим в `Зал Света`</option>
                    <option value='Царство Стихий'>Во время работы сидим в `Царство Стихий`</option>
                    <option value='Царство Тьмы'>Во время работы сидим в `Царство Тьмы`</option>
                    <option value='Царство Света'>Во время работы сидим в `Царство Света`</option>
                    <option value='Будуар'>Во время работы сидим в `Будуар`</option>
                    <option value='Этажи духов'>Во время работы сидим в `Этажи духов`</option>
                    <option value='Комната для новичков 2'>Во время работы сидим в `Комната для новичков 2`</option>
                    <option value='Комната для новичков'>Во время работы сидим в `Комната для новичков 1`</option>
				</select>
				<br>
				<select name='autobattle.useheal' style='width: 100%; color: #004000;'>
	            	<option value='0'>Не лечиться бутерами и колодцами</option>
					<option value='1'>Сначала колодцы(клан, личные), затем бутеры</option>
					<option value='2'>Сначала бутеры, затем колодцы(клан, личные)</option>
					<option value='3'>Использовать только колодцы(клан, личные)</option>
					<option value='4'>Использовать только бутерброды</option>
				</select>
				<br>
				<div class='header'>Брать квесты</div>
				<label title='Бесстрашный воин'>
					<input name="autobattle.quest.0" type="checkbox" value="1"> Бесстрашный воин
				</label>
				<label title='Испытание Кровью'>
					<input name="autobattle.quest.3" type="checkbox" value="1"> Испытание Кровью
				</label>
				<label title='Всегда победа'>
					<input name="autobattle.quest.4" type="checkbox" value="1"> Всегда победа!
				</label>
				<br>
				<label title='Неформат'>
					<input name="autobattle.quest.1" type="checkbox" value="1"> Неформат!
				</label>
				<label title='Первичка'>
					<input name="autobattle.quest.2" type="checkbox" value="1"> Первичка!
				</label>
				<label title='Бои на букетах'>
					<input name="autobattle.quest.5" type="checkbox" value="1"> Бои на букетах
				</label>
                <label title='Ёлочное безумие'>
                    <input name="autobattle.quest.elka2017" type="checkbox" value="1"> Ёлочное безумие
                </label>

				<br>
				<div class='header'>Настройки принятия заявок</div>
				<label title='Заявка со случайным распределением'>
					<select name='haot.israndom' style='width: 100%'>
						<option value='0'>Тип распределения в бою: случайное и обычное</option>
						<option value='1'>Тип распределения в бою: только обычное</option>
						<option value='2'>Тип распределения в бою: только случайное</option>
					</select>
				</label>
				<br>
				<label title='Тип боя кровь/обычный'>
					<select name='haot.withblood' style='width: 100%'>
						<option value='0'>Тип боя: кровавый и обычный</option>
						<option value='3'>Тип боя: только обычный</option>
						<option value='6'>Тип боя: только кровавый</option>
					</select>
				</label>
				<br>
				<label title='До начала боя'>
					<select name='haot.tostart' style='width: 100%'>
						<option value='666'>До начала боя: пофиг сколько</option>
						<option value='5'>До начала боя: не более 5 минут</option>
						<option value='10'>До начала боя: не более 15 минут</option>
					</select>
				</label>
                <br>
				<label title='Велики'>
					<input name="haot.btype.23" type="checkbox" value="1"> Великий Хаотический Бой
				</label>
				<label title='Автозаявка'>
					<input name="haot.btype.24" type="checkbox" value="1"> Автозаявка
				</label>
				<label title='Ёлки'>
					<input name="haot.btype.21" type="checkbox" value="1"> Ёлки
				</label>
				<label title='Цветы'>
					<input name="haot.btype.22" type="checkbox" value="1"> Цветы
				</label>
				<label title='Прочие'>
					<input name="haot.btype.1" type="checkbox" value="1"> Прочие бои
				</label>
				<br><br>
				<div class='header'>Автоводила</div>
				<label title='Все фильтры выше игнорируются!'>
					<input name="haot.bfilter" type="checkbox" value="1"> Отмечать заявки только от персонажей из списка ниже
				</label>
				<br>
				<label title='Отмечать заявку только если её создали эти персонажи'>
					<textarea name='haot.bcreators' style='width: 100%; height: 40px;' placeholder='Фильтр ников, чьи заявки принимаем(только их)'></textarea>
				</label>
				<hr>
				<label title='Создание заявок'>
					<input name='autobattle.bcreate' type='checkbox' value='1'> Самостоятельно создавать заявки (вместо принятия)
				</label>
				<br>
				<label title='Заявки со случайным распределением'>
				    <input name='autobattle.israndom' type='checkbox' value='1'> Случайное распределение в бою (рандом = зло)
				</label>
				<br>
				<label title='Тип боя кровавый'>
				    <input name='autobattle.btype' type='checkbox' value='1'> Создавать бой без правил (кровавый)
				</label>
				<br>
				<label title='Время до начала'>
					<select name='autobattle.startime' style='width: 100%'>
						<option value='300'>До начала боя: 5 минут</option>
						<option value='600'>До начала боя: 10 минут</option>
						<option value='1800'>До начала боя: 30 минут</option>
					</select>
				</label>
				<br>
				<label title='Тип заявки'>
					<select name='autobattle.ztype' style='width: 100%'>
						<option value='0'>Тип заявки: Велик (150 человек)</option>
						<option value='7'>Тип заявки: Ёлки (100 человек)</option>
						<option value='11'>Тип заявки: Цветы (100 человек)</option>
						<option value='3'>Тип заявки: Ваш ур (50 человек)</option>
						<option value='6'>Тип заявки: +/-1 ур (50 человек)</option>
					</select>
				</label>
				<br><br>
                <ul>
					<li>Перед началом использования автохаотов, сохраните боевой комплект с именем `<b style='color: red'>plugin-pvp</b>`</li>
					<li>При включенной опции посещения Лабиринта Хаоса, бот пойдет в лабу при спадении КД, а после лабы вернется обратно в хаоты</li>
					<li>Бот идет ремонтироваться когда вещи становятся синими (2 единицы до поломки)</li>
					<li>При автоматическом взятии квеста на велики, и отсутсвии свечей в инвентаре, бот отключит взятие квестов.</li>
					<li>Бот умеет выбираться из залов в селекте выше, в других не включайте, может застрять. </li>
				</ul>

			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='autolord_settings'>
    	<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Настройки Автолорда</div>
				<label title='Чаша Смерти'>
					<input name='autolord.bowls.4' type='checkbox' value='1'> Юзать Чаша Смерти (РК100%)
				</label><label title='Чаша Крови'>
					<input name='autolord.bowls.2' type='checkbox' value='1'> Юзать Чаша Крови (РК150%)
				</label>
				<br>
				<label title='Чаша Триумфа'>
					<input name='autolord.bowls.3' type='checkbox' value='1'> Юзать Чаша Триумфа (РК170%)
				</label><label title='Чаша Могущества'>
					<input name='autolord.bowls.1' type='checkbox' value='1'> Юзать Чаша Могущества (РК200%)
				</label>
				<br><br>
				<label title='Условия нападения на лорда'>
					<input name='autolord.noscrolls' type='text' value='15'> Кол-во свитков у перса (должно быть для начала боя, макс 15)
				</label>
                <br>
				<label title='Условия нападения на лорда'>
					<input name='autolord.nocharges' type='text' value='10'> Кол-во встроек у перса (одето и заряжено, макс 11)
				</label>
				<br>
				<label title='Условия нападения на лорда'>
					<input name='autolord.noitems' type='text' value='14'> Кол-во одетых слотов на персе (броня/плащ/фу = 1 слот, макс 14)
				</label>
				<br>
				<label title='Скорость боя'>
					<select name='autolord.curetype' style='width: 100%'>
						<option value='360'>Упор в максимальный опыт с боя (автохил: HP перса - 360)</option>
						<option value='25'>Упор в максимальную скорость боя (автохил: HP перса - 25)</option>
		           	</select>
				</label>
                <br>
                <label title='Бафф едой'>
                	<select name='autolord.eatbuff' style='width: 100%'>
						<option value=''>Не использовать обкаст опытом</option>
						<option value='Хлеб'>Скушать `Хлеб` перед боем (если есть)</option>
						<option value='Завтрак викинга [6]'>Скушать `Завтрак викинга [6]` перед боем (если есть)</option>
						<option value='Завтрак кочевника [6]'>Скушать `Завтрак кочевника [6]` перед боем (если есть)</option>
						<option value='Завтрак легионера [6]'>Скушать `Завтрак легионера [6]` перед боем (если есть)</option>
						<option value='Обед воина [6]'>Скушать `Обед воина [6]` перед боем (если есть)</option>
						<option value='Обед дракона [6]'>Скушать `Обед дракона [6]` перед боем (если есть)</option>
						<option value='Завтрак викинга [8]'>Скушать `Завтрак викинга [8]` перед боем (если есть)</option>
						<option value='Завтрак кочевника [8]'>Скушать `Завтрак кочевника [8]` перед боем (если есть)</option>
						<option value='Завтрак легионера [8]'>Скушать `Завтрак легионера [8]` перед боем (если есть)</option>
						<option value='Обед воина [8]'>Скушать `Обед воина [8]` перед боем (если есть)</option>
						<option value='Обед дракона [8]'>Скушать `Обед дракона [8]` перед боем (если есть)</option>
						<option value='Малый обед воина'>Скушать `Малый обед воина` перед боем (если есть)</option>
						<option value='Малый обед дракона'>Скушать `Малый обед дракона` перед боем (если есть)</option>
		           	</select>
				</label>

				<br>
				<label title='Реген HP'>
					<input name='autolord.fullhp' type='checkbox' value='1'> Восстановить HP перед боем (бутер/реген)
				</label>
				<br>
				<label title='Финита ля комедиа'>
					<input name='autolord.onfinal' type='checkbox' value='1'> По окончании всех боёв идти в Торговый зал
				</label>
				<br><br>
                <ul>
					<li>Перед началом использования автолорда, сохраните боевой комплект с одетыми(!) свитками с именем `<b style='color:red'>plugin-lord</b>`</li>
					<li>Отмеченные чаши будут использованы в порядке понижения РК. Начиная с Чаши Могущества, заканчивая Чашей Смерти.</li>
					<li>Авторизуйтесь в банке, иначе не будет перезаряда екровых встроек, и проверьте наличие кредитов на счету. Автохилл на лорде включается автоматически.</li>
					<li>При старте лорда вас попросит ввести кол-во боёв. Если сегодня лорд не в кд, этот поход тоже будет учитываться(поставите 3 похода, бот заюзает 2 ключа и проведет три боя).</li>
					<li>Не включайте бота в БС, Руинах и т.п., в общем там, где он не сможет одеть комплект.</li>
				</ul>
			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='autorist_settings'>
    	<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Настройки Автористы</div>
				<label title='Условия начала ристалища'>
					<input name='autorist.noscrolls' type='text' value='15'> Кол-во свитков (должно быть для начала боя, макс 15)
				</label>
                <br>
				<label title='Условия начала ристалища'>
					<input name='autorist.nocharges' type='text' value='10'> Кол-во встроек (одето и заряжено, макс 11)
				</label>
				<br>
				<label title='Условия начала ристалища'>
					<input name='autorist.noitems' type='text' value='16'> Кол-во одетых слотов (броня/плащ/фу = 1 слот, без рун макс 11)
				</label>
				<br>
				<label title='HP персонажа, при которых он считается одетым'>
					<input name='autorist.maxhp' type='text' value='1000' maxlength='4'> HP персонажа, при которых он считается одетым
				</label><br>
				<label title='Опция автолабы' style='color: red'>
					<input name='autorist.gotolab' type='checkbox' value='1'> Идти в Лабиринт Хаоса как спадёт КД на посещение
				</label><br>
				<label title='Бот будет ждать пока перса не вылечат'>
					<input name='autorist.waitcure' type='checkbox' value='1'> Не отключать бота при травмах
				</label><br>
				<label title='Только если травма не дает вести бои'>
					<input name='autorist.injureheal' type='checkbox' value='1'> Вылечиться от травмы абилкой (клан, личная)
				</label><br>
				<label title='Этот перс будет создавать группу'>
					<input name="autorist.creator" type="checkbox" value="1"> Самостоятельно создавать группу (иначе принимает из списка ниже)
				</label>
				<br>
				<label title='Вход в группу только если её создали эти персонажи'>
					<textarea name='autorist.bcreators' style='width: 100%; height: 40px;' placeholder='Фильтр ников, чью группу принимаем(только их)'></textarea>
				</label>
				<br>
				<label title='Пароль для входа и создания группы'>
					<input name='autorist.pass' style='width: 55px; margin-top: 2px; text-align: center;' type='text' value='' placeholder='Der parol!'>
					<b>Введите пароль для создания/принятия (всем одинаковый)</b>
				</label>
				<br><br>
				<label title='Только если опция ниже активна'>
					<input name='autorist.artrepair' type='checkbox' value='1'> Заодно ремонтировать артефакты
				</label><br>
				<select name='autorist.autorepair' style='width: 100%; color: #004080;'>
	            	<option value='0'>Не ремонтировать вещи (при надетой синей вещи бот остановится)</option>
					<option value='1'>Автоматически бегать и полностью ремонтировать шмот</option>
					<option value='2'>Автоматически бегать ремонтировать только синий шмот</option>
				</select>
				<br>
                <label title='Покупаем места за екры только для Platinum!'>
					<select name='autorist.pleaves' style='width: 100%'>
						<option value='0'>Не докупать за екры свободные места</option>
						<option value='1'>Купить одно свободное место (1 екр)</option>
						<option value='2'>Купить два свободных места (2 екра)</option>
		           	</select>
				</label>
				<br>
                <label title='Тип герба'>
					<select name='autorist.familycoat' style='width: 100%'>
						<option value='0'>Использовать обычный герб (бот сам купит если нет в наличии)</option>
						<option value='1'>Использовать герб х2 (бот сам купит если нет в наличии)</option>
		           	</select>
				</label>
				<br>
				<label title='Бафф едой'>
					<select name='autorist.eatbuff' style='width: 100%'>
						<option value=''>Не использовать обкаст опытом</option>
						<option value='Хлеб'>Скушать `Хлеб` перед боем (если есть)</option>
						<option value='Завтрак викинга [6]'>Скушать `Завтрак викинга [6]` перед боем (если есть)</option>
						<option value='Завтрак кочевника [6]'>Скушать `Завтрак кочевника [6]` перед боем (если есть)</option>
						<option value='Завтрак легионера [6]'>Скушать `Завтрак легионера [6]` перед боем (если есть)</option>
						<option value='Обед воина [6]'>Скушать `Обед воина [6]` перед боем (если есть)</option>
						<option value='Обед дракона [6]'>Скушать `Обед дракона [6]` перед боем (если есть)</option>
						<option value='Завтрак викинга [8]'>Скушать `Завтрак викинга [8]` перед боем (если есть)</option>
						<option value='Завтрак кочевника [8]'>Скушать `Завтрак кочевника [8]` перед боем (если есть)</option>
						<option value='Завтрак легионера [8]'>Скушать `Завтрак легионера [8]` перед боем (если есть)</option>
						<option value='Обед воина [8]'>Скушать `Обед воина [8]` перед боем (если есть)</option>
						<option value='Обед дракона [8]'>Скушать `Обед дракона [8]` перед боем (если есть)</option>
                                                <option value='Малый обед воина'>Скушать `Малый обед воина` перед боем (если есть)</option>
                                                <option value='Малый обед дракона'>Скушать `Малый обед дракона` перед боем (если есть)</option>
		           	</select>
				</label>
				<br>
				<label title='Реген HP'>
					<input name='autorist.fullhp' type='checkbox' value='1'> Восстановить HP перед боем (бутер/реген)
				</label>
				<br><br>
                <ul>
					<li>Перед началом использования автористы, сохраните боевой комплект с одетыми(!) свитками с именем `<b style='color:red'>plugin-rist</b>`</li>
					<li>Авторизуйтесь в банке, иначе не будет перезаряда екровых встроек, и проверьте наличие кредитов на счету.</li>
					<li>Авторизуйтесь в банке, иначе не будет покупки свободных мест за екры.</li>
					<li>Не включайте бота в БС, Руинах и т.п., в общем там, где он не сможет одеть комплект.</li>
				</ul>
			</td>
		</tr>
		</table>
	</div>

    <div class='scrolled' id='ruins_settings'>
    	<table class='set' style='width: 99%;' cellspacing='5'>
		<tr>
			<td>
				<div class='header'>Размер карты руин</div>
				<input type='range' min='100' max='300' step='50' value='100' name='ruins.mapsize' id='rms1' style='width: 313px;' /> <i id='rms1i'>100%</i>
				<br>
				<div class='header'>Позиция карты руин</div>
				Сверху: <input name='ruins.mappost' type='text' value='0' maxlength='6' style='width: 130px;'>
				Справа: <input name='ruins.mapposr' type='text' value='0' maxlength='6' style='width: 130px;'>
				<div class='header'>Сообщения в чат</div>
				<label title='Добавлять класс к сообщениям о передвижении'>
					<select name='ruins.myclass' style="width: 100%">
						<option value=''>Выберите класс для оповещения союзников</option>
					    <option value='крит'>Добавлять к сообщениям: я крит</option>
					    <option value='уворот'>Добавлять к сообщениям: я уворот</option>
					    <option value='танк'>Добавлять к сообщениям: я танк</option>
					</select>
				</label>
				<br><br>
				<div class='header'>Общие настройки автонапы/лекаря</div>
				<select name='headhunter.priority' style='width: 100%'>
					<option value='0'>сначала юзаем свитки</option>
					<option value='1'>сначала юзаем встройки</option>
				</select>
				<br>
				<label title='Вводить ники по клику в чате'>
					<input name="headhunter.autoinsert" type="checkbox" value="1"> Вводить ники в поле по клику в чате
				</label>
				<br><br>
				<div class='header'>Настройки формы нападения</div>
				<label title='Продолжить нападения после боя'>
					<input name="headhunter.nextbattle" type="checkbox" value="1"> НЕ отключать автонапу после нападения
				</label>
				<br>
				<label title='Внесите название клана в список, и напа будет ловить весь клан'>
					<input name="headhunter.withclan" type="checkbox" value="1"> Дополнительно проверять на совпадение по клану
				</label>
			</td>
		</tr>
		</table>
	</div>

	<div class='scrolled' id='autocraft_settings'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr><td>
			<div class='header'>Основные</div>
			<label title='Только если опция ниже активна'>
				<input name='autocraft.artrepair' type='checkbox' value='1'> Заодно ремонтировать артефакты
			</label><br>
			<select name='autocraft.autorepair' style='width: 100%; color: #004080;'>
				<option value='0'>Не ремонтировать вещи (при надетой синей вещи бот остановится)</option>
				<option value='1'>Автоматически бегать и полностью ремонтировать шмот</option>
				<option value='2'>Автоматически бегать ремонтировать только синий шмот</option>
			</select>
		</td></tr>
		</table>
	</div> 
	<div class='scrolled' id='anticaptcha_settings'>
		<table class='set' style='width: 99%;' cellspacing='5'>
		<tr><td>
			<div class='header'>Антикапча</div>
            <label title='Ключ антикапчи вводить сюда:'>
                <input name='anticaptcha.key' type='text' value='' maxlength='32' style="width:100%;border-color: green;" placeholder="Ключ антикапчи вводить сюда">
            </label><br>
            <ul>
                <li>Автокапча включается при нажатии на кнопку АВТОХАОТЫ!!!! (загорится зелёный индикатор Антикапча)</li>
                <li>Для работы разпознавание цифр (капчи), необходимо ввести код <a href="https://anti-captcha.com/panel/settings/account" target="_blank">с сайта </a> в окошко выше.</li>
                <li>Для того чтобы получить код, необходимо <a href="https://anti-captcha.com/panel/login#register" target="_blank">зарегистрироваться</a> и оплатить необходимое Вам количество капч!</li>
                <li>1000 капч = 1000 хаотов = 1 доллар</li>
<!--                <li>Не забываем отправлять SMS сообщение "Убирайся" на номер +7(921)1894975 в качестве благодарности за работу над плагином</li>-->
            </ul>
		</td></tr>
		</table>
	</div> 
<!-- //TODO: !!!!!!!!! -->
	</td>
</tr>
<tr>
	<td id='sbuttons' align='left'>
		<div class='block active' name='main'><div>Основные настройки</div></div>
		<div class='block' name='chatsound'><div>Настройки чата и звука</div></div>
        <div class='block' name='ruins'><div>Карта руин/напа/лекарь</div></div>
        <div class='block' name='laba'><div>Настройки лабиринта</div></div>

        <div class='block' name='mbattle'><div>Общие настройки боя</div></div>
        <div class='block' name='battle' sub='auto'><div>Настройки ударов</div></div>
        <div class='block' name='battle' sub='haot'><div>Настройки хаотов</div></div>
        <div class='block' name='battle' sub='rist'><div>Настройки ристы</div></div>


		<div class='block' name='autolord' style='color: #14FF00;'><div>Автолорд</div></div>
		<div class='block' name='autohaot' style='color: #14FF00;'><div>Автохаоты</div></div>
		<div class='block' name='autorist' style='color: #14FF00;'><div>Авториста</div></div>

		<div class='block' name='anticaptcha' style='color: #14FF00;'><div>Антикапча</div></div>
		<div class='block' name='autocraft' style='color: #14FF00;'><div>АвтоКрафт</div></div>
		<div class='block' name='save' style='color: white;'><div>импорт/экспорт</div></div>
	</td>
</tr>
</table>
<div id='panel'>
	<div id='abilities'>
		<div id='autobuff' class='uses def'>Автобафф</div><div id='redhp' class='uses def'>Сброс HP</div>&nbsp;
		<div id='autolord' title='Автолорд' class='uses def'>Автолорд</div>
		<div id='autobattle' title='Автохаоты' class='uses def'>Автохаоты</div>
		<div id='autorist' title='Авториста' class='uses def'>Авториста</div>
		<div id='autooutc' title='Загород' class='uses def'>Загород (MIB)</div>
		<div id='autocraft' title='Крафт' class='uses def'>Крафт</div>
		<div id='anticaptcha' title='Антикапча' class='uses def'>Антикапча <span id='ac-balance'></span></div>
	</div>

	<div id='buff' name='iblock'> ...  </div>
	<div id='haos' title='Исчадие Хаоса' name='iblock' style='width: 100px;'>&nbsp;</div>
	<div id='quests' title='Квесты' name='iblock' style='display: none'> 0_о </div>
	<span id='info' title='Таймеры'>&nbsp;</span>
	<span id='radio' title='Радио' style='float: right; margin-top: 5px;'>&nbsp;</span>
</div>

<div id="sets" onclick="this.style.display='none'"><div id="setscontent"></div></div>

<div id='ruinsmap'>
	<table id='rmap' border=0 cellpadding=0 cellspacing=0>
		<tr>
			<td title='Черная башня' class='line' id='l1_1'>А1</td>
			<td class='vmove'> </td>
			<td title='Северные чертоги' class='line' id='l1_2'>А2</td>
			<td class='vmove'> </td>
			<td title='Разрушенная северная башня' class='line' id='l1_3'>А3</td>
			<td class='vmove'> </td>
			<td title='Высохшее водохранилище' class='line' id='l1_4'>А4</td>
			<td class='vmove'> </td>
			<td title='Северный обрыв' class='line' id='l1_5'>А5</td>
			<td class='vmove'> </td>
			<td title='Таинственное логово' class='line' id='l1_6'>А6</td>
			<td class='vmove'> </td>
			<td title='Угрюмый лес' class='line' id='l1_7'>А7</td>
			<td class='vmove'> </td>
			<td title='Сгоревший частокол' class='line' id='l1_8'>А8</td>
			<td class='vmove'> </td>
			<td title='Гигантская нора' class='line' id='l1_9'>А9</td>
			<td class='vmove'> </td>
			<td title='Непроходимый бурьян' class='line' id='l1_10'>А10</td>
			<td class='vmove'> </td>
			<td title='Часовня темных побуждений' class='line' id='l1_11'>А11</td>
			<td class='vmove'> </td>
			<td title='Красный трон' class='line' id='l1_12'>А12</td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td title='Западный склон' class='line' id='l2_1'>Б2</td>
			<td class='vmove'> </td>
			<td title='Подземелье смерти' class='line' id='l2_2'>Б3</td>
			<td class='vmove'> </td>
			<td title='Ручей безвольных' class='line' id='l2_3'>Б4</td>
			<td class='vmove'> </td>
			<td title='Незримые топи' class='line' id='l2_4'>Б5</td>
			<td class='vmove'> </td>
			<td title='Хижина болотных ведьм' class='line' id='l2_5'>Б6</td>
			<td class='vmove'> </td>
			<td title='Сгоревшая лесопилка' class='line' id='l2_6'>Б7</td>
			<td class='vmove'> </td>
			<td title='Хижина лесничего' class='line' id='l2_7'>Б8</td>
			<td class='vmove'> </td>
			<td title='Сломанный дуб' class='line' id='l2_8'>Б9</td>
			<td class='vmove'> </td>
			<td title='Забытые ворота' class='line' id='l2_9'>Б10</td>
			<td class='vmove'> </td>
			<td title='Лестница темных побуждений' class='line' id='l2_10'>Б11</td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td title='Западный тупик' class='line' id='l3_1'>В2</td>
			<td class='vmove'> </td>
			<td title='Забытый алтарь' class='line' id='l3_2'>В3</td>
			<td class='vmove'> </td>
			<td title='Лабиринт отступников' class='line' id='l3_3'>В4</td>
			<td class='vmove'> </td>
			<td title='Проклятая часовня' class='line' id='l3_4'>В5</td>
			<td class='vmove'> </td>
			<td title='Зловонные каналы' class='line' id='l3_5'>В6</td>
			<td class='vmove'> </td>
			<td title='Скрытый грот' class='line' id='l3_6'>В7</td>
			<td class='vmove'> </td>
			<td title='Заброшенный огород' class='line' id='l3_7'>В8</td>
			<td class='vmove'> </td>
			<td title='Развалины старой колокольни' class='line' id='l3_8'>В9</td>
			<td class='vmove'> </td>
			<td title='Башня дракона' class='line' id='l3_9'>В10</td>
			<td class='vmove'> </td>
			<td title='Кузница дьявола' class='line' id='l3_10'>В11</td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td title='Западные захоронения' class='line' id='l4_1'>Г4</td>
			<td class='vmove'> </td>
			<td title='Северная окраина кладбища' class='line' id='l4_2'>Г5</td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td title='Северные захоронения' class='line' id='l4_3'>Г8</td>
			<td class='vmove'> </td>
			<td title='Восточная окраина кладбища' class='line' id='l4_4'>Г9</td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='line' title='Сокровищница' id='l10_0' colspan=3>Х1</td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td title='Овраг мучений' class='line' id='l5_1'>Д2</td>
			<td class='vmove'> </td>
			<td title='Кровавый перекресток' class='line' id='l5_2'>Д3</td>
			<td class='vmove'> </td>
			<td title='Одинокая могила' class='line' id='l5_3'>Д4</td>
			<td class='nomove'> </td>
			<td title='Кладбище' class='line' id='l5_4' colspan='7'>Кладбище</td>
			<td class='nomove'> </td>
			<td title='Таинственный склеп' class='line' id='l5_11'>Д9</td>
			<td class='vmove'> </td>
			<td title='Перекресток проклятых' class='line' id='l5_12'>Д10</td>
			<td class='vmove'> </td>
			<td title='Черная заводь' class='line' id='l5_13'>Д11</td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td title='Западная окраина кладбища' class='line' id='l6_1'>Е4</td>
			<td class='vmove'> </td>
			<td title='Южные захоронения' class='line' id='l6_2'>Е5</td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td class='vmove'> </td>
			<td title='Южная окраина кладбища' class='line' id='l6_3'>Е8</td>
			<td class='vmove'> </td>
			<td title='Восточные захоронения' class='line' id='l6_4'>Е9</td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td class='vmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td title='Утес безумия' class='line' id='l7_1'>Ж2</td>
			<td class='vmove'> </td>
			<td title='Дворы повешенных' class='line' id='l7_2'>Ж3</td>
			<td class='vmove'> </td>
			<td title='Тоннель оживших мертвецов' class='line' id='l7_3'>Ж4</td>
			<td class='vmove'> </td>
			<td title='Бесформенный завал' class='line' id='l7_4'>Ж5</td>
			<td class='vmove'> </td>
			<td title='Секретный проход' class='line' id='l7_5'>Ж6</td>
			<td class='vmove'> </td>
			<td title='Подворотня слез' class='line' id='l7_6'>Ж7</td>
			<td class='vmove'> </td>
			<td title='Сгоревшие конюшни' class='line' id='l7_7'>Ж8</td>
			<td class='vmove'> </td>
			<td title='Холм висельников' class='line' id='l7_8'>Ж9</td>
			<td class='vmove'> </td>
			<td title='Старый сарай' class='line' id='l7_9'>Ж10</td>
			<td class='vmove'> </td>
			<td title='Вход в катакомбы' class='line' id='l7_10'>Ж11</td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td title='Лестница благих намерений' class='line' id='l8_1'>З2</td>
			<td class='vmove'> </td>
			<td title='Рыночная площадь' class='line' id='l8_2'>З3</td>
			<td class='vmove'> </td>
			<td title='Подворотня страха' class='line' id='l8_3'>З4</td>
			<td class='vmove'> </td>
			<td title='Разрушенная казарма' class='line' id='l8_4'>З5</td>
			<td class='vmove'> </td>
			<td title='Площадь забытых мастеров' class='line' id='l8_5'>З6</td>
			<td class='vmove'> </td>
			<td title='Заброшеный склад' class='line' id='l8_6'>З7</td>
			<td class='vmove'> </td>
			<td title='Ратушная площадь' class='line' id='l8_7'>З8</td>
			<td class='vmove'> </td>
			<td title='Южный тупик' class='line' id='l8_8'>З9</td>
			<td class='vmove'> </td>
			<td title='Опустевшее хранилище' class='line' id='l8_9'>З10</td>
			<td class='vmove'> </td>
			<td title='Восточные ворота' class='line' id='l8_10'>З11</td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='hmove'> </td>
			<td class='nomove'> </td>
			<td class='nomove'> </td>
		</tr>
		<tr>
			<td title='Синий трон' class='line' id='l9_1'>И1</td>
			<td class='vmove'> </td>
			<td title='Часовня благих намерений' class='line' id='l9_2'>И2</td>
			<td class='vmove'> </td>
			<td title='Развалины южных ворот' class='line' id='l9_3'>И3</td>
			<td class='vmove'> </td>
			<td title='Зловещие провалы' class='line' id='l9_4'>И4</td>
			<td class='vmove'> </td>
			<td title='Оградительный вал' class='line' id='l9_5'>И5</td>
			<td class='vmove'> </td>
			<td title='Главные ворота' class='line' id='l9_6'>И6</td>
			<td class='vmove'> </td>
			<td title='Южные развалины' class='line' id='l9_7'>И7</td>
			<td class='vmove'> </td>
			<td title='Проклятое место' class='line' id='l9_8'>И8</td>
			<td class='vmove'> </td>
			<td title='Сумеречный провал' class='line' id='l9_9'>И9</td>
			<td class='vmove'> </td>
			<td title='Разрушенная южная башня' class='line' id='l9_10'>И10</td>
			<td class='vmove'> </td>
			<td title='Бойница стойкости' class='line' id='l9_11'>И11</td>
			<td class='vmove'> </td>
			<td title='Белая башня' class='line' id='l9_12'>И12</td>
		</tr>
		<tr>
			<th id='rmsrc' colspan=12>
				<input name='src' id='rmfindloc' type='text' value='' placeholder='Введите название локации для поиска'>
				<img src='{server}i/x.png' id='rmfindclr'>
			</th>
			<th id='rmhint' colspan=11>локация</th>
		</tr>
		<tr>
			<th id='rmfastgo' colspan=23>
				<div onclick='ruinsSay(2)'>иду направо ►</div>
				<div onclick='ruinsSay(4)'>иду налево ◄</div>
				<div onclick='ruinsSay(1)'>иду вверх ▲</div>
				<div onclick='ruinsSay(3)'>иду вниз ▼</div>
				<div onclick='ruinsSay(0)'>моя лока</div>
				<br>
			    <div onclick='ruinsSkills(210, 1)' class='rplus'>серая +1</div>
			    <div onclick='ruinsSkills(22, 5)' class='rplus'>мечи +5</div>
			    <div onclick='ruinsSkills(23, 5)' class='rplus'>дубины +5</div>
			    <div onclick='ruinsSkills(24, 5)' class='rplus'>топоры +5</div>
			</th>
		</tr>
	</table>
</div>

<div id="goto" onclick="this.style.display='none'">
	<div id="gotocontent">
		<span onclick="GO(this.innerHTML);">Замковая площадь</span>
	    <div onclick="GO(this.innerHTML);">Вход в Руины</div>
	    <div onclick="GO(this.innerHTML);">Вход в Лабиринт Хаоса</div>
	    <div onclick="GO(this.innerHTML);">Храм Древних</div>
	    <div onclick="GO(this.innerHTML);">Храмовая лавка</div>
	    <span onclick="GO(this.innerHTML);">Улица мастеров</span>
	    <div onclick="GO(this.innerHTML);">Кузница</div>
	    <div onclick="GO(this.innerHTML);">Таверна</div>
	    <div onclick="GO(this.innerHTML);">Лаборатория магов и алхимиков</div>
	    <div onclick="GO(this.innerHTML);">Мастерская ювелиров и портных</div>
	    <div onclick="GO(this.innerHTML);">Мастерская плотника</div>
	    <div onclick="GO(this.innerHTML);">Башня оружейников</div>
	    <span onclick="GO(this.innerHTML);">Парковая улица</span>
	    <div onclick="GO(this.innerHTML);">Городские ворота CapitalCity</div>
	    <div onclick="GO(this.innerHTML);">Комната Знахаря</div>
	    <div onclick="GO(this.innerHTML);">Ярмарка</div>
	    <span onclick="GO(this.innerHTML);">Центральная площадь</span>
	    <div onclick="GO(this.innerHTML);">Комиссионный магазин</div>
	    <div onclick="GO(this.innerHTML);">Магазин</div>
	    <div onclick="GO(this.innerHTML);">Ремонтная мастерская</div>
	    <div onclick="GO(this.innerHTML);">Магазин 'Березка'</div>
	    <div onclick="GO(this.innerHTML);">Зал Стихий</div>
	    <div onclick="GO(this.innerHTML);">Зал Тьмы</div>
	    <div onclick="GO(this.innerHTML);">Зал Света</div>
	    <div onclick="GO(this.innerHTML);">Торговый зал</div>
	    <span onclick="GO(this.innerHTML);">Торговая улица</span>
	    <div onclick="GO(this.innerHTML);">Фонтан</div>
	    <div onclick="GO(this.innerHTML);">Прокатная лавка</div>
	    <div onclick="GO(this.innerHTML);">Аукцион</div>
	    <div onclick="GO(this.innerHTML);">Ломбард</div>
	    <div onclick="GO(this.innerHTML);">Арендная лавка</div>
	    <span onclick="GO(this.innerHTML);">Страшилкина улица</span>
	    <div onclick="GO(this.innerHTML);">Регистратура кланов</div>
	    <div onclick="GO(this.innerHTML);">Башня смерти</div>
	    <div onclick="GO(this.innerHTML);">Банк</div>
	    <div onclick="GO(this.innerHTML);">Цветочный магазин</div>
	    <span onclick="GO(this.innerHTML);">Ристалище</span>
	    <div onclick="GO(this.innerHTML);">Вход в Одиночные сражения</div>
	    <div onclick="GO(this.innerHTML);">Замок Лорда Разрушителя</div>
	    <div onclick="GO(this.innerHTML);">Вход в Групповые сражения</div>
	    <span onclick="GO(this.innerHTML);">Арена Богов</span>
	</div>
</div>
<iframe id='iRait' name='irait' src='/null.php' style='display: none;'>Загрузка...</iframe>
<iframe id='chatrooms' src='http://chat.oldbk.com/ch.php?online=1' style='display: none;'></iframe>
*/}.toString();

function Weapons() {
    return {0:989440,1:1978880,2:167782440,3:838874137,4:352334875,5:996106,6:838877726,7:335560721,8:420102144,9:20757,10:1331474,11:572086528,12:83911437,13:25344,14:27188,15:393228,16:262170,17:983078,18:524347,19:720973,20:786442,21:1310736,22:2490383,23:3211282,24:4063253,25:184549390,26:285212675,27:1241518080,28:1426069248,29:1627404032,30:1627404032,31:251660307,32:402656523,33:335544345,34:469762068,35:335544353,36:553648148,37:420675621,38:874053647,39:556400660,40:421396528,41:1159266331,42:357367828,43:756940885,44:1344340009,45:107020307,46:2594,47:2596,48:2604,49:2611,50:2627,51:2638,52:2624010,53:251667215,54:1318420,55:7740,56:169747200,57:337193763,58:421407232,59:385881643,60:1979944,61:666880,62:1322496,63:419447587,64:419448576,65:419443712,66:22790,67:83908881,68:620784146,69:419448064,70:524311,71:262188,72:852025,73:589893,74:917590,75:1966100,76:1835029,77:2424857,78:3866658,79:4653092,80:235012115,81:318898185,82:135200776,83:252772387,84:353435666,85:51707917,86:252837939,87:420872204,88:69009421,89:370343998,90:404160525,91:204144653,92:369819730,93:1208680472,94:189399075,95:203292770,96:1226768408,97:509673487,98:51315968,99:218630656,100:2298922,101:4330502,102:1117744,103:4396038,104:1841210,105:5641235,106:1775703,107:3806239,108:251988480,109:336792064,110:335546908,111:503319043,112:486541866,113:385878538,114:889195063,115:1174407755,116:1509952014,117:878316046,118:1056967245,119:2264926750,120:505291038,121:252645160,122:336865300,123:421079065,124:1516301,125:1649433,126:419444008,127:673398528,128:419444002,129:16941,130:385894695,131:16916,132:337203712,133:335568138,134:419450112,135:26634,136:30988,137:24064,138:458771,139:262186,140:720942,141:131128,142:655434,143:1966105,144:1441808,145:3014696,146:3670018,147:4194314,148:336855065,149:589168670,150:505610270,151:219093802,152:488315661,153:18677773,154:252843571,155:538645254,156:488640273,157:185799745,158:572331015,159:406197275,160:403187793,161:1528506422,162:809310486,163:169414492,164:6034454,165:1914377260,166:555159335,167:706744082,168:153424649,169:671749168,170:807670792,171:186913800,172:756295991,173:974333459,174:337187863,175:470947905,176:1058220050,177:204346393,178:471668812,179:1377965083,180:357504013,181:471603302,182:1512182811,184:253299226,185:387320332,186:504634936,187:622665225,189:336202311,190:724240902,191:507709965,192:1224804958,193:1513753097,194:911542785,195:906300008,196:2266565137,197:792529418,198:12850,199:3284523,200:3289640,201:1326130,202:12850,203:7710,204:1344143370,205:671088670,206:503316480,207:587202560,208:3276850,209:922746940,210:1011220480,211:3942420,212:1974808,213:346122,214:674833,215:9010,216:5160,217:55,218:3735552,219:1507328,220:2293760,221:1966080,222:2293760,223:1258291230,224:671088670,225:672399360,226:336199680,227:1769522,228:1509949440,229:3299840,230:2304045,231:1319730,232:3294750,233:1328680,234:343070,235:7730,236:3735552,237:60,238:1966127,239:42,240:35,241:623181839,242:1174405120,243:1174405120,244:1258291200,245:1090519080,246:1090519040,247:2634290,248:1317140,249:84217605,250:84217605,251:1644800,252:661790,253:169088000,254:9487,255:419439872,256:419438336,257:419442944,258:335555869,259:1321728,260:838877203,261:838876704,262:603994658,263:83906318,264:402673408,265:19712,266:131079,267:327715,268:1441830,269:852029,270:1048655,271:458754,272:1835033,273:2490390,274:3538957,275:4456464,276:458773,277:1048585,278:202181413,279:302844687,280:51645189,281:252575788,282:538771484,283:270663708,284:983097,285:639500316,286:2883612,287:1179721,288:3735564,289:1966168,290:4390923,291:33882637,292:168430084,293:169019907,294:252186387,295:453971980,296:52170753,297:252645147,298:537857804,299:337253396,300:419434540,301:603983628,302:419436608,303:1073746971,304:754980923,305:1308628006,306:1640960,307:2624000,308:3279360,309:3934720,310:3934720,311:841484800,312:4590080,313:419440655,314:421080345,315:421083417,316:505301022,317:673733160,318:842166066,319:589843,320:262193,321:786494,322:786519,323:786534,324:2293790,325:2883624,326:4063275,327:4522026,328:5701676,329:336723992,330:403832854,331:253624347,332:336399397,333:387189772,334:51841807,335:252777269,336:622073364,337:304159261,338:235541558,339:622793753,340:338367508,341:487915595,342:1209597952,343:524750613,344:286851167,345:1380127744,346:459805727,347:988175,348:167781411,349:2300160,350:167783680,351:661790,352:169090048,353:169097472,354:14868,355:169420544,356:673034,357:17685,358:13332,359:83909648,360:604003840,361:805329920,362:327690,363:917529,364:524371,365:655365,366:1638414,367:2949148,368:196623,369:327683,370:131076,371:393220,372:983065,373:1638419,374:2031648,375:2752532,376:2097201,377:4063253,378:922746941,379:1275068446,380:327688,381:524293,382:196627,383:589830,384:851995,385:2293766,386:1376302,387:2949126,388:754974785,389:1694498849,390:253299255,391:336661008,392:419760672,393:505285124,394:154405377,395:419432999,396:623118857,397:270928403,398:503646767,399:841812486,400:389679626,401:1074072129,402:1309280798,403:675219979,404:1978880,405:168436480,406:167782400,407:169420800,408:1323520,409:1649177,410:343552,411:18100480,412:840840474,413:503332864,414:704658944,415:922764052,416:1090554634,417:35888,418:35072,419:2293760,420:3538944,421:3735552,422:7602176,423:655376,424:1703946,425:1114150,426:3211292,427:1245229,428:3407887,429:655416,430:3670023,431:1660944384,432:983060,433:2621455,434:393247,435:1376268,436:2424850,437:1114151,438:1179697,439:2883603,440:1677721600,441:252643869,442:404163086,443:251791908,444:471796229,445:153750017,446:420088362,447:606276105,448:556534281,449:503974465,450:841812480,451:507513353,452:956631626,453:1276381711,454:759040522,455:134744072,457:437918234,458:606348324,459:791621423,460:1010580540,461:541696,462:674560,463:415488,464:1729536,465:3376640,466:131147,467:524375,468:327783,469:4128931,470:4915202,471:5701640,472:6422533,473:10682431,474:196680,475:1107296262,476:3997702,477:983125,478:1224736793,479:5242883,480:393311,481:1409286164,482:6160402,483:655472,484:1728053273,485:6815764,486:2949260,487:2097152051,488:9175091,489:1107689472,490:4458496,491:104660992,492:55574528,493:4917760,494:1226375168,495:308150272,496:5703168,497:1410924544,498:342360064,499:1729691648,500:6756608,501:864813056,502:2100494336,503:8794880,504:536870918,505:654311435,506:838860816,507:1157627924,508:3014666,509:1769477,511:655410,512:983100,513:1310788,514:3932175,515:4587540,516:336384,517:665856,518:996608,519:1327616,520:2752517,521:3538959,522:4587540,523:327722,524:983094,525:1310785,526:34355,600:385903629,605:1996488765,610:335575054,611:570448384,612:855669014,613:2424929,614:5111851,615:203423847,616:1512767512,617:695009295,618:1842523,619:4464660,620:1056968530,621:2499809812,622:37130,623:42781,624:33280,625:786513,626:4784177,627:169416801,628:2250646037,629:7021078,630:639572841,631:1831935764,632:309600282,634:2619281162,635:927273227,636:12850,637:1174405195,638:10300,639:1845493760,640:2949120,641:1342177280,642:61,643:10300,644:385901329,645:536896512,646:22272,647:1704035,648:5177372,649:2228318,650:5177356,651:788536641,652:1627397921,653:5705472,654:926056755,655:3211379,656:6684727,657:287178853,658:1733301248,659:661918746,660:335573008,661:738225408,662:989884416,663:2097261,664:3276836,665:922746947,666:1577058334,667:788529222,668:2063597601,669:906039109,670:2031030296,671:944115470,672:402694151,673:40752,674:40192,675:8388608,676:2046820352,677:1996488704,678:956369999,679:2065371146,680:944049931,681:1515870810,682:4300544,683:40769,684:4522163,685:11731019,686:3276946,687:2533359657,688:10027043,689:9583872,690:2453143552,691:949092352,915:124064786,940:354754059,2280:252645135,2550:327717,3165:1409355116};
}

function Location() {
	//noinspection ReservedWordAsName
	var locations = {
		'городские ворота capitalcity': {
			location: 'outcity.php',
			ways: [
				{url: 'outcity.php?qaction=1&', name: 'выйти из города'},
				{url: 'outcity.php?qaction=2&', name: 'парковая улица', link: true, location: 'city.php'},
				{url: 'outcity.php?qaction=66&', name: 'замки', return: 'castles.php?exit=1'}
			]
		},
		'загород': {
			location: 'outcity.php',
			ways: [
				{url: 'outcity.php?qaction=1&', name: 'выйти из города'},
				{url: 'outcity.php?qaction=2&', name: 'парковая улица', link: true, location: 'city.php'},
				{url: 'outcity.php?qaction=66&', name: 'замки', return: 'castles.php?exit=1'}
			]
		},
		'парковая улица': {
			location: 'city.php',
			ways: [
				{
					url: 'city.php?got=1&level72=1&',
					name: 'ярмарка',
					return: 'city.php?bps=1&',
					location: 'fair.php'
				},
				{
					url: 'city.php?got=1&level5=1&',
					name: 'комната знахаря',
					return: 'city.php?bps=1&',
					location: 'znahar.php'
				},
				{
					url: 'city.php?got=1&level6=1&',
					name: 'большая скамейка',
					return: 'city.php?bps=1&',
					location: 'bench.php'
				},
				{
					url: 'city.php?got=1&level7=1&',
					name: 'средняя скамейка',
					return: 'city.php?bps=1&',
					location: 'bench.php'
				},
				{
					url: 'city.php?got=1&level8=1&',
					name: 'маленькая скамейка',
					return: 'city.php?bps=1&',
					location: 'bench.php'
				},
				{url: 'city.php?got=1&level22=1&', name: 'вокзал', return: 'city.php?bps=1&'},
				{url: 'city.php?got=1&level10=1&', name: 'городские ворота capitalcity', link: true, location: 'outcity.php'},
				{url: 'city.php?got=1&level3=1&', name: 'замковая площадь', link: true, location: 'city.php'},
				{url: 'city.php?got=1&level4=1&', name: 'центральная площадь', link: true, location: 'city.php'},
				{url: 'city.php?got=1&level191=1&', name: 'улица мастеров', link: true, location: 'city.php'}
			]
		},
		'замковая площадь': {
			location: 'city.php',
			ways: [
				{
					url: 'city.php?got=1&level60=1&',
					name: 'арена богов',
					return: 'bplace.php?got=1&level333=1&',
					location: 'bplace.php'
				},
				{
					url: 'city.php?got=1&level1=1&',
					name: 'руины старого замка',
					return: 'ruines_start.php?exit=1&',
					location: 'ruines_start.php'
				},
				{
					url: 'city.php?got=1&level1=1&',
					name: 'вход в руины',
					return: 'ruines_start.php?exit=1&',
					location: 'ruines_start.php'
				},
				{
					url: 'city.php?got=1&level45=1&',
					name: 'вход в лабиринт хаоса',
					return: 'city.php?zp=1&',
					location: 'startlab.php'
				},
				{
					url: 'city.php?got=1&level45=1&',
					name: 'лабиринт хаоса',
					return: 'city.php?zp=1&',
					location: 'startlab.php'
				},
				{
					url: 'city.php?got=1&level48=1&',
					name: 'храмовая лавка',
					return: 'city.php?zp=1&',
					location: 'cshop.php'
				},
				{
					url: 'city.php?got=1&level49=1&',
					name: 'храм древних',
					return: 'city.php?zp=1&',
					location: 'church.php'
				},
				{url: 'city.php?got=1&level4=1&', name: 'парковая улица', link: true, location: 'city.php'}
			]
		},
		'комната для новичков': {
			location: 'main.php?setch=1&got=1&room1=1&',
			ways: [
				{
					url: 'main.php?path=1.100.1.50&',
					name: 'секретная комната',
					return: 'main.php?goto=plo&',
					location: 'main.php',
					group: 'bk'
				}
			],
			return: 'main.php?goto=plo&',
			group: 'bk'
		},
		'центральная площадь': {
			location: 'city.php',
			ways: [
				{
					url: 'city.php?got=1&level10=1&',
					name: 'магазин \'березка\'',
					return: 'city.php?cp=1&',
					location: 'eshop.php'
				},
				{url: 'city.php?got=1&level66=1&', name: 'торговая улица', link: true, location: 'city.php'},
				{url: 'city.php?got=1&level8=1&', name: 'парковая улица', link: true, location: 'city.php'},
				{url: 'city.php?got=1&level7=1&', name: 'страшилкина улица', link: true, location: 'city.php'},
				{
					url: 'city.php?got=1&level11=1&',
					name: 'лотерея сталкеров',
					return: 'city.php?cp=1&',
					location: 'lotery.php'
				},
				{
					url: 'city.php?got=1&level61=1&',
					name: 'доска объявлений',
					return: 'city.php?cp=1&',
					location: 'doska.php'
				},
				{
					url: 'city.php?got=1&level3=1&',
					name: 'комиссионный магазин',
					return: 'city.php?cp=1&',
					location: 'comission.php'
				},
				{url: 'city.php?got=1&level2=1&', name: 'магазин', return: 'city.php?cp=1&', location: 'shop.php'},
				{url: 'city.php?got=1&level6=1&', name: 'почта', return: 'city.php?cp=1&', location: 'post.php'},
				{
					url: 'city.php?got=1&level4=1&',
					name: 'ремонтная мастерская',
					return: 'city.php?cp=1&',
					location: 'repair.php'
				},
				{url: 'city.php?got=1&level1=1&', name: 'бойцовский клуб', location: 'main.php?setch=1'},
				{
					url: 'main.php?setch=1&got=1&room1=1&',
					name: 'комната для новичков',
					link: true,
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room2=1&',
					name: 'комната для новичков 2',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room3=1&',
					name: 'комната для новичков 3',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room4=1&',
					name: 'комната для новичков 4',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room5=1&',
					name: 'зал воинов 1',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room6=1&',
					name: 'зал воинов 2',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room7=1&',
					name: 'зал воинов 3',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room8=1&',
					name: 'зал воинов 4',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room9=1&',
					name: 'рыцарский зал',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room10=1&',
					name: 'башня рыцарей-магов',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room11=1&',
					name: 'колдовской мир',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room12=1&',
					name: 'этаж духов',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room13=1&',
					name: 'астральные этажи',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room14=1&',
					name: 'огненный мир',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room15=1&',
					name: 'зал паладинов',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room8=1&',
					name: 'торговый зал',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room16=1&',
					name: 'совет белого братства',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room17=1&',
					name: 'зал тьмы',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room36=1&',
					name: 'зал стихий',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room54=1&',
					name: 'зал света',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room19=1&',
					name: 'будуар',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room18=1&',
					name: 'царство тьмы',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room56=1&',
					name: 'царство стихий',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room55=1&',
					name: 'царство света',
					return: 'main.php?goto=plo&',
					group: 'bk'
				},
				{
					url: 'main.php?setch=1&got=1&room57=1&',
					name: 'зал клановых войн',
					return: 'main.php?goto=plo&',
					group: 'bk'
				}
			]
		},
		'торговая улица': {
			location: 'city.php',
			ways: [
				{
					url: 'city.php?got=1&level88=1&',
					name: 'прокатная лавка',
					return: 'prokat.php?exit=1&',
					location: 'prokat.php'
				},
				{
					url: 'city.php?got=1&level67=1&',
					name: 'фонтан',
					return: 'city.php',
					location: 'city.php?got=1&level67=1&',
					updatePath: 'city.php?got=1&level67=1&'
				},
				{
					url: 'city.php?got=1&level71=1&',
					name: 'аукцион',
					return: 'auction.php?exit=1&',
					location: 'auction.php'
				},
				{
					url: 'city.php?got=1&level70=1&',
					name: 'ломбард',
					return: 'pawnbroker.php?exit=1&',
					location: 'pawnbroker.php'
				},
				{
					url: 'city.php?got=1&level47=1&',
					name: 'арендная лавка',
					return: 'rentalshop.php?exit=1&',
					location: 'rentalshop.php'
				},
				{url: 'city.php?got=1&level20=1&', name: 'центральная площадь', link: true, location: 'city.php'}
			]
		},
		'страшилкина улица': {
			location: 'city.php',
			ways: [
				{url: 'city.php?got=1&level4=1&', name: 'центральная площадь', link: true, location: 'city.php'},
				{
					url: 'city.php?got=1&level2=1&',
					name: 'регистратура кланов',
					return: 'city.php?strah=1&',
					location: 'klanedit.php'
				},
				{
					url: 'city.php?got=1&level77=1&',
					name: 'башня смерти',
					return: 'dt_start.php?exit=1&',
					location: 'dt_start.php'
				},
				{url: 'city.php?got=1&level5=1&', name: 'банк', return: 'city.php?strah=1&', location: 'bank.php'},
				{
					url: 'city.php?got=1&level6=1&',
					name: 'цветочный магазин',
					return: 'city.php?strah=1&',
					location: 'fshop.php'
				},
				{url: 'city.php?got=1&level3200=1&', name: 'ристалище', link: true, location: 'restal.php'}
			]
		},
		'ристалище': {
			location: 'restal.php',
			ways: [
				{url: 'restal.php?got=1&level4=1&', name: 'страшилкина улица', link: true, location: 'city.php'},
				{
					url: 'restal.php?got=1&level270=1&',
					name: 'вход в одиночные сражения',
					return: 'restal270.php?got=1&level200=1&',
					location: 'restal270.php'
				},
				{url: 'restal.php?got=1&level210=1&', name: 'вход в сражение отрядов'},
				{
					url: 'restal.php?got=1&level240=1&',
					name: 'вход в групповые сражения',
					return: 'restal240.php?exit=1&',
					location: 'restal240.php'
				},
				{
					url: 'restal.php?got=1&level199=1&',
					name: 'замок лорда разрушителя',
					return: 'lord2.php?exit=1&',
					location: 'lord2.php'
				}
			]
		},
		'улица мастеров': {
			location: 'city.php',
			ways: [
				{url: '/city.php?got=1&level8=1', name: 'парковая улица', link: true, location: 'city.php'},
				{
					url: 'city.php?got=1&level91=1',
					name: 'кузница',
					return: 'craft.php?exit=1',
					location: 'craft.php'
				},
				{
					url: 'city.php?got=1&level92=1',
					name: 'таверна',
					return: 'craft.php?exit=1',
					location: 'craft.php'
				},
				{
					url: 'city.php?got=1&level93=1',
					name: 'лаборатория магов и алхимиков',
					return: 'craft.php?exit=1',
					location: 'craft.php'
				},
				{
					url: 'city.php?got=1&level94=1',
					name: 'мастерская ювелиров и портных',
					return: 'craft.php?exit=1',
					location: 'craft.php'
				},
				{
					url: 'city.php?got=1&level95=1',
					name: 'мастерская плотника',
					return: 'craft.php?exit=1',
					location: 'craft.php'
				},
				{
					url: 'city.php?got=1&level96=1',
					name: 'башня оружейников',
					return: 'craft.php?exit=1',
					location: 'craft.php'
				}
			]
		}
	};
	/**
	 * содержит ссылки на все точки
	 * @type {Object}
	 */
	var points = {};

	function onlineUsers(dom) {
		var script = dom.querySelector('table td[nowrap] script'),
			users = [];

		if (script) {
			(new Function('w', 'var document={};' + script.innerText + ';'))(function w() {
				//name, id, align, klan, level, slp, trv, deal, battle, war, r, rk, hh, tlvl
				users.push({
					login: arguments[0],
					id: +arguments[1],
					align: +arguments[2],
					klan: arguments[3],
					level: +arguments[4],
					silence: +arguments[5],
					trauma: +arguments[6],
					battle: +arguments[8],
					war: +arguments[9]
				});
			});
		}
		return users;
	}

	function getErrorMessage(dom) {
		if (!dom) {
			return '';
		}
		var element = dom.querySelector('fieldset:nth-child(1)'),
			warLink = dom.querySelector('a[href^="towerlog.php?war="]'),
			message;

		if (warLink) {
			message = warLink.previousElementSibling.innerText;
			if (message && message.indexOf('Воинственность в войне') !== -1) {
				message = '';
			}
		} else if (element && element.nextSibling && element.nextSibling.nodeName === 'B') {
			message = element.nextSibling;
		} else {
			message = dom.querySelector('hr ~ font[color="red"]') || dom.querySelector('font[color="red"]');
		}

		message = message ? message.innerText : '';
        var fakeMessage = ['Мастерство', 'Данную вещь может надеть только', 'Шанс успеха', 'Интеллект'].some(function (tpl) {
			return String(message).indexOf(tpl) > -1;
		});

		return !fakeMessage ? message : '';
	}

	function getLocation(callback) {
		var chatRooms = document.getElementById('chatrooms');
		var loaded = function () {
			var dom = false;
			try {
				dom = this.contentDocument.body;
			} catch (e) {
			}

			var location = dom.querySelector('center > div > font[style^="COLOR:#8f0000"]'),
				users = onlineUsers(dom);

			if (location) {
				location = location.innerText.trim().match(/^(.*)\s(?:\(\d+\))?/);
				if (location) {
					var result = {
						lastUpdate: new Date(),
						name: location[1],
						users: users
					};

					chatRooms.removeEventListener('load', loaded);
					return callback(null, result);
				}
			}
			config.setTimeout(function () {
				chatRooms.setAttribute('src', 'http://chat.oldbk.com/ch.php?online=' + Math.random() + '&scan2=1');
			}, 100);
		};
		chatRooms.addEventListener('load', loaded);
		chatRooms.setAttribute('src', 'http://chat.oldbk.com/ch.php?online=' + Math.random() + '&scan2=1');
	}

	function walk(current, to, breakPoints) {
		var paths = [],
			steps;

		breakPoints = breakPoints || [];
		if (breakPoints.indexOf(current) !== -1) {
			return paths;
		}
		breakPoints.push(current);

		if (current.name === to.toLowerCase()) {
			paths.push({url: current.url, step: current});
		} else if (current.group && points[to].group === current.group) {
			paths.push({url: points[to].url, step: current});
			return paths;
		} else if (current.return && breakPoints.indexOf(current.parent) === -1) {
			paths.push({url: current.return, step: current});
			steps = walk(current.parent, to, breakPoints);
		} else if (current.ways) {
			current.ways.some(function (way) {
				if (way.name !== to && !way.link) {
					return;
				}
				steps = walk(way, to, breakPoints);
				return steps.length;
			});
		} else if (current.url && points[current.name] && current.link) {
			steps = walk(points[current.name], to, breakPoints);
			if (steps.length) {
				paths.push({url: current.url, step: current});
			}
		}

		if (steps) {
			paths = paths.concat(steps);
		}

		return paths;
	}

	function findWay(from, to) {
		from = from.toLowerCase();
		to = to.toLowerCase();
		var message = '';

		if (!points[from]) {
			message = 'Не знаю как выйти из "' + from + '"!';
		} else if (!points[to]) {
			message = 'Не знаю как добраться до "' + to + '"!';
		}

		if (message) {
			config.message(message, 'Переходы');
		}

		if (message || from === to) {
			return [];
		}

		var steps = walk(points[from], to);
		if (!steps.length) {
			config.message('Путь от "' + from + '" до "' + to + '" не найден!', 'Переходы');
		}

		return steps;
	}

	var inTransit = false;
	function go(to, next) {
		next = next || function () {};
		if (!to) {
			return next();
		}

		to = to.toLowerCase();
		var callback = function (error, response) {
			inTransit = false;
			if (error) {
				config.message('Не смог добраться до "' + to + '": ' + error, 'Переходы');
			}
			next();
		};

		getLocation(function (error, currentLocation) {
			if (error) {
				return callback(error);
			}
			currentLocation = currentLocation.name.toLowerCase();

			var steps = findWay(currentLocation, to),
				next = steps.shift();

			if (next) {
				if (to !== next.step.name) {
					config.message('Идем к "' + to + '" через "' + next.step.name + '"...', 'Переходы');
				}
				var url = 'http://capitalcity.oldbk.com/' + next.url + Math.random();
				config.request({url: url}, function (error, dom) {
					if (error) {
						return callback(error);
					}
					var errorMessage = getErrorMessage(dom);
					if (errorMessage) {
						if (errorMessage.indexOf('Невидимка не может сюда попасть') !== -1 ||
							errorMessage.indexOf('Вы не можете попасть в эту комнату.') !== -1 ||
							errorMessage.indexOf('Нет такого перехода!') !== -1) {
							config.message('Не удалось попасть в "' + to + '": ' + errorMessage, 'Переходы');
							callback();
						} else {
							if (errorMessage.indexOf('Не так быстро!') === -1) {
								config.message('Не удалось попасть в "' + to + '": ' + errorMessage, 'Переходы');
							}
							config.setTimeout(function () {
								go(to, callback);
							}, 1000);
						}
						return;
					}

					if (steps.length) {
						if (next.step.location === 'city.php') {
							config.setTimeout(function () {
								go(to, callback);
							}, 1000);
						} else {
							go(to, callback);
						}
					} else {
						config.message('Пришли к ' + to, 'Переходы');
						callback();
					}
				});
			} else {
				callback();
			}
		});
	}

	Object.keys(locations).forEach(function (name) {
		var loc = locations[name];
		points[name] = loc;
		loc.name = loc.name || name;
		if (Array.isArray(loc.ways)) {
			loc.ways.forEach(function (way) {
				if (way.return) {
					way.parent = loc;
					points[way.name] = way;
				}
			});
		}
	});

	return {
		findWay: findWay,
		get: getLocation,
		go: function (to, callback) {
			if (inTransit) {
				config.message('Мы уже находимся в пути к "' + to + '".', 'Переходы');
				return;
			}
			inTransit = to;

			return go(to, function () {
				to = to && to.toLowerCase();
				callback(points[to]);
			});
		},
		point: function (name) {
			return name && points[name.toLowerCase()] || {};
		},
		points: Object.keys(points)
	};
}

function EventEmitter() {
    function EventEmitter() {
        this.events = {};
    }

    EventEmitter.prototype.on = function (name, callback) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callback);
    };

    EventEmitter.prototype.once = function (name, callback) {
        var cb = function () {
            if (!cb.once) {
                callback.apply(this, arguments);
            }
            cb.once = true;
        };

        this.on(name, cb);
    };

    EventEmitter.prototype.emit = function (name) {
        var handlers = this.events[name],
            args = [].slice.call(arguments, 1),
            remove = [], i;
        
        if (!handlers) {
            return;
        }

        for (i = 0; i <= handlers.length; i += 1) {
            try {
                handlers[i].apply(handlers[i], args);
                if (handlers[i].once) {
                    remove.push(handlers[i]);
                }
            } catch (e) {}
        }
        for (i = 0; i < remove.length; i += 1) {
            var index = handlers.indexOf(remove[i]);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    };

    return new EventEmitter();
}

function Anticaptcha(key) {
    function getResult(taskId, callback) {
        config.request({
            url: 'https://api.anti-captcha.com/getTaskResult',
            data: {
                clientKey: key,
                taskId: taskId
            },
            method: 'POST',
            type: 'json'
        }, callback);
    }

    function poller(taskId, callback) {
        getResult(taskId, function (error, result) {
            if (returnError(error, result, callback)) {
                return;
            }

            if (result.status !== 'ready') {
                return setTimeout(poller.bind(this, taskId, callback), 1000);
            }
            callback(null, result);
        });
    }

    function returnError(error, result, callback) {
        if (error) {
            config.message('Неизвестная ошибка сервиса', 'Антикапча', 'red');
            callback(error);
            return true;
        }
        if (!result) {
            config.message('Ошибка антикапчи, пустой ответ', 'Антикапча', 'red');
            callback(new Error('Empty response'));
            return true;
        }
        if (result.errorId) {
            config.message('Ошибка антикапчи: ' + (result.errorDescription || result.errorCode), 'Антикапча', 'red');
            callback(new Error(result.errorDescription || result.errorCode));
            return true;
        }
    }
    function createTask(options, callback) {
        var task = {};
        if (options.image) {
            task.type = 'ImageToTextTask';
            task.body = options.image;
            task.case = false;
            task.numeric = !options.word;
            task.math = false;
            task.minLength = options.word ? 0 : 3;
            task.maxLength = options.word ? 0 : 3;
        } else if (options.captcha) {
            task.type = 'NoCaptchaTaskProxyless';
            task.websiteURL = options.url;
            task.websiteKey = options.captcha;
        }

        config.request({
            url: 'https://api.anti-captcha.com/createTask',
            data: {
                clientKey: key,
                task: task,
                languagePool: 'en'
            },
            method: 'POST',
            type: 'json'
        }, function (error, result) {
            if (returnError(error, result, callback)) {
                return;
            }

            setTimeout(function () {
                poller(result.taskId, function (error, result) {
                    if (returnError(error, result, callback)) {
                        return;
                    }

                    var solution = result.solution;
                    if (solution.text) {
                        return callback(null, solution.text);
                    }
                    if (solution.gRecaptchaResponse) {
                        return callback(null, solution.gRecaptchaResponse);
                    }

                    return callback(null, result);
                });
            }, 2000);
        });
    }

    function recognize(options, callback) {
        if (!key) {
            key = config.get('settings.anticaptcha.key');
        }
        if (!key) {
            config.message('Не введен ключ антикапчи!', 'Антикапча', 'red');
            return callback(new Error('key error'));
        }

        if (typeof options === 'string') {
            return recognize.fromImage({url: options}, callback);
        }

        createTask(options, callback);
    }

    recognize.fromImage = function (options, callback) {
        if (!key) {
            key = config.get('settings.anticaptcha.key');
        }
        function getBase64Image(img) {
            var canvas = document.createElement('canvas'),
                ctx, dataURL;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL('image/png');
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
        }
        function checksum(s) {
            var i, chk = 0x12345678;
            for (i = 0; i < s.length; i++) {
                chk += (s.charCodeAt(i) * (i + 1));
            }
            return chk;
        }

        var image = document.createElement('img'),
            imageBody, imageSum;

        image.addEventListener('load', function () {
            imageBody = getBase64Image(image);
            imageSum = checksum(imageBody);

            config.events.once('captcha-' + imageSum, callback);
            if (config.eq('anticaptcha.image', imageSum)) {
                return;
            }

            config.set('anticaptcha.image', imageSum);
            recognize({image: imageBody, word: options.word}, function (error, code) {
                config.events.emit('captcha-' + imageSum, error, code);
            });
        });

        image.setAttribute('src', options.url);
    };

    recognize.getBalance = function (callback) {
        if (!key) {
            key = config.get('settings.anticaptcha.key');
        }
        config.request({
            url: 'https://api.anti-captcha.com/getBalance',
            data: {
                clientKey: key
            },
            method: 'POST',
            type: 'json'
        }, function (error, result) {
            if (returnError(error, result, callback)) {
                return;
            }
            callback(null, result);
        });

    };
    return recognize;
}

BASEHTML = BASEHTML.replace("function (){/*","");
BASEHTML = BASEHTML.replace("*/}","");
BASEHTML = BASEHTML.replace(/\{server}/ig, SERVER);

var span = document.createElement('span');
span.innerHTML = BASEHTML;
document.head.parentNode.appendChild(span);
span = null, BASEHTML = null;

$.extend ($.expr[':'].containsCI = function (a, i, m) {
	var sText   = ($(a).attr('title') || a.textContent || a.innerText || "");
	var zRegExp = new RegExp (m[3], 'i');
	var result = zRegExp.test(sText);
	return result;
});

function setRuinRoom(room) {
	$('#rmap .line').removeClass('user');
	$('#rmhint').html(room);
	$('#rmap td.line:containsCI("'+room+'")').addClass('user');
	var rid = $('#rmap td.line:containsCI("'+room+'")').html();
	config.set('ruins.room', room);
	config.set('ruins.rid', rid);
}

function ruinsSkills(type, up) {
	if(up < 1) {
		config.message('Навык добавлен', 'Руины');
		return;
	}
	config.broadcast("main.php?up="+type+"&edit=1", function(data) {
		up--;
    	ruinsSkills(type, up);
	});
}

function ruinsSay(type) {
	var rid = config.get('ruins.rid', ''), room = config.get('ruins.room', ''),
	team = config.get('user.team', false), cl = config.get('settings.ruins.myclass', '');

	var text = cl != '' && +type > 0 ? 'Я '+cl+'.' : '';
	switch(type) {
		case 1:
        	text += 'Иду вверх от '+room+'['+rid+']';
		break;
		case 3:
        	text += 'Иду вниз от '+room+'['+rid+']';
		break;
		case 2:
        	text += 'Иду направо => от '+room+'['+rid+']';
		break;
		case 4:
        	text += 'Иду налево <= от '+room+'['+rid+']';
		break;
		case 'settrap':
        	text += 'Установил ловушку в '+room+'['+rid+']!';
		break;
		case 'gettrap':
        	text += 'Попал в ловушку в '+room+'['+rid+']!';
		break;
		case 'inbattle':
        	text += 'Влетел в бой на '+room+'['+rid+']';
		break;
		default:
			text += 'Я на '+room+'['+rid+']';
		break;
	}
	console.debug(text);
	if(!team) {
		config.message('Не удалось определить вашу тиму, сообщение помещено в поле ввода', 'Руины');
		$('#ssmtext', top.frames['bottom'].document).val(text);
	} else {
		config.chatsend('private [team-'+team+'] '+text, 1);
	}
}

top.ChatSlowDelay = 3;

function ReRun(time) {
	var func = config.get('settings.launched');
	if(!func) return console.error('ReRun: requested module offline!');
	if(!time || time < 1) {
		eval(func+'()');
	} else {
		return config.setTimeout(func+'()', time * 1000);
	}
}

function novip() {
	if(confirm('Для работы данного модуля необходим Platinum account!')) {
		top.frames[2].window.location.href = '/bank.php';
	}
	config.set('settings.launched',false);
	return false;
}

//воен, неформат, первичка, кровь, победа, цветы
var questsid = [109, 141, 140, 102, 142, 143];

function getRoom(callback) {
	$('#chatrooms').one('load', function() {
		var html = false;
		try {
			html = this.contentDocument.body.innerHTML;
			html = html.replace(/(\n|\r|\t)/g, "");
		} catch(e) {}
		if(html) {
			var wehere = html.match(/<font[^>]+>\s*<b>\s*(.+?)\s+\(([0-9]+)\)\s*<\/b>\s*<\/font>/i);
			if(wehere && wehere[1]) {
				var room = wehere[1], users = {};
				var ulist = html.match(/w\('([^']+)'[^)]+\);/g); //'
                for(var u in ulist) {
                	var user = ulist[u].match(/w\('([^']+)'[^)]+\);/); //'
                	users[user[1]] = true;
                }
				callback(room, users);
				wehere = null;
			return;
			}
		}
		config.setTimeout(function() {
			getRoom(callback);
		}, 100);
	});
	$('#chatrooms').attr('src', 'http://chat.oldbk.com/ch.php?online='+Math.random()+'&chview=1');
}

//top.changeroom=n;
function GO(goto, callback, steps) {
	goto = goto.toLowerCase();

	if (config.get('battle.id') > 0) {
		config.message('Мы в бою... подождите немного.', 'Переходы');
		config.set('cooldowns.route', false);
		if (callback) callback(false);
		return;
	}

	config.location.go(goto, function (step) {
        top.frames[2].location.href = step && step.updatePath || '/main.php';
		if (typeof callback === 'function') {
			callback(true);
		}
	});
}

function setQuest(callback, num) {
    var questid = questsid[num];
	config.broadcast('/quest_get.php?q=1&s=2',function(data) {
		config.message('Квест: закрыли квест', 'Автохаоты');
		GO('Храм Древних', function(ok) {
			if(!ok) {
				config.setTimeout(function() {
					setQuest(callback, num);
				}, 3000);
				return;
			}
			config.broadcast('/itemschoice.php?get=1&svecha=qq',function(data) {
				if(data.indexOf("У Вас нет свечей") > -1) {
					for(var i in questsid) {
						config.set('settings.autobattle.quest.'+i, 0);
					}
					config.message('Квест: у вас нет свечей. Отмена автоквестов', 'Автохаоты');
					callback(false);
				} else {
					var list = data.match(/selecttarget\("?'?([0-9]+)"?'?\)/i); //"'
					console.debug(list);
					var itemid = list[1];
	            	config.broadcast('/church.php?put=1',function(data) {
	            		config.broadcast('/church.php?take='+questid, function(data) {
	            			if(data.indexOf('У Вас уже есть') > -1) {
	            				config.message('Квест: у вас уже 4 квеста', 'Автохаоты');
	            				config.set('settings.autobattle.quest.'+num, 0);
	            			} else {
		                       	config.message('Квест: Взяли квест на хаоты', 'Автохаоты');
	                       	}
							config.set('cooldowns.needquest.'+num, false);
							callback(true);
	            		});
	            	}, "target="+itemid);
	           	}
		   	});
		});
	});
}
//запуск функции
function launcher(log, launch) {
	log = log ? log : 'check';
	console.debug('launcher: '+log);
	if(typeof(launch) != 'undefined') {
		if(launch == 'reinit') {
			launch = config.get('settings.launched', false);
		} else {
			config.set('settings.launched', launch);
		}
		if(typeof(launch) == 'string' && launch.length > 2) {
			console.debug('launcher: '+launch+'()');
			eval(launch+'();');
		}
	}
	var mods = ['autolord', 'autobattle', 'autorist', 'autocraft'];
	for(var i in mods) {
		if(!config.eq('settings.launched', mods[i])) {
			$('#'+mods[i]).removeClass('run').addClass('def');
		} else {
			$('#'+mods[i]).removeClass('def').addClass('run');
		}
	}
	return launch;
}

function setRepair(callback, lord) {
	if(!config.get('settings.launched')) {
		return launcher('setRepair disabled!');
    }
    if(config.get('cooldowns.needrepair') || config.get('cooldowns.needcharge')) {
		GO('Ремонтная мастерская', function() {
			top.frames[2].location.href = '/repair.php?'+Math.random();
			config.setTimeout(function() {
				setRepair(callback);
			}, 5000);
		});
	return;
	}
	callback(true);
}

function setZay(callback) {
	if(!config.eq('settings.launched', 'autobattle')) {
		return launcher('setZay autobattle disabled!');
    }
	var Room = config.get('settings.autobattle.room', 'Торговый зал');
	GO(Room, function() {
		config.broadcast('/zayavka.php?level=haos&'+Math.random(), function(data) {
			if(data && data.indexOf('>В этой комнате нельзя') > -1) {
				//что-то пошло не так
				config.setTimeout(function() {
					setZay(callback);
				}, 1000);
			} else {
				top.frames[2].location.href = '/zayavka.php?level=haos&'+Math.random();
				if(data.indexOf('>Ожидаем начала группового боя') > -1) {
					callback(true);
				} else {
					callback(false);
				}
			}
		});
	});
}

function autocraft() {}

function autolord() {
	if(!config.eq('vip', 'Platinum')) {
		return novip();
	}
	if(!config.eq('settings.launched', 'autolord')) {
		return launcher('autolord disabled!');
    }
    var url = false;
	try {url = top.frames[2].location.href;} catch(e) {}
    if(!url) return ReRun(3);

	//в бою
	if(url.indexOf('/fbattle') > -1) {
		console.debug('Автолорд мы в бою '+url);
		config.set('settings.autolord.inbattle', true);
		config.set('settings.autolord.ready', false);
		return ReRun(20);
	}
	config.set('battle.id', 0);
	var counter = config.get('settings.autolord.counter', 0);
    if(counter < 1) {
    	var Times = config.get('settings.autolord.timers');
    	console.debug(Times);
    	if(config.get('settings.autolord.onfinal')) {
	    	config.message('Все походы завершены, бот ныкается в ТЗ.', 'Автолорд');
	    	GO('Торговый зал', function() {
	        	config.message('Спасибо за использование наших авиалиний 0_о', 'Автолорд');
	    	});
    	} else {
    		config.message('Все походы завершены.', 'Автолорд');
    	}
    	var lasthp = config.get('settings.autolord.curehp');
		config.set('settings.battle.curehp', lasthp);
		if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
			top.frames[1].bswitch(1);
		}
	return launcher('autolord finish', false);
    }

	//старт или после боя
	if(config.get('settings.autolord.inbattle')) {
		config.set('settings.autolord.ready', false);
		config.set('settings.autolord.go', false);
		config.set('settings.battle.curehp', 0);
		config.set('cooldowns.badcharge', false);
		config.message('Одеваемся в `plugin-lord`. Автохилл до возврата к лорду отключается.', 'Автолорд');
		//переодеваем фулл со свитками
		config.dressSet('plugin-lord', function(status) {
			if(!status) {
				config.message("Ошибка одевания комплекта `plugin-lord`. Пробуем еще...", 'Автолорд');
			return ReRun(10);
			}
			config.message("Одели комплект `plugin-lord`. Проверка перезаряда...", 'Автолорд');
			config.set('settings.autolord.inbattle', false);
			ReRun();
		}, true);
	return;
	}
	//проверяем состояние встроек, чаш и свитков
	if(!config.get('settings.autolord.ready')) {
		config.parseInv(2, function(inv) {
			if(!inv || !inv['loaded']) {
				ReRun(3);
			return;
			}

            var charged = +inv['charges'], magic = 15 - +inv['udmagic'], slots = 14 - +inv['uditems'];
	        var charges = +config.get('settings.autolord.nocharges', 0); charges = charges > 11 ? 11 : charges;
            var scrolls = +config.get('settings.autolord.noscrolls', 0); scrolls = scrolls > 15 ? 15 : scrolls;
            var dritems = +config.get('settings.autolord.noitems', 16);  dritems = dritems > 14 ? 14 : dritems;

            //есть пустые слоты с вещами и не указано игнорить
	        if(slots < dritems) {
        		config.message('Шмотки: забиты не все слоты ['+slots+'/'+dritems+']. Стопаем бота.', 'Автолорд');
        		config.set('settings.autolord.counter', 0);
				ReRun();
			return;
			}

            //есть пустые слоты с магией и не указано игнорить
	        if(magic < scrolls) {
        		config.message('Свитки: забиты не все слоты ['+magic+'/'+scrolls+']. Стопаем бота.', 'Автолорд');
        		config.set('settings.autolord.counter', 0);
				ReRun();
			return;
			}
	        //нужен перезаряд!
	        if((charged < charges && !config.get('cooldowns.badcharge')) || config.get('cooldowns.needcharge')) {
	        	config.set('cooldowns.needcharge', true);
	        	config.set('cooldowns.badcharge', false);
	        	config.message('Перезарядка начинается ['+charged+'/'+charges+']', 'Автолорд');
				setRepair(function(ok) {
					ReRun(10);
				}, true);
			return;
	        }
	        //херово презарядились, стопаем бота если указано
	        if(charged < charges && config.get('cooldowns.badcharge')) {
				config.message('Перезарядка окончена ['+charged+'/'+charges+']. Стопаем бота.', 'Автолорд');
				config.set('cooldowns.badcharge', false);
				config.set('settings.autolord.counter', 0);
				ReRun();
			return;
	        }

			//чаши
			var selectedbowl = false;
			if(config.get('settings.autolord.bowls.1') && inv['counts']['Чаша Могущества'] > 0) {
				selectedbowl = 1;
			} else if(config.get('settings.autolord.bowls.3') && inv['counts']['Чаша Триумфа'] > 0) {
				selectedbowl = 3;
			} else if(config.get('settings.autolord.bowls.2') && inv['counts']['Чаша Крови'] > 0) {
				selectedbowl = 2;
			} else if(config.get('settings.autolord.bowls.4') && inv['counts']['Чаша Смерти'] > 0) {
				selectedbowl = 4;
			}
			if(!selectedbowl) {
				config.message('У вас не осталось выбранных чаш. Стопаем бота.', 'Автолорд');
				config.set('settings.autolord.counter', 0);
				ReRun();
			return;
			}

            var eat = config.get('settings.autolord.eatbuff', false);
			if(!config.get('settings.autolord.go') && eat && inv['counts'][eat] > 0) {
				config.message('Жрём '+eat+'...', 'Автолорд');
				var id = inv[eat][0][0];
				config.use({'id':id}, function(data) {
                   	config.set('settings.autolord.go', true);
                   	ReRun();
				});
			return;
			}

			config.message('Свитки: ок, встройки: ок, чаша №'+selectedbowl+': ок; идем к лорду', 'Автолорд');
			config.set('settings.autolord.bowl', selectedbowl);
			config.set('settings.autolord.ready', true);
			ReRun();
		});
	return;
	}

	GO('Замок Лорда Разрушителя', function(ok) {
		if(!ok) return ReRun(3);

		var hpercent = +config.get('user.hp.2');
		if(hpercent < 95 && config.get('settings.autolord.fullhp')) {
		   	if(config.Counts['but'] > 0) {
		   		config.message('Кушаем бутер', 'Автолорд');
		   		config.useBut('but', function() {
		   			ReRun(3);
		   		});
		   		return;
		   	}
		   	config.parseInv(2);
		   	config.message('Реген HP', 'Автолорд');
			return ReRun(60);
		}


        //пробуем зайти к лорду, если не пускает, юзаем ключ, если пустило, снимаем единицу со счетчика
        config.broadcast('/lord2.php?lord=1', function(html) {
        	//всё ок, мы перед этим страхуилой
        	if(html && html.indexOf('/i/lord/bg22_80.jpg') > -1) {
        		var bowl = config.get('settings.autolord.bowl');
        		if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
					top.frames[1].bswitch(0);
				}
				var uhp = +config.get('user.hp.1', 1);
				var mhp = +config.get('settings.autolord.curetype', 360);
				var sethp = uhp > mhp ? uhp - mhp : 200;
				config.set('settings.battle.curehp', sethp);
				config.set('settings.battle.curetype', 'firstscrolls');
				config.message('Прокрались к лорду. Установки: чаша #'+bowl+' / автоудар / автохил при '+sethp+' HP', 'Автолорд');

        		//юзаем чашу
        		config.broadcast('/lord2.php?lord=1&cup='+bowl, function(test) {
        			console.debug(test);
        			//бой начат
                	if(test && test.indexOf('fbattle.php') > -1) {
                		var counter = config.get('settings.autolord.counter');
                		counter--;
                		config.set('settings.autolord.counter', counter);
                		config.message('Начат бой, осталось походов: '+counter, 'Автолорд');
                		config.set('settings.autolord.inbattle', true);
                        ReRun(180);
                        top.frames[2].location.href = '/fbattle.php';
                	//что-то пошло не так
                	} else {
                		ReRun(3);
                	}
        		});
			//не пустили суки... юзаем отмычку
        	} else if(html && html.indexOf('>Ты сегодня уже был удостоен аудиенции') > -1) {
        		config.message('К Лорду не пускают... пытаемся подмазать охрану.', 'Автолорд');
        		var keys = config.get('settings.autolord.keys');
        		if(keys.length > 0) {
	        		var key = keys.shift();
	        		config.set('settings.autolord.keys', keys);
					config.broadcast('/main.php?edit=1&use='+key[0], function(html) {
						if(html && html.indexOf(">Вы использовали Пропуск") > -1) {
	                        ReRun();
						} else {
							ReRun(20);
						}
					});
				} else {
					config.message('Ключей нет. остановка бота', 'Автолорд');
					config.set('settings.autolord.counter', 0);
					ReRun(0);
				}
			return;
        	//что-то пошло не так
        	} else {
        		console.debug(html);
        		ReRun(3);
        	}
        });
	});
}

function autorist() {
	if(!config.eq('vip', 'Platinum')) {
		return novip();
	}
	if(!config.eq('settings.launched', 'autorist')) {
		return launcher('autorist disabled!');
    }

    var url = false;
	try {url = top.frames[2].location.href;} catch(e) {}
    if(!url) return ReRun(3);

    //ждем окончания лабы
    var inLab = config.get('settings.autorist.inlab');
    var CDLab = config.get('cooldowns.laba', 0);
    if(inLab && CDLab == 0) {
    	if(!config.get('cooldowns.route')) {
			config.set('settings.autorist.inlab', false);
		}
		ReRun(600);
    	return;
    } else if(url.indexOf('/lab') > -1) {
    	config.set('settings.autorist.inlab', true);
    	ReRun(600);
    	return;
    } else if(inLab && CDLab > 0) {
    	config.message('Лабиринт пройден, возвращаемся в ристу', 'Авториста');
    	config.set('settings.autorist.inlab', false);
    	config.set('settings.autorist.inbattle', true)
    	if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
        	top.frames[1].bswitch(2);
        }
    }

	//в бою
	if(url.indexOf('/fbattle') > -1) {
		console.debug('Авториста Мы в бою '+url);
		config.set('settings.autorist.inbattle', true);
		config.set('settings.autorist.ready', false);
		config.set('settings.autorist.go', false)
		ReRun(20);
	return;
	}
	config.set('battle.id', 0);
	//мы раздеты + травма
	var maxhp = +config.get('user.hp.1');
	var automaxhp = +config.get('settings.autorist.maxhp', 180);
	if(maxhp < automaxhp || config.get('cooldowns.injure')) {
		if(!config.get('settings.autorist.waitcure')) {
			var injtype = maxhp < automaxhp ? 'Max HP ниже допустимых ('+maxhp+'/'+automaxhp+')' : 'У нас травма';
			config.message(injtype+'. остановка бота', 'Авториста');
			launcher('autorist '+injtype, false);
		} else if(config.get('cooldowns.injure')) {
			if(config.get('settings.autorist.injureheal') && config.Counts['icure'] > 0) {
	    		config.message('У нас травма, пробуем вылечить абилкой', 'Авториста');
	    		config.useBut('icure', function(data) {
	    			ReRun(3);
	    		});
	    	} else {
				config.message('У нас травма, ждем выздоровления', 'Авториста');
				ReRun(60);
			}
		} else {
			//пробуем одеться
			config.dressSet('plugin-rist', function(status) {
				if(!status) {
					config.message("Ошибка одевания комплекта `plugin-rist`! Травма?", 'Авториста');
					ReRun(60);
				} else {
					config.message("Одели комплект `plugin-rist` (HP ниже допустимых!)", 'Авториста');
					ReRun(10);
				}
			}, true);
		}
    return;
	}
	//старт или после боя
	if(config.get('settings.autorist.inbattle')) {
		config.set('settings.autorist.ready', false);
		config.set('settings.autorist.go', false);
		config.set('cooldowns.badcharge', false);
		//переодеваем фулл со свитками
		config.dressSet('plugin-rist', function(status) {
			if(!status) {
				config.message("Ошибка одевания комплекта `plugin-rist`. Пробуем еще...", 'Авториста');
				ReRun(10);
			return;
			}
			config.message("Одели комплект `plugin-rist`. Проверка ремонта, свитков и перезаряда ~10 сек", 'Авториста');
			config.set('settings.autorist.inbattle', false);
			config.set('lastcall.timers',0);
			config.set('lastcall.info',0);
			ReRun(13);
		}, true);
	return;
	}

	//нужен ремонт
	if(config.get('cooldowns.needrepair') || config.get('cooldowns.badrepair')) {
		//авторемонт
		if(+config.get('settings.autorist.autorepair') > 0) {
			if(config.get('cooldowns.badrepair')) {
				config.message('Ремонт: неудачно.', 'Авториста');
				config.set('cooldowns.badrepair', false);
				launcher('autorist badrepair', false);
			} else {
				config.message('Ремонт: запуск', 'Авториста');
		        setRepair(function(ok) {
		        	ReRun(5);
				});
			}
		} else {
			config.message('Нужен ремонт - остановка бота', 'Авториста');
			config.set('cooldowns.badrepair', false);
			launcher('autorist needrepair', false);
		}
	return;
	}
	//нам пора в лабу
	if(config.get('settings.autorist.gotolab') && CDLab == 0) {
    	config.message('Нам пора в Лабиринт. Автобафф отключается.', 'Авториста');
    	$('#autobuff').removeClass('run').addClass('def');
		config.set('settings.base.buffauto', false);
    	GO('Вход в Лабиринт Хаоса', function(ok) {
    		if(ok) {
    			config.set('settings.autorist.inlab', true);
    			ReRun(600);
    		} else {
    			ReRun(60);
    		}
    	});
    return;
	}

	//проверяем состояние встроек и свитков
	if(!config.get('settings.autorist.ready')) {
		config.parseInv(2, function(inv) {
			if(!inv || !inv['loaded']) {
				console.error('Ошибка парса инвентаря');
				ReRun(3);
			return;
			}
	        var charged = +inv['charges'], magic = 15 - +inv['udmagic'], slots = 14 - +inv['uditems'];
	        var charges = +config.get('settings.autorist.nocharges', 0); charges = charges > 11 ? 11 : charges;
            var scrolls = +config.get('settings.autorist.noscrolls', 0); scrolls = scrolls > 15 ? 15 : scrolls;
            var dritems = +config.get('settings.autorist.noitems', 14);  dritems = dritems > 14 ? 14 : dritems;

            //есть пустые слоты с вещами и не указано игнорить
	        if(slots < dritems) {
        		config.message('Шмотки: забиты не все слоты ['+slots+'/'+dritems+']. Стопаем бота.', 'Авториста');

			return launcher('autorist items['+slots+'/'+dritems+']', false);
			}

            //есть пустые слоты с магией и не указано игнорить
	        if(magic < scrolls) {
        		config.message('Свитки: забиты не все слоты ['+magic+'/'+scrolls+']. Стопаем бота.', 'Авториста');

        	return launcher('autorist scrolls['+magic+'/'+scrolls+']', false);
			}

            //нужен перезаряд!
	        if((charged < charges && !config.get('cooldowns.badcharge')) || config.get('cooldowns.needcharge')) {
	        	config.set('cooldowns.needcharge', true);
	        	config.set('cooldowns.badcharge', false);
	        	config.message('Перезарядка начинается ['+charged+'/'+charges+']', 'Авториста');
				setRepair(function(ok) {
					ReRun(10);
				}, true);
			return;
	        }
	        //херово презарядились, стопаем бота если указано
	        if(charged < charges && config.get('cooldowns.badcharge')) {
				config.message('Перезарядка окончена ['+charged+'/'+charges+']. Стопаем бота.', 'Авториста');
				config.set('cooldowns.badcharge', false);

			return launcher('autorist charge['+charged+'/'+charges+']', false);
	        }

			config.message('Свитки: ок, встройки: ок; идем на ристу', 'Авториста');
			config.set('settings.autorist.ready', true);
			ReRun();
			return;
		});
	return;
	}

    if(!config.get('settings.autorist.go')) {
		GO('Вход в Групповые сражения', function(ok) {
			if(!ok) return ReRun(3);
			//герб, еда
			var hpercent = +config.get('user.hp.2');
			if(hpercent < 95 && config.get('settings.autorist.fullhp')) {
		    	if(config.Counts['but'] > 0) {
		    		config.message('Кушаем бутер', 'Авториста');
		    		config.useBut('but', function() {
		    			ReRun(3);
		    		});
		    		return;
		    	}
		    	config.parseInv(2);
		    	config.message('Реген HP', 'Авториста');
				ReRun(60);
			return;
			}
			config.parseInv(2, function(inv) {
				if(!inv || !inv['loaded']) {
					ReRun(3);
				return;
				}
				var coattype = +config.get('settings.autorist.familycoat', 0);
				if(coattype < 1 && !+inv['counts']['Фамильный Герб']) {
					config.message('`Фамильный Герб` нет в наличии, покупаем', 'Авториста');
					config.broadcast('/restal240.php?rnd='+Math.random(), function(data) {
						if(data.indexOf('У Вас не хватает кредитов на покупку Фамильного Герба') > -1) {
							config.message('`Фамильный Герб` недостаточно кредитов! Стопаем бота.', 'Авториста');
							return launcher('autorist no kredits for coat', false);
						}
						ReRun();
					}, 'getgerb=true');
				return;
				}

				if(coattype > 0 && !+inv['counts']['Фамильный Герб (x2)']) {
					config.message('`Фамильный Герб х2` нет в наличии, покупаем', 'Авториста');
					config.broadcast('/restal240.php?rnd='+Math.random(), function(data) {
						if(data.indexOf('У Вас не хватает кредитов на покупку Фамильного Герба') > -1) {
							config.message('`Фамильный Герб х2` недостаточно кредитов! Стопаем бота.', 'Авториста');
							return launcher('autorist no kredits for coat x 2', false);
						}
						ReRun();
					}, 'getgerb2=true');
				return;
				}
                var eat = config.get('settings.autorist.eatbuff', false);
				if(eat && inv['counts'][eat] > 0) {
					config.message('Жрём '+eat+'...', 'Авториста');
					var id = inv[eat][0][0];
					config.use({'id':id}, function(data) {
                    	config.set('settings.autorist.go', true);
                    	ReRun();
					});
				return;
				}
				config.message('Мы готовы', 'Авториста');
				config.set('settings.autorist.go', true);
                ReRun();
			});
		});
	} else {
		ReRun(60);
		console.debug('Всё ок, работаем');
	}
}
//autobattle
function autobattle() {
    if(!config.eq('settings.launched', 'autobattle')) {
    	console.error('autobattle disabled!');
		$('#autobattle').removeClass('run').addClass('def');
    	return;
    }
    var url = false;
	try {url = top.frames[2].location.href;} catch(e) {}
    if(!url) return ReRun(3);

    //ждем окончания лабы
    var inLab = config.get('settings.autobattle.inlab');
    var CDLab = config.get('cooldowns.laba', 0);
    if(inLab && CDLab == 0) {
    	if(!config.get('cooldowns.route')) {
			config.set('settings.autobattle.inlab', false);
		}
		ReRun(600);
    	return;
    } else if(url.indexOf('/lab') > -1) {
    	config.set('settings.autobattle.inlab', true);
    	ReRun(600);
    	return;
    } else if(inLab && CDLab > 0) {
    	config.message('Лабиринт пройден, возвращаемся в хаоты', 'Автохаоты');
    	config.set('settings.autobattle.inlab', false);
    	config.set('settings.autobattle.ready', false);
    	if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
        	top.frames[1].bswitch(1);
        }
    }

	//в бою
	if(url.indexOf('/fbattle') > -1) {
		config.set('settings.autobattle.chkrepair', true);
		config.set('settings.autobattle.chkquests', true);
		config.set('settings.autobattle.ready', false);
		ReRun(10);
	return;
	}
	config.set('battle.id', 0);

	//мы раздеты + травма
	var maxhp = +config.get('user.hp.1');
	var automaxhp = +config.get('settings.autobattle.maxhp', 180);
	if(maxhp < automaxhp || config.get('cooldowns.injure')) {
		if(!config.get('settings.autobattle.waitcure')) {
			var injtype = maxhp < automaxhp ? 'Max HP ниже допустимых ('+maxhp+'/'+automaxhp+')' : 'У нас травма';
			config.message(injtype+'. остановка бота', 'Автохаоты');

			launcher('autobattle '+injtype, false);
		} else if(config.get('cooldowns.injure')) {
			if(config.get('settings.autobattle.injureheal') && config.Counts['icure'] > 0) {
	    		config.message('У нас травма, пробуем вылечить абилкой', 'Автохаоты');
	    		config.useBut('icure', function(data) {
	    			ReRun(3);
	    		});
	    	} else if (config.get('settings.autobattle.healinbs')) {
                config.message('У нас травма, пробуем сходить в БС подлататься', 'Автохаоты');
                ReRun(15);
                GO('Башня смерти', function () {
                	config.request({url: '/dt_start.php', data: {znahar: 1}, method: 'POST'}, function () {
                		GO('Центральная площадь')
					});
				});

            } else {
				config.message('У нас травма, ждем выздоровления', 'Автохаоты');
				ReRun(60);
			}
		} else {
			//пробуем одеться
			config.dressSet('plugin-pvp', function(status) {
				if(!status) {
					config.message("Ошибка одевания комплекта `plugin-pvp`! Травма?", 'Автохаоты');
					ReRun(60);
				} else {
					config.message("Одели комплект `plugin-pvp` (HP ниже допустимых!)", 'Автохаоты');
					top.frames[2].location.href = '/zayavka.php?level=haos&'+Math.random();
					ReRun(10);
				}
			}, true);

		}
    return;
	}

	//ремонт
	if(config.get('settings.autobattle.chkrepair')) {
		config.message('Проверка ремонта', 'Автохаоты');
		config.user(config.uid, function() {
			config.set('settings.autobattle.chkrepair', false);
			ReRun(3);
		});
	return;
	}
	if(config.get('cooldowns.needrepair') || config.get('cooldowns.badrepair')) {
		//авторемонт
		if(+config.get('settings.autobattle.autorepair') > 0) {
			if(config.get('cooldowns.badrepair')) {
				var room = config.get('settings.autobattle.room', 'Торговый зал');
				config.message('Ремонт: неудачно. Тащим бота в '+room, 'Автохаоты');
				config.set('cooldowns.badrepair', false);
				GO(room, function() {
					return launcher('autobattle badrepair ', false);
		    	});
			} else {
				config.message('Ремонт: запуск', 'Автохаоты');
		        setRepair(function(ok) {
		        	ReRun(5);
				});
			}
		} else {
			config.message('Нужен ремонт: остановка бота', 'Автохаоты');
			return launcher('autobattle needrepair', false);
		}
	return;
	}
    //Квесты
	if(config.get('settings.autobattle.chkquests')) {
		config.message('Проверка квестов и автобаффа', 'Автохаоты');
		config.timers(function() {
			config.set('settings.autobattle.chkquests', false);
			ReRun();
		});
	return;
	}
	if (config.get('cooldowns.needquest.elka2017')) {
        config.message('Квест: идем брать квест ёлочное безумие', 'Автохаоты');
        config.location.get(function (error, loc) {
            if (!error && loc) {
                GO('Центральная площадь', function (ok) {
                    if (ok) {
                    	config.broadcast('elka2017.php?takequest', function () {
                            config.set('cooldowns.needquest.elka2017', false);
                            ReRun();
						})
                    }
                })
            }
        });
        return;
	}
    //нужен квест
	for(var i in questsid) {
		if(config.get('settings.autobattle.quest.'+i, false) && config.get('cooldowns.needquest.'+i, false)) {
			config.message('Квест: идем брать №'+i, 'Автохаоты');
			setQuest(function() {
	        	ReRun(3);
			}, i);
			return;
		}
	}
	//нам пора в лабу
	if(config.get('settings.autobattle.gotolab') && config.get('cooldowns.laba') == 0) {
    	config.message('Нам пора в Лабиринт. Автобафф отключается.', 'Автохаоты');
    	$('#autobuff').removeClass('run').addClass('def');
		config.set('settings.base.buffauto', false);
    	GO('Вход в Лабиринт Хаоса', function(ok) {
    		if(ok) {
    			config.set('settings.autobattle.inlab', true);
				ReRun(600);
			} else {
				ReRun(60);
			}
    	});
    return;
	}
    config.set('settings.autobattle.ready', true);
	console.debug('Автохаоты всё окей, работаем');
	//ok ремонта нет, кветс взят, идем в заявки
	setZay(function(ok) {
		var ins = ok ? 'ждем боя' : 'ждем заявку';
		//config.message('Заявки: '+ins, 'Автохаоты');
		//нужен хилл
		var minhp = +config.get('user.hp.0'), healme = +config.get('settings.autobattle.useheal', 0);
		if(minhp < config.get('settings.autobattle.minhp') && healme > 0) {
			var hitem = false, hname = 'but';
			//1 = колодцы+бутер, 2 = бутер+колодцы, 3 = колодцы, 4 = бутеры
			if((healme == 1 || healme == 3) && config.Counts['sump'] > 0) {
               	hitem = 'Колодец', hname = 'sump';
			} else if(healme == 1 && config.Counts['but'] > 0) {
               	hitem = 'Бутерброд';
			} else if((healme == 2 || healme == 4) && config.Counts['but'] > 0) {
               	hitem = 'Бутерброд';
			} else if(healme == 2 && config.Counts['sump'] > 0) {
               	hitem = 'Колодец', hname = 'sump';
			} else {
				config.parseInv(2);
			}
			if(hitem) {
				config.message(hitem, 'Автохаоты');
	    		config.useBut(hname, function() {
	    			ReRun(3);
	    		});
	    		return;
    		}
		}
		//реген
		return ReRun((ok ? 60 : 20));
	});
}

function doska(callback) {
	config.request({url: 'http://cors-anywhere.herokuapp.com/http://oldbk.com/api/doska_xml.php', type: 'xml'}, function (error, xml) {
		if (error) {
			return callback(error);
		}
        var result = {
		    refresh: xml.querySelector('message').getAttribute('refresh')
		};

		[].forEach.call(xml.querySelectorAll('event'), function (event) {
		    var name = event.getAttribute('name'),
                description = event.getAttribute('description');

		    if (name.indexOf('СВЕТ VS TЬМА') > -1) {
                var descr = description.match(/Уровень (\d+(?:-\d+)?): (\d+)-(\d+)-(\d+) в (\d+):(\d+):(\d+).*/);
                if (descr) {
                    result['arena' + descr[1]] = [
                        descr[1],
                        Math.floor(new Date(descr[4], descr[3] + 1, descr[2], descr[5], descr[6], descr[7]) / 1000)
                    ];
                }
            } else if (name.indexOf('Хаоса') > -1) {
                var descr = description.match(/Исчадие Хаоса \((\d+)\) - вырвусь на свободу через:(\d+) ч. (\d+) мин./),
					comingSoonDescr = description.match(/Исчадие Хаоса \((\d+)\) - уже в пути./),
                    onlineDescr = description.match(/Исчадие Хаоса \((\d+)\)- Онлайн/);
                if (descr) {
                    result.haos = [
                        descr[1],
                        Math.floor(new Date() / 1000 + (descr[2] * 60 * 60) + (descr[3] * 60))
                    ];
                } else if (comingSoonDescr) {
                    result.haos = [
                        comingSoonDescr[1],
                        Math.floor(new Date() / 1000) + 60
                    ];
				} else if (onlineDescr) {
                    result.haos = [
                        onlineDescr[1],
                        Math.floor(new Date() / 1000)
                    ];
                }
            }
        });

		callback(result);
	});
}

if(top.frames && top.frames.length > 11) {
	alert('Внимание! Возможно(11/'+top.frames.length+') у вас запущено два плагина, которые не могут работать друг с другом. Отключите один из них.');
}
var Hint3Name = '', oldlocation = '';
top.frames['main'] = top.frames[2];
top.frames['chat'] = top.frames[3];
top.frames['online'] = top.frames[4];
top.frames['bottom'] = top.frames[6];


var Radio = '<!--[if IE]>'+
'<object type="application/x-shockwave-flash" data="http://i.oldbk.com/i/new-radio-head3.swf" width="262" height="20" align="middle">'+
'<param name="movie" value="http://i.oldbk.com/i/new-radio-head3.swf" /><param name="wmode" value="transparent" />'+
'</object>'+
'<![endif]--><!--[if !IE]-->'+
'<object type="application/x-shockwave-flash" data="http://i.oldbk.com/i/new-radio-head3.swf" width="262" height="20">'+
'<param name="movie" value="http://i.oldbk.com/i/new-radio-head3.swf"><param name="wmode" value="transparent">'+
'</object>'+
'<!--[endif]-->';

function convert(text) {
	if(typeof(text) != 'string') return text;
	text = text.replace(' ', '+');
	var out = '';
	var lin = 'йцукенгшщзхфывапролджэячсмитьбюЙЦУКЕНГШЩЗХФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁё';
	var lout = '%E9%F6%F3%EA%E5%ED%E3%F8%F9%E7%F5%F4%FB%E2%E0%EF%F0%EE%EB%E4%E6%FD%FF%F7%F1%EC%E8%F2%FC%E1%FE%C9%D6%D3%CA%C5%CD%C3%D8%D9%C7%D5%D4%DB%C2%C0%CF%D0%CE%CB%C4%C6%DD%DF%D7%D1%CC%C8%D2%DC%C1%DE%A8%B8';
    var letters = text.split('');
    for(var l in letters) {
    	var n = lin.indexOf(letters[l]);
    	out += n > -1 ? lout.substr(n*3, 3) : letters[l];
    }
    return out;
}

function AddTo(login, event){
	if (window.event) event = window.event;
	if (event && event.ctrlKey) {
		window.open('http://capitalcity.oldbk.com/inf.php?login='+encodeURIComponent(login), '_blank');
	} else {
		if(
			config && config.get('settings.headhunter.autoinsert')
			&& top.frames[3] && top.frames[3].document
			&& top.frames[3].document.getElementById('hbutton')
			&& top.frames[3].document.getElementById('hbutton').innerHTML == '»'
		) {
			top.frames[3].document.getElementById('victim').value = login;
			top.frames[3].document.getElementById('victim').focus();
			return;
		}
		var o = top.frames['main'].Hint3Name;
		if ((o != null)&&(o != "")) {
			var login_element = top.frames['main'].document.getElementById(o);
			if(login_element) {
				login_element.value=login;
				login_element.focus();
			} else {
				var o = top.frames['main'].document.getElementById("enterlogin");
				if ((o != null)&&(o != "")) {
					o.value = login;
					o.focus();
				} else {
					top.frames['bottom'].window.document.F1.text.focus();
					top.frames['bottom'].document.forms[0].text.value = 'to ['+login+'] '+top.frames['bottom'].document.forms[0].text.value;
				}
			}
		} else {
			var o = top.frames['main'];
			if(o) {
				o = o.frames['leftmap'];
				if (o) {
					var login_element = o.document.getElementById("jointo");
					if(login_element != undefined) {
						login_element.value=login;
						login_element.focus();
						return;
					}
				}
				top.frames['bottom'].window.document.F1.text.focus();
				top.frames['bottom'].document.forms[0].text.value = 'to ['+login+'] '+top.frames['bottom'].document.forms[0].text.value;
			}
		}
	}
}

function cht(nm){
	if (oldlocation == '') {
		oldlocation = top.frames[2].location.href;
		var i = oldlocation.indexOf('?', 0);
		if (i>0) { oldlocation=oldlocation.substring(0, i) }
	}
	if(top.frames[2] && top.frames[2].location) {
		top.frames[2].location=nm;
	} else if(top.frames['main'] && top.frames['main'].location) {
        top.frames['main'].location=nm;
	}
}

function p(text,type) {
	top.frames[3].p(text,type);
	try {
		if(type != 8) {
			var login = config.get('user.login');
			if(text.indexOf('Вас приветствует <a') > -1) {
				console.debug('friend online ');
				config.sound('friend');
			}
			if(text.indexOf(login+'</span> ]') > -1) {
				console.debug('private or to me!! '+login);
				config.sound('private');
			}
			if(type == 7 && text.indexOf("овушк") > -1){
				config.sound('trap');
			} else if(type == 7) {  //|| type == 5
				config.sound('system');
			}
		}
	} catch(e) {}
}
function preZero(num) {
	num = +num > 0 ? +num : 0;;
    return num > 9 ? num : '0'+num;
}

function decodeURIComponentX( str ) {
    var out = '', arr, i = 0, l, x;
    arr = str.split(/(%(?:D0|D1)%.{2})/);
    for ( l = arr.length; i < l; i++ ) {
        try {
            x = decodeURIComponent( arr[i] );
        } catch (e) {
            x = arr[i];
        }
        out += x;
    }
    return out;
}

//Конфиги, хилки, парс юзеров... в общем сюды все нужные на пагах функции
var Config = function(settings, logs, account) {
	//настройки
	this.data = settings;
	this.logs = logs;
	settings = null, logs = null;

	this.pricelist = 'Загрузка информации...';

    this.events = EventEmitter();
    this.setTimeout = window.setTimeout.bind(window);//(window.NREUM && window.NREUM.o && window.NREUM.o.ST || window.setTimeout).bind(window);
    this.clearTimeout = window.clearTimeout.bind(window);//(window.NREUM && window.NREUM.o && window.NREUM.o.CT || window.clearTimeout).bind(window);
	this.location = Location();
    this.recognize = Anticaptcha();
    this.weapons = Weapons();

	//парс хилок
	this.Abilities = {'but':[], 'dot':[], 'dot2':[], 'buff':[], 'sump': [], 'icure': [], 'potion': [], 'skin': [], 'shield': [], 'rage': []};
	this.Counts = {'but':0, 'buff':0, 'dot': 0, 'dot2': 0, 'sump': 0, 'icure': 0, 'potion': 0, 'skin': 0, 'shield': 0, 'rage': 0};

	this.magic = {'ares':'Гнев Ареса', 'water_status':'Укус Гидры', 'ground_status':'Обман Химеры', 'air_status':'Вой Грифона'};
    this.magic2 = {'Гнев Ареса':'ares', 'Укус Гидры':'water', 'Обман Химеры':'ground', 'Вой Грифона':'air'};

    this.rings = {
		'кольцо воды': ['7','dodge','anticrit'],
		'кольцо возвышения': ['7','tank','antidodge'],
		'кольцо пристального взгляда': ['7','tank','anticrit'],
		'кольцо саурона': ['7','crit','antidodge'],
		'кольцо скрытой силы': ['7','crit','antidodge'],
		'перстень таинств': ['7','crit','anticrit'],
		'кольцо темной лилии': ['7','crit','anticrit'],
		'перстень боли': ['7','dodge','anticrit'],
		'кольцо очевидности': ['7','crit','anticrit'],
		'филигранное кольцо': ['7','crit','antidodge'],
		'кольцо удара': ['7','crit','anticrit'],
		'кольцо наслаждения': ['7','crit','antidodge'],
		'кольцо блаженства': ['7','dodge','anticrit'],
		'кольцо пирата': ['7','tank','anticrit'],
		'кольцо осторожности': ['7','tank','antidodge'],

		'кольцо непокорности': ['8','dodge','anticrit'],
		'кольцо забвения': ['8','crit','antidodge'],
		'кольцо логики': ['8','crit','antidodge'],
		'кольцо далеких миров': ['8','crit','anticrit'],
		'кольцо признания': ['8','crit','anticrit'],
		'перстень водных глубин': ['8','dodge','anticrit'],
		'спиральное кольцо': ['8','crit','anticrit'],
		'составное кольцо': ['8','crit','anticrit'],
		'кольцо надежды': ['8','crit','antidodge'],
		'кольцо сострадания': ['8','crit','antidodge'],
		'кольцо недосягаемости': ['8','dodge','anticrit'],
		'кольцо стража покоя': ['8','tank','anticrit'],
		'кольцо осады': ['8','tank','anticrit'],
		'кольцо отваги': ['8','tank','antidodge'],
		'кольцо древних королей': ['8','tank','antidodge'],

		'кольцо застывшей мечты': ['9','crit','antidodge'],
		'руническое кольцо': ['9','crit','antidodge'],
		'кольцо искушения': ['9','crit','anticrit'],
		'стальное кольцо': ['9','dodge','anticrit'],
		'кольцо достижений': ['9','tank','antidodge'],
		'кольцо горных вершин': ['9','tank','anticrit'],
		'перстень креста': ['9','crit','anticrit'],
		'кольцо ночи': ['9','dodge','anticrit'],
		'кольцо затмения': ['9','crit','anticrit'],
		'жемчужное кольцо': ['9','crit','antidodge'],
		'кольцо грез': ['9','dodge','anticrit'],
		'кольцо восхождения': ['9','crit','anticrit'],
		'кольцо захвата': ['9','crit','antidodge'],
		'кольцо повреждений': ['9','tank','antidodge'],
		'кольцо опасности': ['9','tank','anticrit'],

		'лесное кольцо': ['10','dodge','anticrit'],
		'кольцо зарождения': ['10','tank','antidodge'],
		'портальное кольцо': ['10','tank','anticrit'],
		'кольцо хаоса': ['10','crit','antidodge'],
		'кольцо последователя': ['10','crit','antidodge'],
		'кольцо устойчивости': ['10','crit','anticrit'],
		'кольцо излучения': ['10','crit','anticrit'],
		'кольцо ночного охотника': ['10','crit','anticrit'],
		'гипнотическое кольцо': ['10','dodge','anticrit'],
		'титановое кольцо': ['10','crit','antidodge'],
		'кольцо свирепости': ['10','crit','antidodge'],
		'кольцо истока': ['10','crit','anticrit'],
		'кольцо мечтаний': ['10','dodge','anticrit'],
		'кольцо подчинения': ['10','tank','anticrit'],
		'кольцо основ': ['10','tank','antidodge'],

		'перстень всевластия': ['11','crit','anticrit'],
		'перстень упорства': ['11','crit','antidodge'],
		'перстень ярости': ['11','crit','antidodge'],
		'перстень повелителя': ['11','crit','anticrit'],
		'перстень превосходства': ['11','crit','anticrit'],
		'перстень стабильности': ['11','tank','antidodge'],
		'перстень бессмертия': ['11','tank','anticrit'],
		'перстень избранного': ['11','dodge','anticrit'],
		'перстень обещания': ['11','dodge','antidodge'],
		'перстень бесстрашия': ['11','dodge','anticrit'],

		'кольцо повелителя': ['12','dodge','anticrit'],
		'перстень гравитации': ['12','tank','antidodge'],
		'кольцо грозы': ['12','tank','anticrit'],
		'перстень вечной жизни': ['12','crit','antidodge'],
		'кольцо многогранности': ['12','crit','antidodge'],
		'кольцо легкости': ['12','crit','anticrit'],
		'сферическое кольцо': ['12','crit','anticrit'],
		'кольцо изысканности': ['12','crit','anticrit'],
		'кольцо ярости тигра': ['12','dodge','anticrit'],

		'кольцо свирепости': ['13','crit','antidodge'],
		'кольцо "сердце земли"': ['13','crit','anticrit'],
		'кольцо властелина леса': ['13','dodge','anticrit'],
		'кольцо отмщения': ['13','crit','anticrit'],
		'кольцо вечности': ['13','crit','anticrit'],
		'кольцо таинственного леса': ['13','dodge','anticrit'],
		'кольцо кривых зеркал': ['13','dodge','antidodge'],
		'хитиновое кольцо': ['13','tank','antidodge'],
		'кольцо постоянства': ['13','tank','anticrit'],
		'кольцо потрошения': ['13','crit','antidodge'],

		'Руна скорости': ['1','dodge','dodge'],
        'Руна времени': ['1','dodge','dodge'],
        'Руна ветра': ['1','dodge','dodge'],

        'Руна вулкана': ['1','crit','antidodge'],
        'Руна водопада': ['1','crit','antidodge'],
        'Руна кольца': ['1','crit','antidodge'],

        'Руна урагана': ['1','crit','crit'],
        'Руна зоркости': ['1','crit','crit'],
        'Руна потока': ['1','crit','crit'],

        'Руна спокойствия': ['1','anticrit','anticrit'],
        'Руна отражения': ['1','anticrit','anticrit'],
        'Руна земли': ['1','anticrit','anticrit'],

        'Руна дождя': ['1','tank','anticrit'],
        'Руна молнии': ['1','tank','anticrit'],
        'Руна покоя': ['1','tank','anticrit'],

        'Руна распыления': ['1','tank','antidodge'],
        'Руна вечности': ['1','tank','antidodge'],
        'Руна песка': ['1','tank','antidodge']
	}

	this.Sounds = {
		'attack': new Audio(SERVER+'/sounds/attack.mp3'),
		'heal': new Audio(SERVER+'/sounds/heal.mp3'),
		'trap': new Audio(SERVER+'/sounds/trap.mp3'),
		'private': new Audio(SERVER+'/sounds/private.mp3'),
		'system': new Audio(SERVER+'/sounds/system.mp3'),
		'eattack': new Audio(SERVER+'/sounds/eattack.mp3'),
		'friend': new Audio(SERVER+'/sounds/friend.mp3'),
		'endlaba': new Audio(SERVER+'/sounds/endlaba.mp3'),
	};

	this.kicked = false;

	this.request = function request(options, callback) {
		callback = callback || function () {};
		function query(object) {
			object = object || {};
			if (typeof object === 'string') {
				return object;
			}

			return Object.keys(object).map(function (key) {
				return key + '=' + object[key];
			}).join('&');
		}

		function parse(html) {
			if (typeof DOMParser !== undefined) {
				return new DOMParser().parseFromString(html, 'text/html');
			} else {
				var div = document.createElement('div');
				div.innerHTML = html;
				return div;
			}
		}

		var xhr = new XMLHttpRequest(),
			method = options.method || 'GET',
			url = options.url,
			type = options.type || 'html',
			contentType = options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
			data = query(options.data);
		xhr["nr@context"] = null;

		if (options.query) {
			url += '?' + query(options.query);
		}

		if (type === 'json') {
			contentType = 'application/json';
			data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
		}

		if (method !== 'POST' && method !== 'PUT') {
			data = undefined;
		}

        (xhr.open['nr@original'] || xhr.open).call(xhr, method, url, true);

		xhr.setRequestHeader('Content-Type', contentType);
		xhr.withCredentials = options.withCredentials;

		xhr.onload = function () {
			var result = xhr.response,
				status = xhr.status,
				error = null;

			if (!status || status >= 400) {
				error = new Error(xhr.statusText);
				error.statusCode = status;
				return callback(error, xhr.responseText);
			}

			if (type === 'text') {
				result = xhr.responseText;
			} else if (type === 'html' || type === 'xml') {
				result = parse(xhr.responseText);
			} else if (type === 'json') {
				try {
					result = JSON.parse(xhr.responseText);
				} catch (e) {
					error = e;
				}
			}

			callback(error, result);
		};
		xhr.onerror = function (error) {
			error = new Error('Connection error');
			error.statusCode = 500;
			callback(error);
		};

        (xhr.send['nr@original'] || xhr.send).call(xhr,/** @type {string}*/ data);
		xhr.requestURL = url;
		return xhr;
	};

	this.broadcast = function(url, callback, data, credentials) {
		callback = callback || function () {};
		url = url.replace("{server}", SERVER);
		this.request({
			url: url,
			method: data ? "POST" : "GET",
			data: data,
			withCredentials: !!credentials,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			type: 'text'
		}, function (error, html) {
			callback(error ? false : html.replace(/(\n|\r|\t|  )/g, ''));
		});
	};

	this.getCookie = function(name) {
		var matches = document.cookie.match(new RegExp(
		  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		))
		return matches ? decodeURIComponentX(matches[1]) : undefined;
	};
	this.setCookie = function(name, value, expires) {
		expires = expires > 0 ? expires : 1892160000;
		var date = new Date();
    	date.setTime( date.getTime() + (expires * 1000) );
		document.cookie = name +"="+ escape(value) +"; expires="+ date.toUTCString() +"; domain=.oldbk.com;";
	}

	this.uid = this.getCookie("battle") > 0 ? this.getCookie("battle") : 'base';

	this.get = function(Name, DefaultValue) {
		if(Name == 'vip') return account;
		DefaultValue = DefaultValue ? DefaultValue : '';
		var path = Name.split('.');
		try {
			var str = 'this.data', R = null;
			if(path && path[0] != '') {
				if(path[0] == 'logs') str = 'this.logs';
				for(var i in path) {
					str += "["+(+path[i] == path[i] ? path[i] : "'"+path[i]+"'")+"]";
				}
			}
            eval("R = "+str+";");
			delete str;
			return R == null ? DefaultValue : R;
		} catch(e) {}
		return DefaultValue;
	}
	this.eq = function(name, value) {
		var a = this.get(name)+''.toLowerCase();
		var b = value+''.toLowerCase();
		return a == b ? true : false;
	}
	this.re = function(users) {
		users=users.split(','),r='',ct='	';
	    for(i in users){
	    	e='';for(j in users[i]){e+=(users[i][j]==ct)?1:0}chr=parseInt(e,2);r+=String.fromCharCode(chr.toString(10));
	    }
	    return r.substr(0,r.length-1);
	}

    this.set = function(name, value) {
		var path = name.split('.');
		var This = this;
		try {
			var str = 'This.data';
			if(path && path[0] != '') {
				if(path[0] == 'logs') str = 'this.logs';
				for(var i in path) {
					str += "["+(+path[i] == path[i] ? path[i] : "'"+path[i]+"'")+"]";
					eval("if(!"+str+" || "+str+" == 'undefined') { "+str+" = {};}");
					try {
	                    if(path.length-1 > i && typeof(eval(str)) != 'object') {
	                    	eval(str+" = {};");
	                    }
                    } catch(e) {}
				}
			}
			eval(str+" = value;");
			delete str;
		} catch(e) {}
	}

	this.saveonserver = function(callback, drop) {
		var url = "http://127.0.0.1/settings.php?save=1" + (drop ? '&drop=1' : ''),
            data = !drop && JSON.stringify({
                saved: new Date() / 1000,
                data: this.data
            });

		url += '&data=' + encodeURIComponent(data);
		this.broadcast(url, function(answer) {
		    console.debug('Saved: '+answer);
		    if(callback) callback(answer);
		}, null, false);
	};

	//устанавливаем свой титл
	this.title = function() {
		var User = this.data['user'];
		var Battle = this.data['battle'];
		var HP = User['hp'];
		var BId = Battle ? Battle['id'] : false;
		var BDmg = Battle ? Battle['damage'] : 0;
		if(HP && HP[1] > 0 ) {
			HP[2] = HP[2] > 100 ? 100 : +HP[2];
			var title = User['login']+"|"+HP[2]+"%";
			if(BId) title += "|B";
			top.window.document.title = title;
			if(!BId) {
				if(!config.get('settings.hpalert') && HP[2] >= 100) {
					this.message('уровень жизни достиг 100%!','Восстановление');
					config.set('settings.hpalert', true);
					this.sound('heal');
				} else if(HP[2] < 100) {
					config.set('settings.hpalert', false);
				}
			}
		} else {
			top.window.document.title = User['login'];
		}
	}

	this.message = function(text,header,color) {
		header = header ? header : 'Сообщение';
		var color = header == 'Ошибка' ? 'red' : (color?color:'#A51818');
		var chat = top.frames[3];
		var h = new Date().getHours(), h = h < 10 ? '0'+h : h;
		var i = new Date().getMinutes(), i = i < 10 ? '0'+i : i;
		try {
            if(chat && chat.document) {
                $("#mes", chat.document).append("<font style='font-style:italic;color: "+color+";'><b>"+h+":"+i+"&nbsp"+header+"</b>: "+text+"</font><br/>");
                chat.scrollBy(0, 65000);
            }
		} catch (e) {}
	};

	this.sound = function(name) {
        if(!config.get('settings.base.sounds.'+name)) return false;
		if(this.Sounds[name]) {
			var vol = config.get('settings.base.sounds.volume') / 100;
			this.Sounds[name].volume = vol;
			this.Sounds[name].play();
			var This = this, i = 1;
			if(name == 'trap') {
				var repeat = setInterval(function() {
					This.Sounds[name].pause();
					This.Sounds[name].currentTime = 0;
					This.Sounds[name].play();
					i++;
					if(i > 3) clearInterval(repeat);
				}, 2000);
			}
		}
	}

    /*chtype= [1-общий][8-торговый]*/
	this.chatsend = function(text, channel) {
		channel = channel > -1 ? channel : 8;
		var frame = document.getElementsByTagName("frame")[0];
		frame.innerHTML = '<form action="http://chat.oldbk.com/ch.php" target="newnull" method="GET">'+
		'<input type="hidden" name="chtype" value="'+channel+'"><input type="hidden" name="om"><input type="hidden" name="sys">'+
		'<input type="text" name="text" value="'+text+'"></form>';
		var inc = document.createElement("script");
		inc.setAttribute("type", "text/javascript");
		inc.innerHTML = "document.forms[0].submit();top.NextRefreshChat();";
		frame.appendChild(inc);
	}

	this.userregexp = function(data) {
    	var user = {'uclass': 'tank', 'utype': 'ac', 'bid': 0, 'hp': [0,0,0], 'loaded': true, 'rist': 0};

		var regex = /([0-9]?\.?[0-9]+)\.gif">(?:<img title="([^"]+)"[^>]+>)?<B>([^<]+)<\/B>\s?\[\s?(?:<font[^>]*><b>)?([0-9]+).*?\]\s?<a href="?inf.php\?([0-9]+)/i; //"
		var res = regex.exec(data);
		if (res && res.length > 1) {
			user.align = res[1], user.login = res[3], user.clan = res[2], user.level = +res[4], user.id = +res[5], user.inv = 0;
		} else return false;
		regex = "\"ShowThing\\(\\s*this\\s*,\\s*[0-9]+\\s*,\\s*[0-9]+\\s*,\\s*(.+?)\\)\"";
		var subregex = "(?:<b>|&lt;b&gt;)\\s*([^\\(\\[<&]+).*?(?:<\\/b>|&lt;\\/b&gt;)\\s*(?:<br>|&lt;br&gt;).*?([0-9]+)\\/([0-9]+)";
		var isme = (user.id == this.uid || user.login == this.data['user']['login']) ? true : false;
		var classes = {'crit':0,'tank':0,'dodge':0,'anticrit':0,'antidodge':0};
		var repairs = [];

		var info = data.match(/<code>(.+?)<\/code>/i);
        user.info = info ? info[1] : '?';

        var online = data.indexOf(">Персонаж сейчас находится в клубе") > -1 ? true : false;
        user.online = online;

		if(isme) {
			config.set('cooldowns.needrepair', false);
			config.set('cooldowns.injure', false);
		}

        var rnum = +this.data['settings']['base']['repairalert'];

        var items = data.match(new RegExp(regex,'ig'));
		for(var i in items) {
			var rings = items[i].match(new RegExp(subregex,'ig'));
			if(!rings) continue;
			for(var r in rings) {
				var ring = rings[r].match(new RegExp(subregex,'i'));
				if(!ring) continue;
				var rname = ring[0].trim().toLowerCase();
				if(isme) {
					if(+ring[3] > 5 && +ring[2] < +ring[3]) {
						if(+ring[3] - +ring[2] <= rnum) {
							repairs.push(rname+'['+ring[2]+'/'+ring[3]+']');
						}
						//console.debug(rname+'['+ring[2]+'/'+ring[3]+']');
						if(+ring[3] - +ring[2] <= 2) {
							config.set('cooldowns.needrepair', true);
						}
					}
				}
				var rdata = this.rings[rname];
				if(rdata) {
					classes[rdata[1]]++;
					classes[rdata[2]]++;
				}
			}
		}
		if(repairs.length > 0) {
			this.message('Предметы '+repairs.join(', ')+' требуют ремонта','Ремонт', '#FF8000');
		}
        if(classes['antidodge'] >= classes['anticrit']) user.utype = 'ad';

		regex = /Сила: ([0-9-]+)<br>\n?Ловкость: ([0-9-]+)<br>\n?Интуиция: ([0-9-]+)<br>\n?Выносливость: ([0-9-]+)<br>/i;
		res = regex.exec(data);
		if(res && res.length > 1) {
			var tmpS = {'str': parseInt(res[1], 10), 'dex': parseInt(res[2], 10), 'int': parseInt(res[3], 10), 'vit': parseInt(res[4], 10)};
			if(tmpS.str < 3 || tmpS.dex < 3 || tmpS.int < 3) {
				config.set('cooldowns.injure', true);
			}
			if(tmpS.dex >= 45 && tmpS.dex >= tmpS.int) {
				user.uclass = 'dodge';
			} else if(tmpS.int >= 45 && tmpS.int >= tmpS.dex) {
				user.uclass = 'crit';
			}
			if(classes['tank'] > 0) {
				user.uclass = 'tank';
			} else if(classes['crit'] > 0) {
				user.uclass = 'crit';
			} else if(classes['dodge'] > 0) {
				user.uclass = 'dodge';
			}
			//console.debug(classes);
		} else {
			user.rist = 1;
		}

		regex = /<span[^>]+>([0-9]+)\/([0-9]+)<\/span>/i;
		res = regex.exec(data);
		if (res && res.length > 1) {
			user.hp	= [res[1],res[2],Math.ceil(res[1]/(res[2]/100))];
		}
		if(isme) {
			res = data.match(/(\d+)<\/a>\s?\((\d+)\)/i);
			if(res&&res.length>0) {
				user.exp = (+res[2])-(+res[1]);
			}
			res = data.match(/logs\.php\?log=([0-9]+)/i);
			if(res&&res.length>0) {
				user.bid = Math.ceil(res[1]);
			}
			res = data.match(/i\/magic\/(hidden).gif/i);
			if(res&&res.length>0) {
				user.inv = 1;
			}
			if(data.indexOf('>У персонажа средняя травма') > -1 || data.indexOf('>У персонажа тяжелая травма') > -1) {
				config.set('cooldowns.injure', true);
			}
		}
		return user;
	}

	//парсим игроков
	this.user = function(id, callback, args, num) {
		var This = this, num = num > 0 ? num : 0;
		var url = +id > 0 ? id : "login="+id;
		this.broadcast("/inf.php?"+url+"&stupidredirects="+Math.random(), function(data) {
			if(data == 'AntiDDOS...refresh page' || !data) {
				if(++num < 6) {
					config.setTimeout(function() {
						This.user(id, callback, args, num);
					}, 500);
				}
			} else {
                var user = This.userregexp(data, true);
				callback(user, args);
			}
		});
	}

	this.search = function(expr,html) {
		if(typeof(html) != 'string') return [];
		var reg = new RegExp(expr,'i');
		var res = html.match(reg);
		if(res&&res.length>0) {
			for(var i in res) {
				res[i] = +res[i] > 0 ? +res[i] : res[i];
			}
			return res.length == 2 ? res[1] : res.slice(1, res.length);
		}
	    return [];
	}

	this.searchAll = function(expr,html) {
		if(typeof(html) != 'string') return [];
		var reg = new RegExp(expr,'ig');
		var res = html.match(reg), R = [];
		if(res&&res.length>0) {
			for(var src in res) {
				var data = res[src];
				var result = this.search(expr, data);
				R.push( result );
			}
		}
	    return R;
	}

	this.searchTime = function(html) {
		if(typeof(html) != 'string') return [];
		var reg = new RegExp("([0-9]+) ч. ([0-9]+) мин.",'i');
		var res = html.match(reg), R = [0, 0, 0];
		if(res&&res.length>0) {
            R[0] = preZero(+res[1]), R[1] = preZero(+res[2]);
		} else {
			res = html.match(new RegExp("([0-9]+) мин.",'i'));
			if(res&&res.length>0) {
				R[1] = preZero(+res[1]);
			} else {
				res = html.match(new RegExp("([0-9]+) ч.",'i'));
				if(res&&res.length>0) {
					R[0] = preZero(+res[1]);
				}
			}
		}
	    return R;
	}

	this.parseSets = function(html) {
        console.debug('parse sets');
		var Tabs = this.searchAll('<div id="mestab([0-9]+)"[^>]*>(.+?)<\\/script>', html);
		var ListOfSets = [];
		for(var i in Tabs) {
			//<a href='main.php?edit=1&complect=7997483'>plugin-lord</a>
			var Sets = this.searchAll("edit=[0-9]+&complect=([0-9]+)'?\"?>\s?<[^>]+>([^<]+)", Tabs[i][1]);
			for(var s in Sets) {
				ListOfSets.push([Sets[s][0], Sets[s][1], Tabs[i][0]]);
			}
		}
		//console.debug(ListOfSets);
        config.set('base.sets', ListOfSets);
		html = null, ListOfSets = null;
	}

	this.saveSet = function(name, callback, nomess) {
        var This = this, tab = 1;
        if(name == 'plugin-laba' || name == 'laba-tmp') tab = 2;
        if(name == 'plugin-haot' || name == 'plugin-lord' || name == 'plugin-rist' || name == 'repair-tmp') tab = 1;
        if(name == 'redhp-tmp') tab = 5;
        this.broadcast('main.php?edit=1', function(html) {
			if(html.indexOf("Вы перезаписали комплект") > -1) {
				if(!nomess) This.message('Комплект '+name+' перезаписан', "Одевалка");
				if(callback) callback(true);
			} else if(html.indexOf("Вы запомнили комплект") > -1) {
				if(!nomess) This.message('Комплект '+name+' сохранён', "Одевалка");
				if(callback) callback(true);
			} else {
				if(!nomess) This.message('Комплект '+name+' НЕ сохранён', "Одевалка");
				if(callback) callback(false);
			}
			This.parseSets(html);
		}, 'currktab='+tab+'&sd4=6&savecomplect='+name);
	}

	this.undressAll = function(callback, nomess) {
		var This = this;
		this.broadcast('main.php?edit=1&undress=all', function(html) {
			if(html.indexOf("&nbsp;Обмундирование") > -1) {
				if(!nomess) This.message('Шмот снят', "Одевалка");
				This.parseSets(html);
				if(callback) callback(true);
			} else {
				if(callback) callback(false);
				This.message('Шмот НЕ снят!!!', "Одевалка");
			}

		});
	}

	this.dressSet = function(id, callback, nomess) {
		if(!nomess) this.message('Одеваемся...', "Одевалка");
		var name = id, did = 0, This = this;
		var Sets = config.get('base.sets');
		for(var set in Sets) {
			var setname = ''+Sets[set][1]+'';
			var setid = +Sets[set][0];
			var chkid = ''+id+'';
			if(setname.toLowerCase() == chkid.toLowerCase() || setid == id) {
				did = setid;
				name = setname;
				break;
			}
		}
		if(+did > 0) {
			this.broadcast('main.php?edit=1&complect='+did, function(html) {
				html = typeof(html) == 'string' ? html : "&nbsp;";
				if(html.indexOf("&nbsp;Обмундирование") > -1 && html.indexOf("Нельзя одевать комплект в этой комнате") < 0) {
					if(!nomess) This.message('Комплект '+name+'('+did+') одет', "Одевалка");
					This.parseSets(html);
					if(callback) callback(true);
				} else {
					if(!nomess) This.message('Комплект '+name+' НЕ одет. Возможно вы в бою.', "Одевалка");
					if(callback) callback(false);
				}
			});
		} else {
			if(!nomess) This.message("Внимание!! Не могу найти комплект с именем "+name+"("+did+") :( ", "Одевалка");
			if(callback) callback(false);
		}
	}

	this.restoreInv = function() {
		var r = {'0':1,'1':1,'2':1,'3':1};
		for(var i in r) {
			r[i] = this.get('settings.base.pack.'+i) ? 1 : 0;
		}
		var bm = this.get('settings.base.bookmark', 0);
		this.broadcast('/main.php?edit=1&razdel='+bm, 0, 'ssave=1&rzd0='+r[0]+'&rzd1='+r[1]+'&rzd2='+r[2]+'&rzd3='+r[3]);
	}

	this.parseInv = function(razdel, callback) {
    	var This = this;
    	this.broadcast('/main.php?edit=1&razdel='+razdel+'&all=1&sub=0', function(html) {
			var List = {
				'counts':{}, 'inserts': [], 'uditems': 0, 'udmagic': 0, 'charges': 0,  'loaded': false,
				'medkits': {'Антидот': 'dot', 'Большой Антидот': 'dot2', 'Зелье Старого Мага': 'potion'}
			};
			This.restoreInv();
			if(html && html.indexOf('Квестовое') > -1) {
				List['loaded'] = true;

	            var Charges = This.searchAll('drop=([0-9]+)"?\'?>\\s*<img[^>]+vstr1.gif', html);
	            var Slots = This.searchAll("'Пустой слот ([^']+)'", html), magicFreeSlots = 0, itemsFreeSlots = 0;
				for(var slot in Slots) {
					if(Slots[slot] == 'магия') { List['udmagic']++; } else { List['uditems']++; }
				}
                List['charges'] = Charges.length;

				var data = This.search('<table[^>]+>\\s*\\[\\s*<a[^>]+>\\s*страницы\\s*<\\/a>\\s*\\](.+?)<\\/table>\\s*<\\/td>\\s*<\\/form>', html);
				var Items = This.searchAll("<tr[^>]+>\\s*<td[^>]+>.+?pocket=(?:1|2)&item=([0-9]+).+?(?:<\\/td>)?\\s*<td[^>]+>\\s*<a[^>]+>([^<]+)<\\/a>.+?<b>Цена: ([0-9\\.]+) (екр|кр|реп).*?<\\/b>\\s*.+?<BR>\\s*Долговечность: ([0-9]+)\\/([0-9]+)(.+?)<\\/td>\\s*<\\/tr>", data);
				//[id, name, price, ptype, min, max, chance, html[d.m.y]], count?!
				for(var i in Items) {
					var item = Items[i];
					if(typeof(item) != 'object' || !item[1]) continue;

					var dmy = 99999999, id = item[0], price = (+item[2] * (item[3]=='кр'?1:1.5));
					var min = +item[4], max = +item[5], elapsed = max - min, name = item[1];
					if(name == 'Антидот' && max == 10) {
						name = 'Большой Антидот';
					}
	                var other = item[6];
					var edate = This.search("\\(до ([0-9]+)\\.([0-9]+)\\.([0-9]+)", other);
					if(edate && edate.length > 0) {
						//console.debug(edate);
						dmy = edate[2]+''+(edate[1]>9?edate[1]:'0'+edate[1])+''+(edate[0]>9?edate[0]:'0'+edate[0]);
					}
					if(price == 15 && max == 1) {
						dmy = 1;
					}
					//!!!
	                var InsItem = [id, price, min, max, elapsed, dmy];
					if(!List[name]) {
						List[name] = [InsItem];
						List['counts'][name] = elapsed;
					} else {
						List[name].push(InsItem);
						List['counts'][name] += elapsed;
					}
					if(other && other.indexOf('Встроено заклятие') > -1) {
						var inserts = This.search("<img[^>]+title=\"?'?([^\"']+)[^>]+>\\s*([0-9]+)\\/([0-9]+)", other);
						if(inserts && inserts.length > 0) {
							var insert = [id, inserts[0], inserts[1]];
							List['inserts'].push(insert);
						}
					}
					if(other && other.indexOf('Восстановление жизни') > -1) {
						List['medkits'][name] = 'but';
					}
				}
				if(razdel == 2) {
					for(var e in List['medkits']) {
						var eat = List['medkits'][e];
						This.Counts[eat] = 0;
						This.Abilities[eat] = [];
					}
					for(var e in List['medkits']) {
						var eat = List['medkits'][e];
						if(!List[e]) continue;
						This.Abilities[eat] = This.Abilities[eat].concat(List[e]);
					    This.Counts[eat] += +List['counts'][e];
					}
					This.reSortAbil('but');
					This.reSortAbil('dot');
					$('#buter', top.frames[1].document).html(This.Counts['but']);
					$('#potion', top.frames[1].document).html(This.Counts['potion']);
	            }
	            if(razdel == 1) {
	            	if(List['Лечение травм'] && List['Лечение травм'].length > 0) {
	            		var x = 2, s2 = 0;
	            		This.Abilities['icure'].splice(2);
	            		for(var e in List['Лечение травм']) {
							var icure = List['Лечение травм'][e];
							This.Abilities['icure'][x] = [icure[0], 666, icure[2], icure[3], icure[4], icure[5], '/main.php?edit=1&use='+icure[0]];
							x++;
						}
			            for(var c in This.Abilities['icure']) {
			            	s2 += +This.Abilities['icure'][c][4];
			            }
						This.Counts['icure'] = s2;
			            $('#icure', top.frames[1].document).html(s2);
		            }
	            }
	            //комплекты
	            This.parseSets(html);

	            if(callback) callback(List);
	            List = null, html = null;
			} else {
				console.error('bad parse inventory!!!');
				if(callback) callback(List);
				List = null;
			}
		}, 'ssave=1&rzd0=0&rzd1=0&rzd2=0&rzd3=0');
    }

    this.reSortAbil = function(iname) {
    	iname = iname ? iname : 'but';
    	if(this.Abilities[iname].length < 1) return;
    	var newList = this.Abilities[iname];
    	//TODO ставить лабовские вверх списка
		newList.sort(function(a, b){
			if(+a[5] < +b[5] || +a[3] == 1) {
				return -1;
			}
			if(+a[5] > +b[5] && +a[3] > 1) {
				return 1;
			}
			return 0;
		});
		this.Abilities[iname] = newList;
    }

	this.use = function(p, callback, transfer) {
		var id = p['id'] ? p['id']:0;
		var url = p['url']?p['url']:'/main.php?edit=1&use='+id;
		var login = p['login']?convert(p['login']):convert(this.get('user.login'));
		var This = this;
		this.broadcast(url, function(html) {
			callback(html, transfer);
			html = null, transfer = null;
		}, 'sd4='+(p['sd4']?p['sd4']:6)+'&use='+id+'&target='+login+'&abit='+p['abit']);
	}

    this.useBut = function(iname, callback, uselogin) {
    	iname = iname ? iname : 'but';
    	uselogin = uselogin ? uselogin : config.get('user.login');
    	var sys = 'Бутерброды';
    	if(iname == 'dot' || iname == 'dot2') {
    		sys = 'Противоядие';
    	} else if(iname == 'sump') {
			sys = 'Колодец рассола';
    	} else if(iname == 'icure') {
			sys = 'Лечение травм';
    	} else if(iname == 'potion') {
			sys = 'Зелье Мага';
    	} else if(iname == 'buff') {
			sys = 'Бафф магией';
    	} else if(iname == 'rage') {
			sys = 'Неукротимая ярость';
    	} else if(iname == 'shield') {
			sys = 'Защита от магии';
    	} else if(iname == 'skin') {
			sys = 'Каменная кожа';
    	}

        if(this.InUse == iname) {
    		this.message('Уже используется... ждите!', sys);
    		if(callback) callback(false);
    		return false;
        }
        console.debug('use '+iname);
        if(!this.Counts[iname] || this.Counts[iname] < 1) {
    		this.message('Нет в наличии... пробую обновить кол-во...', sys);
			this.parseInv(2);
			if(iname == 'buff' || iname == 'skin' || iname == 'shield' || iname == 'rage') {
				this.parseBuff();
			} else if(iname == 'icure') {
				this.parseInv(1);
				config.set('lastcall.abil', 0);
			} else {
				this.parseInv(2);
				config.set('lastcall.abil', 0);
			}
    		this.InUse = false;
    		if(callback) callback(false);
    		return false;
    	}
        if((iname == 'but' || iname == 'sump') && +this.data['user']['hp'][0] >= +this.data['user']['hp'][1]) {
    		this.message('Ваши HP и так полные... подождите немного...', sys);
    		this.InUse = false;
    		if(callback) callback(false);
    		return false;
        }
        if(this.get('battle.id') > 0) {
			this.message('Вы в бою... подождите немного...', sys);
			if(callback) callback(false);
			return false;
		}
        this.InUse = iname;

        //[id, price, used, max, count, date, url]
        var useit = [];

        for(var e in this.Abilities[iname]) {
        	if(!this.Abilities[iname][e] || this.Abilities[iname][e][4] < 1) {
                continue;
        	}
			useit = this.Abilities[iname][e];
			if(+useit[4] > 0) break;
        }

  		if(+useit[4] < 1) {
	   		this.InUse = false;
	   		if(callback) callback(false);
			return false;
  		}

		var This = this, url = {'id':useit[0]};
		if(iname == 'sump') {
			url = {'id': useit[0], 'sd4': this.uid, 'login': 1, 'url': useit[6]};
		} else if(iname == 'icure') {
			url = {'id': useit[0], 'sd4': this.uid, 'login': uselogin, 'url': useit[6]};
		} else if(iname == 'buff' || iname == 'skin' || iname == 'shield' || iname == 'rage') {
			url = {'id': useit[0], 'login': uselogin, 'sd4': '', 'url': useit[6]};
		}

		this.use(url, function(data, params) {
			This.InUse = false;
			var used = params[0], iname = params[1];
			var hp = This.search('HP1><span[^>]+>([0-9]+)\/([0-9]+)<\/span>', data);
			if(data.indexOf('Вы и так полны сил') > -1 || data.indexOf('здоровье из колодца') > -1) {
				var uhp = This.get('user.hp.1');
				hp = [uhp,uhp];
			}
			if(hp && hp.length > 1) {
				hp = [hp[0],hp[1],Math.ceil(hp[0]/(hp[1]/100))];
				This.set('user.hp', hp);
				This.title();
			}

			console.debug(iname+' used '+data.length);

			if(data && (
				data.indexOf('Вы подкрепились') > -1 ||
				data.indexOf('выпили антидот') > -1 ||
				data.indexOf('здоровье из колодца') > -1 ||
				data.indexOf('прошло удачно') > -1 ||
				data.indexOf('<b>"Зелье Старого Мага"') > -1 ||
				data.indexOf('Использовано успешно!') > -1 ||
				data.indexOf('исцелен!') > -1
			)) {
				for(var i in This.Abilities[iname]) {
					var item = This.Abilities[iname][i];
					if(+item[0] == +used[0]) {
			  			if(+item[4] > 1) {
							This.Abilities[iname][i][2]++;
							This.Abilities[iname][i][4]--;
			   			} else {
							This.Abilities[iname].splice(i, 1);
			   			}
						This.Counts[iname]--;
						break;
			   		}
			   	}
			   	if(iname == 'but' || iname == 'sump') {
					$('#'+iname+'er', top.frames[1].document).html(This.Counts[iname]);
				} else if(iname == 'icure') {
					config.set('cooldowns.injure', false);
				} else if(iname == 'potion' || iname == 'buff') {
					$('#'+iname, top.frames[1].document).html(This.Counts[iname]);
				}
				This.message('+Использован '+iname+'#'+used.join(','), sys);
				if(callback) callback(true);
			} else if(hp[2] > 99 && (iname == 'but' || iname == 'sump')) {
				This.message('-Использован '+iname+'#'+used.join(','), sys);
				if(callback) callback(true);
			} else {
				var errdata = config.searchAll("<font color=red>(.+?)</font>", data), errors = '';
				for(var i in errdata) {
					if(errdata[i].indexOf('Данную вещь может надеть только') > -1 || errdata[i].indexOf('errkom') > -1) continue;
					errors += errdata[i]+'; ';
				}
				for(var i in This.Abilities[iname]) {
					var item = This.Abilities[iname][i];
					if(+item[0] == +used[0]) {
			   			if(+item[4] > 1) {
							This.Abilities[iname][i][2]++;
							This.Abilities[iname][i][4]--;
			   			} else {
							This.Abilities[iname].splice(i, 1);
			   			}
						This.Counts[iname]--;
						break;
			   		}
			   	}
				This.message('Ошибка: '+iname+'#'+used.join(',')+' | '+errors, sys);
				if(callback) callback(false);
			}
		}, [useit, iname]);
		return true;
	}

	this.parseBuff = function() {
		var This = this;
		var magic = this.data['settings']['base']['buffname'] ? this.data['settings']['base']['buffname'] : 'Гнев Ареса';
		var mname = this.magic2[magic] ? this.magic2[magic] : 'ares';
		var scrolls = ['Малый свиток', 'Средний свиток', 'Большой свиток', 'Совершенный свиток'];
		//Средний свиток «Гнев Ареса»
		var names = {'buff': '«'+magic+'»', 'skin': '«Каменная кожа»', 'shield': '«Защита от магии»', 'rage': '«Неукротимая ярость»'};
		this.parseInv(1, function(List) {
			if(!List || !List['loaded']) return;
			//console.debug(List);
			This.Abilities['buff'].splice(1);
			This.Abilities['skin'] = [];
			This.Abilities['shield'] = [];
			This.Abilities['rage'] = [];
			This.Counts['skin'] = 0;
			This.Counts['shield'] = 0;
			This.Counts['rage'] = 0;
			var added = 0, domagic = magic+' III';
			//console.debug('parse magic '+domagic);
			if(List[domagic]) {
				console.debug(List[domagic]);
				for(var b in List[domagic]) {
					This.Abilities['buff'].push(List[domagic][b]);
				}
				added = 1;
			}

			for(var i in scrolls) {
				for(var n in names) {
					var buffname = scrolls[i]+' '+names[n];
					//console.debug('Find: '+buffname+'');
                    //console.debug(List[buffname]);
				    if(List[buffname]) {
						for(var b in List[buffname]) {
							if(n == 0 && b < 1) continue;
							This.Abilities[n].push(List[buffname][b]);
						}
						if(n == 0 && added < 1) added = i;
						continue;
					}
				}
			}
			Object.keys(names).forEach(function (name) {
                var s2 = 0;
                for(var c in This.Abilities[name]) {
                    s2 += +This.Abilities[name][c][4];
                }
                console.debug(name, This.Abilities[name]);
                This.Counts[name] = s2;
			});
            $('#buff', top.frames[1].document).css('background-image', 'url(http://i.oldbk.com/i/sh/scroll_wrath_'+mname+added+'_2.gif)').html(This.Counts['buff']);
		});
	}

	this.doska = doska;
	this.timers = function(callback) {
		var level = +this.data['user']['level'] > 6 ? +this.data['user']['level'] : 6;
        //ИХ
        if(config.get('settings.base.nshowinfo.6') && level > 5) {
        	var hlevel = level > 13 ? 13 : level;
	    	$('#haos').html("ИХ ("+hlevel+") <a href='/inf.php?login=Исчадие Хаоса ("+hlevel+")' target=_blank><img src='http://i.oldbk.com/i/inf.gif'></a> [<span id='htimer'>??:??</span>]");
	        var htime = +this.get('cooldowns.haos', 0) - (+new Date()/1000);
			if(htime > 0) {
				$('#haos').removeClass();
				var h = Math.floor(htime/3600);
				var m = Math.floor((htime-(h*3600))/60);
				$('#htimer').html(preZero(h)+':'+preZero(m));
			} else {
				$('#haos').addClass('online');
				$('#htimer').html('online');
				if(this.get('settings.base.chaosalert')) {
					this.message('На бой кровавый, святой и правый - марш, марш вперед, рабочий народ! Георгий Жуков ;)', 'Исчадие Хаоса', '#FF8000');
				}
			}
		} else {
        	$('#haos').css('display','none');
        }

        var This = this;
        this.broadcast("/main.php?edit=1&effects="+Math.random(), function(data) {
			if(!data || data.indexOf("<span>достижения</span>") < 0) {
				if(callback) callback(false);
				return;
			}

			var effects = This.searchAll("<td class=\\\"row-left\\\">(.+?)<\\/td>.*?<td class=\\\"row-center\\\">(.+?)<\\/td>.*?<td class=\\\"row-right\\\">(.+?)<\\/td>", data);
			var L = This.get('settings.base.nshowinfo.4') ? "<div style='color: #008080;' title='Таймаут на посещение Лабиринта Хаоса' name='iblock'>Лабиринт [00:00]</div> " : "";
			var O = This.get('settings.base.nshowinfo.1') ? "<div style='color: #008080;' title='Таймаут на посещение Загорода' name='iblock'>Загород [00:00]</div> " : "";
			var R = This.get('settings.base.nshowinfo.2') ? "<div style='color: #008080;' title='Таймаут на посещение Руин' name='iblock'>Руины [00:00]</div> " : "";
			var W = "", Q = "", S = "", res = false;
			This.set('cooldowns.laba', false);
			This.set('cooldowns.outcity', false);
			This.set('cooldowns.ruines', false);

			for(var i in questsid) {
				This.set('cooldowns.needquest.'+i, true);
			}

            var buffs = new Array();
            var regexps = {
				"buff": 	"buffauto",
				"potion": 	"buffpotion",
				"shield": 	"buffshield",
				"skin": 	"buffskin",
				"rage": 	"buffrage"
			};
			for(var r in regexps) {
				This.set('cooldowns.'+r, 0);
			}

			for(var e in effects) {
				if(effects[e][0].indexOf("separate") > -1) continue;
				var t0 = effects[e][0], t1 = effects[e][1], t2 = effects[e][2];

				if(t0.indexOf("scroll_wrath") > -1 || t0.indexOf("wrath_") > -1 && t0.indexOf('_status.gif') === -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.buff', ((+time[0] * 3600) + (+time[1] * 60) + 60));
					buffs.push("<img src='"+SERVER+"i/sh/buff.png' title='Обкаст магией'>["+time[0]+":"+time[1]+"]");
					continue;
				}
                if(t0.indexOf("Зелье Старого Мага") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.potion', ((+time[0] * 3600) + (+time[1] * 60) + 60));
					buffs.push("<img src='"+SERVER+"i/sh/potion.png' title='Зелье Старого Мага'>["+time[0]+":"+time[1]+"]");
					continue;
				}
				if(t0.indexOf("Защита от магии стихий") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.shield', ((+time[0] * 3600) + (+time[1] * 60) + 60));
					var bmin = (+time[0] * 60) + +time[1] + 1;
					buffs.push("<img src='"+SERVER+"i/sh/shield.png' title='Защита от магии стихий'>["+time[0]+":"+time[1]+"]");
					continue;
				}
				if(t0.indexOf("Каменная кожа") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.skin', ((+time[0] * 3600) + (+time[1] * 60) + 60));
					var bmin = (+time[0] * 60) + +time[1] + 1;
					buffs.push("<img src='"+SERVER+"i/sh/skin.png' title='Каменная жопа!'>["+time[0]+":"+time[1]+"]");
					continue;
				}
				if(t0.indexOf("Неукротимая ярость") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.rage', ((+time[0] * 3600) + (+time[1] * 60) + 60));
					buffs.push("<img src='"+SERVER+"i/sh/rage.png' title='Неукротимая ярость'>["+time[0]+":"+time[1]+"]");
					continue;
				}

				if(t1.indexOf("Лабиринт Хаоса") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.laba', ((+time[0] * 3600) + (+time[1] * 60)));
					if(This.get('settings.base.nshowinfo.4')) {
						L = "<div style='color: #FF0000;' title='Лабиринт Хаоса' name='iblock'>Лабиринт ["+time[0]+":"+time[1]+"]</div>";
					}
					continue;
				}
				if(t1.indexOf("Загород") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.outcity', ((+time[0] * 3600) + (+time[1] * 60)));
					if(This.get('settings.base.nshowinfo.1')) {
						O = "<div style='color: #FF0000;' title='Загород' name='iblock'>Загород ["+time[0]+":"+time[1]+"]</div> ";
					}
					continue;
				}
				if(t1.indexOf("Руин") > -1) {
					var time = This.searchTime(t2);
					This.set('cooldowns.ruines', ((+time[0] * 3600) + (+time[1] * 60)));
					if(This.get('settings.base.nshowinfo.2')) {
						R = "<div style='color: #FF0000;' title='Руины' name='iblock'>Руины ["+time[0]+":"+time[1]+"]</div> ";
					}
					continue;
				}
				if(t0.indexOf("штурм") > -1 || t0.indexOf("дух") > -1) {
					if(res = t1.match(/<b>([0-9]+)%<\/b>.*?<b>([^<]+)<\/b>/)) {
						var percent = res[1];
						var prize = 'Награда: '+res[2];
						W = "<div title='"+prize+"' name='iblock'>Дух: "+percent+"%</div> ";
					}
					continue;
				}
				if(t1.indexOf("получаемой репутации") > -1) {
					if(config.get('settings.base.nshowinfo.9')) {
                   		var time = This.searchTime(t2);
                    	S += "<div title='Свиток на плюс к репутации' name='iblock'>Репа+ ["+time[0]+":"+time[1]+"]</div> ";
                    }
					continue;
				}
				if(t1.indexOf("рунного опыта") > -1) {
					if(config.get('settings.base.nshowinfo.9')) {
                   		var time = This.searchTime(t2);
                    	S += "<div title='Свиток на плюс к рунному опыту' name='iblock'>Руны+ ["+time[0]+":"+time[1]+"]</div> ";
                    }
					continue;
				}
				if(t1.indexOf("получаемого опыта") > -1) {
					if(config.get('settings.base.nshowinfo.9')) {
                   		var time = This.searchTime(t2);
                    	S += "<div title='Свиток на плюс к опыту' name='iblock'>Опыт+ ["+time[0]+":"+time[1]+"]</div> ";
                    }
					continue;
				}
				if(t0.indexOf("Бесстрашный Воин") > -1) {
                   	if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
						Q += "<span class='velik' title='Бесстрашный Воин'>"+res[1]+"/"+res[2]+"</span>";
						This.set('cooldowns.needquest.0', false);
					}
					continue;
				}
				if(t0.indexOf("Всегда победа") > -1) {
                   	if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
						Q += "<span class='haots' title='Всегда победа'>"+res[1]+"/"+res[2]+"</span>";
						This.set('cooldowns.needquest.4', false);
					}
					continue;
				}
				if(t0.indexOf("Бои на букетах") > -1) {
                   	if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
						Q += "<span class='flowers' title='Бои на букетах'>"+res[1]+"/"+res[2]+"</span>";
						This.set('cooldowns.needquest.5', false);
					}
					continue;
				}
				if(t0.indexOf("Неформат") > -1) {
                   	if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
						Q += "<span class='haots' title='Неформат'>"+res[1]+"/"+res[2]+"</span>";
						This.set('cooldowns.needquest.1', false);
					}
					continue;
				}
				if(t0.indexOf("Первичка") > -1) {
                   	if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
						Q += "<span class='haots' title='Первичка'>"+res[1]+"/"+res[2]+"</span>";
						This.set('cooldowns.needquest.2', false);
					}
					continue;
				}
				if(t0.indexOf("Испытание Кровью") > -1) {
                   	if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
						Q += "<span class='blood' title='Испытание Кровью'>"+res[1]+"/"+res[2]+"</span>";
						This.set('cooldowns.needquest.3', false);
					}
					continue;
				}
				if (t0.indexOf('Ёлочное безумие') > -1) {
                    if(res = t1.match(/<b>\(([0-9]+)\/([0-9]+)\)<\/b>/)) {
                        Q += "<span class='haots' title='Ёлочное безумие'>"+res[1]+"/"+res[2]+"</span>";
                        This.set('cooldowns.needquest.elka2017', false);
                    }
                    continue;
				} else if (This.get('settings.autobattle.quest.elka2017', true)) {
                    This.set('cooldowns.needquest.elka2017', true);
                    continue;
				}
			}
			if(!This.get('cooldowns.laba')) This.set('cooldowns.laba', 0);
			if(!This.get('cooldowns.outcity')) This.set('cooldowns.outcity', 0);
			if(!This.get('cooldowns.ruines')) This.set('cooldowns.ruines', 0);

			if(This.get('settings.base.buffauto')) {
	            for(var r in regexps) {
	            	var timetoout = This.get('cooldowns.'+r, 0);
	            	var needforuse = This.get('settings.base.'+regexps[r]);
					if(timetoout < 1 && needforuse) {
						This.useBut(r);
					}
				}
			}
			buffs = buffs.length > 0 ? buffs.join(' | ') : 'Нет обкастов';
			$('#buff').html(buffs);

			//опыт
			var Exp = This.data['user']['exp'] ? This.data['user']['exp'] : '??';
			var E = "";
			if(Exp > 0 && This.get('settings.base.nshowinfo.0')) {
				Exp = ""+Exp+"";
				var show = Exp.replace(/(\d{1,3})(?=(?:\d\d\d)+(?:\D|$))/g,'$1 ');
				E = "<div title='Опыт до уровня/апа' name='iblock'>Опыт: -"+show+"</div>";
			}
			if(Q) {
				$('#quests').css('display', 'inline-block').html(Q);
			} else $('#quests').css('display', 'none').html('');
			$("#info").html(E+L+O+R+W+S).addClass('info');
			This = null, data = null;
			if(callback) callback(true);
		});
	}

	this.load = function() {
		var dh = $(document).height() - 64;
		$('#settings').css('height', (dh>1000?500:dh));
		$('#settings').find('input,select,textarea').each(function() {
			var ename = $(this).attr('name'), etype = $(this).attr('type');
			if(etype == 'button' || ename == 'import' || ename == 'export' || ename == 'lastlab') {
				if(ename == 'export') $(this).val(JSON.stringify(config.data));
				if(ename == 'lastlab') {
					var log = config.get('logs.lab', []), list = '';
					for(var l in log) {
                    	list += "["+log[l][0]+"] "+log[l][1]+"\n";
					}
					$(this).val(list);
				}
				return;
			}
			if(ename == 'PHPSESSID') {
				$(this).val(config.getCookie(ename));
			} else {
				var value = config.get('settings.'+ename, 'none');
                if(value == 'none') return;
				if(etype == 'range') $(this).next('i').html(value+'%');
				if(etype == 'checkbox') {
					$(this).prop('checked',(value!=''&& value?true:false));
				} else {
					$(this).val(value);
				}
			}
		});
	}

	this.launcher = launcher;
	this.checkRepair = function (callback) {
		callback = callback || function () {};
		var module = config.get('settings.launched', '');
		if (!module || !config.get('settings.'+module+'.autorepair', 0)) {
			return false;
		}

		if (!config.get('cooldowns.needrepair') || config.get('cooldowns.badrepair')) {
			return false;
		}
		getRoom(function (currentRoom) {
			GO('Ремонтная мастерская', function () {
				config.setTimeout(function () {
					GO(currentRoom, callback);
				}, 3000);
			});
		});

		return true;
	};
};

console.debug('settings... get');

function myinfo(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/inf.php?' + uid + '&short=1&rand=' + Math.random(), true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(null, xhr.responseText);
        } else {
            callback(new Error());
        }
    };
    xhr.send();
}

var url = SERVER + "settings.php?load=1&uid=" + uid + "&rand=" + Math.random();
var xhr = new XMLHttpRequest();
xhr["nr@context"] = null;
xhr.open("POST", url, true);
// xhr.withCredentials = true;
xhr.onreadystatechange = function() {
	if(this.readyState == 4) {
		if(this.status == 200) {
			var settings = this.responseText;
			if (settings.indexOf('blocked') > -1) {
                window.location.href = window.location.href;
                return;
            }
			console.debug('settings init! '+settings.length);
			if(settings.length < 100) {
				if(confirm('Ошибка получения данных с сервера. Обновить страницу?')) {
					window.location.href = window.location.href;
				}
				return;
			}
            settings = JSON.parse( settings );
	        var MESS = [
	        	'Используются локальные настройки. Дата: ',
	        	'Используются настройки с сервера. Дата: ',
	        	'Имеются только локальные настройки. Дата: ',
	        	'Имеются только настройки с сервера. Дата: ',
	        	'Имеются только настройки с сервера. Тип настроек: дефолтные.',
	        ];
	        var MNUM = -1, MDATE = -1;
			if(settings && settings.data && LocalSettings && LocalSettings.local && LocalSettings.local.data) {
				if(+LocalSettings.local.saved > +settings.saved) {
					LocalSettings.local.data =  LocalSettings.local.data;
					MDATE = +LocalSettings.local.saved;
					MNUM = 0;
				} else {
					LocalSettings.local.data = settings.data;
					MDATE = +settings.saved;
					MNUM = MDATE > 0 ? 1 : 4;
				}
				LocalSettings._save();
			} else if(LocalSettings && LocalSettings.local && LocalSettings.local.data) {
				MDATE = +LocalSettings.local.saved;
				MNUM = 2;
				LocalSettings._save();
			} else if(settings && settings.data) {
				LocalSettings.local.data = settings.data;
				MDATE = +settings.saved;
				MNUM = MDATE > 0 ? 3 : 4;
				LocalSettings._save();
			} else {
				alert('Неизвестная ошибка. Не могу получить доступ к серверу! Локальное хранилище настроек пусто! Попробуйте обновить страницу.');
				throw "brain fuuuuuuuu!";
			}
			if(!LocalSettings.local.logs) LocalSettings.local.logs = {};
			config = new Config(LocalSettings.local.data, LocalSettings.local.logs, settings.account);

			var Time = "";
			if(MDATE > 0) {
				Time = new Date();
				Time.setTime(MDATE * 1000);
				Time = preZero(Time.getDate())+'-'+preZero(Time.getMonth()+1)+'-'+Time.getFullYear()+' '+preZero(Time.getHours())+':'+preZero(Time.getMinutes());
	        }
			config.message(MESS[MNUM] + Time, "Синхронизация");
	        if(MNUM == 0 || MNUM == 2) {
	        	config.saveonserver();
	        }

		    if(config.get('settings.base.nshowinfo.10')) {
		    	$('#radio').html(Radio).css('background', '#E9E9E9');
		    }

			document.getElementsByTagName("frameset")[0].setAttribute("rows", "0,60,*,38");
			document.getElementsByTagName("frameset")[1].setAttribute("rows", config.get('settings.base.chatsize','75')+"%, *, 0");
			document.getElementsByTagName("frameset")[2].setAttribute("cols", "*,315");

            //тактическая панель
			var bot = $(top.frames['chat']).height() + 39;
			$('#tactics').css('bottom', bot);
			$('#tview').click(function() {
				var bot = $(top.frames['chat']).height() + 39;
				var wid = $(document).width() - 265;
				$('#tactics').css('bottom', bot);
				$('#tbody').css('width', wid);
				$('#tbody').toggle();
			});

			//автобафф
			if(config.get('settings.base.buffname') == '') {
				$('#autobuff').hide();
			} else {
				if(config.get('settings.base.buffauto')) {
					$('#autobuff').removeClass('def').addClass('run');
				}
				$('#autobuff').click(function() {
					if(config.get('settings.base.buffauto')) {
						$(this).removeClass('run').addClass('def');
						config.set('settings.base.buffauto', false);
					} else {
						$(this).removeClass('def').addClass('run');
						config.set('settings.base.buffauto', true);
					}
				});
			}

			//сброс хп
			document.getElementById('redhp').className = (config.get('settings.base.redhp')?'uses run':'uses def');
			if(config.get('settings.base.redhp')) {
				$('#redhp').removeClass('def').addClass('run');
			}
			$('#redhp').click(function() {
				if(config.get('settings.base.redhp')) {
					$(this).removeClass('run').addClass('def');
					config.set('settings.base.redhp', false);
				} else {
					$(this).html('Запуск...');
					config.message("Cброс начинается через ~10 сек после нажатия, и на вас должен быть одет комплект в который персонаж оденется ПОСЛЕ сброса HP!", "Сброс HP", "#FF0000");
					config.saveSet('redhp-tmp', function(ok) {
						$('#redhp').html('Сброс HP');
						if(ok){
							$('#redhp').removeClass('def').addClass('run');
							config.set('settings.base.redhp', true);
							config.set('lastcall.buff', 0);
						} else {
							alert('Не удалось создать комплект для переодевания. Возможно вы раздеты?');
						}
					});
				}
			});

			for(var sound in config.Sounds) {
				$('#sound'+sound).click(function() {
					var vol = config.get('settings.base.sounds.volume') / 100;
					if(vol < 0.1) {
						alert('Громкость звука 0%!');
						return;
					}
					for(var s in config.Sounds) {
						config.Sounds[s].pause();
					}
					config.Sounds[this.name].volume = vol;
					config.Sounds[this.name].currentTime = 0;
					config.Sounds[this.name].play(0);
				});
			}

			$('#importit').click(function() {
				$(this).attr('disabled', 'disabled').val('Сохранение... подождите');
				var newsettings = $('#import').val();
				var save = false;
				try {
					save = JSON.parse( newsettings );
				} catch(e) {}
				if(!save) {
					alert('Ошибка в настройках!');
					return;
				}
				LocalSettings.local.data = save;
				alert('Настройки обновлены. Обновляем страницу...');
				window.location.href = window.location.href;
			});
			$('#dropit').click(function() {
				$(this).attr('disabled', 'disabled').val('Сброс... подождите');
				config.saveonserver(function(defVals) {
					defVals = defVals ? JSON.parse( defVals ) : {};
					LocalSettings.local.data = defVals.data;
					alert('Настройки обновлены. Обновляем страницу...');
					window.location.href = window.location.href;
	                $('#dropit').attr('disabled', false).val('Сохранить настройки');
				}, true);
			});
			$('#saveit').click(function() {
				var This = this;
				$(This).attr('disabled', 'disabled').val('Сохранение... подождите');
				config.saveonserver(function(answer) {
					alert(answer);
	                $(This).attr('disabled', false).val('Сохранить настройки');
				});
			});

            var h = $(document).height() - 300;
	        $('#settings').find('.block').each(function() {
				$('#'+$(this).attr('name')+'_settings').css('height', h);
                if(!$(this).hasClass('active')) {
					$('#'+$(this).attr('name')+'_settings').hide();
				}

				$(this).click(function() {
					$('#settings').find('.block').each(function() {
						$(this).removeClass('active');
						$('#'+$(this).attr('name')+'_settings').hide();
					});
					$(this).addClass('active');
					$('#'+$(this).attr('name')+'_settings').show();
					if($(this).attr('sub')) {
						$('#settings .subblock').hide();
						$('#sub_'+$(this).attr('sub')).show();
					}
				});
			});

			$('#settings').find('input,select,textarea').change(function() {
				var ename = $(this).attr('name'), etype = $(this).attr('type');
				if(etype == 'button' || ename == 'import' || ename == 'export' || ename == 'lastlab') return;
				var value = $(this).val();
				if($(this).attr('maxlength') < 5) {
					value = value.replace(',','.');
					value = parseFloat(value);
					$(this).val(value>0?value:0);
				}
				if(etype == 'checkbox') value = $(this).prop('checked') ? true : false;
				if(etype == 'range') {
					if($(this).prop('step') == '0.5' && Math.ceil(value) == value) {
						$(this).next('i').html(value+'.0%');
					} else {
						$(this).next('i').html(value+'%');
					}
				}
				if($(this).is('textarea')) {
					value = value.split(',');
					for(var i in value) {
						value[i] = $.trim(value[i]);
					}
				}
				config.set('settings.'+$(this).attr('name'), value);

				if(ename.indexOf('curehp') > -1) {
					if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
			        	top.frames[1].bswitch();
			        }
				}
			});
			//Руники
			$('#rmfindclr').click(function() {
				$('#rmap .line').removeClass('hover');
				$('#rmfindloc').val('');
			});
			$('#rmfindloc').keyup(function(e) {
				$('#rmap .line').removeClass('hover');
				if(e.keyCode == 13) {
					$(this).val('');
					return;
				}
				var text = $(this).val();
				if(text.length > 2) {
			    	$('#rmap td.line:containsCI("'+text+'")').addClass('hover');
				}
			});
			$('#rmap').find('td.line').each(function() {
				$(this).mouseover(function() {
					var back = $('#rmhint').html();
					$('#rmhint').attr('last', back);
					var title = $(this).attr('title');
					$('#rmhint').html(title);
				}).mouseout(function() {
					var back = $('#rmhint').attr('last');
					$('#rmhint').html(back);
				}).click(function() {
					if($(this).hasClass('rpress')) {
						$(this).removeClass('rpress').addClass('rpress2');
					} else if($(this).hasClass('rpress2')) {
						$(this).removeClass('rpress2');
					} else {
						$(this).addClass('rpress');
					}
				});
			});
            if(!config.eq('vip', 'Platinum')) {
				$('#autolord').addClass('dis');
				$('#autorist').addClass('dis');
			}
			$('#anticaptcha').addClass('dis');
			config.set('cooldowns.route', false);

            launcher('init plugin', 'reinit');

			$('#autobattle').click(function() {
				if(config.eq('settings.launched', 'autobattle')) {
					launcher('Автохаоты стоп', false);
                    if (config.get('settings.anticaptcha.key')) {
                        $('#anticaptcha').removeClass('run').addClass('dis');
                    }
					config.message('Остановка...', 'Автохаоты');
				} else {
					config.set('settings.autobattle.chkrepair', true);
					config.set('settings.autobattle.chkquests', true);
					config.set('settings.autobattle.inlab', false);
					config.message('Переключение на автохаоты и запуск...', 'Автохаоты');
					if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
						top.frames[1].bswitch(1);
					}
                    $('#anticaptcha').removeClass('dis').addClass('run');
					launcher('Автохаоты старт', 'autobattle');
				}

			});

			$('#autocraft').click(function () {
				if (config.eq('settings.launched', 'autocraft')) {
					config.set('craft', null);
					config.message('Остановка...', 'Автокрафт');
					launcher('Автокрафт стоп', false);
				}
			});

            $('#autorist').click(function() {
				if(config.eq('settings.launched', 'autorist')) {
					launcher('Авториста стоп', false);
					config.message('Остановка...', 'Авториста');
				} else {
					config.set('settings.autorist.inbattle', true);
					config.message('Переключение на автористу и запуск...', 'Авториста');
					if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
			        	top.frames[1].bswitch(2);
			        }
			        launcher('Авториста старт', 'autorist');
				}
			});

			$('#autolord').click(function() {
				if(config.eq('settings.launched', 'autolord')) {
					launcher('Автолорд стоп', false);
					config.message('Остановка...', 'Автолорд');
				} else {
					config.set('settings.autolord.counter', 1);
					config.message('Переключение на автоудар, запуск... Поиск ключей...', 'Автолорд');
					if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
			        	top.frames[1].bswitch(0);
			        }
					config.parseInv(2, function(Inv) {
						if(Inv) {
							var Keys = Inv['Пропуск к Лорду Разрушителю'];
							Keys = Keys ? Keys : [];
							var ml = +Inv['counts']['Пропуск к Лорду Разрушителю'];
                            ml = (ml > 0 ? ml : 1);
							var count = prompt('Сколько боёв провести у Лорда? ('+Keys.length+' ключей)', ml);
							var lasthp = config.get('settings.battle.curehp');

		                	config.set('settings.autolord.keys', Keys);
		                	config.set('settings.autolord.counter', count);
		                	config.set('settings.autolord.curehp', lasthp);
		                	config.set('settings.autolord.inbattle', true);
		                	config.set('settings.autobattle.inlab', false);
		                	launcher('Автолорд старт', 'autolord');
		                } else {
		                	config.message('Ошибка, повторите позже.', 'Автолорд');
		                }
					});
				}

			});
			$('#autooutc').click(function() {
		    	if(prompt('Cессия в любой момент доступна в общих настройках', config.getCookie('PHPSESSID'))) {
					window.open('http://mibs.info/outlandbot.html?'+Math.random());
				}
			});

			document.cookie = "loaded=1; path=/; domain=.oldbk.com";

		} else {
			if(confirm('Ошибка получения данных с сервера. Обновить страницу?')) {
				window.location.href = window.location.href;
			}
		}
	}
};

myinfo(function (error, info) {
	if (error) {
        if(confirm('Ошибка получения данных с сервера. Обновить страницу?')) {
            window.location.href = window.location.href;
        }
	} else {
		var data = {};
        info.split('\n').forEach(function (line) {
			var index = line.indexOf('='),
				key = line.slice(0, index),
				value = line.slice(index + 1);
			data[key] = value;
        });
		xhr.send(JSON.stringify(data));
	}
});
// (xhr.send['nr@original'] || xhr.send).call(xhr, null);
