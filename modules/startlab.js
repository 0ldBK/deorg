//console.debug("startlab loaded");

function refreshPeriodic(){
	//console.debug("Refresh page");
	location.href = '/startlab.php?rnd='+Math.random();
	timerID = setTimeout("refreshPeriodic()",60000);
}
clearTimeout(timerID);
timerID = setTimeout("refreshPeriodic()",60000);


//брать и сдавать квесты
var QuestAction = config.get('settings.lab.questtake');
//не входить в лабу без квеста
var QuestCheck = config.get('settings.lab.questenter');
//автовход в лабу
var LabEnter = config.get('settings.lab.enter');

function check_quest(mess) {
	console.log('check_quest '+mess);
	config.set('lab', {});
	config.broadcast("/startlab.php", function(html) {
		if(html) {
			html = html.split('\n').join('');
			if(html.indexOf("У Вас есть незавершенное задание") > -1) {
				var queststage = html.match(/<b>Выполнено:\s*<\/b>\s*([0-9]+)\/([0-9]+).+?([0-9]+)\/([0-9]+).+?([0-9]+)\/([0-9]+).+?([0-9]+)\/([0-9]+)/i);
				//console.debug(queststage);
				if(!queststage || queststage.length < 1 || (queststage.length > 0 && queststage[4] == undefined)) {
					queststage = html.match(/<b>Выполнено:\s*<\/b>\s*([0-9]+)\/([0-9]+)\s*</i);
				}
				//console.debug(queststage);
                var min = 0, max = 0, qname = quest[0];
				for(var n=queststage.length-1;n>1;n-=2) {
					if(queststage[n] == undefined) continue;
					min += Math.ceil(queststage[n-1]);
					max += Math.ceil(queststage[n]);
				}

       			//console.log('quest taked');
        		//var queststage = html.match(/([0-9]+)\/([0-9]+)\s*</i);
        		if(mess) {
        			//console.debug(mess);
        			var qname = html.match(/задание\s?:\s?(.+?)<\/b>/i);
        			//console.debug(qname);
        			config.message("Взят квест: "+qname[1]);
        		}
        		if(!queststage || queststage.length < 1) config.message("Не могу определить состояние квеста!");
                 //console.log('Qquest ['+min+'/'+max+']');
        		if(queststage && queststage.length > 0 && max > 0 && min >= max) {
        			if(QuestAction) {
        				//console.log('Returned quest');
        				return_quest();
        			}
        		} else {
        			//console.log('Unfinished quest');
	        		if(LabEnter) {
	        			//console.log('Autologin to the lab...');
	        			goto_lab();
	        		} else {
	        			//console.debug("Refresh page without autologin 1");
	        		}
        		}
        	} else {
        		 if(QuestAction) {
        		 	//console.log('To take quest');
        		 	var QuestIDs = [], take = false;
                    var questsids = html.match(/name="new" value="[0-9]+">/ig);
                    for(var i in questsids) {
                    	var qid = questsids[i].match(/name="new" value="([0-9]+)">/i);
                    	//console.log(qid);
                    	if(qid && qid[1] > 0) {
                    		take = true;
	                        //QuestIDs.push(qid[1]);
	                        take_quest(qid[1]);
	                        break;
                        }
                    }
                    if(!take) {
                    	//console.debug("Refresh page no taked quest");
					}
                    //console.log(QuestIDs);
        		 } else {
	        		if(!QuestCheck && LabEnter) {
	        			//console.log('Autologin to the lab...');
	        			goto_lab();
	        		} else if(QuestCheck && LabEnter) {
	        			//console.log('Autologin to the lab... not taken quest!');
	        			config.message("Автовход в лабу не работает. Причина: не взят квест!", "Автолаба");
	        		} else {
	                    //config.message("Автовход в лабу выключен. Внимание! У вас не взят квест!");
	                    //console.debug("Refresh page without autologin 2");
	        		}
	       		}
			}
		} else {
			check_quest();
		}
	}, "quest=Взять квестовое задание");
}

