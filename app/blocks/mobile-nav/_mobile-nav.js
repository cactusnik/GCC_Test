//scrolltop
$(document).ready(function(){
  $('.mobile-nav__openbtn').click(function () {
    $('.mobile-nav__content').css('width','100%');
  });
  $('.mobile-nav__closebtn').click(function () {
    $('.mobile-nav__content').css('width','0');
  });
});
