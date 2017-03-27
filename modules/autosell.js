var Url = window.location.href.toString();
if(Url.indexOf("/church.php") > -1) {
	//console.log("seller loaded");
} else {
	//console.log("bad seller loaded");
    throw "nouse";
}
console.log("seller work");
//<b>Вы пожертвовали на внутреннюю отделку: Портальный кристалл &beta; x2 </b><br>И получили 31 репутации.<br>

var GHTML = function(){/*
	<div id='sales'><button id='sellitall'>Продать все ресурсы</button><hr><div id='stext'></div></div>
	<div id='gifter' style='display: none;'>
		<table>
		<tr>
			<td style='width: 200px;'>
				Плюшкин <b id='scount'>...</b>
			</td>
			<td id='sstatus'>Загрузка данных...</td>
			<td style='width: 200px;'>
				<input id='giftname' name='giftname' value='' placeholder='Фильтр по подарку. Пусто = любые'>
			</td>
		    <td style='width: 100px;'>
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

function timeSale(res, allr, allp, r) {	console.debug(res[r]);	config.broadcast("/church.php?got=1&level11=1&doit="+res[r], function(data) {		allr--;
		if(data.indexOf("Вы пожертвовали") > -1) {
			var inf = data.match(/отделку: (.+?) x([0-9]+).*?<\/b><br>И получили ([0-9]+)/i);
			allp += parseInt(inf[3]);
			document.getElementById('stext').innerHTML = document.getElementById('stext').innerHTML + "<div>["+r+"/"+allr+"] "+inf[1]+" x "+inf[2]+" за "+parseInt(inf[3])+" репы</div>";
		} else {
			document.getElementById('stext').innerHTML = document.getElementById('stext').innerHTML + "<div>Ошибка сдачи ресов!</div>";
		}
		if(allr < 1) {
           	config.message("Получено "+allp+" репутации.", "Автопродажа");
		} else {
			r++;
			timeSale(res, allr, allp, r);
		}
	});
}

document.getElementById('sellitall').onclick = function() {
	console.log('sale');	var allp = 0, allc = 0;
	config.broadcast("/church.php?got=1&level11=1", function(data) {
		var i = [0, 0, 0, 0, 0];
		var res = data.match(/got=1&level11=1&doit=([0-9]+)/ig);
		if(res &&  res.length > 0) {			console.debug(res);
        	timeSale(res, res.length, 0, 0);
        } else {
        	document.getElementById('stext').innerHTML = document.getElementById('stext').innerHTML + "<div>Нет тут никого, нечего продавать</div>";
        }
	});
};

