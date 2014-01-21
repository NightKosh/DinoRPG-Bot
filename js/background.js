
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log("Запрос :", request);
	if (request.method == "getLocalStorage") {
		sendResponse({
			data  : localStorage.getItem(request.key)
		});
	} else if (request.method == "setLocalStorage") {
		localStorage.setItem(request.key, request.value);
	} else {
		sendResponse({});
	}
});