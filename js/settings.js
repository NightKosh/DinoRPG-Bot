
$(document).ready(function () {
	var autoFightSettings = new AutoFightSettings();
	
	if (isLocalStorageAvailable) {
		// Добавляет дино
		$("#add_dinoz").click(function () {
			autoFightSettings.add($("#dinoz").val());
		});
		// Удаляет дино
		$("#remove_dinoz").click(function () {
			autoFightSettings.remove($("#dinoz").val());
		});
		// Чистит список дин
		$("#clear_dinoz").click(function () {
			autoFightSettings.clearDinoz();
		});
		// Чистит статистику
		$("#clear_stats").click(function () {
			autoFightSettings.clearStats();
		});
		// Удаляет настройки
		$("#clear_settings").click(function () {
			autoFightSettings.clearSettings();
		});
		
		// разворачивает/сворачивает настройки
		$(".time_settings").mouseenter(function () {
			$(this).stop().animate({
				height : $(this).attr("sheight")
			}, "slow");
		}).mouseleave(function () {
			$(this).stop().animate({
				height : 30
			}, "slow");
		});
		// сохраняет настройки
		$("#save_settings").click(function () {
			saveSettings("redirectTime", 
						parseInt($("#redirect .min_time:first").val()), 
						parseInt($("#redirect .rand_time:first").val()), 
						parseInt($("#redirect .count:first").val()));
			
			saveSettings("newTurnTime", 
						parseInt($("#new_turn .min_time:first").val()), 
						parseInt($("#new_turn .rand_time:first").val()), 
						parseInt($("#new_turn .count:first").val()));
			
			saveSettings("fightTime", 
						parseInt($("#fight .min_time:first").val()), 
						parseInt($("#fight .rand_time:first").val()), 
						parseInt($("#fight .count:first").val()));
			
			saveSettings("continueTime", 
						parseInt($("#continue .min_time:first").val()), 
						parseInt($("#continue .rand_time:first").val()), 
						parseInt($("#continue .count:first").val()));
			
			saveSleepTime(parseInt($("#sleep_begin_time").val()),
						  parseInt($("#sleep_end_time").val()));

			
			saveShopSettings(parseInt($("#shop_irmas").val()),
							 parseInt($("#shop_burger").val()),
							 parseInt($("#shop_pie").val()),
							 parseInt($("#shop_ration").val()),
							 parseInt($("#shop_bread").val()));
			
			saveLevel(parseInt($("#dinoz_level").val()));
		});
		// пересчёт времени хода
		$("#clear_time").click(function () {
			autoFightSettings.clearTime();
		});
	}
	
	function saveSettings (key, minTime, randTime, countTime) {
		if (!isNaN(minTime) && !isNaN(randTime) && !isNaN(countTime)) {
			autoFightSettings.setSettings(key, {
				"minTime"  : minTime,
				"randTime" : randTime,
				"count"    : countTime
			});
		}
	}
	
	function saveSleepTime (beginTime, endTime) {
		if (!isNaN(beginTime) && !isNaN(endTime)) {
			autoFightSettings.setSettings("sleepTime", {
				"beginTime" : beginTime,
				"endTime"   : endTime
			});
		}
	}
	
	function saveShopSettings (irmas, burger, pie, ration, bread) {
		if (!isNaN(irmas) && !isNaN(burger) && !isNaN(pie) && !isNaN(ration) && !isNaN(bread)) {
			autoFightSettings.setSettings("shop", {
				"irmas"  : irmas,
				"burger" : burger,
				"pie"    : pie,
				"ration" : ration,
				"bread"  : bread
			});
			
			if (irmas > 0 || burger > 0 || pie > 0 || ration > 0 || bread > 0) {
				autoFightSettings.setSettings('daySettings', {
					'shop'   : true,
					'irmas'  : irmas,
					'burger' : burger,
					'pie'    : pie,
					'ration' : ration,
					'bread'  : bread
				});
			}
		}
	}
	
	function saveLevel (level) {
		if (!isNaN(level)) {
			autoFightSettings.setSettings("dinozLevel", level);
		}
	}
	
	function isLocalStorageAvailable () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			console.log("Ваш браузер не поддерживает Local Storage");
			return false;
		}
	}
});

