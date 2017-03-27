if (window.location.href.indexOf('lookmap=') > -1 || window.location.href.indexOf('talk=') > -1) {
    throw 'map/deal';
}
if (!config.get('settings.lab.enabled')) throw 'lab disabled';

var Hint3Name = '';

var LABHTML = function(){/*
<div id='badbuttons'>
	<a href="?travm=true" onclick="return confirm('Вы уверенны, что хотите вылечить травму за 30 кр?')">
		<img src="http://i.oldbk.com/i/magic/ct_all.gif" title="Вылечить 30 кр" alt="Вылечить 30 кр">
	</a>
</div>
<table id='render' cellspacing=0>
<tr>
	<th rowspan=8 id="mapdata"> Загрузка карты... </th>
	<td class='buttons' width=305px height="30px">
		<button id="autopilot" onclick="autop(this);">Включить</button>
		<button id="badexit" onclick="lab.crossWalks('leave');">Выйти из лабы</button>
		<button id="dropmap" onclick="dropit(this);">Сброс карты</button>
	</td>
</tr>
<tr>
	<td align=center width="305px" height="140px">
		<table id='navi' cellspacing='0' cellpadding='0'>
			<tr>
				<th colspan=3 height=10> </th>
			</tr>
			<tr>
				<th></th>
				<th colspan=2 class='up' title='Вверх' name='direct' id='dup' onclick='lab.direct("up");'> </th>
				<th></th>
			</tr>
			<tr>
				<th class='left' title='Влево' name='direct' id='dleft' onclick='lab.direct("left");'> </th>
				<th class='refresh' title='Обновить' name='direct' colspan=2 id='drefresh' onclick='lab.direct("refresh");'></th>
				<th class='right' title='Вправо' name='direct' id='dright' onclick='lab.direct("right");'> </th>
			</tr>
			<tr>
				<th></td>
				<th colspan=2 class='down' title='Вниз' name='direct' id='ddown' onclick='lab.direct("down");'> </th>
				<th></th>
			</tr>
			<tr>
				<th colspan=4 id='time'> Загрузка... </th>
			</tr>
		</table>
		<table id='heal' cellspacing='5' cellpadding='0'>
			<tr>
				<th id='dot' title='Юз антидота' onclick='lab.use("dot", true);'>&infin;</th>
				<th id='dot2' title='Юз большого антидота' onclick='lab.use("dot2", true);'>&infin;</th>
				<th rowspan='2'><img src='{server}/i/rld.png' title='Обновить список' onclick='lab.loadItems();' style='cursor: pointer;'></th>
			</tr>
			<tr>
				<th id='but' title='Юз бутерброда' onclick='lab.use("but", true);'>&infin;</th>
				<th id='keys'>
					<div id='key1' title='Ключи #1'>&infin;</div>
					<div id='key2' title='Ключи #2'>&infin;</div>
					<div id='key3' title='Ключи #3'>&infin;</div>
					<div id='key4' title='Ключи #4'>&infin;</div>
					<div id='key666' title='Ключи #666'>&infin;</div>
				</th>
			</tr>
		</table>
		<br><br>
		<label title='ID карты из познания лабиринта(цифры в конце ссылки)' id='labmapid'>
			<input name='labmapid' id='labmapnum' type='text' value='' style='width: 55%' placeholder='Познание лабиринта (id карты)'> <input type='button' value='нанести карту' onclick='openMap()'>
		</label>
		<br>
		<i id='shift' onclick='press(this);' class='norun'>безопасный путь</i>
		<i id='ctrl' onclick='press(this);' class='norun'>добавить к пути</i>
		<i id='alt' onclick='press(this);' class='norun'>пустой путь</i>
	</td>
</tr>
<tr>
	<td class='trap' width="305px" height="30px">
		<div id='traptime' title='Время перехода +3'>0 мин.</div>
		<div id='trapheal' title='Уровень жизни -2'>0 мин.</div>
		<div id='trapstat' title='Все параметры -1'>0 мин.</div>
	</td>
</tr>
<tr>
	<td class='params' width="305px" height="30px">
		<div id='died' title='Погибали в лабе'>[0/3]</div>
		<div id='cord' title='Местонахождение х/у'>[x/y]</div>
		<div id='netto' title='Загруз n/m'>[n/m]</div>
	</td>
</tr>
<tr>
	<td class='heal' width="305px" height="30px">
		<span id='HPinfo' title='Уровень жизни'>[&infin;/&infin;][&infin;%]</span> <div id='HPcure' title='Можно отлечить свитками'>+&infin;</div>
	</td>
</tr>
<tr>
	<td title='Текущий квест' class='quest' width="305px" height="30px">
		<span id='quest'></span>
	</td>
</tr>290
<tr>
	<td class='info' width="305px" height="200px">
		Здесь находится: <br>
		<div id='info'></div>
	</td>
</tr>
<tr>
	<td class='logs' width="305px">
		Логи: <div id='cleanlogs' onclick='lab.cleanLogs();'>очистить</div><br>
		<div id='logs'></div>
	</td>
</tr>
</table>
<div id='dealer'>
	<div id='dtitle'>Старьёвщик</div>
	<div id='dclose' onclick='lab.closeDealer(1);'>X</div>
	<div id='dtext'>Загрузка...</div>
</div>
*/}.toString();
LABHTML = LABHTML.replace("function (){/*", "");
LABHTML = LABHTML.replace("*/}", "");
LABHTML = LABHTML.replace(/{server}/ig, SERVER);

try {
    window.setTimeout = window.NREUM && window.NREUM.o && window.NREUM.o.ST || window.setTimeout;
    window.clearTimeout = window.NREUM && window.NREUM.o && window.NREUM.o.CT || window.clearTimeout;
} catch (e) {}

