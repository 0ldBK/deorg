console.log("pre ruines work");

config.set('ruins.myteam', false);
config.set('ruins.rid', false);
config.set('ruins.room', false);

document.body.innerHTML = document.body.innerHTML + "<div id='sales'><div id='stext'>Загрузка ваших комплектов...</div></div>";

function set_sets_to() {
	config.broadcast("/ruines_profile.php?"+Math.random(), function(html) {		html = html.split('\n').join('');
		var regex = "<tr onclick[^\\d]+([0-9]+)[^>]+>\\s*<td[^>]*>\\s*<b>\\s*([^<]+)\\s*<\\/b>\\s*<\\/td>\\s*<td[^>]*>\\s*<a[^>]+>\\s*(<font[^>]+>)?([^<]+)";
		var sets = config.searchAll(regex, html);
		if(sets && sets.length > 0) {
			document.getElementById('stext').innerHTML = '';
			for(var set in sets) {
				var id = sets[set][0], name = sets[set][1], def = sets[set][2] ? true : false;
				var text = def ? "Установлен комплект &laquo;"+name+"&raquo;" : "Сменить на комплект &laquo;"+name+"&raquo;";
				var color = def ? "#800000" : "#003388";

				var newDiv = document.createElement('div');
				newDiv.setAttribute('id', id);
				newDiv.style['color'] = color;
				newDiv.innerHTML = text;
				newDiv.onclick = function() {
					this.style['color'] = '#C0C0C0';
					this.innerHTML = 'Установка...';
					var This = this;
					config.broadcast("/ruines_profile.php?setdef="+this.getAttribute('id'), function(html) {
						if(html.indexOf("<font color=red><b>Сохранено") > -1) {							This.style['color'] = '#008000';
							This.innerHTML = 'Всё ок, обновляю.';
						} else {							This.style['color'] = '#FF0000';
							This.innerHTML = 'Ошибка, обновляю!';
						}
						set_sets_to();
					});
				}
				document.getElementById('stext').appendChild(newDiv);
			}
		}
	});
}
set_sets_to();