(function($){
  'use strict';

  // 默认设置 defaults
  var defaults = {
    id: 'jsBridgeForm',
    method: 'GET',
    action: 'ddjr://j',
    formContainer: document.body,
    input: {
      name: 't',
      type: 'hidden',
      value: ''
    }
  };

  //jsBridge 调用定义
  $.jsBridge = function(params){

    params = $.extend({}, defaults, params);

    var inputsHTML = '';
    // 随机数，确保每次form都能通过jsBridge提交，解决在使用Fastclick插件时，调用jsBridge弹出登录框后再次点击无效的问题
    var inputRandomHTML = '<input type="' + defaults.input.type + '" name="random" value="' + Date.parse(new Date()) + Math.random().toFixed(4) + '"/>';

    // 参数HTML
    if (params.inputs && params.inputs.length > 0) {
      for (var i = 0; i < params.inputs.length; i++) {
        inputsHTML += '<input type="' + (params.inputs[i].type || defaults.input.type) + '" name="' + (params.inputs[i].name || defaults.input.name) + '" value="' + (params.inputs[i].value || defaults.input.value) + '"/>';
      }
    }
    // 表单HTML
    var formHTML = '<form id="' + params.id + '" method="' + params.method + '" action="' + params.action + '">' + inputRandomHTML + inputsHTML + '</form>';

    // 清除原有表单，确保每个页面中只有一个jsBridgeForm
    var jsBridgeForm = $('#' + params.id);
    $.removeJsBridgeForm(jsBridgeForm);

    jsBridgeForm = $(formHTML);
    $(defaults.formContainer).append(jsBridgeForm);

    return jsBridgeForm;
  };


  // 提交表单
  $.submitJsBridgeForm = function(jsBridgeForm) {
    jsBridgeForm = $(jsBridgeForm);
    if (typeof jsBridgeForm !== 'undefined' && jsBridgeForm.length === 0) {
      return;
    }
    jsBridgeForm.submit();
  };

  // 删除表单
  $.removeJsBridgeForm = function(jsBridgeForm) {
    jsBridgeForm = $(jsBridgeForm);
    jsBridgeForm.remove();
  };

})(jQuery);

