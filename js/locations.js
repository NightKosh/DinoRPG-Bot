
$(document).ready(function () {
	var LOCATIONS = {
		SWAMP : 0,
		ROCK  : 1
	}
	
	var location = $("#dinozList > .lieu em").text();
	
	switch (location) {
		case "Sticky Swamp" :
			setLocationHint(LOCATIONS.SWAMP);
			checkDig(location);
			break;
		case "Waïkiki Island" :
			setLocationHint(LOCATIONS.SWAMP);
			break;
		case "Coral Mines" :
			setLocationHint(LOCATIONS.SWAMP);
			checkShovel();
			break;
		case "Mutant Falls" :
			setLocationHint(LOCATIONS.SWAMP);
			break;
		case "Klutz Workshop" :
			setLocationHint(LOCATIONS.SWAMP);
			break;
			
		case "Gravity Rock" :
			setLocationHint(LOCATIONS.ROCK);
			break;
		case "Caushemesh Acropolis" :
			setLocationHint(LOCATIONS.ROCK);
			break;
		case "Ethereal Well" :
			setLocationHint(LOCATIONS.ROCK);
			break;
		case "Entryway to the Pyramid" :
			setLocationHint(LOCATIONS.ROCK);
			break;
		case "Submerged Technodome" :
			setLocationHint(LOCATIONS.ROCK);
			break;
		
		
		
		case "Basalt Slopes" :
			checkDig(location);
			break;
		case "The Fountain of Youth" :
			checkDig(location);
			break;
		case "Ashpouk Ruins" :
			checkDig(location);
			break;
	}
	
	function setLocationHint (location) {
		var content;
		switch (location) {
			case LOCATIONS.SWAMP :
				content = "<p>График движения на болоте:</br></br>" + getSwampContent() + "</p>";
				/*"<p>График движения на болоте:</br></br>" + 
							"Понедельник - Нормально</br>" + 
							"Вторник - Нормально</br>" + 
							"Среда - Только движение</br>" + 
							"Четверг - Только битва</br>" + 
							"Пятница - Нормально</br>" + 
							"Суббота - Только битва</br>" + 
							"Воскресенье - Только движение</p>";*/
				break;
			case LOCATIONS.ROCK :
				content = "<p>График движения камня:</br></br>" + getRockContent();
				break;
		}
		$("#dinozPanel .map .box").after(content);
	}
	
	function getRockContent () {
		switch (new Date().getDay()) {
			case 0 :
				return  "0-15 - Ethereal Well</br>" + 
						"15-30 - Caushemesh Acropolis</br>" + 
						"30-45 - Submerged Technodome</br>" + 
						"45-60 - Entryway to the Pyramid</p>";
				break;
			case 1 :
				return  "0-15 - Caushemesh Acropolis</br>" + 
						"15-30 - Entryway to the Pyramid</br>" + 
						"30-45 - Ethereal Well</br>" + 
						"45-60 - Submerged Technodome</p>";
				break;
			case 2 :
				return  "0-15 - Entryway to the Pyramid</br>" + 
						"15-30 - Ethereal Well</br>" + 
						"30-45 - Submerged Technodome</br>" + 
						"45-60 - Caushemesh Acropolis</p>";
				break;
			case 3 :
				return  "0-15 - Ethereal Well</br>" + 
						"15-30 - Submerged Technodome</br>" + 
						"30-45 - Entryway to the Pyramid</br>" + 
						"45-60 - Caushemesh Acropolis</p>";
				break;
			case 4 :
				return  "0-15 - Ethereal Well</br>" + 
						"15-30 - Submerged Technodome</br>" + 
						"30-45 - Caushemesh Acropolis</br>" + 
						"45-60 - Entryway to the Pyramid</p>";
				break;
			case 5 :
				return  "0-15 - Caushemesh Acropolis</br>" + 
						"15-30 - Ethereal Well</br>" + 
						"30-45 - Entryway to the Pyramid</br>" + 
						"45-60 - Submerged Technodome</p>";
				break;
			case 6 :
				return  "0-15 - Ethereal Well</br>" + 
						"15-30 - Entryway to the Pyramid</br>" + 
						"30-45 - Caushemesh Acropolis</br>" + 
						"45-60 - Submerged Technodome</p>";
				break;
		}
	}

	function getSwampContent () {
		switch (new Date().getDay()) {
			case 0 :
				return "Сегодня - Только движение</br>" + 
						"Завтра - Всё нормально";
				break;
			case 1 :
				return "Сегодня - Всё нормально</br>" + 
						"Завтра - Всё нормально";
				break;
			case 2 :
				return "Сегодня - Всё нормально</br>" + 
						"Завтра - Только движение";
				break;
			case 3 :
				return "Сегодня - Только движение</br>" + 
						"Завтра - Только битва";
				break;
			case 4 :
				return "Сегодня - Только битва</br>" + 
						"Завтра - Всё нормально";
				break;
			case 5 :
				return "Сегодня - Всё нормально</br>" + 
						"Завтра - Только битва";
			case 6 :
				return "Сегодня - Только битва</br>" + 
						"Завтра - Только движение";
				break;
		}
	}
	
	function checkDig (location) {
		var imgs = $(".dinoz .fx");
		if (imgs.find("img[src='/img/icons/fx_pelle.gif']").length != 0) {
			var dig = false;
			// проверяем наличие итема
			switch (location) {
				case "Sticky Swamp" :
					if (imgs.find("img[src='/img/icons/fx_.gif']").length == 0 && imgs.find("img[src='/img/icons/fx_gant.gif']").length == 0) {
						dig = true;
					}
					break;
				case "The Fountain of Youth" :
					if (imgs.find("img[src='/img/icons/fx_wpure.gif']").length == 0 && imgs.find("img[src='/img/icons/fx_gant.gif']").length == 0) {
						dig = true;
					}
					break;
				case "Basalt Slopes" :
					if (imgs.find("img[src='/img/icons/fx_basalt.gif']").length == 0 && imgs.find("img[src='/img/icons/fx_gant.gif']").length == 0) {
						dig = true;
					}
					break;
				case "Ashpouk Ruins" :
					if (imgs.find("img[src='/img/icons/.gif']").length == 0 && imgs.find("img[src='/img/icons/fx_totem.gif']").length == 0) {
						dig = true;
					}
					break;
			}
			// копаем
			if (dig) {
				try {
					console.log("Сейчас будем копать!");
					setTimeout(function() {
						eval($("#act_dig tr").eq(0).attr("onclick").slice(38));
					}, 1500);
				} catch (e) {
					console.log("Ошибка!!!!!!!!", e);
				}
			}
		}
	}
	
	function checkShovel () {
		
	}
});
