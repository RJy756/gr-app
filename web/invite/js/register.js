'use strict';

$(function () {
  FastClick.attach(document.body);
  var ajaxUrl = location.protocol + '//' + location.host + '/activity/';
  var ajaxType = 'POST';
  console.log(ajaxUrl);
  var phone, vCode, pwd, memberId, traceId;
  var phoneRegExp = /^[1]\d{10}$/;
  var startTime;
  var timer = $('.btn-get-vCode');
  var channelCode;
  var args = Arg.parse(location.href);

  function checkTimer() {
    startTime = Cookies.get('startTime');
    if (startTime) {
      timer.addClass('disabled');
      var remainingTime = parseInt((startTime - new Date().getTime()) / 1000);
      timer.text(remainingTime + 's后重发');
    } else {
      timer.removeClass('disabled');
      timer.text('获取验证码');
    }
  }

  function setCookies() {
    Cookies.set('startTime', new Date().getTime() + (60 * 1000), {
      expires: new Date(new Date().getTime() + 60 * 1000)
    });
    checkTimer();
  }

  function closeConfirm() {
    $('html,body').css({'overflow':'auto', 'height': 'auto'});
    $('.alert-box2').fadeOut(300);
  }

  function confirmMsg() {
    $('html,body').css({'overflow':'hidden', 'height': '100%'});
    $('.alert-box2').fadeIn(100);
    $('.alert-box2 .btn-close-alert, .alert-box2 .btn-left').click(function () {
      closeConfirm();
    });
    $('.alert-box2 .btn-right').click(function () {
      location.href = location.protocol + '//' + location.host + '/home/invite/fail.html';
    });
  }

  function closeAlert() {
    $('html,body').css({'overflow':'auto', 'height': 'auto'});
    $('.alert-box').fadeOut(300);
    $('.alert-box .alert-text').text('');
  }

  function alertMsg(text) {
    $('html,body').css({'overflow':'hidden', 'height': '100%'});
    $('.alert-box .alert-text').text(text);
    $('.alert-box').fadeIn(100);
    $('.alert-box .btn-close-alert').click(function () {
      closeAlert();
    });
    /*    setTimeout(function () {
     closeAlert();
     }, 1500);*/
  }

  if (args.channel) {
    channelCode = args.channel;
    memberId = args.channel;
  } else {
    alertMsg('参数异常，请重试');
  }

  function getChannelInfo() {
    $.ajax({
      url: ajaxUrl + 'invite/channel.json',
      type: ajaxType,
      timeout: 3000,
      data: {
        'channelCode': channelCode
      },
      async: false,
      success: function (respData, status, jqXhr) {
        if (typeof respData === 'string') {
          respData = JSON.parse(respData);
        }
        if (respData.result === 'success') {
          var tel = respData.info.name.replace(/(\d{3})\d{5}(\d{3})/, '$1****$2');
          $('.telNum').text('您的好友' + tel + '，邀您共享15%高收益');

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
        $('.spinner-content').hide();
        if (status === 'timeout') {
          alertMsg('网络超时，请重试');
        }
      }
    });
  }

  function inComing() {
    $.ajax({
      url: ajaxUrl + 'invite/incoming.json',
      type: ajaxType,
      timeout: 3000,
      data: {
        '_ac': '4',
        '_mc': 'yqhd'
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function (respData, status, jqXhr) {
        if (typeof respData === 'string') {
          respData = JSON.parse(respData);
        }
        if (respData.result === 'success') {
          traceId = respData.traceId;
        }
      }
    });
  }

  function register() {
    $.ajax({
      url: ajaxUrl + 'common/reg.json',
      type: ajaxType,
      timeout: 3000,
      data: {
        'account': phone,
        'regVerifyCode': vCode,
        'pwd': pwd,
        'recMemberId': memberId,
        'traceId': traceId
      },
      async: false,
      success: function (respData, status, jqXhr) {
        if (typeof respData === 'string') {
          respData = JSON.parse(respData);
        }
        if (respData.result === 'success') {
          if (respData.isExist === 'true') {
            location.href = location.protocol + '//' + location.host + '/home/invite/fail.html';
          } else {
            location.href = location.protocol + '//' + location.host + '/home/invite/success.html';
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

  function getVCode() {
    $.ajax({
      url: ajaxUrl + 'common/send_verify_code.json',
      type: ajaxType,
      timeout: 3000,
      data: {
        'verifyType': '001',
        'mobile': phone
      },
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      async: false,
      success: function (respData, status, jqXhr) {
        if (typeof respData === 'string') {
          respData = JSON.parse(respData);
        }
        if (respData.result === 'success') {
          alertMsg('验证码发送成功');
          setCookies();
          setTimeout(function () {
            closeAlert();
          }, 3000);
        } else if (respData.code && respData.code === 'accountIsExists') {
          confirmMsg();
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

  timer.click(function () {
    if (!$(this).hasClass('disabled')) {
      phone = $('#phone-input').val();
      if (phoneRegExp.test(phone)) {
        getVCode();
      } else {
        alertMsg('手机号码不正确');
      }
    }
  });

  $('.btn-register').click(function () {
    phone = $('#phone-input').val();
    vCode = $('#vCode-input').val();
    pwd = $('#pwd-input').val();
    if (phoneRegExp.test(phone)) {
      if (vCode) {
        if (pwd && pwd.length > 5) {
          register();
        } else {
          alertMsg('请输入长度至少6位的登录密码');
          setTimeout(function () {
            closeAlert();
          }, 1500);
        }
      } else {
        alertMsg('请输入验证码');
        setTimeout(function () {
          closeAlert();
        }, 1500);
      }
    } else {
      alertMsg('手机号码不正确');
    }
  });

  if(channelCode === 'yqhd') {
    $('.telNum').text(' ');
    $('.spinner-content').hide();
  } else {
    getChannelInfo();
  }
  inComing();
  checkTimer();
  setInterval(function () {
    checkTimer();
  }, 1000);
});