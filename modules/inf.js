if(new Date().getDate() == 1 && new Date().getMonth() == 3) {
	var newMess = document.createElement('span');
	newMess.innerHTML = "<br>Сообщение от пахлавы о печеньках сладких в пудре/глазировке:<br><font class='private'>01.04.16 00:00 В течение суток отпраздновать первое апреля!</font><hr>";
	document.getElementsByTagName('table')[8].getElementsByTagName('td')[0].appendChild(newMess);
	document.getElementsByTagName('table')[2].className = 'rotate';
}


