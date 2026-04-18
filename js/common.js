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

    $(".slider-range").each(function () {

        let slider = $(this);

        slider.slider({
            min: 0,
            max: 1,
            step: 0.1,
            value: 0.1,
            range: "min",

            create: function () {

                let currentValue = slider.slider("value");

                slider.find(".ui-slider-handle").append(
                    '<div class="slider-value">' + currentValue.toFixed(1) + '%</div>'
                );
            },

            slide: function (event, ui) {
                slider.find(".slider-value").text(ui.value.toFixed(1) + "%");
            },

            change: function (event, ui) {
                slider.find(".slider-value").text(
                    slider.slider("value").toFixed(1) + "%"
                );
            }
        });

    });

});

// $(function () {

//     const form = $(".contract-constructor-form");

//     updateProgress();

//     form.on("input change", "input, textarea, select", function () {
//         updateProgress();
//     });

//     function updateProgress() {

//         const fields = form.find("[required]");
//         const total = fields.length;
//         let filled = 0;

//         fields.each(function () {

//             const field = $(this);

//             if (field.is(":checkbox,:radio")) {
//                 if (field.is(":checked")) filled++;
//             } else {
//                 if ($.trim(field.val()) !== "") filled++;
//             }

//         });

//         const percent = total ? Math.round((filled / total) * 100) : 0;

//         $(".completed-line__progress").css("width", percent + "%");
//         $(".completed-line span").text(percent + "%");

//         const btn = $(".contract-constructor-form .btn-contract");

//         if (percent >= 100) {
//             btn.removeClass("disabled");
//         } else {
//             btn.addClass("disabled");
//         }
//     }

// });

// $(document).ready(function () {

//     $('.contract-constructor-form').each(function () {
//         let block = $(this);

//         block.on('input change', '[data-sync]', function () {
//             let field = $(this);
//             let key = field.data('sync');
//             let value = field.val();

//             // Форматирование даты
//             if (field.attr('type') === 'date' && value) {
//                 let parts = value.split('-');
//                 value = parts[2] + '.' + parts[1] + '.' + parts[0];
//             }

//             block.find('[data-output="' + key + '"]').text(value);
//         });

//         // Инициализация при загрузке
//         block.find('[data-sync]').trigger('change');
//     });

// });

jQuery(document).ready(function ($) {

  $('.contract-constructor-form').each(function () {

    var $block = $(this);
    var $items = $block.find('.accordion-item');

    var $progressBar = $block.find('.completed-line__progress');
    var $progressText = $block.find('.completed-line p span').first();
    var $downloadBtn = $block.find('.btn-contract');

    /* =========================
      FORMAT VALUE
    ========================= */
    function formatValue($field, value) {
      if ($field.attr('type') === 'date' && value) {
        var p = value.split('-');
        return p[2] + '.' + p[1] + '.' + p[0];
      }

      if ($field.data('format') === 'money' && value) {
        return Number(String(value).replace(/\s/g, '') || 0)
          .toLocaleString('ru-RU') + ' ₽';
      }

      return value;
    }

    /* =========================
      SYNC PREVIEW
    ========================= */
    function syncPreview() {
      $block.find('[data-sync]').each(function () {
        var $field = $(this);
        var key = $field.data('sync');
        var value = formatValue($field, $field.val());

        if (!value || value === '' || value === 'Выберите') {
          value = $field.data('placeholder') || '____________';
        }

        $block.find('[data-output="' + key + '"]').text(value);
      });
    }

    /* =========================
      CHECK STEP COMPLETE
    ========================= */
    function isComplete($item) {
      var ok = true;

      $item.find('input, select, textarea').each(function () {
        var $f = $(this);

        if ($f.prop('required')) {
          var val = $f.val();

          if (!val || val === '' || val === 'Выберите') {
            ok = false;
          }
        }
      });

      return ok;
    }

    /* =========================
      UPDATE STATE (STEP LOGIC FIXED)
    ========================= */
    function updateState() {

      var total = $items.length;
      var completed = 0;

      $items.each(function (i) {

        var $item = $(this);
        var $prev = $items.eq(i - 1);

        $item.removeClass('checked no-checked locked force-error');

        // lock logic (strict step flow)
        if (i > 0 && !$prev.hasClass('checked')) {
          $item.addClass('locked');
          return;
        }

        if (isComplete($item)) {
          $item.addClass('checked');
        }

        if ($item.hasClass('checked')) {
          completed++;
        }

        if ($item.find('.force-error').length) {
          $item.addClass('no-checked');
        }

      });

      // progress
      var percent = Math.round((completed / total) * 100) || 0;

      $progressBar.stop(true).animate({ width: percent + '%' }, 200);
      $progressText.text(percent + '%');

      // button state
      if (percent === 100) {
        $downloadBtn.removeClass('disabled');
      } else {
        $downloadBtn.addClass('disabled');
      }
    }

    /* =========================
      INPUT HANDLER (LOCK FIX)
    ========================= */
    $block.on('input change', 'input, select, textarea', function () {

      var $currentItem = $(this).closest('.accordion-item');

      if ($currentItem.hasClass('locked')) {
        $currentItem.addClass('force-error no-checked');
        $(this).val('');
        updateState();
        return false;
      }

      syncPreview();
      updateState();
    });

    /* =========================
      PREVENT EDIT LOCKED FIELDS
    ========================= */
    $block.on('focus mousedown', 'input, select, textarea', function (e) {

      var $currentItem = $(this).closest('.accordion-item');

      if ($currentItem.hasClass('locked')) {
        $currentItem.addClass('force-error no-checked');
        updateState();
        e.preventDefault();
      }
    });

    /* =========================
      PARTICIPANT LOGIC (CUSTOMER / EXECUTOR FIXED)
    ========================= */
    $block.on('change', '.participant-type', function () {

      var type = $(this).val();
      var $wrap = $(this).closest('.participant-block');

      var $nameLabel = $wrap.find('.field-name-label');
      var $nameInput = $wrap.find('.field-name-input');

      var $docLabel = $wrap.find('.field-doc-label');
      var $docInput = $wrap.find('.field-doc-input');

      var config = {
        'Физ. лицо': {
          nameLabel: 'ФИО',
          namePlaceholder: 'Иванов Иван Иванович',
          docLabel: 'Паспорт',
          docPlaceholder: '1234 567890'
        },
        'Юр. лицо': {
          nameLabel: 'Наименование',
          namePlaceholder: 'ООО Рога и Копыта',
          docLabel: 'ОГРН',
          docPlaceholder: '1027700132195'
        },
        'ИП': {
          nameLabel: 'ФИО ИП',
          namePlaceholder: 'ИП Иванов И.И.',
          docLabel: 'ОГРНИП',
          docPlaceholder: '304500116000157'
        },
        'Самозанятый': {
          nameLabel: 'ФИО',
          namePlaceholder: 'Иванов Иван Иванович',
          docLabel: 'ИНН',
          docPlaceholder: '1234567890'
        }
      };

      if (config[type]) {
        $nameLabel.text(config[type].nameLabel);
        $nameInput.attr('placeholder', config[type].namePlaceholder);

        $docLabel.text(config[type].docLabel);
        $docInput.attr('placeholder', config[type].docPlaceholder);
      }

      updateState();
    });

    /* =========================
      INIT
    ========================= */
    $block.find('.participant-type').trigger('change');

    syncPreview();
    updateState();

  });

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
