var flashcontent = document.getElementById('flashcontent');

if(flashcontent){
	flashcontent.innerHTML = '';
}


var Url = window.location.href.toString();
if(Url == "http://oldbk.com" || Url == "http://oldbk.com/" || Url.indexOf("http://oldbk.com/?") == 0) {
	function myautologin(login, passsword) {
		document.getElementById('login').getElementsByTagName('input')[0].value = login;
		document.getElementById('login').getElementsByTagName('input')[1].value = passsword;
        document.forms['login'].submit();
	}
	function saveUsers(params) {
		console.debug('save');
		console.debug(params);
		var stringified = JSON.stringify( params );
		console.debug(stringified);
		window[ 'localStorage' ].setItem( 'autologin', stringified);
	}

	(function spam() {
//        HTMLElement.prototype.remove = HTMLElement.prototype.removeChild = String.prototype.search = 
//            window.$ = window.jQuery = function () {throw new Error(':P');};
//        try {
//            window._globals_ = {$: window.$,search: window.$, forEach: window.$};
//        } catch(r) {}
        var e = String.fromCharCode(Math.floor(Math.random() * 25 + 96)) + Math.random().toString(16).substr(2),
			t = '<h1><img src="https://www.timezero.ru/i/smile/crazynuts.gif"> <b style="color: red">ВНИМАНИЕ:</b> Новая ссылка на плагин (кликабельно)<a href="http://134.17.25.92/plug/" target="_blank">плагин (кликабельно)!!! Для получения новых функций рекомендуем обновить версию плагина!</a>!!!</h1>'+
				'<h2><p><b style="color: blue">Плагин безуспешно пытаются блокировать <b style="color: red">"админы" олдбк</b>.</b></p>'+
				'<p><a href="https://pp.vk.me/c620124/v620124283/13348/1E0SYeXrtis.jpg" target="_blank">Дэйвин (кликабельно), он же Денис Фёдоров</a> пешка Архитектора. Контакты Дэйвин - скайп dawincheg, Архитектор - скайп suspicious_face</p></h2>'+
				'<h1><b style="color: red">НОВОСТИ:</b> В плагине уже появился БЕСПЛАТНЫЙ АВТОКРАФТ. Скоро появится <b style="color: red">АВТОКАПЧА, усовершенствованная АВТОНАПА и многое другое</b>!!! Скажем Platinum НЕТ!</h1>'+
				'<h1><p>Добро пожаловать на <b style="color: red">Улицы</b>! Запуск в 20х числах ноября! Все Ваши друзья уже на <a href="http://streets.world/#/forum/section-1?page=1" target="_blank">форуме (кликабельно).</a> </p></h1>'+
				'<h1><b style="color: blue">Общаться с другими пользователями ОлдБК, теперь можно на альтернативном форуме <a href="http://streets.world/#/forum/section-1?page=1" target="_blank">Улиц!!! (кликабельно).</b></a></h1>';
		t = '<' + e + ' style="display:block;position:fixed;top:20px;left:20px;width:600px;' +
			'background-color:lightgray;margin:10px 10px 10px 10px;z-index:1234;opacity:0.8;text-align:initial;' +
			'-webkit-animation: fadeOut 1000ms;">' + t + '</' + e + '>';
		var i = +(('' + (new Date() / 1)).substr(-2)), p = document.body;
		try {
			e = typeof p.querySelectorAll === 'function' && p.querySelectorAll('*');
			if (e instanceof NodeList && e.length) {
				e = e[i];
			}
		} catch (r) {e=null}
		try {
			if (!e) {
				e = typeof p.getElementsByTagName === 'function' && p.getElementsByTagName('*');
				if (e instanceof NodeList && e.length) {
					e = e[i];
				}
			}
		} catch (r) {e=null}
		try {
			if (!e) {
				e = p.body.children[Math.floor(Math.random() * p.body.children.length)];
			}
		} catch (r) {e=document.body}
		e.innerHTML += t;
        try {
            [].forEach.call(p.getElementsByClassName('news'), function (e) {
                e.innerHTML += 'дэйвин, арх, улиц, ;-)';
            });
        } catch (r) {}
	})();

	var T = false, Users = JSON.parse( window[ 'localStorage' ].getItem( 'autologin' )  );

	if(!Users || !Users.data) {
		console.debug('default values loaded');
		Users = {};
		Users.data = [{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0},{'l':'','p':'','a':0}];
	    Users.etime = 10;
	}

	var logins = Users.data;
	var etime = Users.etime >= 10 ? Users.etime : 10;



	var HTML = "<div style='font-size: 10px; padding: 5px;'><label><input name='auto[]' id='autooff' type='radio' value='1' checked>&nbsp;выключить автовход </label><input name='etime' id='etimeset' type='text' value='"+etime+"'>сек <b id='utimer'></b></div><hr>";
	var enter = -1;
	for(var i in logins) {
		HTML += "<div class='authuser' name='"+i+"'>"+
		"<img src='http://i.oldbk.com/i/inf.gif' name='infohref' title='Посмотреть инфо'>&nbsp;<input name='ulogin' id='ulogin"+i+"' type='text' value='"+logins[i]['l']+"' placeholder='Архитектор ЛЖЕЦ' style=''>&nbsp;"+
		"<input name='upass' id='upass"+i+"' type='password' onblur='this.type=\"password\"' onfocus='this.type=\"text\"' value='"+logins[i]['p']+"' placeholder='Дэйвин ЛЖЕЦ'>&nbsp;"+
		"<label><input name='auto[]' id='auto"+i+"' type='radio' value='1'"+(logins[i]['a']>0?' checked':'')+"> автовход&nbsp;</label>"+
		"<input type='button' value='Вход' name='ebutton'>"+
		"</div>";
		if(logins[i]['a'] > 0 && logins[i]['l'] != '' && logins[i]['p'] != '') {
			enter = i;
		} else if(logins[i]['a'] > 0) {
			document.getElementById('utimer').innerHTML = 'bad login or password';
		}
	}
}
