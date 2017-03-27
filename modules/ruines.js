var Url = window.location.href.toString();
if(Url.indexOf("/ruines.php") < 0) {
	console.log("ruines bad");
	throw "nouse";
}
//собно (не)запуск и (не)работа рендера тут
if(!config.get('settings.ruines.enabled')) throw 'ruines disabled';
console.debug('ruines work');

if(top.document && top.document.getElementById('ruinsmap')) {
	//top.document.getElementById('ruinsmap').style['display'] = 'block';
	var Html = document.body.innerHTML;
	var nowroom = config.search('<td class="?\'?H3"?\'? align="?\'?right"?\'?>([^<&]+)', Html);
    nowroom = nowroom.trim();
	top.setRuinRoom(nowroom);
}


