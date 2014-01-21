
/**
 * Автофармилка
 *
 * @class
 */
var autoFight = new function () {
	var self = this;
	var dinozList = {};
	var settings = {};
	var ONE_HOUR = 3600000;
	var timeZoneOffset = new Date().getTimezoneOffset() * 60000;
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
	var autoFight = function () {
		getStorageItem("settings", getSettings);
	}
	
	var run = function () {
		switch (settings.state) {
			case STATE.GET_TIME :
				console.log("Время хода не определенно!");
				getNewTime();
				break;
			case STATE.WAIT :
				if (!isSleepTime() && !isShopTime()) {
					console.log("Ожидание нового хода!");
					console.log("До него " + getTimeStr(settings.time - new Date().getTime() + timeZoneOffset, (settings.dinozLevel == 1) ? false : true));
					wait();
				}
				break;
			case STATE.NEW_TURN :
				newTurn();
				break;
			case STATE.FIGHT :
				checkContB();
				break;
			case STATE.SHOP :
				var money = parseFloat($("#dinozList .money").text()) * 1000;
				if (money > 6000) {
					var shop = new Shop(settings, money);
				} else {
					console.log("Для магазина недостаточно денег.");
					self.restoreState();
				}
				break;
			case STATE.HEAL :
				
				break;
			case STATE.SLEEP :
				console.log("Бот 'спит'!");
				sleep();
				break;
		}
	}
	
	/**
	 * Запрашивает данные из localStorage
	 *
	 * @param {string} itemKey Название запрашиваемых "данных"
	 * @param {function} holder Метод, получающий данные
	 */
	var getStorageItem = function (key, holder) {
		chrome.extension.sendRequest({
			'method' : "getLocalStorage",
			'key'    : key
		}, holder);
	}
	
	/**
	 * Получает настройки
	 * 
	 * @param {object} response Объект настроек
	 */
	var getSettings = function (response) {
		if (response.data != undefined) {
			settings = JSON.parse(response.data);
			console.log("Параметры: ", settings);
			
			if (settings.isActive) {
				getStorageItem("dinoz_list", getDinozList);
			}
		} else {
			console.log("Настройки отсутствуют!");
		}
	}
	
	/**
	 * Получает список динозов
	 * 
	 * @param {object} response Массив динозов
	 */
	var getDinozList = function (response) {
		if (response.data != undefined) {
			dinozList = JSON.parse(response.data);
			
			console.log("Список динозов: ");
			for (var i = 0, length = dinozList.length; i < length; i++) {
				console.log(dinozList[i]);
			}
			
			run();
		} else {
			console.log("Список динозов отсутствует");
		}
	}
	
	/** 
	 * Сохраняет данные в localStorage
	 *
	 * @param {string} itemKey Название сохраняемых "данных"
	 * @param {string} value Сохраняемые данные
	 */
	var setStorageItem = function (itemKey, value) {
		chrome.extension.sendRequest({
			'method' : "setLocalStorage",
			'key'    : itemKey,
			'value'  : value
		}, function (response) {
			
		});
	}
	
	/** Сохраняет список динозов */
	var saveDinozList = function () {
		//localStorage.setItem("dinoz_list", JSON.stringify(dinozList));
		setStorageItem("dinoz_list", JSON.stringify(dinozList));
	}
	
	/**
	 * Сохраняет настройки (параметры не обязательны!)
	 * 
	 * @param {string} key "Имя" поля настроек
	 * @param {} value Сохраняемое значение
	 */
	var saveSettings = function (key, value) {
		if (key) {
			settings[key] = value;
		}
		setStorageItem("settings", JSON.stringify(settings));
	}
	
	/** Получает время у текущего диноза */
	var getTime = function () {
		var time = $("#timer_0");
		if (time.length != 0) {
			time = time.text();
			var hours = parseInt(time.slice(0, time.indexOf('h')));
			if (hours == -1) {
				hours = 0;
			} else {
				time = time.slice(time.indexOf('h') + 1, time.length);
			} 
			
			var minutes = parseInt(time.slice(0, time.indexOf('m')));
			if (minutes == -1) {
				minutes = 0;
				
				var seconds = parseInt(time);
			} else {
				if (time.indexOf('s') != -1) {
					var seconds = parseInt(time.slice(time.indexOf('m')+ 1, time.indexOf('s')));
				} else {
					var seconds = 0;
				}
			}
			return hours * ONE_HOUR + minutes * 60000 + seconds * 1000 + new Date().getTime();
		} else {
			return new Date().getTime();
		}
	}
	
	/** Получает новое время */
	var getNewTime = function () {
		//если мы на нужном дине
		if (document.location.pathname == "/dino/" + dinozList[settings.lastCheck].id) {
			var time = getTime();
			if (time > settings.time) {
				settings.time = time;
			}
			
			settings.state = STATE.WAIT;
			settings.isCheck = true;
			settings.lastCheck = 0;
			saveSettings();
			
			run();
		} else {
			redirect("/dino/" + dinozList[0].id);
		}
		
		//redirect("/dino/" + dinozList[settings.lastCheck].id);
	}
	
	/** Проверяет "актуальность" времени в настройках */
	/*
	var checkTime = function () {
		if (settings.time + ONE_HOUR < new Date().getTime()) {
			console.log("Необходимо обновить время!!!");
			
			settings.state = STATE.GET_TIME;
			settings.isCheck = false;
			settings.lastCheck = 0;
			settings.time = 0;
			
			saveSettings();
			
			return false;
		} else {
			return true;
		}
	}*/
	
	/** Проверяет выбран ли нужный диноз */
	var checkDinoz = function () {
		//если выбран не тот диноз, то переходим к нужному
		if (document.location.pathname != "/dino/" + dinozList[settings.lastCheck].id) {
			redirect("/dino/" + dinozList[settings.lastCheck].id);
		}
		
	}
	
	/** Ожидает времени нового хода, и переходит к его активации */
	var wait = function () {
		if (settings.time > new Date().getTime()) {
			//Дополнительные 10 секунд задержки для исключения проблем с автоматическим обновлением страницы
			setTimeout(function () {
				saveSettings("state", STATE.NEW_TURN);
				newTurn();
			}, settings.time - new Date().getTime() + 10000);
		} else {
			saveSettings("state", STATE.NEW_TURN);
			newTurn();
		}
	}
	
	/** Новый ход динозу */
	var newTurn = function () {
		self.redirectPage(settings.newTurnTime, $("#menu_action").attr("href"), "Новый ход возможен. До него ", "Новый ход", setSettingsToFight);
	}
	
	/** Изменяет настройки для "боя" */
	var setSettingsToFight = function () {
		settings.state = STATE.FIGHT;
		settings.time = new Date().getTime() + ONE_HOUR * settings.dinozLevel;
		saveSettings();
	}
	
	/** Завершалка боя */
	var checkContB = function () {
		if (document.location.pathname == "/dino/" + dinozList[settings.lastCheck].id + "/act/fight") {
			console.log("Сбор статистики...");
			dinozList[settings.lastCheck].hp += parseInt($(".life:first").text().replace(/[^0-9]/g, ""));
			dinozList[settings.lastCheck].tCount += 1;
			//parseInt($(".xp:first").text().replace(/[^0-9]/g, ""));
			dinozList[settings.lastCheck].gold += parseInt($(".gold:first").text().replace(/[^0-9]/g, ""));
			saveDinozList();
			
			if (settings.lastCheck == dinozList.length - 1) {
				settings.lastCheck = 0;
				settings.state = STATE.WAIT;
				saveSettings();
			} else {
				saveSettings("lastCheck", settings.lastCheck + 1);
			}
			
			self.redirectPage(settings.continueTime, "/dino/" + dinozList[settings.lastCheck].id, "До завершения боя ", "Бой завершён.");
		} else {
			fight();
		}
	}
	
	/** Дерётся динозом, или переходит на нужного, если выбран не тот */
	var fight = function () {
		if (document.location.pathname == "/dino/" + dinozList[settings.lastCheck].id) {
			var fight = $("#act_fight tr");
			
			if (fight.length != 0) {
				var waitTime = getRandomTime(settings.fightTime);
				console.log("Бой начнётся через " + getTimeStr(waitTime));
				
				setTimeout(function () {
					console.log("Бой!");
					try {
						eval(fight.attr("onclick").slice(38));
					} catch (e) {
						console.log("Ошибка!!!!!!!!", e);
						//newTurn();
					}
				}, waitTime);
			} else {
				console.log("Кнопка боя отсутствует!!!!");
				console.log("Сейчас будут сброшенны настройки 'состояния'");
				
				settings.state = STATE.GET_TIME;
				settings.lastCheck = 0;
				settings.time = 0;
				saveSettings();
				
				// Переходим на первого диноза
				redirect("/dino/" + dinozList[0].id);
			}
		} else {
			// Переходим на нужного нам диноза
			redirect("/dino/" + dinozList[settings.lastCheck].id);
		}
		
	}
	
	/**
	 * Возвращает "случайное" время, на основании параметров
	 *
	 * @params {object} time 
	 * @return {int} Время в миллисекундах
	 */
	var getRandomTime = function (time) {
		return Math.round((time.randTime * Math.random() + time.minTime) * time.count);
	}
	
	/**
	 * Возвращает строку с временем
	 * 
	 * @params {int} time Время в миллисекундах
	 * @return {string} Время в минутах и секундах
	 */
	var getTimeStr = function (time, h) {
		time = new Date(time);
		var str = '';
		if (h) {
			str = time.getHours() + " часов ";
		}
		return str + time.getMinutes() + " минут " + time.getSeconds() + " секунд";
	}
	
	/**
	 * Переходит на другого диноза
	 *
	 * @params {string} page Адрес страницы диноза (без http://en.dinorpg.com)
	 */
	var redirect = function (page) {
		var waitTime = getRandomTime(settings.redirectTime);
		console.log("Редирект на http://en.dinorpg.com" + page + " через " + getTimeStr(waitTime));
		setTimeout(function () {
			document.location.pathname = page;
		}, waitTime);
	}
	
	/**
	 * Переходит на другую страницу
	 *
	 * @params {Object} time Объект с настройками времени
	 * @params {string} page Адрес страницы
	 * @params {string} text Текст сообщения
	 * @params {string} addText Текст сообщения зарешения ожидания
	 * @params {function} action Метод, вызываемый, по заверешию
	 */
	this.redirectPage = function (time, page, text, addText, action) {
		var waitTime = getRandomTime(time);
		console.log(text + getTimeStr(waitTime));
		setTimeout(function () {
			if (typeof action == "function") {
				action();
			}
			if (addText) {
				console.log(addText);
			}
			document.location.pathname = page;
		}, waitTime);
	}
	
	/** Возвращает состояние к ожиданию */
	this.restoreState = function (state) {
		if (typeof state != "undefined") {
			settings.daySettings.shop = state;
		}
		saveSettings('state', STATE.WAIT);
		run();
	}
	
	/** Проверяет время на необходимость "отключения" */
	var isSleepTime = function () {
		var time = new Date(settings.time);
		if (time.getHours() > settings.sleepTime.beginTime && time.getHours() < settings.sleepTime.endTime) {
			console.log("До " + settings.sleepTime.endTime + " часов работа бота преостанавливается.");
			
			var sleepTime = settings.sleepTime.endTime - settings.sleepTime.beginTime;
			sleepTime = sleepTime * ONE_HOUR;
			
			settings.time += sleepTime;
			settings.state = STATE.SLEEP;
			saveSettings();
			run();
			return true;
		}
		return false;
	}
	
	/** "Сон" */
	var sleep = function () {
		var sleepTime = settings.sleepTime.endTime - settings.sleepTime.beginTime;
		sleepTime = sleepTime * ONE_HOUR - new Date().getMinutes() * 60000;
		console.log("До выхода из сна " + getTimeStr(sleepTime + timeZoneOffset, true));
		setTimeout(function () {
			settings.state = STATE.WAIT; // Возвращаем состояние
			settings.daySettings = settings.shop; // возвращаем настройки магазина
			if (settings.shop.irmas > 0 || settings.shop.burger > 0 || settings.shop.pie > 0 || settings.shop.ration > 0 || settings.shop.bread > 0) {
				settings.daySettings.shop = true;
			} else {
				settings.daySettings = false;
			}
			saveSettings();
			
			run();
		}, sleepTime);
	}
	
	/** Чекает магазин */
	var isShopTime = function () {
		if (settings.daySettings.shop) {
			if (parseInt($("#dinozList .money").text()) > 6) {
				console.log("Надо бы заглянуть в магазин.");
				var rand = Math.round(Math.random() * 5);
				if (rand == 3 || rand == 1) {
					saveSettings('state', STATE.SHOP);
					run();
					return true;
				} else {
					console.log("Поход в магазин будет в другой раз.");
				}
			} else {
				console.log("На магазин не хватает денег.");
			}
		} else {
			console.log("Посещение магазина сегодня не требуется.");
		}
		return false;
	}
	
	this.zeroShop = function (type, count) {
		settings.daySettings[type] = settings.daySettings[type] - count;
		saveSettings();
	}
	
	/** Включает/отключает скрипт */
	var turnOnOff = function (response) {
		if (response.data != undefined) {
			settings = JSON.parse(response.data);
			
			if (settings.isActive) {
				saveSettings('isActive', false);
				console.log("Бот отключен");
			} else {
				saveSettings('isActive', true);
				console.log("Бот включен");
				
				getStorageItem("dinoz_list", getDinozList);
			}
		
		} else {
			console.log("Настройки отсутствуют!");
		}
	}
	
	/** Обработчик событий нажатия кнопок */
	$(document).keydown(function (e) {
		var VK_TAB = 9,
			VK_NUM = 144;
		
		switch (e.keyCode) {
			case VK_TAB :
				
				getStorageItem("settings", turnOnOff);
			
				break;
		}
	});
	
	autoFight();
}
