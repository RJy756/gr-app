'use strict';

$(function () {
  FastClick.attach(document.body);

  // 注： ios直接返回的是object对象，android返回的是json的字符串，需要调用JSON.parse();
  connectWebViewJavascriptBridge(function (bridge) {
    var token, shareUrl;

    var ajaxUrl = location.protocol + '//' + location.host + '/activity/invite/';
    var ajaxType = 'POST';
    var recordUrl = location.protocol + '//' + location.host + '/home/invite/record.html';

    function loaded() {
      FastClick.attach(document.body);
      $('.spinner-content').hide();
    }
    window.onload = loaded();

    // 绑定返回事件
    bridge.registerHandler('returnBackHandler', function (data, responseCallback) {
      var backParam = {};
      backParam.isFirstPage = true;
      responseCallback(backParam);
    });

    function noShareUrl() {
      $('.qr-code').empty();
      $('.qr-code').qrcode({
        text: location.protocol + '//' + location.host + '/home/invite/index.html?channel=yqhd'
      });
    }

    // 调用modal弹框
    function alertMsg(text) {
      var modalParams = {
        modalId: 'modal1',
        title: '提示',
        text: text,
        type: '0',
        buttons: [
          {
            text: '确定',
            value: 'btn'
          }
        ]
      };

      bridge.callHandler('modal', modalParams, function (response) {

      });
    }

    function getInfo() {
      if (token) {
        $.ajax({
          url: ajaxUrl + 'index.json',
          type: ajaxType,
          timeout: 3000,
          headers: {
            'Http-X-User-Access-Token': token
          },
          async: false,
          success: function (respData, status, jqXhr) {
            if (typeof respData === 'string') {
              respData = JSON.parse(respData);
            }
            if (respData.result === 'success') {
              if (!respData.code) {
                $('.qr-code').empty();
                shareUrl = location.protocol + '//' + location.host + '/home/invite/index.html?channel=' + respData.channelCode;
                if (Number(respData.awardAmount) >= 1000) {
                  $('.a-num').text(' 1千多 ');
                } else {
                  $('.a-num').text(respData.awardAmount);
                }
                $('.p-num').text(respData.inviteCount);
                $('#hasToken').show();
                $('.qr-code').qrcode({
                  text: shareUrl
                });
              } else if (respData.message) {
                noShareUrl();
                alertMsg(respData.message);
              } else {
                noShareUrl();
                alertMsg('网络异常，请重试');
              }
            } else if (respData.message) {
              noShareUrl();
              alertMsg(respData.message);
            } else {
              noShareUrl();
              alertMsg('网络异常，请重试');
            }
          },
          error: function (xhr, status, errorThrown) {
            noShareUrl();
            alertMsg('网络异常，请重试');
          },
          complete: function (xhr, status) {
            if (status === 'timeout') {
              noShareUrl();
              alertMsg('网络超时，请重试');
            }
          }
        });
      }
    }

    function checkToken() {
      if (token) {
        $('#noToken').hide();
        getInfo();
      } else {
        $('#hasToken').hide();
        $('#noToken').show();
        noShareUrl();
      }
    }

    // 登陆回调
    bridge.registerHandler('loginHandler', function (data, responseCallback) {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      token = data.token;

      checkToken();

      var loginParam = {};
      loginParam.triggerId = 'login';
      responseCallback(loginParam);
    });

    // 获取token
    function getToken() {
      var loginParams;
      var getTokenParams = {
        triggerId: 'getUserToken'
      };
      bridge.callHandler('getUserToken', getTokenParams, function (response) {
        if (response === null) {
          checkToken();
          loginParams = {
            triggerId: 'noToken'
          };
          bridge.callHandler('login', loginParams, function (lresponse) {
          });
          return;
        } else if (response) {
          if (typeof response === 'string') {
            response = JSON.parse(response);
          }
          if (response.token === '') {
            checkToken();
            loginParams = {
              triggerId: 'noToken'
            };
            bridge.callHandler('login', loginParams, function (lresponse) {
            });
            return;
          }
        }

        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        token = response.token;
        checkToken();
      });
    }

    getToken();

    $('#noToken').click(function () {
      var loginParams = {'triggerId': 'btnNoToken'};
      bridge.callHandler('login', loginParams, function () {
      });
    });

    $('#hasToken').click(function () {
      var btnParams = {
        url: recordUrl
      };
      bridge.callHandler('openView', btnParams, function (response) {
      });
    });
  });
});