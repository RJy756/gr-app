'use strict';


function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge);
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			callback(WebViewJavascriptBridge);
		}, false);
	}
}

function thirdPartyPageTest(data) {
	var testObj = {};
	testObj.isThirdPartyPage = 'false';
	return JSON.stringify(testObj);
}

$(function() {
	connectWebViewJavascriptBridge(function(bridge) {
		bridge.init(function(message, responseCallback) {
			responseCallback(null);
		});

		if (/(Android)/i.test(navigator.userAgent)) {
			var notifyObj = {};
			notifyObj.isThirdPartyPage = 'false';
			bridge.callHandler('thirdPartyPageNotify', notifyObj, function(
					response) {

			});
		}
	});
});
