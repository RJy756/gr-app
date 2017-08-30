$(function () {
    function loaded() {
   FastClick.attach(document.body);
   $('.spinner-content').hide();
   }
   window.onload = loaded();
});