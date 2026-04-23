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

// $(function () {

//     $(".slider-range").each(function () {

//         let slider = $(this);

//         slider.slider({
//             min: 0,
//             max: 1,
//             step: 0.1,
//             value: 0.1,
//             range: "min",

//             create: function () {

//                 let currentValue = slider.slider("value");

//                 slider.find(".ui-slider-handle").append(
//                     '<div class="slider-value">' + currentValue.toFixed(1) + '%</div>'
//                 );
//             },

//             slide: function (event, ui) {
//                 slider.find(".slider-value").text(ui.value.toFixed(1) + "%");
//             },

//             change: function (event, ui) {
//                 slider.find(".slider-value").text(
//                     slider.slider("value").toFixed(1) + "%"
//                 );
//             }
//         });

//     });

// });


$(function () {

    function syncValue(key, value) {
        $('[data-output="' + key + '"]').text(value);
    }

    $(".slider-range").each(function () {

        let slider = $(this);

        /* защита от повторной инициализации */
        if (slider.hasClass("ui-slider")) return;

        let key = slider.data("sync");

        slider.slider({
            min: 0,
            max: 1,
            step: 0.1,
            value: 0.1,
            range: "min",

            create: function () {

                let val = slider.slider("value");

                /* вставка только если нет */
                if (!slider.find(".slider-value").length) {
                    slider.find(".ui-slider-handle").append(
                        '<div class="slider-value"></div>'
                    );
                }

                update(val);
            },

            slide: function (event, ui) {
                update(ui.value);
            },

            change: function () {
                update(slider.slider("value"));
            }
        });

        function update(val) {
            let value = val.toFixed(1);

            slider.find(".slider-value").text(value + "%");

            if (key) {
                syncValue(key, value);
            }
        }

    });

});

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

// text price
$(function () {

    function morph(n, f1, f2, f5) {
        n = Math.abs(n) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) return f5;
        if (n1 > 1 && n1 < 5) return f2;
        if (n1 == 1) return f1;
        return f5;
    }

    function numberToWords(num) {

        const units = [
            ['', ''],
            ['один', 'одна'],
            ['два', 'две'],
            ['три', 'три'],
            ['четыре', 'четыре'],
            ['пять', 'пять'],
            ['шесть', 'шесть'],
            ['семь', 'семь'],
            ['восемь', 'восемь'],
            ['девять', 'девять']
        ];

        const teens = [
            'десять','одиннадцать','двенадцать','тринадцать',
            'четырнадцать','пятнадцать','шестнадцать',
            'семнадцать','восемнадцать','девятнадцать'
        ];

        const tens = [
            '','десять','двадцать','тридцать','сорок',
            'пятьдесят','шестьдесят','семьдесят',
            'восемьдесят','девяносто'
        ];

        const hundreds = [
            '','сто','двести','триста','четыреста',
            'пятьсот','шестьсот','семьсот',
            'восемьсот','девятьсот'
        ];

        function parse(num, female = false) {
            let str = '';

            let h = Math.floor(num / 100);
            let t = Math.floor((num % 100) / 10);
            let u = num % 10;

            if (h) str += hundreds[h] + ' ';

            if (t === 1) {
                str += teens[u] + ' ';
            } else {
                if (t) str += tens[t] + ' ';
                if (u) str += units[u][female ? 1 : 0] + ' ';
            }

            return str.trim();
        }

        if (!num) return 'ноль рублей';

        let result = '';

        let millions = Math.floor(num / 1000000);
        let thousands = Math.floor((num % 1000000) / 1000);
        let rest = num % 1000;

        if (millions) {
            result += parse(millions) + ' ' +
                morph(millions, 'миллион', 'миллиона', 'миллионов') + ' ';
        }

        if (thousands) {
            result += parse(thousands, true) + ' ' +
                morph(thousands, 'тысяча', 'тысячи', 'тысяч') + ' ';
        }

        if (rest) {
            result += parse(rest) + ' ';
        }

        return (result + morph(num, 'рубль', 'рубля', 'рублей')).trim();
    }


    /* синхронизация input → data-output */
    function syncInputs() {

        $("[data-sync]").each(function () {

            let key = $(this).data("sync");
            let val = $(this).val();

            $('[data-output="' + key + '"]').text(val);
        });
    }


    function updateVAT() {

        $("[data-vat-output]").each(function () {

            let el = $(this);

            let sumKey = el.data("vat-output");
            let rateKey = el.data("rate");

            let total = $('[data-output="' + sumKey + '"]').text()
                .replace(/\s/g, '')
                .replace(',', '.');

            let rate = $('[data-output="' + rateKey + '"]').text()
                .replace(',', '.');

            let totalNum = parseFloat(total);
            let rateNum = parseFloat(rate);

            if (isNaN(totalNum) || isNaN(rateNum)) return;

            let vat = totalNum * rateNum / (100 + rateNum);

            let rub = Math.floor(vat);
            let kop = Math.round((vat - rub) * 100);

            $('[data-vat-output="' + sumKey + '"]').text(vat.toFixed(2));

            let text = numberToWords(rub) + ' ' + kop + ' копеек';

            $('[data-vat-output-text="' + sumKey + '"]').text(text);
        });
    }


    function updateAll() {
        syncInputs();
        updateVAT();
    }


    /* слушаем всё */
    $(document).on("input change", "[data-sync]", function () {
        updateAll();
    });


    /* первый запуск */
    updateAll();

});

$(function () {

    function toggleGroup(selectKey, targets, container) {

        let select = container.find('[data-sync="' + selectKey + '"]');
        let val = (select.val() || '').toLowerCase();

        let fields = container.find(targets.map(t => '[data-sync="' + t + '"]').join(','));
        let blocks = fields.closest('.col-12, .col-lg-6');

        if (val.includes('нет')) {

            blocks.hide();

            fields.each(function () {
                $(this)
                    .val('')
                    .prop('disabled', true)
                    .removeAttr('required');
            });

        } else {

            blocks.show();

            fields.each(function () {
                $(this)
                    .prop('disabled', false)
                    .attr('required', true);
            });

        }
    }


    function initToggles() {

        $('[data-sync]').each(function () {

            let container = $(this).closest('.row');

            /* гарантия */
            toggleGroup('warranty_select',
                ['warranty_period', 'warranty_description', 'warranty_exceptions'],
                container
            );

            /* НДС */
            toggleGroup('nds_select',
                ['nds_cost'],
                container
            );

            /* этапы оплаты */
            toggleGroup('payment_step_select',
                ['name_step', 'sum_step'],
                container
            );

        });

    }


    /* init */
    initToggles();

    /* change */
    $(document).on('change', '[data-sync]', function () {
        let container = $(this).closest('.row');
        initToggles(container);
    });

});

