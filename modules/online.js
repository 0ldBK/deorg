var Hint3Name = '';
if(config && config.get('settings.base.chatupdate') && document.getElementsByTagName("input")[1]) {
	if(!document.getElementsByTagName("input")[1].checked) {		console.debug('activate chat');
		document.getElementsByTagName("input")[1].click();
		document.getElementsByTagName("input")[0].click();
	}
}
if(config && document.body) {
	var html = document.body.innerHTML;
	var users = config.searchAll("w\\(([^\\)]+)\\);", html);
	var me = config.get('user.login'); me = me.toLowerCase();
	for(var u in users) {
		var user = users[u].replace(/(')/g, '');  user = user.split(','); //'
		var login = user[0].toLowerCase();
		if(me != login) continue;
		var team = +user[10];

		if(team > 0) {			console.debug('Есть тима '+team);
			config.set('user.team', (team == 1 ? 'blue' : 'red'));
		} else {			config.set('user.team', false);
		}
		break;
	}
}


