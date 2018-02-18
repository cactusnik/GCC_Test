//slider team

$('.team__slider').slick(
{
  autoplay: false,
  autoplaySpeed: 4000,
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: true,
  //prevArrow:"<img class='a-left control-c prev slick-prev' src='img/arrow-left.png'>",
 // nextArrow:"<img class='a-right control-c next slick-next' src='img/arrownav.png'>",
 responsive: [
     {
         breakpoint: 1300,
         settings: {
             slidesToShow: 4,
             slidesToScroll: 1,
             arrows: false,
             dots: true
         }
     },
     {
         breakpoint: 992,
         settings: {
             slidesToShow: 3,
             slidesToScroll: 1,
             arrows: false,
             dots: true
         }
     },
     {
         breakpoint: 768,
         settings: {
             slidesToShow: 2,
             slidesToScroll: 1,
             arrows: false,
             dots: true
         }
     },
     {
         breakpoint: 450,
         settings: {
             slidesToShow: 1,
             slidesToScroll: 1,
             arrows: false,
             dots: true
         }
     },

     // You can unslick at a given breakpoint now by adding:
     // settings: "unslick"
     // instead of a settings object
 ]
});
