"use strict";$(function(){function e(){if(p=Cookies.get("startTime")){b.addClass("disabled");var e=parseInt((p-(new Date).getTime())/1e3);b.text(e+"s后重发")}else b.removeClass("disabled"),b.text("获取验证码")}function t(){Cookies.set("startTime",(new Date).getTime()+6e4,{expires:new Date((new Date).getTime()+6e4)}),e()}function o(){$("html,body").css({overflow:"auto",height:"auto"}),$(".alert-box2").fadeOut(300)}function n(){$("html,body").css({overflow:"hidden",height:"100%"}),$(".alert-box2").fadeIn(100),$(".alert-box2 .btn-close-alert, .alert-box2 .btn-left").click(function(){o()}),$(".alert-box2 .btn-right").click(function(){location.href=location.protocol+"//"+location.host+"/home/invite/fail.html"})}function c(){$("html,body").css({overflow:"auto",height:"auto"}),$(".alert-box").fadeOut(300),$(".alert-box .alert-text").text("")}function i(e){$("html,body").css({overflow:"hidden",height:"100%"}),$(".alert-box .alert-text").text(e),$(".alert-box").fadeIn(100),$(".alert-box .btn-close-alert").click(function(){c()})}function s(){$.ajax({url:l+"common/reg.json",type:r,timeout:3e3,data:{account:u,regVerifyCode:f,pwd:d,recMemberId:m,traceId:h},async:!1,success:function(e,t,o){"string"==typeof e&&(e=JSON.parse(e)),"success"===e.result?"true"===e.isExist?location.href=location.protocol+"//"+location.host+"/home/invite/fail.html":location.href=location.protocol+"//"+location.host+"/home/invite/success.html":i(e.message?e.message:"网络异常，请重试")},error:function(e,t,o){i("网络异常，请重试")},complete:function(e,t){"timeout"===t&&i("网络超时，请重试")}})}function a(){$.ajax({url:l+"common/send_verify_code.json",type:r,timeout:3e3,data:{verifyType:"001",mobile:u},contentType:"application/x-www-form-urlencoded; charset=UTF-8",async:!1,success:function(e,o,s){"string"==typeof e&&(e=JSON.parse(e)),"success"===e.result?(i("验证码发送成功"),t(),setTimeout(function(){c()},3e3)):e.code&&"accountIsExists"===e.code?n():i(e.message?e.message:"网络异常，请重试")},error:function(e,t,o){i("网络异常，请重试")},complete:function(e,t){"timeout"===t&&i("网络超时，请重试")}})}FastClick.attach(document.body);var l=location.protocol+"//"+location.host+"/activity/",r="POST";console.log(l);var u,f,d,m,h,p,g,x=/^[1]\d{10}$/,b=$(".btn-get-vCode"),y=Arg.parse(location.href);y.channel?(g=y.channel,m=y.channel):i("参数异常，请重试"),b.click(function(){$(this).hasClass("disabled")||(u=$("#phone-input").val(),x.test(u)?a():i("手机号码不正确"))}),$(".btn-register").click(function(){u=$("#phone-input").val(),f=$("#vCode-input").val(),d=$("#pwd-input").val(),x.test(u)?f?d&&d.length>5?s():(i("请输入长度至少6位的登录密码"),setTimeout(function(){c()},1500)):(i("请输入验证码"),setTimeout(function(){c()},1500)):i("手机号码不正确")}),"yqhd"===g?($(".telNum").text(" "),$(".spinner-content").hide()):$.ajax({url:l+"invite/channel.json",type:r,timeout:3e3,data:{channelCode:g},async:!1,success:function(e,t,o){if("string"==typeof e&&(e=JSON.parse(e)),"success"===e.result){var n=e.info.name.replace(/(\d{3})\d{5}(\d{3})/,"$1****$2");$(".telNum").text("您的好友"+n+"，邀您共享15%高收益")}else i(e.message?e.message:"网络异常，请重试")},error:function(e,t,o){i("网络异常，请重试")},complete:function(e,t){$(".spinner-content").hide(),"timeout"===t&&i("网络超时，请重试")}}),$.ajax({url:l+"invite/incoming.json",type:r,timeout:3e3,data:{_ac:"4",_mc:"yqhd"},contentType:"application/x-www-form-urlencoded; charset=UTF-8",success:function(e,t,o){"string"==typeof e&&(e=JSON.parse(e)),"success"===e.result&&(h=e.traceId)}}),e(),setInterval(function(){e()},1e3)});