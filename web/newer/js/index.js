$(function () {
  connectWebViewJavascriptBridge(function (bridge) {

    // 绑定返回事件
    bridge.registerHandler('returnBackHandler', function (data, responseCallback) {
      var backParam = {};
      backParam.isFirstPage = true;
      responseCallback(backParam);
    });

    function loaded() {
      FastClick.attach(document.body);
      $('.spinner-content').hide();
    }
    window.onload = loaded();

    $('.btn1').click(function () {
      var jsBridgeForm = $.jsBridge({
        id: 'jsBridgeForm',
        method: 'GET',
        action: 'ddjr://j',
        inputs: [{
          name: 't',
          value: 'cp'
        }]
      });
      $.submitJsBridgeForm(jsBridgeForm);
    });

  });
});