//вход в лабу
function goto_lab() {
	if (document.body.innerHTML.indexOf("До следующего посещения лабиринта") != -1) {
    	console.debug('Ещё не время!');
    	if(config.get('settings.lab.uselabkey')) {
	     	var Keys = [],
                ListOfKeys = [
	     		'Ключ от Лабиринта', 'Малый свиток «Пропуск в Лабиринт»', 'Средний свиток «Пропуск в Лабиринт»',
                'Большой свиток «Пропуск в Лабиринт»', 'Совершенный свиток «Пропуск в Лабиринт»'];
            function checkInv(num) {
                config.parseInv(num, function(List) {
                    for(var k in ListOfKeys) {
                        var key = ListOfKeys[k];
                        if(List[key] && List[key].length > 0) {
                            Keys = Keys.concat(List[key]);
                        }
                    }
                    var id = 0, elapsed = 0, d = 0, r = 0;
                    for(var i in Keys) {
                        var Key = Keys[i], D = 'X'+Key[5];
                        var reg = D.match(/X([0-9]{2})([0-9]{2})([0-9]{4})/i);
                        if(reg && reg.length > 0) {
                            r = reg[3]+''+reg[2]+''+reg[1];
                        }
                        if(!id || +r < +d) {
                            id = Key[0], elapsed = Key[4], d = r;
                        }
                    }
                    console.debug(id+'/'+elapsed+'/'+d);
                    if(+id > 0) {
                        config.InUse = true;
                        config.use({'id':id}, function(data) {
                            config.InUse = false;
                            if(data.indexOf("Вы использовали Ключ") > -1) {
                                config.message('Использован ключ лабиринта на персонажа '+config.get('user.login')+' #'+id+' ['+elapsed+'] срок '+d, 'Ключ лабиринта');
                            } else {
                                console.error(data);
                                config.message('Ошибка использования ключика :(','Ключ лабиринта');
                            }
                        });
                    } else {
                    	if (num === 1) {
                    		checkInv(2);
						} else {
                            config.message('Ключей нет. Совсем нет. Ну вот ваще ни одного :(','Ключ лабиринта');
						}
                    }
                });
            }
            checkInv(1);
		}
	} else if(document.body.innerHTML.indexOf("Лабиринт переполнен") != -1) {
		console.debug('переполняшке!');
		config.message("Лабиринт переполнен 0_о. Превед переполнившим (смайлик краба)", "Автолаба");
	} else if(document.body.innerHTML.indexOf("через 10 Хаотических боев!") != -1) {
		console.debug('Хаоты надо!');
		//config.message("10 хаотов мне запили!", "Автолаба");
	} else {
		console.log('Входим!');
		config.message("Автовход в лабу", "Автолаба");
		if(document.getElementsByName("open").length > 0) {
			document.getElementsByName("open")[0].click();
		} else if (document.getElementsByName("startzay").length > 0) {
			document.getElementsByName("startzay")[0].click();
		}
	}
}
//взятие квеста
function take_quest(id) {
	config.broadcast("/startlab.php", function(html) {
		if(html) {
			if(id) config.message("Берем квест #"+id+"... ", "Автолаба");
			check_quest(true);
		} else {
			config.message("Ошибка взятия квеста #"+id+"... пробуем ещё раз", "Автолаба");
			setTimeout(function () {
				take_quest(id);
			}, 3000);
		}
	}, "new="+id+"&quest=Взять квест");
}

//сдача квеста
function return_quest() {
	config.broadcast("/startlab.php", function(html) {
		if(html) {
			config.message("Сдаём выполненный квест...", "Автолаба");
            var qname = html.match(/<b>У Вас есть незавершенное задание:(.+?)<\/b>/i);
            var award = html.match(/color="?'?red"?'?>(.+?)<\/font>/i); //"'
            if(award.length > 0) {
            	config.message("Квест "+qname[1]+" сдан. "+award[1]+"");
            }
			take_quest();
		} else {
			return_quest();
		}
	}, "fin=true&quest=Завершить задание");
}

//запускаемся
check_quest();

//console.log('test');


