if(!config.get('settings.battle.enabled')) {
	throw "module offline!";
}

var Battle = function(Eid, Tnum, Died) {
    this.die = Died;
    this.eid = Eid;
    this.e = 'U'+Eid;
	this.tnum = Tnum;
	//фикс мусора
	Eid = null, Tnum = null, Died = null;
    //встройки и свитки
	this.Cures = [];
	this.CuresIns = [];
	this.CHeal = 0;
	var body = document.body.innerHTML;
	body = body.split('\n').join('');
	var CureList = body.match(/<a onclick=([^>]+?)><img(.+?)><\/a>/ig);
    var leaves = config.get('battle.leavescrolls', 0);
	if(body.indexOf('> Этот свиток нельзя') > -1) {
		leaves++;
		config.set('battle.leavescrolls', leaves);
	}


	for(var i in CureList) {
		var cure = CureList[i].match(/<a onclick=[^>]+?use=([0-9]+)[^>]+><img src=[^>]+?title="?'?([^"'\d]+)\s+([0-9]+)HP.*?Прочность\s+([0-9]+)\/([0-9]+)"?'?[^>]+><\/a>/i);
		if(cure && cure.length > 0) {
			var ccount = cure[5]-cure[4];
			this.Cures.push([cure[1], cure[2], cure[3], ccount]);
			this.CHeal += +cure[3] * ccount;
			continue;
		}
		//console.debug(CureList[i]);
		var cure2 = CureList[i].match(/<a onclick=[^>]+?use=([0-9]+)[^>]+><img.+?Встроена магия: исцеление/i);
		if(cure2 && cure2.length > 0) {
			if(leaves < 1) {
				this.CuresIns.push([cure2[1],'Встройка','??',1]);
			} else {
				leaves--;
			}
		}
	}
	config.set('battle.hcures', this.CHeal);
    config.set('battle.icures', this.CuresIns.length);

	//Текущие HP персонажа
	if(document.getElementsByTagName('table')[1]) {
		var tmp = document.getElementsByTagName('table')[1].innerHTML.match(/([0-9]+)\/([0-9]+)/i);
		if(tmp && tmp[2] > 0) {
			config.set('user.hp', [tmp[1], tmp[2], Math.ceil(tmp[1]/(tmp[2]/100))]);
		}
	}

	this.UClasses = {'crit': 'Крит', 'dodge': 'Уворот', 'tank': 'Танк', 'ac': 'анти-крит', 'ad': 'анти-уворот', 'false': '??'};

    this.MyLevel = +config.get('user.level', 13);
    this.Enemies = config.get('battle.list', {});
	this.Changes = config.get('battle.changes', {});
    this.AlliesCount = 0;
    this.EnemiesCount = 0;
    this.LiveUsers = {};

    this.showinfo = config.get('settings.battle.showinfo', false);
 	this.strikes = config.get('settings.battle.style', []);
    this.btype = +config.get('settings.battle.atype', 1);
    this.inviz = {};
    var inviz = config.get('settings.battle.invisibles', {});
    for(var i in inviz) {
    	var inv = inviz[i].split('/');
     	this.inviz['U'+inv[1]] = inv[0];
    }
    this.isRange = function(is_class, level) {
    	if(!this.strikes[is_class]) {
        	console.error('bad isRange range for '+is_class);
        	return false;
        }
        var range = this.strikes[is_class];
        if(range['max'] < 1) return false;
        range['min'] = range['min'] > 0 ? range['min'] : 0;
		return ( level >= range['min'] && level <= range['max'] ) ? true : false;
    }
	this.isStrike = function(user) {
		if(!user || !user['loaded'] || user['level'] < 1) {
			console.error('bad isStrike user');
			return false;
		}
        var is_class = false, range = false, level = +user['level'];
        //невиды, несменяемые, воплоты
        if(user['bad'] > 0 || user['mob'] > 0 || user['vop'] > 0) {
        	is_class = 'bad';
        }
        if(user['inv'] > 0) {
        	is_class = 'inviz';
        }
        if(!is_class && user['uclass'] && user['utype']) {
        	is_class = user['uclass']+user['utype'];
        }
        var it_strike = this.isRange(is_class, level);
		return it_strike;
	}
    this.isTop = function(level) {
		return (level > this.MyLevel) ? true : false;
	}
	this.isLevel = function(level) {
		return (level >= this.MyLevel-1 && level <= this.MyLevel+1) ? true : false;
	}
	this.resortUsers = function() {
		var vals = new Array(), topvals = new Array();

    	for(var eid in this.Enemies) {
    		var enemy = this.Enemies[eid];
    		if(!enemy) continue;
       		if(enemy['level'] <= this.MyLevel) {
				vals.push([enemy['level'], enemy]);
       		} else {
				topvals.push([enemy['level'], enemy]);
       		}
    	}
		vals.sort(function(a, b){
			if(+a[0] < +b[0]) return 1;
			else if(+a[0] > +b[0]) return -1;
			return 0;
		});
		topvals.sort(function(a, b){
			if(+a[0] < +b[0]) return 1;
			else if(+a[0] > +b[0]) return -1;
			return 0;
		});
        this.Enemies = null;
        this.Enemies = {};
		for (i in vals) {
			var eid = vals[i][1]['id'];
        	this.Enemies['U'+eid] = vals[i][1];
		}
		for (i in topvals) {
			var eid = topvals[i][1]['id'];
        	this.Enemies['U'+eid] = topvals[i][1];
		}
		vals = null, topvals = null;
	}
    //парсим игрока 1+9 = <u>дарил, 2 = id, 3 = friend/enemy, 4 = login, 5 = level, 6 = class, 7+8 = <i>nviz, 10+11 = hp
	this.parseUser = function(html, team) {

		var eteam = team;
		var parse = html.match(new RegExp('(<u>)?<span id="([0-9]+)" onclick="(selectFrend|ChangeEnemy)\\(\'([^\']+)\'\\);?" oncontextmenu="return OpenMenu\\(event,([0-9]+)\\)" class="B([0-9]+)">(<b><i>)?[^<]+(<\\/i><\\/b>)?<\\/span>(<\\/u>)? \\[(-?[0-9\\?]+)\\/([0-9\\?]+)\\]','i'));
        if(!parse || parse.length < 1) {
        	if(html.indexOf('Лидер') < 0) {
        		console.error('Parse failed in team '+eteam+'! ');
        		window.location.href = "/fbattle.php";
        	}
        	return;
        }
        team = null, html = null;
        var myTeam = config.get('battle.myteam', 0);
        if(+eteam == +myTeam) {
        	this.LiveUsers['U'+parse[2]] = 2;
			this.AlliesCount++;
			return;
		}
        this.LiveUsers['U'+parse[2]] = 1;

		if(!this.Enemies['U'+parse[2]]) {
			var uid = +parse[2], level = +parse[5], login = parse[4], rlogin = parse[4], clonNum = 0,
			clon = 0, mob = 0, bad = 0, inv = 0, vop = 0, attack = 0, utype = false, uclass = false;

			if(parse[6] == 'B3') {
	        	attack = (+new Date() - (config.get('battle.timeout') / 3)) - 10;
	        } else if(parse[1] == '<u>') {
	        	attack = +new Date();
	        }

			var MobInfo = login.match(/([^\(]+?)\s+\(([^\d\s]+)?\s?([0-9]+)\)/i);
			if(MobInfo && MobInfo.length > 1) {
				rlogin = MobInfo[1];
				clonNum = MobInfo[3];
				if(!MobInfo[2] || MobInfo[2] == '' || MobInfo[2] == 'Проекция') {
					mob = 1;
					bad = 1;
				} else {
				    clon = 1;
				}
            }

            if(parse[7] == '<b><i>' || login == 'Невидимка' || rlogin == 'Невидимка') {
				inv = 1, bad = 1, mob = 0;
				if(this.inviz['U'+uid]) {
					rlogin = this.inviz['U'+uid];
				}
			}
			if(login == 'Лорд Разрушитель' || login == 'Исчадие Хаоса') {
				mob = 1;
			}
			var islvl = false, istop = false, fit = false;

			if(mob < 1) {
				istop = this.isTop(level);
                islvl = this.isLevel(level);
	        }
	        if(inv == 1) {
				fit = this.isRange('inviz', level);
			}

			var User = {
				'id': uid, 'login': login, 'rlogin': rlogin, 'level': level, 'team': eteam,
				'mob': mob, 'vop': 0, 'inv': inv, 'bad': bad, 'clon': clon, 'clonnum': clonNum, 'attack': attack,
				'hp': [parse[10], parse[11], Math.ceil(parse[10]/(parse[11]/100))],
				'loaded': false, 'utype': utype, 'uclass': uclass,
				'died': false, 'like': islvl, 'hard': istop, 'fit': fit, 'now': false
		   	};

		   	this.Enemies['U'+uid] = User;
		   	User = null;

		} else {
            var uid = +parse[2], level = +parse[5];
            var rtime = (+new Date() - (config.get('battle.timeout') / 3));
            var hp = [parse[10], parse[11], Math.ceil(parse[10]/(parse[11]/100))];

			if(parse[6] == 'B3' && this.Enemies['U'+uid]['attack'] < rtime) {
	        	this.Enemies['U'+uid]['attack'] = rtime - 10;
	        } else if(parse[1] == '<u>' && this.Enemies['U'+uid]['attack'] < 1) {
	        	this.Enemies['U'+uid]['attack'] = +new Date();
	        }

	        if(this.inviz['U'+uid]) {
				this.Enemies['U'+uid]['rlogin'] = this.inviz['U'+uid];
			}

            this.Enemies['U'+uid]['hp'] = hp;
            this.Enemies['U'+uid]['died'] = false;
            this.Enemies['U'+uid]['now'] = false;
            hp = null;

            if(this.Enemies['U'+uid]['attack'] > 0 && this.Changes['U'+uid]) {
            	this.Changes['U'+uid] = false;
            }
		}

	}

    this.parseUsers = function() {
		var PA = '', PE = '', NEW = false;
		//console.log(Teams);
        if(document.getElementById('mes') && document.getElementById('mes').innerHTML) {
	        var Teams = document.getElementById('mes').innerHTML;
			Teams = Teams.split('] против <');
            var myTeam = config.get('battle.myteam', 0);
	        if(!myTeam || myTeam < 1) {
	        	var UID = 0;
	        	//ID если мы невид.
				try {
					UID = document.getElementsByTagName('center')[1].innerHTML;
					UID = UID.split('\n').join('');
					UID = UID.match(/inf.php\?([0-9]+)/i);
					UID = +UID[1];
				} catch(e) {}
	        	var ualign = config.get('user.align');
				for(var t in Teams) {
					if(
						Teams[t].match(new RegExp("id='?\"?"+config.uid+"'?\"?",'i')) ||
						Teams[t].match(new RegExp("id='?\"?"+UID+"'?\"?",'i')) ||
						Teams[t].match(new RegExp("align_"+ualign+"\\.gif",'i')) ||
						Teams[t].match(new RegExp('selectFrend\\(','i'))
					) {
						var team = Teams[t].match(/private \[team-([0-9]+)\]/i);
						myTeam = team && team.length > 0 ? +team[1] : 666;
						config.set('battle.myteam', myTeam);
						break;
					}
				}
			}
			for(var t in Teams) {
				Teams[t] = "<"+Teams[t]+"]";
	            var team = Teams[t].match(/<img.+?team-([0-9])[^>]+>/i);
				team = team && team.length > 0 ? team[1] : 666;
				var Users = Teams[t].split('],');
				if(team == myTeam) {
					PA = "<img src='http://i.oldbk.com/i/lock.gif' width=20 height=15 border=0 style='cursor:pointer' onclick='Prv(\"private [team-"+team+"] \");'>";
				} else {
					PE += "<img src='http://i.oldbk.com/i/lock.gif' width=20 height=15 border=0 style='cursor:pointer' onclick='Prv(\"private [team-"+team+"] \");'> ";
				}
				for(var u in Users) {
					this.parseUser(Users[u]+']', team);
				}
				Users = null, team = null;
			}
			Teams = null;
		}
		if(this.eid) {
	        var enemy = this.Enemies[this.e];
	        if(enemy && enemy['inv']) {
	        	var clogin = enemy['clon'] ? "<b>"+enemy['rlogin']+"<sup>"+enemy['clonnum']+"</sup></b>" : "<b>"+enemy['rlogin']+"</b>";
	        	var ehtml = document.getElementsByTagName('table')[this.tnum].innerHTML;
	        	ehtml = ehtml.replace('??', enemy['level']);
	        	ehtml = ehtml.replace(/<b>([^<]+)<\/b>/i, clogin);
           		document.getElementsByTagName('table')[this.tnum].innerHTML = ehtml;
           		ehtml = null;
	        }
        }
		//проверка живых
		for(var uid in this.Enemies) {
			if(!this.LiveUsers[uid]) {
				this.Enemies[uid]['died'] = true;
				this.Enemies[uid]['hp'][0] = 0;
				this.Enemies[uid]['hp'][2] = 0;
				continue;
			} else if(this.LiveUsers[uid] == 2) {
				this.Enemies[uid] = false;
				continue;
			}
			this.EnemiesCount++;
			if(this.btype == 1 && this.showinfo) {
				var newB = document.createElement('b'), id = this.Enemies[uid]['id'],
				level = this.Enemies[uid]['level'], usAttack = this.Enemies[uid]['attack'] > 0 ? '('+Math.ceil((new Date() - this.Enemies[uid]['attack'])/1000)+')' : '';
				newB.setAttribute('style', 'font-size: 11px');
				newB.innerHTML = '['+level+']'+usAttack;
				document.getElementById(id).parentNode.insertBefore(newB, document.getElementById(id).nextSibling);
			}
		}
		//обновляем список
		config.set('battle.list', this.Enemies);
		config.set('battle.changes', this.Changes);
	}

	function getOpponentClasses(dom, enemy) {
		'use strict';
		var weapons = [];
		var runes = [];
		[].slice.call(dom.querySelectorAll('#att>table>tbody>tr>td:nth-child(3) center table a[target="_blank"]'))
			.forEach(function (a) {
				var name = a.getAttribute('href').replace(/.*\/(.*)\.html$/, '$1'),
					splitted = name.split('_');
				if (!/[0-9]+/.test(splitted[2])) {
					return;
				}

				var s = +splitted[3] || 0,
					i = (+splitted[2] - 18000) << (s && 2) + s,
					weapon = config.weapons[i];
				if (weapon) {
					weapons.push(weapon);
				}
			});

		[].slice.call(dom.querySelectorAll('#att>table>tbody>tr>td:nth-child(3) img[src*="/runes_anim"]'))
			.forEach(function (img) {
				var onMouseOver = new Function('ShowThing', img.getAttribute('onmouseover'));
				onMouseOver(function (win, width, height, content) {
					var dom = document.createElement('div');
					dom.innerHTML = content;
					var id = img.getAttribute('src').match(/anim([1-6])-[1-3]\.gif/)[1],
						name = dom.childNodes[0].textContent,
						level = +dom.childNodes[3].textContent;

					runes.push({id: id, name: name.toLowerCase().trim(), level: level});
				});
			});

		var stats = {str: 0, agil: 0, int: 0, dex: 0, intel: 0, wisd: 0};
		var statKeys = {
			'Сила': 'str',
			'Ловкость': 'agil',
			'Интуиция': 'int',
			'Выносливость': 'dex',
			'Интеллект': 'intel',
			'Мудрость': 'wisd'
		};
		var statsEl = dom.querySelector('#att>table>tbody>tr>td:nth-child(3) center>center>:last-child td');
		if (statsEl) {
			statsEl.innerText.split('\n').forEach(function (string) {
				var splitted = string.split(':');
				stats[statKeys[splitted[0].trim()]] = parseInt(splitted[1], 10);
			});
		}

		var modificators = {
			crit: stats.int * 5,
			dodge: stats.agil * 5,
			ac: stats.int * 2 + stats.agil * 2,
			ad: stats.agil * 2 + stats.int * 2
		};

		weapons.forEach(function (weapon) {
			modificators.crit += weapon >>> 24 & 0xff;
			modificators.ac += weapon >>> 16 & 0xff;
			modificators.dodge += weapon >>> 8 & 0xff;
			modificators.ad += weapon & 0xff;
		});

		//                  0,    1,      2,      3,    4,    5,    6
		var runesType = [null, 'ac', 'crit', 'dodge', 'ac', 'ad', 'ad'];
		//               0,  1,  2   3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16,  17,
		var runeLevel = [1, 10, 10, 20, 20, 30, 30, 40, 40, 50, 50, 65, 65, 80, 80, 95, 95, 110,
			//                   18,  19,  20,  21,  22,  23,  24,  25,  26,  27,  28,  29,  30
								110, 125, 145, 160, 176, 193, 211, 236, 256, 277, 299, 322, 345];
		runes.forEach(function (rune) {
			var type = runesType[rune.id];
			if (!type) {
				return;
			}
			modificators[type] += runeLevel[rune.level];
		});

		var classes = {
			class: null,
			subclass: null
		};

		if (stats.dex > 50 && stats.agil < 50) {
			classes.class = 'tank';
		} else {
			classes.class = modificators.crit > modificators.dodge ? 'crit' : 'dodge';
		}
		classes.subclass = modificators.ac > modificators.ad ? 'ac' : 'ad';

		return classes;
	}

	this.parseEnemy = function() {
		if(!this.tnum || !document.getElementsByTagName('table')[this.tnum]) return false;

		var data = document.getElementsByTagName('table')[this.tnum].innerHTML;
		var regex = /([0-9]?\.?[0-9]+)\.gif">(?:<img title="([^"]+)"[^>]+>)?<B>([^<]+)<\/B>\s?\[\s?(<font[^>]*><b>)?([0-9]+).*?\]\s?<a href="?inf.php\?([0-9]+)/i; //"
		var res = regex.exec(data);
		if(!res || res.length < 1) {
			if(data.indexOf('Невидимка') < 0) {
				console.error('bad user '+this.tnum);
				data = document.getElementsByTagName('table')[this.tnum-1].innerHTML;
				res = regex.exec(data);
				console.error(data);
			}
			if(!res || res.length < 1) return false;
		}
		//console.debug(res);
		var uid = 'U'+res[6], login = res[3], level = +res[5], clan = res[2], align = res[1];

		if(!this.Enemies[uid]) {
			console.error('воплот! '+uid+'/'+login);
			for(var u in this.Enemies) {
				var e = this.Enemies[u];
				if(!e || !e['login']) continue;
				if(login == e['login']) {
					this.Enemies[u]['vop'] = 1;
					this.Enemies[u]['bad'] = 1;
					this.Enemies[u]['like'] = true;
					uid = u;
					break;
				}
			}
        }

		if(!this.Enemies[uid]) {
			this.Enemies[uid] = {'attack': 0};
			console.error('bad user 2');
			return false;
		}

		this.Enemies[uid]['clan'] = clan;
        this.Enemies[uid]['align'] = align;
        this.Enemies[uid]['now'] = true;

		var enemy = this.Enemies[uid];
		var classes = getOpponentClasses(document.body, enemy);
		enemy.uclass = classes.class;
		enemy.utype = classes.subclass;

		if(!enemy['loaded']) {
			this.Enemies[uid]['loaded'] = true;
			if(this.isStrike(enemy)) {
				var elogin = enemy['rlogin'].toLowerCase(), fit = true;
		        var TMP = config.get('settings.battle.listusers');
		        for(var m in TMP) {
		        	if(!TMP[m] || TMP[m].length < 3) continue;
		        	var ulogin = TMP[m].trim().toLowerCase();
		        	if(ulogin == elogin) {
		        		fit = false;
		        		break;
		        	}
		        }
				this.Enemies[uid]['fit'] = fit;
			}

		}
	}

	this.parse = function() {
		var body = document.body.innerHTML;
        var WAIT = body.indexOf('Ожидаем хода противника...') > -1 || body.indexOf('пока бой закончат другие игроки') > -1 || Body.indexOf('>Бой закончен') > -1 ? true : false;
        var uid = config.get('battle.lastchangeid');
        if(uid && body.indexOf('Персонаж не найден') > -1) {
			if(this.Enemies[uid]) this.Enemies[uid]['bad'] = 1;
			this.Changes[uid] = true;
		} else if(uid && body.indexOf('Противник еще не ответил') > -1) {
			if(this.Enemies[uid]) this.Enemies[uid]['bad'] = 0;
			this.Changes[uid] = true;
		} else if(uid && this.Changes[uid]) {
			this.Changes[uid] = false;
		}
		var sid = +config.get('battle.laststrikeid');
		if(sid > 0) {
			if(document.getElementById(sid) && this.Enemies['U'+sid] && !this.Enemies['U'+sid]['clon'] && !this.Enemies['U'+sid]['mob'] && !this.Enemies['U'+sid]['bad']) {
        		var pu = document.getElementById(sid).parentNode.tagName;
        		if(pu == 'U') {
        			console.error('Непрошедшая атака по врагу... повторяем '+sid);
        			console.error(this.Enemies['U'+sid]);
        		} else {
        			this.Enemies['U'+sid]['attack'] = 0;
        		}
        	} else if(this.Enemies['U'+sid]) {
        		this.Enemies['U'+sid]['attack'] = 0;
        	}
        }

		config.set('battle.lastchangeid', false);
        config.set('battle.laststrikeid', false);
        config.set('battle.autokill', false);

		this.parseUsers();
		if(this.btype == 1) {
			this.parseEnemy();
		}

        //автобой вкл
		if(!WAIT) {
			if(this.cure()) {
				if(this.btype == 0) {
					this.attack();
					refresh(3000);
				} else if(this.btype == 1) {
					this.autohaot();
				} else if(this.btype == 2) {
					this.autorist();
				}
			} else refresh(10000);
		} else {
			//console.log('!Ожидаем чего-то...');
			refresh(5000);
		}
	}

	this.cure = function() {
		var NowHP = +config.get('user.hp.0'), MaxHP = +config.get('user.hp.1');
		var CureHP = 0, StopHP = 0, CureType = 'onlyscrolls';
		if(this.btype == 1) {
			CureHP = +config.get('settings.battle.curehpah');
            CureType = config.get('settings.battle.curetypeah');
            StopHP = +config.get('settings.battle.stophpah');
		} else if(this.btype == 2) {
			CureHP = +config.get('settings.battle.curehprs');
            CureType = config.get('settings.battle.curetypers');
            StopHP = +config.get('settings.battle.stophprs');
   		} else {
			CureHP = +config.get('settings.battle.curehp');
            CureType = config.get('settings.battle.curetype');
            StopHP = +config.get('settings.battle.stophp');
   		}
   		CureHP = CureHP >= MaxHP ? MaxHP - 25 : CureHP;
   		StopHP = StopHP >= MaxHP ? MaxHP - 25 : StopHP;

   		//console.debug(MaxHP+'/'+CureHP+'/'+StopHP+'/'+this.btype);
        //кол-во ХП ниже лимита
		if(StopHP > 0 && NowHP <= StopHP && !config.get('settings.battle.pause')) {
			if(!confirm('HP достигло лимита['+NowHP+'/'+StopHP+']. Продолжить бить?')) {
				config.set('settings.battle.pause',true);
				if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
					top.frames[1].bswitch();
				}
				return false;
			}
		}
		if(config.get('settings.battle.pause')) {
			return false;
		}

        //Автохил
		if(CureHP > 0 && NowHP <= CureHP && !config.get('battle.leaveuseheal')) {
			var cureID = 0;
			if((CureType == 'onlyscrolls' || CureType == 'firstscrolls') && this.Cures.length > 0) {
				var cure = this.Cures.shift();
				cureID = cure[0];
			} else if((CureType == 'onlyinstalls' || CureType == 'firstinstalls') && this.CuresIns.length > 0) {
				var cure = this.CuresIns.shift();
				cureID = cure[0];
			} else if(CureType == 'firstinstalls' && this.CuresIns.length < 1 && this.Cures.length > 0) {
				var cure = this.Cures.shift();
				cureID = cure[0];
			} else if(CureType == 'firstscrolls' && this.Cures.length < 1 && this.CuresIns.length > 0) {
				var cure = this.CuresIns.shift();
				cureID = cure[0];
			}
			if(cureID > 0) {
				location.href = "/fbattle.php?use="+cure[0]+"&enemy="+document.getElementById('penemy').value+"&defend="+document.getElementById('txtblockzone').value;
	            return false;
            }
		}
		return true;
	}

	this.autorist = function() {

		var enemy = this.Enemies[this.e], ListMobs = {};
        var TMP = config.get('settings.battle.listmobs');
        var lastMobNum = +config.get('settings.battle.ristlast');
        for(var m in TMP) {
        	var mob = TMP[m].match(new RegExp("^\s?([^0-9]+)[^0-9]*?([0-9]*)[^0-9]*?([0-9]*)[^0-9]*?$",'i'));
        	if(!mob) continue;
        	var mlogin = mob[1].trim().toLowerCase(), min = +mob[2] > 0 ? +mob[2] : 1, max = +mob[3] > 0 ? +mob[3] : 9999999999;
        	ListMobs[mlogin] = [min, max];
        }
        var min = [], max = [], LastMob = false, nlogin = enemy['rlogin'].toLowerCase(), nhp = +enemy['hp'][0];
        //console.debug('now '+nlogin+'['+nhp+']');
        for(var ulogin in ListMobs) {
         	//враг первый в очереди
	        if(!max[0] && !min[0] && ulogin == nlogin && ListMobs[ulogin][0] <= nhp && ListMobs[ulogin][1] >= nhp) {
	        	if(config.get('battle.leaveuseheal')) {
					config.set('battle.leaveuseheal', false);
					config.message("Новая волна, автохил включается", "Автобой: Ристалище");
				}
				//console.debug('strike it');
				this.attack();
				refresh(5000);
				return;
			//нашли кого бить переключаемся
			} else if(max[0] && min[0]) {
				break;
			}

			for(var uid in this.Enemies) {
	       		var user = this.Enemies[uid];
	       		if(typeof(user['hp']) != 'object' || user['died']) continue;

	       		var uhp = +user['hp'][0], elogin = user['rlogin'].toLowerCase();
				if(ulogin == elogin && ListMobs[ulogin][0] <= uhp && ListMobs[ulogin][1] >= uhp) {
					if(!max[0] || max[0] < uhp) max = [uhp, user['login'], uid];
					if(!min[0] || min[0] > uhp) min = [uhp, user['login'], uid];
					//console.debug('find '+elogin+'['+uhp+']');
				}
				if(lastMobNum > 0 && +user['clonnum'] >= lastMobNum) LastMob = true;
			}
		}

		if(config.get('settings.battle.risthp') && +max[0] > 0) {
        	this.ChangeEnemy(max[1], max[2]);
			refresh(5000);
			return;
        } else if(+min[0] > 0) {
			this.ChangeEnemy(min[1], min[2]);
			refresh(5000);
			return;
		}
		if(LastMob || this.AlliesCount == 1) {
			if(!config.get('battle.leaveuseheal')) {
				config.set('battle.leaveuseheal', true);
				config.message("Убиваемся об моба. Автохил отключается", "Автобой: Ристалище");
			}
			this.attack();
		}
		refresh(3000);
		return;
	}

	this.autohaot = function() {

		var enemy = this.Enemies[this.e];

		if(typeof(enemy) != 'object') {
			refresh(3000);
			return;
		}
		var LastStrikeIs = +new Date() - config.get('battle.laststrike');
		var StrikeTime = config.get('battle.striketime');

		//вы один и подходит тайм
        if(this.AlliesCount == 1 && LastStrikeIs >= StrikeTime) {
        	console.debug('alone user. strike by timeout');
        	this.attack(1000);
			refresh(5000);
			return;
		}

		//Враг подходит по настройкам, бьём.
		var usAttack = enemy['attack'] > 0 ? +new Date() - enemy['attack'] : 0;
		var lvclon = enemy['clon'] > 0 && config.get('settings.battle.leaveclons') ? true : false;
        //console.debug('leave clons: '+lvclon+'/'+enemy['login']);
		if(!lvclon && ( enemy['fit'] || (enemy['like'] && usAttack >= StrikeTime) ) ) {
			//console.debug('strike '+enemy['login']+'['+enemy['level']+']: F['+enemy['fit']+'] C['+enemy['clon']+'] T['+usAttack+'/'+StrikeTime+']');
			this.attack(1000);
			refresh(5000);
			return;
		}
        //сортировка по уровню от больших к мелким
        this.resortUsers();

		//очищаем список от несменяемых, невидов, и тех, кого уже били/ и проверяем красных. приоритет своему уровню, подходят к тайму
		var Clean = {}, cntr = 0, actual = 0, litenemy = 0;
		for(var uid in this.Enemies) {
			var user = this.Enemies[uid];
			if(!user || user['died'] || (user['clon'] && lvclon)) continue;

			var usAttack = user['attack'] > 0 ? +new Date() - user['attack'] : 0;
			var isTimeOut = usAttack >= StrikeTime ? true : false;

			//есть об кого убиться
			if( user['hard'] && (user['uclass'] == 'dodge' || user['uclass'] == 'tank') ) {
            	litenemy++;
            }
            //актуальные и тайм
			if(user['like'] ) {
				if( user['fit'] || (!user['loaded'] && !user['inv'] && !user['vop'] && !user['bad']) ) {
					actual++;
				}
				if(isTimeOut && !user['inv'] && !user['vop'] && !user['bad']) {
					this.ChangeEnemy(user['login'], uid);
					refresh(3000);
					return;
				}
			}
            //враг с уже в размене или не подходит по настройкам
			if((this.Changes[uid] && usAttack < 1) || (user['loaded'] && !user['fit']) || user['bad'] || user['inv'] || user['vop']) continue;

			Clean[uid] = this.Enemies[uid];
			cntr++;
		}
		//Самоподрыв!
		if((actual < 1 && config.get('settings.battle.autokill')) || (this.AlliesCount == 1 && config.get('settings.battle.autodie'))) {
			config.set('battle.autokill', true);
			if(litenemy < 1 || enemy['uclass'] == 'dodge' || enemy['uclass'] == 'tank') {
				//console.debug('strike!');
				this.attack(1000);
				refresh(5000);
				return;
			} else {
				for(var uid in this.Enemies) {
					var user = this.Enemies[uid];
					if(user['died'] || user['bad'] || user['inv'] || user['vop'] || this.Changes[uid]) continue;
					if(user['uclass'] == 'dodge' || user['uclass'] == 'tank') {
						console.debug('change! '+user['uclass']);
						this.ChangeEnemy(user['login'], uid);
						refresh(3000);
						return;
					}
				}
			}
		} else {
			config.set('battle.autokill', false);
		}
        //Ищем актуальных врагов
        var changeTo = false, changeId = false;
        for(var uid in Clean) {
			var user = Clean[uid];
            if(user['loaded'] && user['fit']) {
				changeTo = user['login'], changeId = uid;
				break;
        	}
        	if(!changeId && !user['loaded']) {
				changeTo = user['login'], changeId = uid;
        	}
		}
        if(changeId) {
        	this.ChangeEnemy(changeTo, changeId);
			refresh(3000);
			return;
        }

       	config.set('battle.changes', {});
		refresh(3000);
	}

	this.attack = function(elapsed) {
		var Wait = config.get('settings.battle.marinad');
        elapsed = elapsed > 0 ? elapsed : 525;
		if(+Wait > 0) {
			Wait *= 1000;
			var LS = config.get('battle.laststrike');
			var STIME = +new Date() - LS;
			elapsed = Wait - STIME;
		}
		this.Enemies = null;
		this.Changes = null;
 		setTimeout('aPlugin()', elapsed);
	}

	this.ChangeEnemy = function(login, id) {
		if(id) config.set('battle.changes.'+id, true);
		config.set('battle.lastchangeid', id);
		this.Enemies = null;
		this.Changes = null;
		location.href='/fbattle.php?login_target='+login+'&rnd='+Math.random();
	}

	this.parse();
}

//смена игрока
function ChangeEnemy(login, id) {
	if(document.all("hint3").style.visibility == "visible" && document.getElementById("enterlogin") != null) {
		 document.getElementById('enterlogin').value = login;
	} else {
		if(id) config.set('battle.changes.'+id, true);
		config.set('battle.lastchangeid', id);
		window.location.href = '/fbattle.php?login_target='+login+'&rnd='+Math.random();
	}
}
//обновление страницы
function refresh(time){
	setTimeout(function() {
		window.location.href = '/fbattle.php?rnd='+Math.random();
	}, (time > -1 ? time : 5000));
}
//генератор ударов
function gen(type) {
	var percents = config.get('settings.battle.style.'+(type=='strike'?'strike':'block'));
	generator = [];
	for(var p in percents) {
		var prc = Math.ceil(percents[p] / 5);
		for(var i=prc;i>0;i--) {
			generator.push(p);
		}
	}
	var rnd = Math.floor(Math.random()*(generator.length-1));
	var striketo = generator[rnd];
	switch(striketo) {
		case 'head': return 1; break;
		case 'body': return 2; break;
		case 'groin': return 3; break;
		case 'legs': return 4; break;
		default: return 2; break;
	}
}
function setAttack() {
	if(document.getElementById('A1')) {
		var gattack = gen('strike');
		var gdefend = gen('block');
		document.all['A'+gattack].checked = true;
		document.all['D'+gdefend].checked = true;
		document.getElementById('txtblockzone').value = gdefend;
		attack=true, defend=true;
	} else {
		console.error('can`t find attack/defend zones!');
	}
	return true;
}

function aPlugin() {
    if(attack && defend) {
		var time = +new Date();
		config.set('battle.changes.U'+Eid, true);
		config.set('battle.laststrike', time);
		config.set('battle.laststrikeid', Eid);
		document.forms["att"].submit();
		return true;
	}
	config.message("Блок или удар не выбран!");
	return false;
}

var Bid = false, Mid = false;
var inputs = document.getElementById('att').getElementsByTagName('input');
for(var i in inputs) {
	if(typeof(inputs[i]) != 'object') continue;
	if(inputs[i].getAttribute('name') == 'batl') {
		Bid = inputs[i].value;
	}
	if(inputs[i].getAttribute('name') == 'myid') {
		Mid = inputs[i].value;
	}
}

var Body = document.body.innerHTML;
var Die = (Body.indexOf('пока бой закончат другие игроки') > -1 || Body.indexOf('>Бой закончен') > -1) ? true : false;
//вами нанесено урона:<B>202 HP</B>.
if(Body.indexOf("вами нанесено урона:") > -1) {
	var dmg = Body.match(/<B>([0-9]+)\s*HP<\/B>\./i);
	if(dmg && dmg.length > 1) {
		config.set('battle.damage', +dmg[1]);
	}
}
var Enum = 13, Eid = false;
//конец боя
if(Body.indexOf('>Бой закончен') > -1) {
	console.debug('end battle');
    config.set('battle', null);
    if(top.frames[3] && typeof(top.frames[3].tactics) == 'function') {
		top.frames[3].tactics(2);
	}
    //config.battle(2);
	document.forms["att"].submit();
	refresh();
} else if(Body.indexOf('Противник долго не делает') > -1) {
	var inputs = document.getElementsByTagName('input');
	for(var i in inputs) {
		if(typeof(inputs[i]) != 'object') continue;
		if(config.eq('settings.battle.wewin', 1) && inputs[i].getAttribute('name') == 'victory_time_out') {
			inputs[i].click();
		} else if(config.eq('settings.battle.wewin', 2) && inputs[i].getAttribute('name') == 'victory_time_out2') {
			inputs[i].click();
		} else if(config.eq('settings.battle.wewin', 0) && inputs[i].getAttribute('name') == 'battle') {
			inputs[i].click();
		}
	}
} else if(Bid && Mid) {

	var tables = document.getElementsByTagName('table');

	if(tables.length > 13) {
		var enemy = tables[13].innerHTML;
		if(typeof(enemy) == 'string') {
	    	var enemyid = enemy.match(/inf.php\?([0-9]+)/i);
	    	if(enemyid && enemyid.length > 0) {
	    		Eid = +enemyid[1];
	    	} else {
	    		var enemy = tables[14].innerHTML;
	    		if(typeof(enemy) == 'string') {
		    		var enemyid = enemy.match(/inf.php\?([0-9]+)/i);
			    	if(enemyid && enemyid.length > 0) {
			    		Eid = +enemyid[1];
			    		Enum = 14;
			    	}
				}
	    	}
	    }
		document.getElementById('go').onclick = aPlugin;
        setAttack();
        var BType = 0;
		//начало боя
		if(Bid && !config.eq('battle.id', Bid)) {
			console.debug('battle start $');
			//Определяем таймаут боя
			var TM = Body.match(/Бой идет с таймаутом ([0-9]+)/i);
			var timeout = (TM && TM.length > 0) ? (TM[1] * 60) : 60;

			var autostrike = config.get('settings.battle.autoanswer', 0);
			var striketime = autostrike > 0 ? autostrike * 1000 : (timeout > 60 ? (((timeout / 2) - 10) * 1000) : 55000);
			var New  = {
				'hcures': 0, 'icures': 0, 'id': Bid, 'laststrike': +new Date(), 'starttime': +new Date(),
		       	'timeout': timeout, 'striketime': striketime, 'damage': 0, 'list': {}, 'changes': {}
			};
			config.set('battle', New);
			BType = 1, New = null;
			if( config.get('settings.battle.resetpause') && config.get('settings.battle.pause') ) {
				config.set('settings.battle.pause', false);
			}
			if(top.frames[1] && typeof(top.frames[1].bswitch) == 'function') {
				top.frames[1].bswitch();
			}
		}
	} else {
		//console.error('Ошибка парса врага ['+Enum+'/'+Bid+'/'+Mid+']. Обновляем... ');
		refresh(3000);
	}

	new Battle(Eid, Enum, Die);

	if(top.frames[3] && typeof(top.frames[3].tactics) == 'function') {
		top.frames[3].tactics(BType);
	}
    //config.battle(BType);
	Battle = null;
}