var Labyrinth = function() {

    this.Bosses = {
        'Фобос': 'ares','Сын Ареса': 'ares','Амфисбена': 'amfis','Гидра': 'hydra',
        'Химера': 'chimera','Пирагмон': 'piragmon','Аэлла': 'aella','Грифон': 'grifon'
    };
    this.Quests = {
        'Сундук с сокровищами': 1,'Карта лабиринта': 25,'Заказ от Архитектора': 31,'Драгоценные камни': 10,'Растения лабиринта': 21,
        'Сталь для кузнеца': 11,'Осколок Хрустального Шара': 21,'Образцы для лаборатории': 20,'Пора потушить свет в лабиринте': 10,
        'Камень для кулона': 5
    };
    this.ArtsList = [
        'Дубинка Радости', 'Топор Вихря', 'Щит Пророчества', 'Щит Откровения', 'Кольцо Жизни', 'Великое Кольцо Жизни',
        'Закрытый шлем Развития', 'Шлем Ангела', 'Лучшие Ботинки', 'Панцирь Злости', 'Доспех Хаоса', 'Броня Ангела','Доспех -Броня Титанов-'
    ];
    this.Traps = {
        'time': 'Время перехода \\+([0-9]+) секунды \\((Осталось|Длительность\s?)\s?:\s?([0-9\\.]+)',
        'heal': 'Уровень жизни -([0-9]+)HP в минуту \\((Осталось|Длительность\s?)\s?:\s?([0-9\\.]+)',
        'stat': 'Ослаблены характеристики( )\\((Осталось|Длительность\s?)\s?:\s?([0-9\\.]+)'
    };

    this.DealerItems = [
    [1, '([0-9]+)\\"?\'?>Продать (.+?) за ([0-9\\.]+)', 'Артефакт', 1],
    [56662, '<input name="scrol\\[([0-9]+)\\]"', 'Cвиток Чарования II', 3],
    [56663, '<input name="scrol\\[([0-9]+)\\]"', 'Cвиток Чарования III', 3],
    [2, '([0-9]+)\\"?\'?>Отдать Чек на предъявителя ([0-9]+)', 'Чек', 1],
    [15551, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Мусорщика', 5],
    [15552, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Мироздателя', 5],
    [15553, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Удачи', 5],
    [15554, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Исчадия Хаоса', 5],
    [15555, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Духа Форума', 5],
    [15556, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Пятницы', 5],
    [15557, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Лорда Разрушителя', 5],
    [15558, '<input name="scrol\\[([0-9]+)\\]"', 'Cтатуя Хранителя', 5]
    ];

    this.DealerGoods = [[],[],[],[],[],[],[],[],[],[],[],[]];

    this.trap = false;
    this.step = false;
    this.GO = false;
    this.Items = 0;
    this.DItems = 0;
    this.NoGetItems = 0;

    this.Directs = [[0,-1],[-1,0],[0,1],[1,0]]; //left,up,right,down
    this.Directf = {'up': 1,'left':0,'right':2,'down':3,'refresh':-1};
    this.request = 0;
    this.T = +new Date() - 100;
    this.I = false;
    this.F = false;

    this.broadcast = function(url, callback, data) {

        var xhr = new XMLHttpRequest();
        xhr["nr@context"] = null;
        (xhr.open['nr@original'] || xhr.open).call(xhr, (data ? 'POST' : 'GET'), url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var html = this.responseText;
                    if (callback) callback(html);
                    html = null, callback = null;
                } else {
                    if (callback) callback(false);
                }
                callback = null;
            }
        };
        (xhr.send['nr@original'] || xhr.send).call(xhr, (data ? data : null));
        xhr = null;
    };

    this.mess = function(text, color) {
        if (document.getElementById('time')) {
            document.getElementById('time').innerHTML = text;
            document.getElementById('time').style['color'] = (color ? color : 'red');
        }
    };

    //проверяем надо ли хилиться type = boolean; true = buter, false = heal
    this.needCure = function(type) {

        var useit = config.get('settings.lab.autoheal.1'), size = config.get('lab.size');

        if (type && (useit == 0 || (useit == 2 && size < 26))) {
            return false;
        }
        //включены проценты
        var buterpercent = config.get('settings.lab.autoheal.5');
        var healpercent = config.get('settings.lab.autoheal.4');
        var uhp = config.get('user.hp');
        var percent = uhp[2];
        if (+buterpercent > 0 && +buterpercent <= 99 && type) {
            return percent < buterpercent;
        }
        if (+healpercent > 0 && +healpercent <= 100 && !type) {
            return percent < healpercent;
        }

        //Автоподсчёт по макс хп для атаки
        if (uhp[0] < uhp[1]) {
            var MHP = 0;
            var type = size > 25 ? 1 : 0;
            var HPList = config.get('settings.lab.attack.' + type);
            for (var i in HPList) {
                if (HPList[i] > MHP) MHP = HPList[i];
            }
            //в героике хп берём у боссов
            if (type == 1) {
                var HBBoss = config.get('settings.lab.hpbosses');
                for (var i in HBBoss) {
                    if (HBBoss[i][1] > MHP) MHP = HBBoss[i][1];
                }
            }
            return uhp[0] < MHP ? true : false;
        }
        return false;
    };
    //поиск лечилки
    this.findCure = function() {
        var Min = false, Route = {}, Map = config.get('lab.map'), VmMap = config.get('lab.vmmap'), cord = config.get('lab.cord');
        for (var xy in Map) {
            if (Map[xy]['name'] != 'heal') continue;
            var x = Map[xy]['x'], y = Map[xy]['y'];
            Route = AStar(VmMap, cord, [x,y], 'Euclidean');
            if (Route.length < 1) continue;

            if (!Min || Route.length < Min.length) Min = Route;
        }
        return (Min.length > 0) ? Min : false;
    };

    //надо ли жрать бутер
    this.eatButer = function() {
        var bcount = config.get('lab.cures.but', 0);
        if (bcount < 1) return false;
        var buters = config.get('settings.lab.autoheal.1');
        if (buters < 1) return false;
        if (buters == 1) return true;
        if ((buters == 2) && config.get('lab.size') > 25) return true;
        return false;
    };

    //Хп для атаки моба
    this.mayAttack = function(name, y, title) {
        var Size = config.get('lab.size'), Cord = config.get('lab.cord');
        y = y > 0 ? y : Cord[1];
        var type = Size > 25 ? 1 : 0;
        var uhp = config.get('user.hp');
        var nowHP = +uhp[0];
        var subHP = +config.get('lab.cures.hp', 0);
        if (config.get('settings.lab.attack.2.1')) nowHP += subHP;
        var minHP = +uhp[1];
        if (name == 'boss') {
            var HPBosses = config.get('settings.lab.hpbosses');
            for (var i in HPBosses) {
                if (HPBosses[i][0] == title) {
                    minHP = HPBosses[i][1];
                    break;
                }
            }
        } else {
            minHP = config.get('settings.lab.attack.' + type + '.' + (y > Size / 2 ? 1 : 0));
        }
        return (nowHP < minHP) ? false : true;
    };
    //имя картинки
    this.im = function(image) {
        var find = config.search('\\/([0-9a-z]+)\\.gif', image);
        return find;
    };
    //это текущая ячейка
    this.it = function(x,y) {
        var Cord = config.get('lab.cord');
        return Cord[0] == x && Cord[1] == y ? true : false;
    };
    //сторона света
    this.align = function(to) {
        var Cord = config.get('lab.cord');
        if (to[0] == Cord[0]) {
            return (to[1] > Cord[1]) ? 'p2' : 'p4';
        } else if (to[1] == Cord[1]) {
            return (to[0] > Cord[0]) ? 'p3' : 'p1';
        }
    };
    //создание пути по клику
    this.direct = function(el) {
        var Cord = config.get('lab.cord');

        if (typeof(el) == 'string') {
            //'up': 'p1','down':'p3','right':'p2','left':'p4',
            var goto = this.Directf[el];
            if (goto > -1) {
                console.debug('go ' + goto, Cord);

                var x = Cord[0] + this.Directs[goto][0], y = Cord[1] + this.Directs[goto][1];
                console.debug([x,y]);
                config.set('lab.route',[[x,y]]);
                this.drawRoute();
                this.router('direct man');
                return;
            }
            this.go(false, 'm');
            return;
        }
        if (el.getAttribute('name') == 'me') {
            config.set('lab.route',[]);
            this.drawRoute();
            this.router('man');
            return;
        } else if (el.getAttribute('name') == 'undefined' || el.getAttribute('name') == 'wall') {
            return;
        }

        var Map = config.get('lab.map'), xy = el.getAttribute('id'), loc = Map[xy];

        if (config.get('lab.alt')) {
            if (loc['type'] < 1 || loc['name'] == 'wall') return;
            config.set('lab.route',[]);
            this.drawRoute();

            var lc = el.getAttribute('class'), lt = el.getAttribute('type');
            if (loc['type'] == 4) {
                var type = (loc['ptype'] > 0 ? loc['ptype'] : 1);
                var clas = (loc['pclass'] ? loc['pclass'] : 'not');
                config.set('lab.map.' + xy + '.type', type);
                config.set('lab.map.' + xy + '.class', clas);
                el.setAttribute('type', type);
                el.setAttribute('class', clas);
            } else {
                config.set('lab.map.' + xy + '.type', 4);
                config.set('lab.map.' + xy + '.class', 'fre');
                config.set('lab.map.' + xy + '.ptype', lt);
                config.set('lab.map.' + xy + '.pclass', lc);
                var nclass = el.className.replace('not', 'fre');
                el.setAttribute('type', 4);
                el.setAttribute('class', nclass);
            }
            return;
        }

        var route = [], x = +loc['x'], y = +loc['y'], VMap = config.get('lab.vmap'), VmMap = config.get('lab.vmmap');

        if (config.get('lab.ctrl') && el.getAttribute('name') != 'direct') {
            var proute = config.get('lab.route');
            if (proute.length > 0) {
                route = proute;
                var last = proute[proute.length - 1];
                var tmp = AStar((config.get('lab.shift') ? VmMap : VMap), last, [x,y], 'Euclidean');
                for (var r in tmp) {
                    if (r < 1) continue;
                    route.push(tmp[r]);
                }
            } else {
                route = AStar(VMap, Cord, [x,y], 'Euclidean');
            }
        } else {
            route = AStar((config.get('lab.shift') ? VmMap : VMap), Cord, [x,y], 'Euclidean');
        }
        if (route.length > 0) {
            config.set('lab.route',route);
            this.drawRoute();
            this.router('man map');
        }
    };
    /*
        [4]типы развилок (0)посещённая, (1)рядом есть непосещённые, (2)рядом есть пропускаемые, (3)рядом есть мобы, (4)рядом есть босс.
        [5]типы ячеек: (0)развилка, (1)проход, (2)тупик, (3)неизвестно, (4)тупик с дверью
        [6]рядом есть дверь
        */
    //left[x,y,name,type],up[x,y,name,type],right[x,y,name,type],down[x,y,name,type],(4)тип развилки,(5)тип ячейки,(6)содержимое дверей]
    this.cellInfo = function(x,y) {
        var Map = config.get('lab.map'), lid = x + '-' + y;
        if (!Map[lid] || !Map[lid]['name'] || Map[lid]['name'] == 'wall' || Map[lid]['name'] == 'goup' || Map[lid]['name'] == 'godown' || Map[lid]['name'] == 'door') {
            return false;
        }
        var D = [x + '-' + (y - 1), (x - 1) + '-' + y, x + '-' + (y + 1), (x + 1) + '-' + y];  //Direct [left,up,down,right]
        var D2 = [x + '-' + (y - 2), (x - 2) + '-' + y, x + '-' + (y + 2), (x + 2) + '-' + y];  //Direct x 2 [left,up,down,right]
        var R = [[x, (y - 1), 0, 0], [(x - 1), y, 0, 0], [x, (y + 1), 0, 0], [(x + 1), y, 0, 0], 0, 0, false];
        var undef = 0, walls = 0, mobs = 0, bosses = 0, free = 0, not = 0, ways = 0, doors = 0, okdoor = 0;
        for (var d in D) {
            var cell = Map[D[d]];
            if (!cell) continue;
            var type = cell['type'], name = cell['name'], title = cell['title'];
            if (type > 0) {
                if (name == 'mob') mobs++;
                if (name == 'boss') bosses++;

                if (name == 'wall' || type == 5 || name == 'goup' || name == 'godown') walls++;
                if (name != 'godown' && name != 'goup' && name != 'door' && name != 'wall' && name != 'mob' && name != 'boss' && type == 1) not++;
                if (name != 'godown' && name != 'goup' && name != 'door' && name != 'wall') ways++;
                if (name == 'door') {
                    if (+Map[D2[d]]['type'] == 1) {
                        doors++;
                        var indoor = Map[D2[d]]['title'];
                        if (indoor == '' || indoor == 'Ловушка') {
                            okdoor++;
                        }
                    }
                }
                if (type == 4) free++;
                R[d][2] = name;
                R[d][3] = type;
                R[d][4] = title;
            } else {
                if (cell['x'] < 49 && cell['x'] > 1) {
                    undef++;
                } else {
                    walls++;
                }
                R[d][0] = false;
            }
        }
        if (doors == 1 && okdoor == 1) {
            R[6] = true;
        }

        if (undef > 0) {
            R[5] = 3;
        } else if (walls == 3) {
            R[5] = 2;
        } else if (walls == 2) R[5] = 1;

        if (not > 0) {
            R[4] = 1;
        } else if (free > 0)  {
            R[4] = 2;
        } else if (mobs > 0 && bosses < 1) {
            R[4] = 3;
        } else if (bosses > 0) R[4] = 4;

        return R;
    };

    //основной парсер всего
    this.parse = function(html) {
        var Cord = config.search('X=([0-9]+).+?Y=([0-9]+)', html);
        var noHeroic = config.search('(Тут собрались не все)', html);
        if (!noHeroic) {
            config.message('Тут собрались не все... либо среди вас нет ни одного героя...');
            config.set('settings.lab.heroic', false);
        }
        if (Cord[0] > 0 && Cord[1] > 0) {
            config.set('lab.cord', Cord);
            document.getElementById('cord').innerHTML = '[' + Cord.join('/') + ']';
            if (html.indexOf('>Не так быстро') > -1) {
                config.set('lab.step', +new Date() + 1500);
                this.mess('Не так быстро...');
                this.step = false;
            } else if (html.indexOf('>Стена..') > -1) {
                this.mess('Стена...');
                config.set('lab.route',[]);
            }
        } else {
            console.error('bad coordinates!');
            document.getElementById('cord').innerHTML = '[&infin;/&infin;]';
            window.location.href = '/main.php?battlefromlab=1';
            return false;
        }

        //this.mess('Парсим инфу...', 'rgb(162, 162, 241)');
        this.parseUser(html);
        //this.mess('Парсим предметы...', 'rgb(162, 162, 241)');
        this.parseItems(html);
        //this.mess('Парсим карту...', 'rgb(162, 162, 241)');
        this.parseMap(html);
        //this.mess('Рисуем путь...', 'rgb(162, 162, 241)');
        this.drawRoute();
        //this.mess('Пишем логи...', 'rgb(162, 162, 241)');
        return true;
    };
    //используем бутеры и доты
    this.use = function(name, message, callback) {
        var count = +config.get('lab.cures.' + name, 0);
        if (count < 1) {
            if (message) alert('Нет в наличии');
        } else if (!callback) {
            if (config.useBut(name)) {
                count--;
                config.set('lab.cures.' + name, count);
                this.setLog('Использован ' + name + '[' + count + ']');
                document.getElementById(name).innerHTML = count;
                return true;
            }
        } else {
            return config.useBut(name, function(ok) {
                callback(ok);
            });
        }
        return false;
    };
    //первичная загрузка данных. бутеры доты ключи и пр.
    this.loadItems = function(callback) {
        config.parseInv(2, function(List) {
        if (List['loaded']) {
            config.set('lab.loaded', true);
    
            config.set('lab.cures.but', config.Counts['but']);
            document.getElementById('but').innerHTML = config.Counts['but'];
            var ids = {
                'dot':'Антидот','dot2':'Большой Антидот','key1':'Ключ №1','key2':'Ключ №2','key3':'Ключ №3','key4':'Ключ №4','key666':'Ключ №666'
            };
            for (var id in ids) {
                var name = ids[id];
                var count = List['counts'][name] ? +List['counts'][name] : 0;
                document.getElementById(id).innerHTML = count;
                config.set('lab.cures.' + id, count);
            }
        }
        List = null;
        if (callback) callback();
		                                                                                
        });
    };
    //основная загрузка данных. масса, свитки, слоты магии, одетые вещи и т.п.
    this.loadScrolls = function(callback) {
        //пишем данные
        config.set('lab.cures.but', config.Counts['but']);
        config.set('lab.cures.dot', config.Counts['dot']);
        config.set('lab.cures.dot2', config.Counts['dot2']);
        var ids = ['but', 'dot','dot2','key1','key2','key3','key4','key666'];
        for (var i in ids) {
            var id = ids[i];
            document.getElementById(id).innerHTML = config.get('lab.cures.' + id);
        }

        var This = this;
        this.broadcast('/main.php?edit=1&razdel=1&all=1', function(html) {
            var List = {'counts':{}, 'netto': [], 'slots': [0,0,0], 'inserts': [], 'loaded': false};
            if (html && html.indexOf('(Вес:') > -1) {
                html = html.replace(/(\n|\r|\t)/g, '');

                //вес
                var Netto = config.search('Вес: ([0-9\.]+)\/([0-9\.]+)', html);
                var color = (+Netto[1] - +Netto[0] < 26 ? 'red' : 'green');
                document.getElementById('netto').style.color = color;
                document.getElementById('netto').innerHTML = '[' + Netto[0] + '/' + Netto[1] + ']';

                //слоты магии
                var Slots = config.searchAll('\'Пустой слот ([^\']+)\'',html), magicFreeSlots = 0, itemsFreeSlots = 0;
                for (var slot in Slots) {
                    if (Slots[slot] == 'магия') { magicFreeSlots++; } else { itemsFreeSlots++; }
                }
                //проверяем одеты ли мы
                var needDressSlots = +config.get('settings.lab.stopifundress', 0);
                if (config.get('lab.dealersell') < 1 && itemsFreeSlots > 0 && needDressSlots > 0 && itemsFreeSlots >= needDressSlots) {
                    if (config.get('settings.lab.start')) {
                        if (config.get('settings.lab.dressifundress')) {
                            config.dressSet('laba-tmp', function(dressed) {
                                config.message('У вас снято ' + itemsFreeSlots + '/' + needDressSlots + ' вещей. Комплект одет[' + dressed + '].', 'Фикс');
                            });
                        } else {
                            config.message('Автобот остановлен. Причина: у вас снято ' + itemsFreeSlots + '/' + needDressSlots + ' вещей.', 'Автолаба');
                            config.set('settings.lab.start', false);
                        }
                        window.location.href = '/main.php?battlefromlab=1';
                        return;
                    }
                }

                if (config.get('lab.dealersell') < 2 && config.get('settings.lab.attack.2.0') && magicFreeSlots > 0) {
                    var data = config.search('<table[^>]+>\\s*\\[\\s*<a[^>]+>\\s*страницы\\s*<\\/a>\\s*\\](.+?)<\\/table>\\s*<\\/td>\\s*<\\/form>', html);
                    var Items = config.searchAll('<tr[^>]+>\\s*<td[^>]+>.+?pocket=(?:1|2)&item=([0-9]+).+?(?:<\\/td>)?\\s*<td[^>]+>\\s*<a[^>]+>([^<]+)<\\/a>.+?<b>Цена: ([0-9\\.]+) (екр|кр).*?<\\/b>\\s*.+?<BR>\\s*Долговечность: ([0-9]+)\\/([0-9]+)\\s*<br>(.+?)<\\/td>\\s*<\\/tr>', data);
                    //[id, name, price, ptype, min, max, chance, html[d.m.y]], count?!
                    for (var item in Items) {
                        var name = Items[item][1];
                        if (!name || name == undefined) continue;

                        var dmy = 99999999, id = Items[item][0], price = (+Items[item][2] * (Items[item][3] == 'кр' ? 1 : 1.5));
                        var min = +Items[item][4], max = +Items[item][5], elapsed = max - min;

                        if (name == 'Антидот' && max == 10) {
                            name = 'Большой Антидот';
                        }
                        var other = Items[item][6];
                        var edate = config.search('Срок годности: (?:[0-9]+) дн\\. \\(до ([0-9]+)\\.([0-9]+)\\.([0-9]+)', other);
                        if (edate && edate.length > 0) {
                            dmy = (edate[0] > 9 ? edate[0] : '0' + edate[0]) + '' + (edate[1] > 9 ? edate[1] : '0' + edate[1]) + '' + edate[2];
                        }
                        var InsItem = [id, price, min, max, elapsed, dmy];
                        if (!List[name]) {
                            List[name] = [InsItem];
                            List['counts'][name] = elapsed;
                        } else {
                            List[name].push(InsItem);
                            List['counts'][name] += elapsed;
                        }
                    }

                    var cureSlots = config.searchAll('Снять <b>Восстановление энергии ([0-9]+)HP<\/b><br>Прочность ([0-9]+)\/([0-9]+)',html);
                    var subHP = 0;
                    for (var c in cureSlots) {
                        subHP += Math.ceil(cureSlots[c][0] * (cureSlots[c][2] - cureSlots[c][1]));
                    }
                    var heals = ['Малый свиток «Восстановление 90HP»', 'Большой свиток «Восстановление 180HP»'], ctypes = [90,180];
                    for (var h in heals) {
                        var heal = heals[h], hp = ctypes[h];
                        if (List['counts'][heal]) {
                            for (var cure in List[heal]) {
                                if (magicFreeSlots < 1) break;
                                var scroll = List[heal][cure];
                                // if (+scroll[1] == 5 || +scroll[1] == 4.5 || (hp == 180  && +scroll[3] < 5)) continue;
                                magicFreeSlots--;
                                subHP += Math.ceil(hp * +scroll[4]);
                                This.setLog('одел хилку ' + hp);
                                This.broadcast('/main.php?edit=1&dress=' + scroll[0]);
                            }
                        }
                    }
                    config.set('lab.cures.hp', subHP);
                }
            } else {
                console.error('bad parse inventory!!!');
            }
            List = null;
            if (callback) callback();

        }, 'ssave=1&rzd0=0&rzd1=0&rzd2=0&rzd3=0');
    };

    //HP, квесты, ловушки
    this.parseUser = function(html) {

        var hp = config.search('([0-9]+)\\s*\\/\\s*([0-9]+)\\s*(<\\/span>|<\\/div>)', html);
        hp = [+hp[0], +hp[1], Math.ceil(hp[0] / (hp[1] / 100))];
        if (hp[1] > 0) {
            config.set('user.hp', hp);
            config.title();
            var color = hp[2] >= 61 ? 'green' : (hp[2] >= 31 ? 'yellow' : 'red');
            var subHP = +config.get('lab.cures.hp');
            document.getElementById('HPinfo').className = color;
            document.getElementById('HPinfo').innerHTML = '[' + hp[0] + '/' + hp[1] + '][' + hp[2] + '%]';
            document.getElementById('HPcure').innerHTML = '+' + subHP + 'HP';
        } else {
            document.getElementById('HPinfo').innerHTML = '[ошибка]';
        }
        var quest = config.search('<b>Ваше задание:(.+?):([0-9]+)\/([0-9]+).+?([0-9]+)\/([0-9]+).+?([0-9]+)\/([0-9]+).+([0-9]+)\/([0-9]+).+?<html>',html);
        if (!quest || quest.length < 1 || (quest.length > 0 && quest[4] == undefined)) {
            quest = config.search('<b>Ваше задание:(.+?):([0-9]+)\/([0-9]+).+?<html>',html);
        }

        if (quest && quest.length > 0) {
            var qnow = 0, qmax = 0, qname = quest[0];
            for (var n = quest.length - 1;n > 1;n -= 2) {
                if (quest[n] == undefined) continue;
                qnow += Math.ceil(quest[n - 1]);
                qmax += Math.ceil(quest[n]);
            }
            var myquest = [qname,qnow,qmax];
            if (!config.eq('lab.quest',myquest)) {
                config.set('lab.quest',myquest);
                var QL = qname.toLowerCase();
                if (config.get('settings.lab.leavequest')) {
                    for (var i in this.Quests) {
                        var NL = i.toLowerCase();
                        if (QL.indexOf(NL) > -1) {
                            if (this.Quests[i] <= qnow && !config.get('settings.lab.leave')) {
                                config.set('settings.lab.leave', true);
                                config.message('Пропуск пустых путей включён. Причина: квест на сбор ресурсов закончен.', 'Автолаба');
                                break;
                            } else if (this.Quests[i] > qnow && config.get('settings.lab.leave')) {
                                config.set('settings.lab.leave', false);
                                config.message('Пропуск пустых путей выключен. Причина: квест на сбор ресурсов', 'Автолаба');
                                break;
                            }
                        }
                    }
                }
            }
            document.getElementById('quest').innerHTML = '[' + qname + '][' + qnow + '/' + qmax + ']';
        } else {
            document.getElementById('quest').innerHTML = 'Квест не взят';
        }
        var died = config.search('<b>([0-9]+) из ([0-9]+)-х<\/b>',html);
        if (died && died.length > 0 && document.getElementById('died')) {
            document.getElementById('died').innerHTML = '' + died[0] + ' из ' + died[1] + ' раз';
            document.getElementById('died').style['color'] = (died[1] - died[0] < 2 ? '#FF0000' : '#004000');
        }

        var dottime = config.get('settings.lab.antidot.0', 0);
        var dotstat = config.get('settings.lab.antidot.1', false);
        var dottype = config.get('lab.cures.dot') > 0 ? 'dot' : (config.get('lab.cures.dot2') > 0 ? 'dot2' : false);
        for (var name in this.Traps) {
            var ok = config.search(this.Traps[name],html);
            if (ok && ok.length > 1) {
                document.getElementById('trap' + name).innerHTML = ok[2] + ' мин.';
                //нет дотов
                if (!dottype) continue;
                //лова на переход
                if (name == 'time') {
                    this.trap = true;
                    if (dottime > 0 && +ok[2] > dottime) {
                        this.use(dottype);
                    }
                    continue;
                }
                //лова на статы
                if (name == 'stat' && dotstat) {
                    this.use(dottype, false, function(used) {
                        config.dressSet('laba-tmp', function(dressed) {
                            config.message('Использован антидот[' + used + ']. Комплект одет[' + dressed + '].', 'Ловушка на статы');
                        });
                    });
                }
            } else {
                document.getElementById('trap' + name).innerHTML = '0 мин.';
                if (name == 'time') this.trap = false;
            }
        }
    };
    //проверка надобности открытия двери
    this.openDoors = function(el) {
        var name = el[0], num = +el[4] > -1 ? +el[4] : +el[1], Cures = config.get('lab.cures');
        var id = 'key' + num;

        if (!Cures[id] || Cures[id] < 1) return false;
        if (num == 666 && !config.get('settings.lab.use666')) return false;

        var Cord = config.get('lab.cord'), Directs = this.Directs, Map = config.get('lab.map');
        var x = 0, y = 0, direct = -1, xy = '1-1', allKeys = 0, dtype = 0, cx = Cord[0], cy = Cord[1];

        for (var i in Directs) {
            x = cx + Directs[i][0], y = cy + Directs[i][1], xy = x + '-' + y, knum = Map[xy]['num'], kname = Map[xy]['name'];
            if (kname != 'door') continue;
            if (id == 'key666') {
                allKeys = +Cures['key666'];
                dtype = 666;
            } else {
                allKeys = +Cures['key' + knum];
                dtype = knum;
            }
            if (allKeys < 1 || dtype != num) {
                continue;
            }
            direct = i;
        }
        if (direct < 0) return false;

        var px = +Directs[direct][0] * 2, py = +Directs[direct][1] * 2;
        var oxy = (cx + px) + '-' + (cy + py);
        var odoor = Map[oxy]['name'], oname = Map[oxy]['title'];
        var openit = false;
        var context = config.get('settings.lab.opendoors');
        for (var i in context) {
            var count = Math.ceil(context[i][1]);
            if (count < 1 || count > allKeys) continue;
            if (
            (i == 0 && oname != 'Ящик Пандоры' && oname != 'Живая Вода' && odoor != 'mob' && odoor != 'boss')            ||
            (i == 1 && odoor == 'mob')            ||
            (i == 2 && oname == 'Ящик Пандоры')            ||
            (i == 3 && oname == 'Живая Вода')            ||
            (i > 3 && odoor == 'boss' && oname == context[i][0])
            ) {
                openit = true;
                break;
            }
        }
        if (openit) {
            config.set('lab.map.' + xy + '.name', 'way');
            if (config.eq('settings.lab.start',true)) {
                config.set('lab.route',[]);
                this.setLog('Дверь №' + num + ' [' + oname + ']');
            }
            return true;
        }
        return false;
    };

    //на этой локации находится...
    this.parseItems = function(html) {
        document.getElementById('info').innerHTML = '';

        var RaiseItems = config.searchAll('\\?(openbox|sunduk|keybox|hill|getitem)=([0-9]+|get)\'?"?><img.+?alt="?\'?([^\'"]+)"?\'?',html);
        var This = this;
        this.NoGetItems = 0;
        var OpenDoor = config.searchAll('У Вас нет подходящего Ключа №([0-9]+)',html);
        if (OpenDoor.length > 0) {
            for (var d in OpenDoor) {
                var door = OpenDoor[d];
                RaiseItems.push(['door',door,'Ключ №' + door,'ключа нет']);
            }
        }
        OpenDoor = config.searchAll('useitem=\'?"?([0-9]+)\'?"?>.+?alt=\'?"?Использовать Ключ №([0-9]+)\'?"?',html);
        if (OpenDoor.length > 0) {
            for (var d in OpenDoor) {
                var door = OpenDoor[d];
                RaiseItems.push(['door',door[0],'Ключ №' + door[1],'открыть',door[1]]);
            }
        }
        if (html.indexOf('?talk=73') > -1 || html.indexOf('?talk=75') > -1) {
            var Dealer = config.get('lab.dealer');
            if (!Dealer || Dealer[0] < 1) {
                this.setLog('Нашёл бомжа, кусается', 'navy');
                var Cord = config.get('lab.cord');
                config.set('lab.dealer', Cord);
            }

            RaiseItems.push(['talk',(config.get('lab.size') < 26 ? 73 : 75),'Старьевщик','говорить']);
        }
        if (html.indexOf('name="exit_good"') > -1 || html.indexOf('name=exit_good') > -1) {
            RaiseItems.push(['exit',true,'Выход из лабы','выйти']);
        }
        if (html.indexOf('name="gotolab2"') > -1 || html.indexOf('name=gotolab2') > -1) {
            RaiseItems.push(['heroic',true,'Переход в героик','переход']);
        }
        this.Items = RaiseItems.length;

        for (var i in RaiseItems) {
            var item = RaiseItems[i];
            item[3] = item[3] ? item[3] : 'сбор';
            var cl = item[0] != 'door' ? item[0] : item[0] + item[1];
            var uniqueid = item[0] == 'talk' ? item[0] : item[0] + '-' + Math.ceil(Math.random() * 100000);
            var newDiv = document.createElement('div');
            if (item[4]) newDiv.setAttribute('param2', item[4]);
            newDiv.setAttribute('id', uniqueid);
            newDiv.setAttribute('name', item[0]);
            newDiv.setAttribute('param', item[1]);
            newDiv.setAttribute('title', item[2]);
            newDiv.className = 'item ' + cl;
            newDiv.innerHTML = item[2] + ' <u>' + item[3] + '</u>';
            newDiv.onclick = function() {
                var id = this.id;
                lab.getItem(id, true);
            };
            document.getElementById('info').appendChild(newDiv);

            if (
            (item[0] == 'door' && this.openDoors(item))            ||
            (item[0] == 'sunduk' && config.get('settings.lab.autodrop.2'))            ||
            (item[0] == 'hill' && this.needCure())            ||
            (item[0] != 'talk' && item[0] != 'door' && item[0] != 'exit' && item[0] != 'heroic' && item[0] != 'hill' && config.get('settings.lab.autodrop.0'))
            ) {
                this.getItem(uniqueid, false);
            } else if (item[0] == 'talk' && (config.get('settings.lab.sellfigures') || config.get('settings.lab.sellcheque') || config.get('settings.lab.sellarts') || config.get('settings.lab.sellcharms2') || config.get('settings.lab.sellcharms3'))) {
                this.getItem(uniqueid, false);
            } else if (item[0] != 'talk' && item[0] != 'door' && item[0] != 'exit' && item[0] != 'heroic' && item[0] != 'hill' && !config.get('settings.lab.autodrop.0')) {
                this.NoGetItems++;
                this.Items--;
            } else {
                this.Items--;
            }
        }

    };

    //поднимаем предмет
    this.getItem = function(elid, manual) {
        var el = document.getElementById(elid);
        if (!el || el.getAttribute('disabled')) {
            return false;
        }
        el.className = el.className + ' load';
        el.setAttribute('disabled', 'disabled');

        var name = el.getAttribute('name'), param = el.getAttribute('param'), title = el.getAttribute('title'), Result = false;
        name = name == 'door' ? 'useitem' : name;
        if (name == 'talk') {
            if (manual) {
                window.location.href = config.get('lab.url') + '?talk=' + (config.get('lab.size') < 26 ? 73 : 75);
            } else {
                this.talkDealer();
            }
            return false;
        } else if (name == 'exit' || name == 'heroic') {
            if (confirm('Уверены?')) {
                this.crossWalks(name);
            }
            return false;
        } else if (name == 'hill') {
            var This = this, url = config.get('lab.url');
            this.broadcast(url + '?hill=1&rnd=' + Math.random(), function(data) {
                if (data) {
                    var ok = config.search('(Уровень жизни) \\+([0-9]{1,3})%', data);
                    if (ok && ok.length > 1) {
                        This.setLog('Нахилялись хилкой (' + This.Items + ')!');
                        if (config.eq('settings.lab.start',true)) {
                            config.set('lab.route',[]);
                        }
                    }
                }
                This.Items--;
                if (This.Items < 1) This.go(false, '+');
            });
            el.remove();
            return;
        }
        var This = this, url = config.get('lab.url');
        this.broadcast(url + '?' + name + '=' + param + '&rnd=' + Math.random(), function(data) {
            if (data) {
                var expr = {
                    'getitem': '<font color="?\'?red"?\'?>(Вы подняли )?"([^"]+)"',
                    'openbox': 'открыла? (Ящик Пандоры)\\.\\.\\.(?:<i>а там )?(ничего)?',
                    'sunduk': '<i>\s?\s?(.+?)\s?\s?"([^"]+)"',
                    'keybox': '(открыла?) (Ларец)',
                    'useitem': 'Вы (открыли) (дверь)',
                };
                var regexp = expr[name] ? expr[name] : '??';
                var ok = config.search(regexp, data);
                if (ok && ok.length > 1) {
                    var saction = ok[0];
                    var sname = ok[1];
                    if (typeof(sname) != 'string') {
                        sname = 'предмет';
                    }
                    if (sname == 'ничего') {
                        sname =  'ловушка';
                    }

                    if (name == 'sunduk') {
                        var Sets = config.get('settings.lab.dress');
                        This.mess(sname, 'green');
                        var dressit = false;
                        for (var setart in Sets) {
                            if (!Sets[setart]) continue;
                            var optart = This.ArtsList[setart];
                            if (optart == sname) {
                                dressit = true;
                                This.dressItem(sname);
                                break;
                            }
                        }
                        //если ничего не одеваем, проверяем надо ли выбрасывать.
                        if (!dressit) {
                            This.Items--;
                            This.dropItems();
                        }
                    } else {
                        This.Items--;
                    }

                    //config.set('lab.cures.'+id, count);
                    if (sname.indexOf('Ключ №') > -1) {
                        var knum = sname.match(/([0-9]+)/i);
                        var kid = 'key' + knum[1];
                        var count = config.get('lab.cures.' + kid);  count++;
                        config.set('lab.cures.' + kid, count);
                        document.getElementById(kid).innerHTML = count;
                        console.debug('Подняли ключ ' + kid + ' => ' + count);

                        This.setLog('Взял ключ №' + knum[1] + '');
                    } else if (sname.indexOf('Антидот') > -1) {
                        var count = config.get('lab.cures.dot'); count++;
                        config.set('lab.cures.dot', count);
                        document.getElementById('dot').innerHTML = count;
                        console.debug('Подняли антидот => ' + count);

                        This.setLog(sname, '#804000');
                    } else if (sname.indexOf('дверь') > -1) {
                        var num = el.getAttribute('param2'),
                            rnum = el.getAttribute('param');
                        var kid = 'key' + num;
                        var count = config.get('lab.cures.' + kid);  count--;
                        config.set('lab.cures.' + kid, count);
                        document.getElementById(kid).innerHTML = count;

                        This.setLog('Открыл дверь №' + rnum + '(' + num + ')');
                    } else if (sname.indexOf('Завтрак') > -1 || sname.indexOf('Бутерброд') > -1) {
                        This.setLog(sname, '#804000');
                        This.loadItems(function() {
                            if (This.Items < 1) {
                                This.go(false, 'ᴕ');
                            }
                        });
                        el.remove();
                        return;
                    } else if (sname.indexOf('Восстановление энергии') > -1) {
                        This.setLog(sname, '#004000');
                        This.loadScrolls(function() {
                            if (This.Items < 1) {
                                This.go(false, 'ᴥ');
                            }
                        });
                        el.remove();
                        return;
                    } else if (sname.indexOf('Чек') > -1 || sname.indexOf('Осколок') > -1 || sname.indexOf('Чарования') > -1) {
                        This.setLog('$[' + sname + ']', '#400080');
                    } else {
                        This.setLog('[' + sname + ']');
                    }
                    el.remove();
                } else {
                    el.className = el.className.replace(' load', '');
                    el.removeAttribute('disabled');
                    This.Items--;
                    if (data.indexOf('Недостаточно места в рюкзаке') > -1) {
                        This.setLog('Перегруз! Автосбор отключается.', 'red');
                        config.set('settings.lab.autodrop.0', false);
                        config.set('settings.lab.autodrop.2', true);
                        config.set('lab.maxweight',true);
                    } else if (data.indexOf('Кто не успел') > -1 || data.indexOf('этот Факел') > -1) {
                                            //test
                    } else {
                        This.setLog('Ошибка сбора ' + name + '[' + param + ']', 'red');
                        //console.error(data);
                    }
                }
            } else {
                el.className = el.className.replace(' load', '');
                el.removeAttribute('disabled');
                This.Items--;
            }
            if (This.Items < 1) {
                This.go(false, '◄');
            }
        });
    };

    //говорим с барыгой
    this.talkDealer = function() {
        if (this.InParse) return;
        this.DItems = 0, this.InParse = true;

        document.getElementById('dtitle').innerHTML = 'Бомж-барыга: автопродажа';
        document.getElementById('dtext').innerHTML = 'Поиск хлама на продажу...';
        document.getElementById('dealer').style['display'] = 'block';

        var start = config.get('lab.size') < 26 ? 1 : 0;

        //фикс разговора с барыгой перед выходом
        if (config.get('lab.dealersell') == 1) {
            if (config.get('settings.lab.dealerundress')) {
                var This = this;
                config.undressAll(function() {
                    config.set('lab.dealersell', 2);
                    This.dealerQuery(start);
                });
                return;
            }
            config.set('lab.dealersell',2);
        }
        this.dealerQuery(start);
    };
    //парсим поэтапно барыгу
    this.dealerQuery = function(now) {
        var nowItem = this.DealerItems[now], next = now + 1;

        var This = this, talk = config.get('lab.size') < 26 ? 73 : 75, dial = +nowItem[0], parts = +nowItem[3], url = config.get('lab.url');

        this.broadcast(url + '?talk=' + talk + '&dial=' + dial + '&stupidcache=' + Math.random(), function(data) {
            if (!data) data = 's';
            var parseItem = config.searchAll(nowItem[1], data);
            var count = Math.floor(parseItem.length / parts);

            var newDiv = document.createElement('div');
            newDiv.className = 'cheque';
            newDiv.innerHTML = '&laquo;' + nowItem[2] + '&raquo; [' + (count > 0 ? '<b style=\'color:red\'>' + count + '</b>' : count) + ']';
            document.getElementById('dtext').appendChild(newDiv);
            newDiv = null;

            if (parseItem.length > 0) {
                for (var i in parseItem) {
                    var start = i * parts, end = start + parts;
                    if (end > parseItem.length) break;
                    var id = parseItem[i], title = nowItem[2];
                    if (parts > 1) {
                        id = parseItem.slice(start, end).join(',');
                    } else if (typeof(id) == 'object') {
                        id = parseItem[i][0];
                        title = nowItem[2] + ' ' + parseItem[i][1];
                    }
                    var el = {'id':id, 'dial':dial, 'parts':parts, 'title': title};
                    This.DealerGoods[now].push(el);
                    el = null;
                }
            }
            if (typeof(This.DealerItems[next]) == 'object') {
                setTimeout(function() {
                    This.dealerQuery(next);
                }, 300);
            } else {

                document.getElementById('dtext').innerHTML = 'Торгуемся...';
                var goods = 0, selled = 0;
                for (var g in This.DealerGoods) {
                    if (This.DealerGoods[g].length < 1) continue;
                    for (var item in This.DealerGoods[g]) {
                        var el = This.DealerGoods[g][item];
                        goods++;
                        if (
                        (config.get('settings.lab.sellfigures') && el['dial'] > 15550 && el['dial'] < 15559)                        ||
                        (config.get('settings.lab.sellcharms2') && el['dial'] == 56662)                        ||
                        (config.get('settings.lab.sellcharms3') && el['dial'] == 56663)                        ||
                        (config.get('settings.lab.sellcheque') && el['dial'] == 2)                        ||
                        (config.get('settings.lab.sellarts') && el['dial'] == 1)
                        ) {
                            This.dealerSell(el, (This.DItems * 500));
                            This.DItems++; selled++;
                        }
                        el = null;
                    }
                    This.DealerGoods[g] = [];
                }
                if (selled < 1) {
                    This.setLog('Же не манж па сис жур! [' + goods + '/' + selled + ']', 'red');
                    document.getElementById('dtext').innerHTML = '0_о';
                    This.closeDealer('no selled goods');
                }
            }
        });
    };
    //закрываем барыгу
    this.closeDealer = function(reason) {
        console.debug('Rs:' + reason + '|Gd:' + this.DItems + '|Pr:' + this.InParse + '|It:' + this.Items);
        this.InParse = false;
        var el = document.getElementById('talk');
        if (el) {
            el.removeAttribute('disabled');
            el.className = el.className.replace(' load', '');
        }

        document.getElementById('dealer').style['display'] = 'none';
        if (this.Items > 0) {
            this.Items--;
            this.router('close dealer');
        }
    };
    //продажа барыге
    this.dealerSell = function(el, time) {
        var name = el['title'], This = this;
        document.getElementById('dtext').innerHTML = document.getElementById('dtext').innerHTML + '<br>Мутим... ' + name;
        console.debug('(' + time + '/' + (+new Date()) + ')');

        setTimeout(function() {
            var dial = el['dial'], id = el['id'], parts = el['parts'], url = config.get('lab.url'), talk = config.get('lab.size') < 26 ? 73 : 75;
            if (parts > 1) {
                var send = 'talk=' + talk + '&dial=' + dial + '&kol=' + parts + '&sendscroll=%CE%E1%EC%E5%ED%FF%F2%FC';
                var ids = id.split(',');
                for (var i in ids) {	send += '&scrol[' + ids[i] + ']=1';	}

                console.debug('sell2: [' + url + '?talk=' + talk + '&dial=' + dial + '](' + time + '/' + (+new Date()) + ')');
                console.debug(send);

                This.broadcast(url + '?talk=' + talk + '&dial=' + dial, function(data) {
                    This.DItems--;
                    if (data.indexOf('Удачный обмен')) {
                        This.setLog('Собрано ' + name + '', 'navy');
                    } else {
                        This.setLog('Ошибка сборки ' + name + '', 'red');
                    }
                    if (This.DItems < 1) This.closeDealer('dealerSellStatue');
                }, send);

            } else {
                console.debug('sell: [' + url + '?talk=' + talk + '&dial=' + dial + '&sale=' + id + '](' + time + '/' + (+new Date()) + ')');
                This.broadcast(url + '?talk=' + talk + '&dial=' + dial + '&sale=' + id, function() {
                    This.setLog('Обмен ' + name + '', 'navy');
                    This.DItems--;
                    if (This.DItems < 1) This.closeDealer('dealerSell');
                });

            }
        }, time);
    };

    //переход в герыч, выход
    this.crossWalks = function(routename) {
        if (!routename) routename = 'exit';
        if (routename == 'leave') {
            var text = prompt('Хотите выйти и потерять все найденное? Введите слово `выход` без кавычек.', '');
            if (text != 'выход') return false;
        }
        var Routes = {
            'heroic': 'gotolab2=Перейти в Героический лабиринт!',
            'exit':   'exit_good=Выход!',
            'leave':  'exit=Выйти и потерять все найденное!'
        };
        try {
            if (routename == 'exit') {
                var nowtime = +new Date() / 1000;
                var labtime = (nowtime - Math.ceil(config.get('lab.starttime'))) / 3600;
                labtime = labtime < 10 ? labtime : 0;
                var mess = config.get('lab.maxweight') ? 'Внимание! У вас перегруз!!! ' : '';

                if (config.get('lab.size') < 26 && config.get('settings.lab.heroic') && config.get('settings.lab.set.2')) {
                    mess = 'Переход в Героик отменён. Причина: Артефактное оружие не найдено. Время похода: ' + labtime.toFixed(1) + ' ч.';
                } else if (config.get('lab.size') < 26) {
                    mess = 'Выход из лабы. Время похода: ' + labtime.toFixed(1) + ' ч.';
                } else {
                    var traps = 0, freeways = 0, doors = 0, Map = config.get('lab.map');

                    for (var xy in Map) {
                        var x = Map[xy]['x'], y = Map[xy]['y'], name = Map[xy]['name'], type = Map[xy]['type'];
                        if (name == 'trap') traps++;
                        if (type == 4 || type == 5) freeways++;
                        if (name == 'door') doors++;
                    }
                    var heroictime = (nowtime - Math.ceil(config.get('lab.startheroic'))) / 3600;
                    var freewaystimemin = Math.ceil(((doors + freeways) * 1.5) / 60);
                    var freewaystimemax = Math.ceil(((doors + freeways) * 6) / 60);
                    mess = 'Выход из лабы. Героик: Ловушек пропущено ' + traps + '. ' +
                    'Комнат пропущено: ' + freeways + ' (~' + freewaystimemin + '-' + freewaystimemax + ' мин). ' +
                    'Дверей не открыто: ' + doors + '. Время похода: Общее - ' + labtime.toFixed(1) + ' ч., Героик - ' + heroictime.toFixed(1) + ' ч.';
                    config.set('lastcall.eat', 0);
                }
                config.message(mess);
                if (config.get('settings.lab.setexit')) {
                    config.dressSet('plugin-pvp', function(status) {
                        if (!status) config.dressSet('plugin-pvp');
                    });
                }
                config.set('lab', {});
            }
            if (routename == 'heroic') {
                var nowtime = +new Date() / 1000;
                var labtime = (nowtime - Math.ceil(config.get('lab.starttime'))) / 3600;
                labtime = labtime < 10 ? labtime : 0;
                config.message('Обычная лаба закончена. Время - ' + labtime.toFixed(1) + ' ч.');
            }
        } catch (e) { }

        var url = config.get('lab.url');
        this.broadcast(url, function(ok) {
            window.location.href = '/main.php?r=3.14';
        }, Routes[routename]);
    };
    //одеванеи артов
    this.dressItem = function(art) {
        var This = this;
        this.broadcast('http://capitalcity.oldbk.com/main.php?edit=1&razdel=0&all=1', function(data) {
    		                                                                                if (data) {
        var items = config.searchAll(',\s?([0-9]+)\s?,\s?\'Снять <b>([^<]+)<\/b>',data);
        var drop = config.searchAll('edit=1&drop=([0-9]+)',data);
        var undress = false, nodress = false;
        for (var i in items) {
            var item = typeof(items[i]) == 'object' ? items[i][1] : items[i];
            if (item != '') {
                if (item == 'Кольцо Жизни' && art == 'Великое Кольцо Жизни') {
                    undress = drop[i];
                    break;
                }
                if (
                item == art ||
                (art == 'Кольцо Жизни' && item == 'Великое Кольцо Жизни') ||
                (art == 'Топор Вихря' && item == 'Дубинка Радости') ||
                (art == 'Закрытый шлем Развития' && item == 'Шлем Ангела') ||
                (art == 'Шлем Ангела' && item == 'Закрытый шлем Развития') ||
                (art == 'Щит Пророчества' && item == 'Щит Откровения') ||
                (art == 'Щит Откровения' && item == 'Щит Пророчества') ||
                (art == 'Панцирь Злости' && (item == 'Доспех Хаоса' || item == 'Броня Ангела' || item == 'Доспех -Броня Титанов-')) ||
                (art == 'Доспех Хаоса' && (item == 'Панцирь Злости' || item == 'Броня Ангела' || item == 'Доспех -Броня Титанов-')) ||
                (art == 'Броня Ангела' && (item == 'Доспех Хаоса' || item == 'Панцирь Злости' || item == 'Доспех -Броня Титанов-')) ||
                (art == 'Доспех -Броня Титанов-' && (item == 'Доспех Хаоса' || item == 'Броня Ангела' || item == 'Панцирь Злости'))
                ) {
                    nodress = true;
                    break;
                }
            }
        }
        if (!nodress) {
            items = config.searchAll('Предмет ([^!]{5,20}) будет утерян(.+?)destruct=([0-9]+)',data);
            for (var i in items) {
                var name = items[i][0], id = items[i][2];
                if (name != '' && name == art) {
                    if (undress) {
                        This.broadcast('http://capitalcity.oldbk.com/main.php?edit=1&drop=' + undress, function(data) {
                            This.broadcast('http://capitalcity.oldbk.com/main.php?edit=1&dress=' + id, function(data) {
                                if (art == 'Дубинка Радости' || art == 'Топор Вихря') config.set('lab.weapon',true);
                                This.setLog('Переодел [' + art + ']', '#804040');
                                config.saveSet('laba-tmp');
                                This.Items--;
                                if (This.Items < 1) {
                                    This.dropItems();
                                    This.go(false, '▼');
                                }
                            });
                        });
                        return;
                    } else {
                        This.broadcast('http://capitalcity.oldbk.com/main.php?edit=1&dress=' + id, function(data) {
                            if (art == 'Дубинка Радости' || art == 'Топор Вихря') config.set('lab.weapon',true);
                            config.saveSet('laba-tmp');
                            This.setLog('Одел [' + art + ']', '#804040');
                            This.Items--;
                            if (This.Items < 1) {
                                This.dropItems();
                                This.go(false, '▲');
                            }
                        });
                        return;
                    }
                }
            }
        }
    }
            This.Items--;
            if (This.Items < 1) {
                This.dropItems();
                This.go(false, '√');
            }
		                                                                                });
    };
    //сброс артов
    this.dropItems = function() {
        var Arts = config.get('settings.lab.artefacts');
        var ArtsList = [
            'Дубинка Радости','Меч Кромуса','Топор Вихря','Меч Героев',
            'Кольцо Жизни','Великое Кольцо Жизни','Щит Пророчества','Щит Откровения',
            'Панцирь Злости','Доспех Хаоса','Броня Ангела','Доспех -Броня Титанов-',
            'Закрытый шлем Развития','Шлем Ангела','Лучшие Ботинки'
        ];
        var AList = '';
        for (var art in Arts) {
            if (!Arts[art]) continue;
            AList += ArtsList[art] + ',';
        }
        if (AList == '') return false;

        var This = this;
        this.broadcast('http://capitalcity.oldbk.com/main.php?edit=1&razdel=0&all=1', function(data) {
            data = data.replace(/(\n|\r|\t)/g, '');
            var items = config.search('Рюкзак \\(Вес(.*)<\\/table>', data);
            if (typeof(items) != 'string') return;
            items = config.searchAll('<tr[^>]+>(.+?)<\\/tr>', items);
            for (var i in items) {
                if (items[i].indexOf('Предмет пропадет после выхода из Лабиринта') < 0) continue;
                var item = items[i].match(/Предмет (.+?) будет утерян(.+?)destruct=([0-9]+)/i);
                if (item && item.length > 0 && AList.indexOf(item[1] + ',') > -1) {
                    This.broadcast('http://capitalcity.oldbk.com/main.php?edit=1&destruct=' + item[3], function(data) {
                        var droped = config.search('<font[^>]+><b>Предмет "([^"]+)" выброшен', data);
                        This.setLog('Выбросил [' + droped + ']', '#804040');
                    });
                }
            }
        });
    };

    //парсим карту
    this.parseMap = function(html) {
        html = html.replace(/(\n|\r|\t)/g, '');
        var me = 0;

        var mapData = config.search('<td width="165" height="165">(.+?)<\\/td>',html);
        html = null;

        var cells = config.searchAll('<img src="?http:\\/\\/i.oldbk.com\\/llabb\\/([^\.]+).gif"?[^">]*"?([^">]+)?"?[^>]*>', mapData);
        for (var i in cells) {
            if (cells[i][0] == 'u' || cells[i][0] == 'u2') {
                me = i;
                break;
            }
        }
        var Map = config.get('lab.map'), VMap = config.get('lab.vmap'), VmMap = config.get('lab.vmmap'), Cord = config.get('lab.cord'),
            LeaveDoor = config.get('settings.lab.leavedoor'), LeaveHeal = config.get('settings.lab.leaveheal'), Leave = config.get('settings.lab.leave'),
            size = config.get('lab.size', 25), Exit = config.get('lab.exit', []), Dealer = config.get('lab.dealer', []);

        //console.debug('redraw 5');
        var px = Math.floor(me / 11), py = (me - (px * 11)), px = Cord[0] - px, py = Cord[1] - py;
        for (var i in cells) {
            var sx = Math.floor(i / 11), sy = (i - (sx * 11)), x = px + sx, y = py + sy, xy = x + '-' + y;

            if (x < 1 || y < 1) continue;

            var img = cells[i][0], title = cells[i][1] != undefined ? cells[i][1] : '', name = is(img),
                cl = (name == 'me' ? 'was' : 'not'), num = 0, type = (name == 'me' ? 2 : 1);
            if (name == 'exit') {
                config.set('lab.exit',[x,y]);
                Exit = [x,y];
            }
            if (name == 'door') {
                num = img == 'x' ? 3 : (img == 'z' ? 2 : (img == 'c' ? 4 : 1));
            }
            if (name == 'keybox') {
                num = img == 'y2' ? 3 : (img == 'w2' ? 2 : (img == 'k2' ? 4 : 1));
            }

            if (VMap[y][x] > 0 && name != 'door' && name != 'wall' && name != 'goup' && name != 'godown') {
                VMap[y][x] = 0;
            }
            if (VmMap[y][x] > 0 && name != 'door' && name != 'wall' && name != 'goup' && name != 'godown' && name != 'mob' && name != 'boss') {
                VmMap[y][x] = 0;
            }
            if (VMap[y][x] == 0 && (name == 'goup' || name == 'godown')) {
                VMap[y][x] = 1;
            }
            if (VmMap[y][x] == 0 && (name == 'goup' || name == 'godown' || name == 'trap')) {
                VmMap[y][x] = 1;
            }

            if (Map[xy]['type'] < 1) {
                Map[xy] = {'x': x, 'y': y, 'img': img, 'type': type, 'title': title, 'name': name, 'class': cl, 'num': num};
            } else {
                type = Map[xy]['type'], cl = Map[xy]['class'];
                if (name == 'me') {
                    if (Cord[0] == x && Cord[1] == y) {
                        Map[xy]['type'] = 2;
                        Map[xy]['class'] = 'was';
                        cl = 'me', type = 2;
                    } else {
                        Map[xy]['name'] = 'way';
                        Map[xy]['img'] = 'o2';
                    }
                } else {
                    Map[xy]['name'] = name;
                    Map[xy]['img'] = img;
                }
                Map[xy]['title'] = title;
                Map[xy]['num'] = num;
            }
            if (size > 25 && Dealer && Dealer[0] == x && Dealer[1] == y) {
                cl += ' dealer';
            } else if (name != 'me') {
                if (name == 'door') {
                    title += ' №' + num;
                    cl += ' door' + img;
                }
                if (name == 'keybox') {
                    title += ' №' + num;
                    cl += ' key' + img;
                }
                if (name == 'boss') {
                    cl += ' ' + this.Bosses[title];
                }
            }
            var el = document.getElementById(xy);
            var lc = el.className.replace('router', '').trim();
            var ln = el.getAttribute('name');
            if (el && ('!' + lc != '!' + cl || '!' + name != '!' + ln)) {
                //console.debug('Отрисовка локации ['+xy+'] '+lc+' != '+cl+' || '+name+' != '+ln);
                el.setAttribute('name', name);
                el.setAttribute('class', cl);
                el.setAttribute('type', type);
                el.setAttribute('title', '[' + xy + '] ' + title);
            }
        }

        for (var xy in Map) {
            var cell = Map[xy], x = cell['x'], y = cell['y'];
            if (x > size - 1 || x < 2) continue;

            var name = cell['name'], type = +cell['type'];

            //тупики, ловушки
            if (type < 1 || type > 3 || (name == 'heal' && !LeaveHeal) || (name != 'heal' && name != 'way' && name != 'trap')) {
                continue;
            }
            var env = this.cellInfo(x,y);
            if (Leave && (env[4] == 1 || env[4] == 2)) {
                var R = [];
                if (env[5] == 2 || (LeaveDoor && env[6])) {
                    R = this.drawDeadLocks(x,y);
                } else if (env[5] == 0) {
                    var ways = 0;
                    for (var c = 3;c > -1;c--) {
                        if (env[c][2] == 'way' && env[c][3] == 1) ways++;
                    }
                    if (ways == 1) {
                        R = this.drawAltWays(x,y);
                    }
                }
                for (var l in R) {
                    var rxy = R[l];
                    if (!Map[rxy]) continue;
                    var rtype = +Map[rxy]['type'];
                    if (rtype != 5 && rtype != 4 && rtype != 0) {
                        Map[rxy]['type'] = 4;
                        Map[rxy]['class'] = 'fre';
                        var rel = document.getElementById(rxy);
                        rel.setAttribute('class', 'fre');
                        rel.setAttribute('type', 4);
                        //console.debug('Отрисовка пустого пути ['+rxy+']');
                    }
                }
                R = null;
            }
            if (env[5] == 2) {
                if (name == 'trap') {
                    Map[xy]['class'] = 'lev';
                    Map[xy]['type'] = 5;
                    var el = document.getElementById(xy);
                    el.setAttribute('class', 'lev');
                    el.setAttribute('type', 5);
                    //console.debug('Отрисовка ловушки ['+xy+']');
                    continue;
                }
            }
        }
        //запись
        config.set('lab.map', Map); config.set('lab.vmap', VMap); config.set('lab.vmmap', VmMap);
        Map = null, VMap = null, VmMap = null;
    };

    //это тупик?
    this.isDeadLock = function(cx,cy) {

        var i = 0, direct = -1, back = [2,3,0,1], x = cx, y = cy, leave = config.get('settings.lab.leave');
        do {
            var env = this.cellInfo(x,y);
            //console.debug(env,x,y);
            if (env[5] == 1) {
                var ok = false;
                for (var c = 0;c < 4;c++) {
                    if (direct == back[c] || env[c][3] == 2 || env[c][2] == 'goup' || env[c][2] == 'godown' || env[c][2] == 'wall') continue;
                    x = env[c][0], y = env[c][1], direct = c, ok = true;
                    break;
                }
                if (!ok) break;

            } else if ((env[4] == 1 || env[4] == 2) && env[5] == 0) {
                var ways = 0, tmpdirect = -1;
                for (var c = 3;c > -1;c--) {
                    if (direct == back[c] || env[c][3] == 5 || env[c][3] == 2 || (env[c][3] == 4 && leave) || env[c][4] == 'Я' || env[c][2] == 'goup' || env[c][2] == 'godown' || env[c][2] == 'wall') continue;
                    ways++;
                    x = env[c][0], y = env[c][1], tmpdirect = c;
                }
                direct = tmpdirect;
                if (ways > 1) {
                    break;
                } else if (ways == 0) {
                    return 3;
                }
            } else if (env[5] == 2) {
                return 1;
            } else if (env[5] == 3) {
                return false;
            } else {
                return 2;
            }

            if (++i > 15) return [];

        } while (1);

        return false;
    };

    //закрашиваем пустые тупички
    this.drawDeadLocks = function(x,y) {
        var xy = x + '-' + y, R = [xy], i = 0, direct = -1, back = [2,3,0,1],
            leaveheal = config.get('settings.lab.leaveheal'), leavedoor = config.get('settings.lab.leavedoor');
        do {
            var env = this.cellInfo(x,y);
            //это тупик или проход
            if (env[5] == 2 || env[5] == 1) {
                var ok = false, ways = 0;
                for (var c = 3;c > -1;c--) {
                    if (direct == back[c] || env[c][3] > 1) continue;
                    //пропуск хилок
                    if (env[c][2] == 'heal') {
                        if (!leaveheal) continue;
                        //это не хилка не дорога и не ловушка, игнорим
                    } else if (env[c][2] != 'way' && env[c][2] != 'trap') {
                        //мы внутри двери
                        if (env[c][2] == 'box') {
                            var nenv = this.cellInfo(env[c][0],env[c][1]);
                            if (nenv[5] == 2 || nenv[5] == 3) {
                                return [];
                            }
                        }
                        continue;
                    }
                    //ок нашли локу для пропуска
                    x = env[c][0], y = env[c][1], ok = true, direct = c;
                    R.push(x + '-' + y);
                    break;
                }
                //лока стрёмная, стопаем и отдаем чо нашли
                if (!ok) break;
                if (ways > 1) {
                    return [];
                }
                            //это развилка и рядом есть непосещенные или пропускаемые локи
            } else if (env[5] == 0 && (env[4] == 1 || env[4] == 2)) {
                var ok = false, ways = 0, tmp = -1;
                for (var c = 3;c > -1;c--) {
                    if (direct == back[c]) continue;
                    //хил пропускаем
                    if (name == 'heal') {
                        if (!leaveheal) {
                            ways++;
                            continue;
                        }
                    } else {
                        if (env[c][2] != 'wall' && env[c][2] != 'undefined'  && env[c][3] < 3) ways++;
                        if ((env[c][2] != 'way' && env[c][2] != 'trap') || env[c][3] > 1) continue;
                    }

                    x = env[c][0], y = env[c][1];
                    if (!ok) {
                        R.push(x + '-' + y);
                        ok = true, tmp = c;
                    }
                    //break;
                }
                direct = tmp;
                if (ways > 1) {
                    R.pop();
                    R.pop();
                    ok = false;
                }
                if (!ok) break;

            } else if (env[5] == 0) {
                R.pop();
                break;
            } else if (env[5] == 3) {
                return [];
            } else {
                break;
            }
            if (++i > 15) return [];

        } while (1);

        return R;
    };

    //закрашиваем альтернативные пути
    this.drawAltWays = function(x,y) {
        var xy = x + '-' + y, i = 0, direct = -1, back = [2,3,0,1], R = [], ways = 0, leaveheal = config.get('settings.lab.leaveheal');
        do {
            var env = this.cellInfo(x,y);
            if (!env) return [];

            ways = 0, lastdirect = -1;
            for (var c = 3;c > -1;c--) {
                if (direct == back[c]) continue;
                if (!env[c][0] || !env[c][1]) return [];
                if (env[c][3] != 1 || env[c][2] == 'wall') continue;
                ways++;
                if (env[c][2] == 'heal') {
                    if (!leaveheal) {
                        ways++;
                        break;
                    }
                } else if (env[c][2] != 'way' && env[c][2] != 'trap') {
                    ways++;
                    break;
                }
                x = env[c][0], y = env[c][1], lastdirect = c;
            }
            direct = lastdirect;
            if (ways > 1) {
                return [];
            } else if (ways == 0) {
                break;
            }
            R.push(x + '-' + y);
            if (++i > 20) return [];
        } while (1);

        return R;
    };

    //рисуем текущий путь
    this.drawRoute = function(auto) {
        var Route = config.get('lab.route');
        var tds = document.getElementById('map').getElementsByTagName('td');
        for (var i in tds) {
            if (typeof(tds[i]) != 'object') continue;
            tds[i].className = tds[i].className.replace('router','');
        }
        for (var l in Route) {
            var xy = Route[l][0] + '-' + Route[l][1];
            document.getElementById(xy).className = document.getElementById(xy).className + ' router';
        }
        Route = null, tds = null;
    };

    //отрисовка логов
    this.drawLogs = function() {
        this.cleanLogs(true);
        var Logs = config.get('logs.lab', []), log = '';
        for (var i in Logs) {
            log += '<li style=\'color: ' + Logs[i][2] + '\'>[' + Logs[i][0] + '] ' + Logs[i][1] + '</li>';
        }
        document.getElementById('logs').innerHTML = log;
        Logs = null, log = null;
    };
    //очистка логов
    this.cleanLogs = function(htmlonly) {
        if (!htmlonly) config.set('logs.lab', []);
        var els = document.getElementById('logs').getElementsByTagName('li');
        for (var e in els) {
            if (typeof(els[e]) != 'object') continue;
            els[e].remove();
        }
        //document.getElementById('logs').innerHTML = '';
    };
    //добавление логов
    this.setLog = function(text, color) {
        var cid = config.get('lab.cord', []), Logs = config.get('logs.lab', []);
        color = color ? color : 'black';
        var log = [
            cid.join('/'),
            text,
            color
        ];
        Logs.unshift(log);
        config.set('logs.lab', Logs);
        Logs = null, log = null;
    };

    //автопилот, ага
    this.autoPilot = function() {

        var Route = [], Map = config.get('lab.map'), VmMap = config.get('lab.vmmap'), Leave = config.get('settings.lab.leave');
        var Cord = config.get('lab.cord'), Dealer = config.get('lab.dealer'),  Exit = config.get('lab.exit');
        var x = Cord[0], y = Cord[1], env = this.cellInfo(x,y), uhp = config.get('user.hp'), This = this;

        //на выход при перегрузе
        var priority = config.get('settings.lab.autoheal.0'), needUseHeal = this.needCure(), needUseBut = this.needCure(true);
        //console.debug('nc'+needUseHeal+'/nb'+needUseBut);

        //поиск шага
        for (var i = 0; i < 4; i++) {
            var x = env[i][0], y = env[i][1], name = env[i][2], type = env[i][3], title = env[i][4];

            if (type == 1 || (type == 4 && !Leave)) {
                if (name == 'wall' || name == 'goup' || name == 'door' || name == 'godown') continue;
                //Проверяем моба. Юзаем лечилку или бутер, если включено
                if ((name == 'mob' || name == 'boss') && !this.mayAttack(name,y,title)) {
                    if (priority == 2) {
                        //Бутеры
                        if (needUseBut && this.use('but')) {
                            setTimeout(function() {
                                This.go(false, '$2');
                            }, 5000);
                            return;
                        }
                    }
                    if (priority > 1) {
                        //Хилки
                        if (needUseHeal) {
                            Route = this.findCure();
                            if (Route.length > 0) {
                                config.set('lab.route',Route);
                                this.drawRoute(true);
                                setTimeout(function() {
                                    This.router('auto: goto heal');
                                }, 13);
                                return;
                            }
                        }
                        if (priority == 3) {
                            //Бутеры 2
                            if (needUseBut && this.use('but')) {
                                setTimeout(function() {
                                    This.go(false, '$3');
                                }, 5000);
                                return;
                            }
                        }
                    }
                    continue;
                }
                var dl = this.isDeadLock(x,y);
                //console.debug('DL '+dl,x,y);
                if (dl == 1 || dl == 3) {
                    Route = [[x,y]];
                    break;
                } else if (dl == 2) {
                    Route = [[x,y]];
                } else if (Route.length < 1) {
                    Route = [[x,y]];
                }
            }
        }

        //console.debug('no steps');

        //Шагать некуда, идём к развилке
        if (!Route || Route.length < 1) {
            var mobsRoads = 0, bossRoads = 0, freeRoads = 0, doorRoads = 0;
            for (var xy in Map) {
                var cell = Map[xy];
                var mtype = +cell['type'], mname = cell['name'], mx = cell['x'], my = cell['y'], mtitle = cell['title'];
                if (mname == 'wall') continue;
                if (mname == 'door') {
                    doorRoads++;
                    continue;
                }
                if (mname == 'way' && mtype === 1) {
                    freeRoads++;
                    continue;
                }
                if (mname == 'mob') {
                    mobsRoads++;
                    continue;
                }
                if (mname == 'boss') {
                    bossRoads++;
                    continue;
                }

                if (mtype !== 2) continue;

                var env = this.cellInfo(mx, my);

                if (env[4] < 1 || (env[4] == 2 && Leave)) continue;

                var mroad = AStar(VmMap, Cord, [mx,my], 'Euclidean');
                if (!mroad || mroad.length < 1) continue;

                //console.debug('check road '+[mx,my]);
                //console.debug(env);

                var ok = false;
                for (var i = 0; i < 4; i++) {

                    var x = env[i][0], y = env[i][1], name = env[i][2], type = env[i][3], title = env[i][4];

                    if (type == 1 || (type == 4 && !Leave)) {

                        if (name == 'wall' || name == 'goup' || name == 'door' || name == 'godown') continue;

                        if ((name == 'mob' || name == 'boss') && !this.mayAttack(name,y,title)) {
                            if (priority == 2) {
                                if (needUseBut && this.use('but')) {
                                    setTimeout(function() {
                                        This.go(false, '@2');
                                    }, 5000);
                                    return;
                                }
                            }
                            if (priority > 1) {
                                if (needUseHeal) {
                                    Route = this.findCure();
                                    if (Route.length > 0) {
                                        config.set('lab.route',Route);
                                        this.drawRoute(true);
                                        setTimeout(function() {
                                            This.router('auto: goto heal 2');
                                        }, 13);
                                        return;
                                    }
                                }
                                if (priority == 3) {
                                    if (needUseBut && this.use('but')) {
                                        setTimeout(function() {
                                            This.go(false, '@3');
                                        }, 5000);
                                        return;
                                    }
                                }
                            }
                            continue;
                        }
                        ok = true;
                        break;
                    }
                }
                if (!ok) continue;
                if (!Route[0] || Route.length > mroad.length) {
                    Route = mroad;
                }
            }

            console.debug('no roads ' + mobsRoads + '/' + bossRoads);

            if (!Route || Route.length < 1) {

                if ((mobsRoads > 0 || bossRoads > 0) && config.get('lab.dealersell') < 1) {
                    if (priority == 0 || priority == 4 || priority == 2) {
                        if (needUseBut && this.use('but')) {
                            setTimeout(function() {
                                This.go(false, '&0');
                            }, 5000);
                            return;
                        }
                    }
                    if (needUseHeal) {
                        Route = this.findCure();
                        if (Route.length > 0) {
                            config.set('lab.route', Route);
                            this.drawRoute(true);
                            setTimeout(function() {
                                This.router('autopilot 3');
                            }, 13);
                            return;
                        }
                    }
                    if (priority == 1 || priority == 3) {
                        if (needUseBut && this.use('but')) {
                            setTimeout(function() {
                                This.go(false, '&1');
                            }, 5000);
                            return;
                        }
                    }

                    this.mess('Реген HP', '#FF8040');
                    if (config.get('lab.size') < 26 && uhp[0] < uhp[1]) {
                        var time = ((100 - uhp[2]) / 10) * 20000;
                        if (time > 20000) {
                            setTimeout(function() {
                                This.go(false, '&+');
                            }, time);
                            return;
                        }
                    }
                }

                console.debug('no ways!');

                //идём до барыги
                if (config.get('lab.size') > 25 && config.get('settings.lab.dealer') && config.get('lab.dealersell') < 2 && Dealer && Dealer[0] > 0 && Dealer[1] > 0 && !this.it(Dealer[0],Dealer[1])) {
                    Route = AStar(VmMap, Cord, Dealer, 'Euclidean');
                    config.set('lab.dealersell',1);
                    //хилок нет, дорог нет.. идём к выходу
                } else if (this.it(Exit[0],Exit[1])) {
                    if (
                    config.get('lab.size') < 26                    &&
						config.get('settings.lab.heroic')                    &&
						(config.get('lab.weapon') || !config.get('settings.lab.set.2'))
                    ) {
                        this.mess('Переход...', 'rgb(162, 162, 241)');
                        if (config.get('settings.lab.heroicheal') && uhp[0] < uhp[1])  {
                            config.message('Отхил перед героиком в процессе...');
                            setTimeout(function() {
                                This.go(false, '&+');
                            }, 60000);
                            return;
                        }
                        config.message('Переход в Героик.');
                        this.crossWalks('heroic');
                    } else if (config.get('settings.lab.exit')) {
                        this.mess('Выход...', '#FF8040');
                        config.sound('endlaba');
                        this.crossWalks('exit');
                    } else {
                        this.mess('Всё...', '#FF8040');
                    }
                    return;
                } else {
                    Route = AStar(VmMap, Cord, Exit, 'Euclidean');
                }
            }

        }

        if (Route.length < 1) {
            this.mess('BAD>HP;EXIT;ROAD', '#FF0080');
            if (!this.messagesended) {
                config.message('Нет HP для атаки мобов. Проверьте текущие HP и настройки атаки мобов!', 'Ошибка настроек!');
                config.message('Не найдена точка выхода из лабы. Не могу завершить лабиринт!', 'Ошибка пути!');
                config.message('Нет безопасной дороги. Некуда идти, везде мобы и нет не открытых свободных дорог!', 'Ошибка пути!');
                this.messagesended = true;
            }
            setTimeout(function() {
                This.go(false, '!!');
            }, 10000);
            return;
        }
        config.set('lab.route', Route);
        this.drawRoute(true);
        setTimeout(function() {
            This.router('autopilot end');
        }, 13);
    };

    //ходим тут
    this.router = function(ident) {
        var Route = config.get('lab.route',[]), This = this;
        //console.debug('Router '+ident);

        if (Route[0] && this.it(Route[0][0],Route[0][1])) {
            //console.debug('bad route 0');
            Route.shift();
        }
        if (Route[0]) {
            var next = false, Cord = config.get('lab.cord');
            for (var i in this.Directs) {
                var cx = Cord[0] + this.Directs[i][0], cy = Cord[1] + this.Directs[i][1];
                if (Route[0][0] == cx && Route[0][1] == cy) {
                    next = true;
                    break;
                }
            }
            if (!next) {
                console.debug('bad route next');
                Route = [];
                config.set('lab.route',[]);
                this.drawRoute();
            }
        }

        if (config.eq('settings.lab.start', true) && Route.length < 1) {
            this.mess('Автопилот...', 'green');
            setTimeout(function() {
                This.autoPilot();
            }, 13);
            setTimeout(function () {
                if (Route.length < -1) {
                    top.main.location.href = top.main.location.href;
                }
            }, 15);
            return;
        }
        var MAX = ((this.trap ? 6 : config.get('lab.steptime')) * 1000);
        if (this.step) config.set('lab.step', (+new Date() + MAX));

        //время до следующего шага в милисекундах
        var Wait = config.get('lab.step') - +new Date();
        if (Wait > MAX) {
            this.mess('Упс ' + ((Wait / 1000).toFixed(2)) + 'сек.', '#408080');
            config.set('lab.step', +new Date());
            Wait = 0;
        }
        //время не пришло
        if (Wait > 0) {
            this.mess('Ждём ' + ((Wait / 1000).toFixed(2)) + 'сек.', 'rgb(162, 162, 240)');
            setTimeout(function() {
                This.step = false;
                This.router('wait');
            }, Wait);
            return;
        }
        if (Route.length < 1) {
            this.mess('Стоим... ', 'rgb(162, 162, 240)');
            setTimeout(function() {
                This.router('noroute');
            }, 30000);
            return;
        }
        var goto = this.align(Route[0]);
        setTimeout(function() {
            This.go(goto, '►');
        }, 13);
    };

    //делаем шаг
    this.go = function(to, inf) {
    	                                        if (this.I) {
        console.debug('antiloop [' + inf + '/' + to + ']');
        return;
    	}
    	//console.debug('go '+to);
    	                                        this.I = true;
    	                                        clearTimeout(this.F);

    	                                        this.step = to ? true : false;
        this.drawLogs();
        this.mess(inf, '#FF8000');
        var url = config.get('lab.url') + '?', urlgo = config.get('lab.urlgo');
        var goto = (to ? url + urlgo + '=' + to + '&' : url);
        goto += 'refresh=' + Math.random();
        var This = this;
        this.broadcast(goto, function(html) {

            if (html && html.indexOf('координаты') > -1) {

            	                                This.mess('Парсим...', 'rgb(162, 162, 241)');
            	                                var parsed = This.parse(html);
                html = null;
                if (parsed) {
                	                            This.mess('Поиск пути...', 'rgb(162, 162, 241)');
                	                            if (This.Items > 0 && config.get('settings.lab.autodrop.0')) {
                    This.mess('Сбор предметов(' + This.Items + ')...', 'green');
                    This.I = false;
                    This.F = setTimeout(function() {
                        This.go();
                    }, 20000);
                } else {
                    var xy = config.get('lab.cord'), xy = xy.join('-');
                    if (This.NoGetItems > 0) {
                        config.set('lab.map.' + xy + '.class', 'res');
                    } else {
                        config.set('lab.map.' + xy + '.class', 'was');
                    }
                    This.I = false;
                    setTimeout(function() {
                        This.router('from go');
                    }, 300);
                }
                } else {
                    if (html.indexOf('До следующего посещения') > 0) {
                        This.mess('Вышли из лабы...', 'green');
                    } else {
                        This.mess('Начат бой...', '#FF8040');
                    }
                    window.location.href = '/main.php?battlefromlab=1';
                }

            } else {
                html = null;
                This.mess('Бой...');
                window.location.href = '/main.php?battlefromlab=1';
            }

        });
	                                        };
};
//Класс для поиска пути. Нагло стырен откуда-то там
function AStar(Grid, Start, Goal, Find) {
    function AStar() {
        switch (Find) {
            case 'Diagonal':
            case 'Euclidean':
                Find = DiagonalSuccessors;
                break;
            case 'DiagonalFree':
            case 'EuclideanFree':
                Find = DiagonalSuccessors$;
                break;
            default:
                Find = function () {
                };
                break;
        }
    }

    function $Grid(x, y) {
        return Grid[y][x] === 0;
    }

    function Node(Parent, Point) {
        return {Parent: Parent, value: Point.x + (Point.y * cols), x: Point.x, y: Point.y, f: 0, g: 0};
    }

    function Path() {
        var $Start = Node(null, {x: Start[0], y: Start[1]}), $Goal = Node(null, {
            x: Goal[0],
            y: Goal[1]
        }), AStar = new Array(limit), Open = [$Start], Closed = [], result = [], $Successors, $Node, $Path, length, max, min, i, j;
        while (length = Open.length) {
            max = limit;
            min = -1;
            for (i = 0; i < length; i++) {
                if (Open[i].f < max) {
                    max = Open[i].f;
                    min = i;
                }
            }
            $Node = Open.splice(min, 1)[0];
            if ($Node.value === $Goal.value) {
                $Path = Closed[Closed.push($Node) - 1];
                do {
                    result.push([$Path.x, $Path.y]);
                } while ($Path = $Path.Parent);
                AStar = Closed = Open = [];
                result.reverse();
            } else {
                $Successors = Successors($Node.x, $Node.y);
                for (i = 0, j = $Successors.length; i < j; i++) {
                    $Path = Node($Node, $Successors[i]);
                    if (!AStar[$Path.value]) {
                        $Path.g = $Node.g + Distance($Successors[i], $Node);
                        $Path.f = $Path.g + Distance($Successors[i], $Goal);
                        Open.push($Path);
                        AStar[$Path.value] = true;
                    }
                }
                Closed.push($Node);
            }
        }
        return result;
    }

    function Successors(x, y) {
        var N = y - 1, S = y + 1, E = x + 1, W = x - 1, $N = N > -1 && $Grid(x, N), $S = S < rows && $Grid(x, S), $E = E < cols && $Grid(E, y), $W = W > -1 && $Grid(W, y), result = [];
        if ($N)result.push({x: x, y: N});
        if ($E)result.push({x: E, y: y});
        if ($S)result.push({x: x, y: S});
        if ($W)result.push({x: W, y: y});
        Find($N, $S, $E, $W, N, S, E, W, result);
        return result;
    }

    function DiagonalSuccessors($N, $S, $E, $W, N, S, E, W, result) {
        if ($N) {
            if ($E && $Grid(E, N))result.push({x: E, y: N});
            if ($W && $Grid(W, N))result.push({x: W, y: N});
        }
        if ($S) {
            if ($E && $Grid(E, S))result.push({x: E, y: S});
            if ($W && $Grid(W, S))result.push({x: W, y: S});
        }
    }

    function DiagonalSuccessors$($N, $S, $E, $W, N, S, E, W, result) {
        $N = N > -1;
        $S = S < rows;
        $E = E < cols;
        $W = W > -1;
        if ($E) {
            if ($N && $Grid(E, N))result.push({x: E, y: N});
            if ($S && $Grid(E, S))result.push({x: E, y: S});
        }
        if ($W) {
            if ($N && $Grid(W, N))result.push({x: W, y: N});
            if ($S && $Grid(W, S))result.push({x: W, y: S});
        }
    }

    function Diagonal(Point, Goal) {
        return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
    }

    function Euclidean(Point, Goal) {
        return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
    }

    function Manhattan(Point, Goal) {
        return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
    }

    var abs = Math.abs, max = Math.max, pow = Math.pow, sqrt = Math.sqrt;
    var cols = Grid[0].length, rows = Grid.length;
    var limit = cols * rows, Distance = {
            Diagonal: Diagonal,
            DiagonalFree: Diagonal,
            Euclidean: Euclidean,
            EuclideanFree: Euclidean,
            Manhattan: Manhattan
        }[Find] || Manhattan;
    return Path(AStar());
}

//килл рефреша
function refreshPeriodic() {}

//наша карта
var HTML = document.body.innerHTML;
var MapId = HTML.match(/Карта:\s?([0-9]+)/i);
var WaitSet = false, WaitAbil = false;
if (!MapId || MapId.length < 1) {
    window.location.href = window.location.href;
    throw 'map failed';
}
MapId = MapId[1];

var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'labtable');
document.body.appendChild(newDiv);
document.getElementById('labtable').innerHTML = LABHTML;
LABHTML = null, newDiv = null;

console.debug('it works!');

var Size = window.location.href.indexOf('/lab2') > -1 ? 49 : 25;

if (!config.eq('lab.id', MapId) || !config.eq('lab.size',Size)) {

    console.debug('new map');

    var URL = '/lab.php', SIZE = 25,  STEP = 3, URLGO = 'gto';
    if (window.location.href.indexOf('/lab2') > -1) {
        URL = '/lab2.php', SIZE = 49, STEP = 1.5;
    } else if (window.location.href.indexOf('/lab3') > -1) {
        URL = '/lab3.php', URLGO = 'goto';
    }
    var Map = {}, VMap = new Array(SIZE), VmMap = new Array(SIZE);

    for (y = 0; y <= SIZE; y++) {
        VMap[y] = new Array(SIZE);
        VmMap[y] = new Array(SIZE);
        for (x = 0; x <= SIZE; x++) {
            VMap[y][x] = 1;
            VmMap[y][x] = 1;
        }
    }
    for (var x = 1;x <= SIZE;x++) {
        for (var y = 1;y <= SIZE;y++) {
            Map[x + '-' + y] = {'x': x,'y': y,'img': '','title': '','type': 0, 'class': 'unk', 'num': 0};
        }
    }
    var LabData = {
        'id': MapId, 'map': Map, 'vmap': VMap, 'vmmap': VmMap,
        'size': SIZE, 'steptime': STEP, 'url': URL, 'urlgo': URLGO, 'step': +new Date(), 'dealersell': false,
        'weapon': (SIZE < 26 ? false : config.get('lab.weapon')), 'starttime': config.get('lab.starttime'),
        'cures': {'but': 0,'dot': 0,'dot2': 0,'key1': 0,'key2': 0,'key3': 0,'key4': 0,'key666': 0,'hp': 0}, 'loaded': false
    };
    config.set('lab', LabData);

    //старт обычной лабы
    if (SIZE < 26) {
        config.set('logs.lab', []);
        if (config.get('settings.lab.setenter')) {
            WaitSet = true;
        } else {
            config.saveSet('laba-tmp');
        }
        if (config.get('settings.lab.abilities.1')) WaitAbil = true;
        config.message('Старт лабы.');
        config.set('lab.starttime', (+new Date() / 1000));
    } else {
        if (config.get('settings.lab.abilities.0')) WaitAbil = true;
        config.message('Старт героика.');
        config.set('lab.startheroic', (+new Date() / 1000));
    }

    if (config.get('settings.lab.autosettings', true)) {
        config.set('settings.lab.autodrop.0', true);
        config.set('settings.battle.atype', 0);
        // config.set('settings.battle.curehp', 275);
        config.set('settings.battle.stophp', 0);
        config.set('settings.lab.start', true);
        if (top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
            top.frames[1].bswitch(0);
        }
        config.message('Установки: +Автостарт; +Автосбор; +Автоудар; +Автохил; -Автостоп; ' + (WaitSet ? '+' : '-') + 'Комплект; ' + (WaitAbil ? '+' : '-') + 'Жажда;');
    }

}

//рендер
var RMap = config.get('lab.map'), Bosses = {
        'Фобос': 'ares','Сын Ареса': 'ares','Амфисбена': 'amfis','Гидра': 'hydra',
        'Химера': 'chimera','Пирагмон': 'piragmon','Аэлла': 'aella','Грифон': 'grifon'
    }, Dealer = config.get('lab.dealer', []);

var html = '<table id=\'map\' cellpadding=0 cellspacing=0 align=center>';
for (var i in RMap) {
    var m = RMap[i];
    var x = m['x'], y = m['y'], name = m['name'], img = m['img'], type = m['type'], cl = m['class'], num = m['num'];
    var mtitle = m['title'];
    if (name == 'door') {
        mtitle += ' №' + num;
        cl += ' door' + img;
    }
    if (name == 'keybox') {
        mtitle += ' №' + num;
        cl += ' key' + img;
    }
    if (Size > 25 && Dealer && Dealer[0] == x && Dealer[1] == y) {
        mtitle += ' Бомжара';
        cl += ' dealer';
    }
    if (name == 'boss') {
        cl += ' ' + Bosses[mtitle];
    }
    var title = mtitle && cl != 'unk' ? 'title="[' + x + '-' + y + '] ' + mtitle + '"' : '';
    if (y == 1) {
        if (x == 1 || x == Size) {
            html += '<tr style=\'display: none;\'>\n';
        } else html += '<tr>\n';
    }
    html += '<td class=\'' + cl + '\' ' + title + ' name=\'' + name + '\' type=\'' + type + '\' id=\'' + i + '\' onclick=\'lab.direct(this);\'>&nbsp;</td>\n';
    if (y == Size) html += '</tr>\n';
}
html += '</table>';
document.getElementById('mapdata').innerHTML = html;

RMap = null, html = null, dealer = null, Size = null, Bosses = null, Dealer = null;

//автопилод
if (config.eq('settings.lab.start',true)) {
    document.getElementById('autopilot').className = 'on';
    document.getElementById('autopilot').innerHTML = 'Автобот';
}
function autop(el) {
    config.set('lab.route', []);
    lab.drawRoute();
    if (config.eq('settings.lab.start',true)) {
        el.className = '';
        el.innerHTML = 'Включить';
        config.set('settings.lab.start',false);
    } else {
        config.set('settings.lab.start',true);
        el.className = 'on';
        el.innerHTML = 'Автобот';
        lab.router('fastrun');
    }
}
function dropit(el) {
    if (confirm('Это полностью очистит карту лабы. Продолжить?')) {
        config.set('lab.id', 0);
        window.location.href = '/main.php?battlefromlab=1';
    }
}

function press(el) {
    var id = el.getAttribute('id');
    if (el.className == 'run') {
        el.className = 'norun';
        config.set('lab.' + id, false);
    } else {
        el.className = 'run';
        config.set('lab.' + id, true);
    }
}
config.set('lab.shift', false);
config.set('lab.ctrl', false);
config.set('lab.alt', false);

//инициация лабиринта
var lab = new Labyrinth();
Labyrinth = null;

function run() {
    if (!config.get('lab.loaded')) {
        lab.mess('Предметы...');
        lab.loadItems(function() {
            lab.mess('свитки...');
            lab.loadScrolls(function() {
                if (config.get('settings.lab.saveonserver')) {
                    config.saveonserver();
                }
                lab.go(false, '₪');
            });
        });
    } else {
        lab.mess('свитки...');
        lab.loadScrolls(function() {
            if (config.get('settings.lab.saveonserver')) {
                config.saveonserver();
            }
            lab.go(false, '₪');
        });
    }
}

if (WaitSet) {
    lab.mess('Одеваемся...');
    config.dressSet('plugin-laba', function(status) {
        if (!status) {
            config.message('Ошибка одевания комплекта для лабы! Попробуем ещё раз.');
            config.dressSet('plugin-laba', function(status) {
                if (!status) {
                    config.message('Повторная ошибка одевания комплекта для лабы! Что-то у вас не так.');
                } else {
                    config.message('Во второй раз комплект оделся успешно. Начинаем...');
                    config.saveSet('laba-tmp');
                }
            });
        } else {
            config.message('Одели комплект для лабы. Начинаем...');
            config.saveSet('laba-tmp');
        }
        if (WaitAbil) {
            lab.mess('Абилка...');
            config.use({'url':'/myabil.php?', 'sd4':config.uid, 'id':813, 'abit':'abil', 'login':1}, function(html) {
                if (html.indexOf('>Все прошло удачно!') > -1) {
                    config.message('Жажда наживы использована', 'Абилки');
                } else if (html.indexOf('>Вы сможете использовать') > -1) {
                    config.message('Жажда наживы в кулдауне. Сочуствую.', 'Абилки');
                } else {
                    config.message('Жажда наживы не заюзана. И я не знаю почему.', 'Абилки');
                }
                run();
            });
        } else run();
    });
} else {
    if (WaitAbil) {
        lab.mess('Абилка...');
        config.use({'url':'/myabil.php?', 'sd4':config.uid, 'id':813, 'abit':'abil', 'login':1}, function(html) {
            if (html.indexOf('>Все прошло удачно!') > -1) {
                config.message('Жажда наживы использована', 'Абилки');
            } else if (html.indexOf('>Вы сможете использовать') > -1) {
                config.message('Жажда наживы в кулдауне. Сочуствую.', 'Абилки');
            } else {
                config.message('Жажда наживы не заюзана. И я не знаю почему.', 'Абилки');
            }
            run();
        });
    } else run();
}

//познание лабиринта
function openMap() {
    if (config.get('lab.size') < 26) {
        alert('Только для героического лабиринта!');
        return;
    }
    var mapid = parseInt(document.getElementById('labmapnum').value);
    if (!mapid) {
        alert('Только цифры с конца ссылки на карту лабиринта! ' + document.getElementById('labmapnum').value);
        return;
    }
    lab.mess('#' + mapid + ' :: парс', 'rgb(162, 162, 241)');
    lab.broadcast('/lab2.php?lookmap=' + mapid, function(html) {
        if (!html) {
            alert('Ошибка получения данных!');
            return;
        }
        html = html.replace(/(\n|\r|\t)/g, '');
        lab.mess('#' + mapid + ' :: проверка', 'rgb(162, 162, 241)');
        var rmapid = config.search('Карта:([0-9]+)<br><html>',html);
        if (!config.eq('lab.id',rmapid)) {
            alert('Это карта другого лабиринта (несовпадение id)!');
            return;
        }
        var me = 0, html = html.split('\n').join(' '), size = config.get('lab.size'),
            VMap = config.get('lab.vmap'), VmMap = config.get('lab.vmmap'), Map = config.get('lab.map');
        var cells = config.searchAll('<img src="?http:\\/\\/i.oldbk.com\\/llabb\\/([^\.]+).gif"?[^">]*"?([^">]+)?"?[^>]*>',html);
        for (var i in cells) {
            if (cells[i][0] == 'ot2') {
                me = i;
                break;
            }
        }
        var px = Math.floor(me / 49), py = (me - (px * 49));
        var Cord = config.get('lab.cord', [px, py]);
        px = Cord[0] - px, py = Cord[1] - py;
        for (var i in cells) {
            var sx = Math.floor(i / 49), sy = (i - (sx * 49)), x = px + sx, y = py + sy, xy = x + '-' + y;
            if (x < 2 || x > 48 || y < 1) continue;
            var img = cells[i][0], title = cells[i][1] != undefined ? cells[i][1] : '';
            var name = +img == 2 ? 'dealer' : is(img), cl = (name == 'me' ? 'was' : 'not'), num = 0;
            if (name == 'exit') {
                config.set('lab.exit',[x,y]);
            }
            if (name == 'door') {
                num = img == 'x' ? 3 : (img == 'z' ? 2 : (img == 'c' ? 4 : 1));
            }
            if (name == 'dealer') {
                config.set('lab.dealer',[x,y]);
                img = 'deal';
            }
            if (VMap[y][x] > 0 && name != 'door' && name != 'wall' && name != 'goup' && name != 'godown') {
                VMap[y][x] = 0;
            }
            if (VmMap[y][x] > 0 && name != 'door' && name != 'wall' && name != 'goup' && name != 'godown' && name != 'mob' && name != 'boss') {
                VmMap[y][x] = 0;
            }
            if (VMap[y][x] == 0 && (name == 'goup' || name == 'godown')) {
                VMap[y][x] = 1;
            }
            if (VmMap[y][x] == 0 && (name == 'goup' || name == 'godown' || name == 'trap')) {
                VmMap[y][x] = 1;
            }
            if (Map[xy]['type'] < 1) {
                Map[xy] = {'x': x, 'y': y, 'img': img, 'type': (name == 'me' ? 2 : 1), 'title': title, 'name': name, 'class': cl, 'num': num};
            } else {
                if (name == 'me') {
                    Map[xy]['type'] = 2;
                    Map[xy]['class'] = 'was';
                }
                Map[xy]['img'] = img;
                Map[xy]['title'] = title;
                Map[xy]['name'] = name;
                Map[xy]['num'] = num;
            }
        }
        config.set('lab.map',Map);
        config.set('lab.vmap',VMap);
        config.set('lab.vmmap',VmMap);
        window.location.href = '/main.php?battlefromlab=1';
    });
}

//что на ячейке
function is(name) {
    //типы ячеек doors d:1,z:2,x:3,c:4 || keyboxes w2:2,l2:1,y2:3,k2:4
    var CellTypes = {
        'wall': ['m2','m','n'], 'goup': ['e2'], 'godown': ['a2'], 'way' : ['o','o2','g'],
        'mob': ['r','r2'], 'boss': ['j2'], 'trap': ['b','b2'],
        'door': ['c','d','x','z'], 'keybox' : ['y2','l2','k2','w2'],
        'box': ['s','s2'], 'panbox': ['p','p2'], 'heal': ['h','h2'],
        'me': ['u','u2','ot2','ot'], 'enter': ['os','os2'], 'exit': ['of','of2'], 'dealer' : ['deal', '2'], 'res' : ['res'], 'portal': ['t2']
    };
    for (var src in CellTypes) {
        for (var crs in CellTypes[src]) {
            if (name == CellTypes[src][crs]) return src;
        }
    }
    return false;
}
