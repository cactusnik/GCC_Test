//scrolltop
$(document).ready(function(){
  $('.scroll-top').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 1000);
    return false;
  });
});
