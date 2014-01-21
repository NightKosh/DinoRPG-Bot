
/**
 * Автофармилка
 *
 * @class
 */
var Shop = function (settings, money) {
	var self = this;
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
	var shop = function () {
		if (document.location.pathname == "/shop" ) {
			setTimeout(function () {
				if (settings.daySettings.irmas > 0) {
					console.log("Покупаем ирмы");
					$("#obj_irma").click();
					setItemsCount("irmas", settings.daySettings.irmas);
					
				} else if (settings.daySettings.burger > 0) {
					console.log("Покупаем бургеры");
					$("#obj_burger").click();
					setItemsCount("burger", settings.daySettings.burger);
					
				} else if (settings.daySettings.pie > 0) {
					console.log("Покупаем пироги");
					$("#obj_tartev").click();
					setItemsCount("pie", settings.daySettings.pie);
					
				} else if (settings.daySettings.ration > 0) {
					console.log("Покупаем шоколадки");
					$("#obj_ration").click();
					setItemsCount("ration", settings.daySettings.ration);
					
				} else if (settings.daySettings.bread > 0) {
					console.log("Покупаем хлеб");
					$("#obj_hotpan").click();
					setItemsCount("bread", settings.daySettings.bread);
					
				} else {
					console.log("Покупать больше нечего");
					autoFight.restoreState(false);
				}
			}, Math.round((3 * Math.random() + 2) * 1000));
		} else {
			autoFight.redirectPage(settings.redirectTime, "/shop", "Идём в магазин через ");
		}
	}
	
	/**
	 * Устанавливает количество итемов
	 * 
	 * @param {int} itemCount Количество итемов
	 */
	var setItemsCount = function (type, itemCount) {
		var price,
			field,
			button;
		switch (type) {
			case "irmas":
				price = 810;
				field = $("#field_0");
				button = $("#form_0");
				break;
			case "burger":
				price = 630;
				field = $("#field_2");
				button = $("#form_2");
				break;
			case "pie":
				price = 1800;
				field = $("#field_3");
				button = $("#form_3");
				break;
			case "ration":
				price = 900;
				field = $("#field_5");
				button = $("#form_5");
				break;
			case "bread":
				price = 5400;
				field = $("#field_4");
				button = $("#form_4");
				break;
		}
		var count = Math.floor(money / price);
		if (count > itemCount) {
			count = itemCount;
		}
		
		field.val(count);
		
		setTimeout(function () {
			console.log("Покупаем " + count + "штук");
			buyItem(type, count, button);
		}, Math.round((3 * Math.random() + 2) * 1000));
	}
	
	/** Покупает итемы */
	var buyItem = function (type, count, button) {
		if (document.location.pathname == "/shop") {
			autoFight.zeroShop(type, count);
			
			console.log("Покупаем выбранные предметы");
			button.submit();
		} else {
			console.log("Открыта некорректная страница!");
			autoFight.redirectPage(settings.redirectTime, "/shop", "Идём в магазин через ");
		}
	}
	
	shop();
}
