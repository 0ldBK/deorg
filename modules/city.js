var Url = window.location.href.toString();
if(Url.indexOf('/outcity.php') > -1) {	console.log('drop route and quest');
	config.set('map.route',false);
	config.set('outcity.quest.now', false);
} else {	var Html = document.body.innerHTML;	if(Html.indexOf("function cityg()") > -1) {
		console.log('refresh');
		window.location.href = '/city.php';
	}
}
/*
var im = document.getElementsByTagName('table');
for(var i in im) {	if(!im[i] || !im[i].style) continue;
	if(im[i].getAttribute('width') == 1) {    	im[i].setAttribute('width', '50%');
	}
}
*/
console.log('city');

if(Url.indexOf('/main.php?setch') > -1) {
	var SECRED = function(){/*
		<div class="map-block-logo buduar"></div>
		<div class="map-block-mid buduar">
			<div class="map-block-head">Секретная комната</div>
			<div class="map-block-bottom">
				<div class="button-mid btn" name="setch" title="Войти в комнату" onclick="if(confirm('Сначало надо зайти в любую комнату БК, вы это сделали?')) {location.href='main.php?path=1.100.1.50';}">Войти</div><div class="room-amount">&nbsp;(100500)</div>
				<div class="room-info">
					<a href="javascript:void(0)" onclick="alert('Это невозможно, Карл! ©')"><img src="http://i.oldbk.com/i/world_map2/i_2.jpg"></a>
				</div>
			</div>
		</div>
		<div class="map-block-right buduar"></div>
	*/}.toString();
	SECRED = SECRED.replace("function (){/*","");
	SECRED = SECRED.replace("*/}","");

	var newDiv = document.createElement('div');
	newDiv.className = 'map-block';
	newDiv.innerHTML = SECRED;
	document.getElementById('page-wrapper').appendChild(newDiv);
}



var snowmax = 25;
var Y = new Date().getYear();
var snow=new Array();
var marginbottom;
var marginright;
var timer;
var i_snow=0;
var x_mv=new Array();
var crds=new Array();
var lftrght=new Array();
var browserinfos=navigator.userAgent;
var ie5=document.all&&document.getElementById&&!browserinfos.match(/Opera/);
var ns6=document.getElementById&&!document.all;
var opera=browserinfos.match(/Opera/);
var browserok=ie5||ns6||opera;
function randommaker(range) {
	rand=Math.floor(range*Math.random());
	return rand;
}
function movesnow() {	var moved = 0;
	for(i=0;i<=snowmax;i++) {		if(!document.getElementById("s"+i)) {			continue;
		}
		moved++;
		crds[i] += x_mv[i];
		snow[i].posy += snow[i].sink;
		snow[i].style.left = snow[i].posx+lftrght[i]*Math.sin(crds[i])+"px";
		snow[i].style.top = snow[i].posy+"px";
		if (snow[i].posy >= marginbottom-30 || parseInt(snow[i].style.left) > (marginright-3*lftrght[i])) {
			snow[i].posx = randommaker(marginright - 10);
			snow[i].posy = 0;
		}
	}
	if(moved > 0) {
		setTimeout("movesnow()",50);
	} else {		alert('You win! Крейзики шлют тебе лучи добра и любви!');
		document.body.style.cursor = 'default';
		config.set('firstaprel'+Y, true);
	}
}

if(new Date().getDate() == 1 && new Date().getMonth() == 3 && !config.get('firstaprel'+Y)) {	if (ie5 || opera) {
		marginbottom=document.body.clientHeight;
		marginright=document.body.clientWidth;
	} else if (ns6) {
		marginbottom=window.innerHeight;
		marginright=window.innerWidth;
	}	for(i=0;i<=snowmax;i++) {
		var newSmile = document.createElement('img');
		newSmile.setAttribute('id', "s"+i);
		newSmile.setAttribute('src', "http://mail.podhod.by:45566/i/crazy.gif");
		newSmile.setAttribute('style', "position:absolute; top:-20px; width: 16px;");
		newSmile.onclick = function() {
			config.message('Пиу пиу! Крейзик пал смертью храбрых  :(', '1 апреля');
			this.remove();
		}
		document.body.appendChild(newSmile);

		crds[i]=0;
		lftrght[i]=Math.random()*15;
		x_mv[i]=0.03+Math.random()/10;
		snow[i] = document.getElementById("s"+i);
		snow[i].sink = 6/5;
		snow[i].posx=randommaker(marginright - 10);
		snow[i].posy=randommaker( (2*marginbottom) - marginbottom - 20 );
		snow[i].style.left = snow[i].posx+"px";
		snow[i].style.top = snow[i].posy+"px";
	}
	document.body.style.cursor = 'crosshair';
	movesnow();
}



