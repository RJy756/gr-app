'use strict';

$(function () {
  FastClick.attach(document.body);

  connectWebViewJavascriptBridge(function (bridge) {
    var token;

    var ajaxUrl = location.protocol + '//' + location.host + '/activity/invite/';
    var ajaxType = 'POST';

    // 绑定返回事件
    bridge.registerHandler('returnBackHandler', function (data, responseCallback) {
      var backParam = {};
      backParam.isFirstPage = true;
      responseCallback(backParam);
    });

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
      $.ajax({
        url: ajaxUrl + 'friends.json',
        type: ajaxType,
        timeout: 3000,
        headers: {
          'Http-X-User-Access-Token': token
        },
        success: function (respData, status, jqXhr) {
          if (typeof respData === 'string') {
            respData = JSON.parse(respData);
          }
          if (respData.result === 'success') {
            if (!respData.code) {
              $('#table-info').empty();
              if(respData.friends.length > 0) {
                var investmentFlag;
                for (var i = 0; i < respData.friends.length; i++) {
                  if (respData.friends[i].hasFinancialSubscribe) {
                    investmentFlag = '是';
                  } else {
                    investmentFlag = '否';
                  }
                  $('#table-info').append('<tr> <td>' + respData.friends[i].regTime + '</td> <td>' + respData.friends[i].account + '</td> <td>' + investmentFlag + '</td> </tr>');
                }
                $('.no-record').hide();
                $('.body-table').show();
              } else {
                $('.body-table').hide();
                $('.no-record').show();
              }
            } else if (respData.message) {
              $('.body-table').hide();
              $('.no-record').show();
              alertMsg(respData.message);
            } else {
              $('.body-table').hide();
              $('.no-record').show();
              alertMsg('网络异常，请重试');
            }
          } else if (respData.message) {
            $('.body-table').hide();
            $('.no-record').show();
            alertMsg(respData.message);
          } else {
            $('.body-table').hide();
            $('.no-record').show();
            alertMsg('网络异常，请重试');
          }
        },
        error: function (xhr, status, errorThrown) {
          $('.body-table').hide();
          $('.no-record').show();
          alertMsg('网络异常，请重试');
        },
        complete: function (xhr, status) {
          $('.spinner-content').hide();
          if (status === 'timeout') {
            $('.body-table').hide();
            $('.no-record').show();
            alertMsg('网络超时，请重试');
          }
        }
      });
    }

    function getAmount() {
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
              getInfo();
              $('#amount').text(respData.awardAmount);
            } else if (respData.message) {
              alertMsg(respData.message);
            } else {
              alertMsg('网络异常，请重试');
            }
          } else if (respData.message) {
            alertMsg(respData.message);
          } else {
            alertMsg('网络异常，请重试');
          }
        },
        error: function (xhr, status, errorThrown) {
          alertMsg('网络异常，请重试');
        },
        complete: function (xhr, status) {
          if (status === 'timeout') {
            alertMsg('网络超时，请重试');
          }
        }
      });
    }

    function checkToken() {
      if (token) {
        getAmount();
      } else {
        $('.body-table').hide();
        $('.no-record').show();
        $('.spinner-content').hide();
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
  });
});