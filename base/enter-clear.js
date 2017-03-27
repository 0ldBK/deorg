var Url = window.location.href.toString();
if(Url == "http://oldbk.com" || Url == "http://oldbk.com/" || Url.indexOf("http://oldbk.com/?") == 0) {	function myautologin(login, passsword) {		document.getElementById('login').getElementsByTagName('input')[0].value = login;
		document.getElementById('login').getElementsByTagName('input')[1].value = passsword;
        document.forms['login'].submit();
	}
	function saveUsers(params) {		console.debug('save');		console.debug(params);		var stringified = JSON.stringify( params );
		console.debug(stringified);
		window[ 'localStorage' ].setItem( 'autologin', stringified);	}


    //console.log(Url);
    var newLogin = document.createElement('div');
    newLogin.setAttribute('id', 'authform');
	var newRait = document.createElement('div');
    newRait.setAttribute('id', 'raitmessage');
    newRait.innerHTML = "Внимание!!! <img src='https://www.timezero.ru/i/smile/crazynuts.gif'>";

	document.body.appendChild(newLogin);
	document.body.appendChild(newRait);

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
	for(var i in logins) {		HTML += "<div class='authuser' name='"+i+"'>"+
		"<img src='http://i.oldbk.com/i/inf.gif' name='infohref' title='Посмотреть инфо'>&nbsp;<input name='ulogin' id='ulogin"+i+"' type='text' value='"+logins[i]['l']+"' placeholder='Логин' style=''>&nbsp;"+
		"<input name='upass' id='upass"+i+"' type='password' onblur='this.type=\"password\"' onfocus='this.type=\"text\"' value='"+logins[i]['p']+"' placeholder='Пароль'>&nbsp;"+
		"<label><input name='auto[]' id='auto"+i+"' type='radio' value='1'"+(logins[i]['a']>0?' checked':'')+"> автовход&nbsp;</label>"+
		"<input type='button' value='Вход' name='ebutton'>"+
		"</div>";
		if(logins[i]['a'] > 0 && logins[i]['l'] != '' && logins[i]['p'] != '') {
			enter = i;
		} else if(logins[i]['a'] > 0) {			document.getElementById('utimer').innerHTML = 'bad login or password';
		}
	}
	document.getElementById('authform').innerHTML = HTML;

    var buttons = document.getElementsByName('ebutton'), logins = document.getElementsByName('ulogin'),
	passwords = document.getElementsByName('upass'), autos = document.getElementsByName('auto[]'),
	hrefs = document.getElementsByName('infohref');

	for(var b in buttons) {		if(isNaN(+b)) continue;		var a = +b + 1;		buttons[b].onclick = function() {	       	var i = this.parentNode.getAttribute('name');
	       	var l = document.getElementById('ulogin'+i).value;
	       	var p = document.getElementById('upass'+i).value;
	       	myautologin(l, p);
		}
		hrefs[b].onclick = function() {
	       	var i = this.parentNode.getAttribute('name');
	       	var l = document.getElementById('ulogin'+i).value;
	       	if(l) {
	       		window.open("/inf.php?login="+l, "userinfo");
	       	} else alert('Сначала введите логин!');
		}
		logins[b].onchange = function() {			var i = this.parentNode.getAttribute('name');			Users.data[i]['l'] = this.value;
			saveUsers(Users);
		}
		passwords[b].onchange = function() {			var i = this.parentNode.getAttribute('name');			Users.data[i]['p'] = this.value;
			saveUsers(Users);
		}
		autos[a].onclick = function() {
			var i = this.parentNode.parentNode.getAttribute('name');
			var l = document.getElementById('ulogin'+i).value;
			document.getElementById('utimer').innerHTML = 'Настроен автовход для '+l;
			for(var u in Users.data) {				Users.data[u]['a'] = u==i ? 1 : 0;
			}
			saveUsers(Users);
		}
	}
	autos[0].onclick = function() {
		clearInterval(T);
		document.getElementById('utimer').innerHTML = 'Автовход отменен';
		for(var u in Users.data) {
			Users.data[u]['a'] = 0;
		}
		saveUsers(Users);
	}
	document.getElementById('etimeset').onkeyup = function() {
		etime = this.value;
		Users.etime = this.value;
		saveUsers(Users);
	};
	if(enter > -1) {
		var S = etime, login = Users.data[enter]['l'], password = Users.data[enter]['p'];
		T = setInterval(function() {			document.getElementById('utimer').innerHTML = 'Автовход <b>'+login+'</b> через '+S+' сек.';
		    S--;
		    if(S < 1) {
		    	clearInterval(T);
	        	myautologin(login, password);
		    	return;
		    }
		}, 1000);
	}
}
