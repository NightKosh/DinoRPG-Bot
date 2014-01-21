
$(document).ready(function () {
	
	if (document.location.href.indexOf("/act/dialog/") != -1) {
		//показываем меню диалогов
		$("#answers").show();
		
		// Подменяем диалоги у клутца
		if (document.location.href.indexOf("/act/dialog/broc__2") != -1) {
			setTimeout(function () {
				var linkEl = $("#answers a:last");
				var link = linkEl.attr("href");
				if (link.indexOf("goto=depart_1") != -1) {
					linkEl.text("Waikiki Island here we come!");
				} else if (link.indexOf("goto=depart_2") != -1) {
					linkEl.text("Basalt Slopes here we come!");
				} else if (link.indexOf("goto=depart_3") != -1) {
					linkEl.text("Frishport here we come!");
				}
			}, 300);
		}
	}
	
});
