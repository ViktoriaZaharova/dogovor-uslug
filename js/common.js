$('[name="phone"]').mask('+7 (999) 999-99-99');

// animate scroll to top
$('.btn-top-scroll').on('click', function (e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: 0
    });
});

$('.btn-burger').on('click', function (e) {
    e.preventDefault
    $(this).toggleClass('click');      
    $('.nav-menu').fadeToggle();
    // $('.header-contacts').toggleClass('active');
});

// $('.nav-menu a').on('click', function () {
//     $('.btn-burger').removeClass('click');      
//     $('.nav-menu').fadeOut();
// });

$(".slider-range").slider({
    min: 0,
    max: 10,
    value: 0.1,
    range: "min",
    animate: "fast",
    slide : function(event, ui) {    
        $(".slider-range span").html(ui.value + "<b>%</b>");        
    }    
});
$(".slider-range span").html($(".slider-range").slider("value") + "<b>%</b>");    
