var Url = window.location.href.toString();
var uid = document.cookie.match(/ battle=([^;]+)/i);
uid = uid ? Math.ceil(uid[1]) : 0;

var defVals = {
	'user' : {		'hp' : [0,0,0] //min,max,percent
	},
	'lastcall': {'info': 600,'haos': 600,'sost': 600, 'flood': 0, 'eat': 180, 'refresh': 0},
	'settings' : {
		'radio': false,
		'hpalert': [100,true,false], //percent,on,alertet
		'lab' : {
			'navytype': 0,
			'autoheal' : [1, 2, 0, 99,0,0], //min hp, where eat buter, автоматы/<100%
			'antidot' : [16,false], //жрать антидот при времени ловушки > x / сначала большие
			'attack': [[300,500],[500,600]], //normal[left,right], heroic[left,right]
			'start': true, //включить автогенерацию пути
			'enabled': true, //включить сам скрипт
			'pause': false,//пауза переходов
			'leave': false,//пропуск пустых путей
			'leaveheal': false,//пропуск лечилок как пустых путей
			'autodrop': [true,false,false],//сбор дропа,идти на выход
			'enter': false,//автовход в лабу
			'questenter': false,//не входить если квест не взят
			'questtake': false,//Авто сдача и взятие квестов
			'heroic': false,//автовход в героик
			'exit': false,//автовыход из лабы
			'set': [0,0,0,0,0,0,0], //одеваемся [оружие, кольца, тест оружия, броня, шлем, боты, щит]
			'use666' : false,
			'step': [3.1,6,1.5,6,false], //время перехода обычная, +лова, героик, +лова
			'dealer': true,
			'sellarts': true,
			'sellfigures': true,
			'sellartsafter': true,
			'stopifundress': 0,
			'artefacts': [
				['Дубинка Радости',false],
				['Меч Кромуса',false],
      ['Топор Вихря',false],
      ['Меч Героев',false],
				['Кольцо Жизни',false],
				['Великое Кольцо Жизни',false],
				['Щит Пророчества',false],
				['Щит Откровения',false],
				['Панцирь Злости',false],
				['Доспех Хаоса',false],
	    ['Броня Ангела',false],
	    ['Доспех -Броня Титанов-',false],
				['Закрытый шлем Развития',false],
				['Шлем Ангела',false],
				['Лучшие Ботинки',false]
			],
			'opendoors' : [
				['Никого',50],
				['Монстр',1],
				['Пандора',1],
				['Лечилка',10],
				['Аэлла',1],
				['Грифон',1],
				['Химера',1],
				['Гидра',1],
				['Пирагмон',1],
				['Амфисбена',0],
				['Сын Ареса',0],

			],
			'hpbosses' : [
				['Аэлла',400],
				['Грифон',400],
				['Химера',500],
				['Гидра',500],
				['Пирагмон',600],
				['Амфисбена',800],
				['Сын Ареса',800]
			]
  },
		'battle' : {
			'listmobs' : [], //бить по списку
			'auto': 'strike', //strike, timeout
			'enabled' : true, //собсно сам скрипт
			'start' : true, //собсно удары вкл

			'stophp' : 0,//останавливаться если хп ниже
    'curehp': 0,//автохил
    'curetype': 'onlyscrolls',
    'stophpah' : 0,
    'curehpah': 0,//автохил хаоты
    'curetypeah': 'onlyscrolls',
    'stophprs' : 0,
    'curehprs': 0,//автохил риста
    'curetypers': 'onlyscrolls',

    'atype': 0,
    'wewin': 0,
    'esort': 0,
    'design' : 2,
    'answertime': 90,
			'style': {
				'block': { 'head': 100, 'body': 100, 'groin': 100, 'legs': 100 },
				'strike': { 'head': 100, 'body': 100, 'groin': 100, 'legs': 100 },
				'critac': { 'min': 0, 'max': 99 },
				'critad': { 'min': 0, 'max': 99 },

				'dodgeac': { 'min': 0, 'max': 99 },
				'dodgead': { 'min': 0, 'max': 99 },

				'tankac': { 'min': 0, 'max': 99 },
				'tankad': { 'min': 0, 'max': 99 },

				'other': { 'min': 0, 'max': 99 },
				'bad': { 'min': 0, 'max': 99 },
				'mob': { 'min': 0, 'max': 99 },
				'inviz': { 'min': 0, 'max': 99 },
			}
		},
		'base' : {
			'chatsize' : 60,
			'chatupdate' : false,
			'chatoff' : false,
			'chatolddesign' : false,
			'consoleerr' : false,
			'showinfo': [false,true,true,true],
			'chatdeltab' : [false,false,false,false,false],
			'update': {'info': 60,'haos': 60,'sost': 60, 'flood': -1, 'eat': 180, 'refresh': -1 },
			'flood' : '',
			'sounds': {'volume': 0, 'system': false, 'private': false, 'heal': false, 'attack': false, 'trap': false, 'friend': false}
		},
		'outcity' : {			'attackhp': 500
		}
	}
};


var ObjectStorage = function ObjectStorage( name ) {
	var self, name = name || '_objectStorage';
	if ( ObjectStorage.instances[ name ] ) {
		self = ObjectStorage.instances[ name ];
	} else {
		self = this;
  		self._name = name;
  		self._stop = false;
  		self._init();
  		ObjectStorage.instances[ name ] = self;
	}
	return self;
};
ObjectStorage.instances = {};
ObjectStorage.prototype = {
	_save: function() {		if(this._stop) return;
		var stringified = JSON.stringify( this[ 'local' ] ), storage = window[ 'localStorage' ];
		if( storage.getItem( this._name ) === stringified || !stringified ) {
			//console.log('not changed settings '+stringified);
			return;
		}
		console.log('save settings '+this._name);
		storage.setItem( this._name, stringified );
	},

	_get: function() {
		this[ 'local' ] = JSON.parse( window[ 'localStorage' ].getItem( this._name ) ) || {};
	},

	_init: function() {
		var self = this;
		self._get();
		(function callee() {
			setTimeout( function () {				if(!self._stop) {
					self._save();
					callee();
				}
			}, 10000 );
		})();
		if(window.addEventListener) {
	        window.addEventListener( 'beforeunload', function () {
	        	console.debug('save data before unload page');
	            if(!self._stop) self._save();
	        });
        } else {
	        window.onbeforeunload = function () {
	        	console.debug('save data before unload page 2');
	            if(!self._stop) self._save();
	        };
        }
	},

	_kill: function() {		console.error('kill websql');		this._stop = true;
	},

	local: {}, session: {}
};

console.debug('renew5 websql');
var Settings = new ObjectStorage( 'U'+uid );

