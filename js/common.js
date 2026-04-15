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

$(function () {

    $(".slider-range").slider({
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.1,
        range: "min",

        create: function () {
            updateSlider($(this), $(this).slider("value"));
        },

        start: function () {
            $(this).closest(".slider-range-wrapper").addClass("dragging");
        },

        slide: function (event, ui) {
            updateSlider($(this), ui.value);
        },

        stop: function () {
            $(this).closest(".slider-range-wrapper").removeClass("dragging");
        }
    });

    function updateSlider(slider, value) {
        let wrapper = slider.closest(".slider-range-wrapper");
        let bubble = wrapper.find(".slider-value");
        let handle = slider.find(".ui-slider-handle");

        bubble.text(value.toFixed(1) + "%");

        let center = handle.position().left + handle.outerWidth() / 2;
        bubble.css("left", center + "px");
    }

});

$(function () {

    const form = $(".contract-constructor-form");

    updateProgress();

    form.on("input change", "input, textarea, select", function () {
        updateProgress();
    });

    function updateProgress() {

        const fields = form.find("[required]");
        const total = fields.length;
        let filled = 0;

        fields.each(function () {

            const field = $(this);

            if (field.is(":checkbox,:radio")) {
                if (field.is(":checked")) filled++;
            } else {
                if ($.trim(field.val()) !== "") filled++;
            }

        });

        const percent = total ? Math.round((filled / total) * 100) : 0;

        $(".completed-line__progress").css("width", percent + "%");
        $(".completed-line span").text(percent + "%");

        const btn = $(".btn-accent");

        if (percent >= 100) {
            btn.removeClass("disabled");
        } else {
            btn.addClass("disabled");
        }
    }

});

// validate
$(function () {

    /* submit всех форм */
    $("form").on("submit", function (e) {

        let form = $(this);
        let valid = true;

        form.find("[required]").each(function () {

            let field = $(this);
            let label = field.closest("label");

            if ($.trim(field.val()) === "") {
                label.addClass("error-label");
                valid = false;
            } else {
                label.removeClass("error-label");
            }

        });

        if (!valid) {
            e.preventDefault();
        }

    });


    /* убираем ошибку при вводе */
    $("form").on("input change", "[required]", function () {

        let field = $(this);
        let label = field.closest("label");

        if ($.trim(field.val()) !== "") {
            label.removeClass("error-label");
        }

    });

});