/**
 * Настройки автофармилки
 *
 * @class
 */
var AutoFightSettings = function () {
	var dinozList = [];
	var settings = {};
	var STATE = {
		GET_TIME : 0,
		WAIT     : 1,
		NEW_TURN : 2,
		FIGHT    : 3,
		SHOP     : 4,
		HEAL     : 5,
		SLEEP    : 6
	}
	
	/** Конструктор */
	var AutoFightSettings = function () {
		getDinozList();
		updateList();
		
		getSettings();
		showSettings();
	}
	
	/** Получает список динозов */
	var getDinozList = function () {
		var dinoz = localStorage.getItem("dinoz_list");
		if (dinoz == null) {
			console.log("Список динозов пуст");
		} else {
			dinozList = JSON.parse(dinoz);
		}
	}
	
	/** Получает настройки */
	var getSettings = function () {
		var s = localStorage.getItem("settings");
		if (s == null) {
			settings = getDefaultSettings();
			saveSettings();
		} else {
			settings = JSON.parse(s);
		}
	}
	
	/**
	 * Добавляет диноза
	 * 
	 * @param {int} id Айди диноза
	 */
	this.add = function (id) {
		console.log(id, dinozList);
		if (id != '') {
			dinozList.push({
				'id'     : id,
				'tCount' : 0,
				'hp'     : 0,
				'gold'   : 0
			})
			
			settings.state = STATE.GET_TIME;
			settings.isCheck = false;
			settings.lastCheck = 0;
			settings.time = 0;
			
			saveSettings();
			saveDinozList();
		}
	}
	
	/**
	 * Удаляет диноза
	 * 
	 * @param {int} id Айди диноза
	 */
	this.remove = function (id) {
		for (var i = 0, length = dinozList.length; i < length; i++) {
			if (dinozList[i].id == id) {
				dinozList.splice(i, 1);
				saveDinozList();
				
				settings.state = STATE.GET_TIME;
				settings.isCheck = false;
				settings.lastCheck = 0;
				settings.time = 0;
				
				saveSettings();
				
				break;
			}
		}
	}
	
	/** Сохраняет список динозов */
	var saveDinozList = function () {
		localStorage.setItem("dinoz_list", JSON.stringify(dinozList));
		updateList();
		console.log(dinozList);
	}
	
	/** Сохраняет настройки */
	var saveSettings = function () {
		localStorage.setItem("settings", JSON.stringify(settings));
	}
	
	/**
	 * Изменяет значение поля настроек
	 *
	 * @param {string} key Имя поля
	 * @param {} value Значение
	 */
	this.setSettings = function (key, value) {
		settings[key] = value;
		saveSettings();
	}
	
	/** Удаляет сохранённых динозов*/
	this.clearDinoz = function () {
		dinozList = [];
		saveDinozList();
		
		settings.state = STATE.GET_TIME;
		settings.isCheck = false;
		settings.lastCheck = 0;
		settings.time = 0;
		
		saveSettings();
		
		console.log("Локальное хранилище очищено!");
	}
	
	/** Удаляет все сохранённые данные */
	this.clear = function () {
		localStorage.clear();
		dinozList = [];
		settings = getDefaultSettings();
		saveSettings();
		
		updateList();
		console.log("Локальное хранилище очищено!");
	}
	
	/** Восстанавливает дефолтные настройки */
	this.clearSettings = function () {
		settings = getDefaultSettings();
		saveSettings();
		
		showSettings();
		console.log("Локальное хранилище очищено!");
	}
	
	/** Сбрасывает время нового хода */
	this.clearTime = function () {
		settings.state = STATE.GET_TIME;
		settings.isCheck = false;
		settings.lastCheck = 0;
		settings.time = 0;
		
		saveSettings();
	}
	
	/** Сбрасывает статистику */
	this.clearStats = function () {
		for (var i = 0, length = dinozList.length; i < length; i++) {
			dinozList[i].tCount = 0;
			dinozList[i].hp = 0;
			dinozList[i].gold = 0;
		}
		saveDinozList();
		updateList();
	}
	
	/** Выводит массив динозов */
	var updateList = function () {
		var dinozListEl = $("#dinoz_list tbody");
		dinozListEl.empty();
		var tCount = 0,
			hp     = 0,
			gold   = 0;
		for (var i = 0, length = dinozList.length; i < length; i++) {
			dinozListEl.append("<tr><td>" + 
									dinozList[i].id + "</td><td>" + 
									dinozList[i].tCount + "</td><td>" + 
									dinozList[i].hp + "</td><td>" + 
									dinozList[i].gold + "</td></tr>"   /*+
									"<td class='remove_dinoz' onclick='self.remove(" + dinozList[i].id + ")'></td></tr>"*/
			);
			tCount += dinozList[i].tCount;
			hp     += dinozList[i].hp;
			gold   += dinozList[i].gold;
		}
		dinozListEl.append("<tr><td>Итого</td><td>" + 
								tCount + "</td><td>" + 
								hp + "</td><td>" + 
								gold + "</td></tr>"
		);
	}
	
	/** Выводит настройки на форму */
	var showSettings = function () {
		$("#redirect .min_time:first").val(settings.redirectTime.minTime); 
		$("#redirect .rand_time:first").val(settings.redirectTime.randTime);  
		$("#redirect .count:first").val(settings.redirectTime.count); 
		
		$("#new_turn .min_time:first").val(settings.newTurnTime.minTime); 
		$("#new_turn .rand_time:first").val(settings.newTurnTime.randTime);
		$("#new_turn .count:first").val(settings.newTurnTime.count);
		
		$("#fight .min_time:first").val(settings.fightTime.minTime); 
		$("#fight .rand_time:first").val(settings.fightTime.randTime);
		$("#fight .count:first").val(settings.fightTime.count);
		
		$("#continue .min_time:first").val(settings.continueTime.minTime); 
		$("#continue .rand_time:first").val(settings.continueTime.randTime);
		$("#continue .count:first").val(settings.continueTime.count);
		
		try {
			$("#sleep_begin_time").val(settings.sleepTime.beginTime);
			$("#sleep_end_time").val(settings.sleepTime.endTime);
		} catch (e) {
			console.log(e);
		}
		
		try {
			$("#shop_irmas").val(settings.shop.irmas);
			$("#shop_burger").val(settings.shop.burger);
			$("#shop_pie").val(settings.shop.pie);
			$("#shop_ration").val(settings.shop.ration);
			$("#shop_bread").val(settings.shop.bread);
		} catch (e) {
			console.log(e);
		}
		
		try {
			$("#dinoz_level").val(settings.dinozLevel);
		} catch (e) {
			console.log(e);
		}
	}
	
	/**
	 * Возвращает дефолтные настройки
	 * 
	 * @return {Object} дефолтные настройки
	 */
	var getDefaultSettings = function () {
		return {
			isActive   : false,
			isCheck    : false,
			lastCheck  : 0,
			time       : 0,
			state      : STATE.GET_TIME,
			dinozLevel : 1,
			redirectTime : {
				minTime  : 3,
				randTime : 2,
				count    : 1000
			},
			newTurnTime  : {
				minTime  : 1,
				randTime : 9,
				count    : 60000
			},
			fightTime    : {
				minTime  : 1.5,
				randTime : 2,
				count    : 1000
			},
			continueTime : {
				minTime  : 3,
				randTime : 2,
				count    : 1000
			},
			sleepTime    : {
				beginTime: 2,
				endTime  : 8
			},
			shop         : {
				irmas    : 0,
				burger   : 0,
				pie      : 0,
				ration   : 0,
				bread    : 0
			},
			daySettings  : {
				shop     : false,
				irmas    : 0,
				burger   : 0,
				pie      : 0,
				ration   : 0,
				bread    : 0
			}
		};
	}
	
	AutoFightSettings();
}
