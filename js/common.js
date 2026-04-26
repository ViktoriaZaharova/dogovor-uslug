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

  /* =========================
    DATE FORMAT
  ========================= */
  function formatDate(value) {
    if (!value) return '';

    let parts = value.split('-'); // YYYY-MM-DD
    if (parts.length !== 3) return value;

    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }


  /* =========================
    NUMBER → WORDS
  ========================= */
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
      ['', ''], ['один','одна'], ['два','две'], ['три','три'],
      ['четыре','четыре'], ['пять','пять'], ['шесть','шесть'],
      ['семь','семь'], ['восемь','восемь'], ['девять','девять']
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


  /* =========================
    FORMAT VALUE
  ========================= */
  function formatValue($field) {

    let value = $field.val();

    if ($field.attr('type') === 'date') {
      return formatDate(value);
    }

    if ($field.data('format') === 'money' && value) {
      return Number(String(value).replace(/\s/g, '') || 0)
        .toLocaleString('ru-RU');
    }

    return value;
  }


  /* =========================
    VALIDATION
  ========================= */
  function validateField($field) {

    let $label = $field.closest('label');
    if (!$label.length) return;

    let val = $field.val();

    if ($field.prop('required')) {

      if (!val || val === '' || val === 'Выберите') {
        $label.addClass('error-label');
      } else {
        $label.removeClass('error-label');
      }

    }
  }

  function validateItem($item) {
    $item.find('input, select, textarea').each(function () {
      validateField($(this));
    });
  }


  /* =========================
    SYNC ALL
  ========================= */
  function syncAll() {

    $('[data-sync]').each(function () {

      let $field = $(this);
      let key = $field.data('sync');
      let value = formatValue($field);

      if (!value || value === '' || value === 'Выберите') {
        value = '____________';
      }

      $('[data-output="' + key + '"]').text(value);

      if ($field.data('format') === 'money') {
        let num = parseFloat(value.replace(/\s/g, '').replace(',', '.'));
        if (!isNaN(num)) {
          $('[data-output-text="' + key + '"]')
            .text(numberToWords(Math.floor(num)));
        }
      }

    });

  }


  /* =========================
    VAT
  ========================= */
  function updateVAT() {

    $('[data-vat-output]').each(function () {

      let el = $(this);

      let sumKey = el.data("vat-output");
      let rateKey = el.data("rate");

      let total = $('[data-output="' + sumKey + '"]').text().replace(/\s/g, '');
      let rate = $('[data-output="' + rateKey + '"]').text();

      let totalNum = parseFloat(total);
      let rateNum = parseFloat(rate);

      if (isNaN(totalNum) || isNaN(rateNum)) return;

      let vat = totalNum * rateNum / (100 + rateNum);

      $('[data-vat-output="' + sumKey + '"]').text(vat.toFixed(2));
      $('[data-vat-output-text="' + sumKey + '"]')
        .text(numberToWords(Math.floor(vat)));

    });

  }


  /* =========================
    SLIDER
  ========================= */
  $(".slider-range").each(function () {

    let slider = $(this);
    if (slider.hasClass("ui-slider")) return;

    let key = slider.data("sync");

    slider.slider({
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.1,
      range: "min",

      create: function () {
        if (!slider.find(".slider-value").length) {
          slider.find(".ui-slider-handle")
            .append('<div class="slider-value"></div>');
        }
        update(slider.slider("value"));
      },

      slide: function (e, ui) {
        update(ui.value);
      },

      change: function () {
        update(slider.slider("value"));
      }
    });

    function update(val) {
      let v = val.toFixed(1);

      slider.find(".slider-value").text(v + "%");

      if (key) {
        $('[data-output="' + key + '"]').text(v);
      }
    }

  });


  /* =========================
    CHECK STEP COMPLETE
  ========================= */
  function isComplete($item) {

    let ok = true;

    $item.find('input, select, textarea').each(function () {

      let $f = $(this);

      if ($f.prop('required') && !$f.prop('disabled')) {

        let val = $f.val();

        if (!val || val === '' || val === 'Выберите') {
          ok = false;
        }
      }

    });

    return ok;
  }


  /* =========================
    PROGRESS + CHECKED
  ========================= */
  function updateProgress() {

    let $items = $('.accordion-item');
    let total = $items.length;
    let completed = 0;

    $items.each(function () {

      let $item = $(this);

      if (isComplete($item)) {
        $item.addClass('checked').removeClass('no-checked');
        completed++;
      } else {
        $item.removeClass('checked');
      }

    });

    let percent = Math.round((completed / total) * 100);

    $('.completed-line__progress')
      .stop(true)
      .animate({ width: percent + '%' }, 200);

    $('.completed-line span').text(percent + '%');

    if (percent === 100) {
      $('.btn-contract').removeClass('disabled');
    } else {
      $('.btn-contract').addClass('disabled');
    }

  }


  /* =========================
    BLOCK NEXT STEP INPUT
  ========================= */
  $(document).on('focus mousedown', '.accordion-item input, .accordion-item select, .accordion-item textarea', function (e) {

    let $current = $(this).closest('.accordion-item');
    let $prev = $current.prev('.accordion-item');

    if ($prev.length && !isComplete($prev)) {

      $prev.addClass('no-checked');
      validateItem($prev);

      e.preventDefault();
      $(this).blur();

      $('html, body').animate({
        scrollTop: $prev.offset().top - 100
      }, 300);

      return false;
    }

  });


  /* =========================
    EVENTS
  ========================= */
  $(document).on('input change', '[data-sync]', function () {

    let $field = $(this);
    let $item = $field.closest('.accordion-item');

    validateField($field);

    if (isComplete($item)) {
      $item.removeClass('no-checked');
    }

    syncAll();
    updateVAT();
    updateProgress();

  });


  /* INIT */
  syncAll();
  updateVAT();
  updateProgress();

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
// $(function () {

//     function morph(n, f1, f2, f5) {
//         n = Math.abs(n) % 100;
//         let n1 = n % 10;
//         if (n > 10 && n < 20) return f5;
//         if (n1 > 1 && n1 < 5) return f2;
//         if (n1 == 1) return f1;
//         return f5;
//     }

//     function numberToWords(num) {

//         const units = [
//             ['', ''],
//             ['один', 'одна'],
//             ['два', 'две'],
//             ['три', 'три'],
//             ['четыре', 'четыре'],
//             ['пять', 'пять'],
//             ['шесть', 'шесть'],
//             ['семь', 'семь'],
//             ['восемь', 'восемь'],
//             ['девять', 'девять']
//         ];

//         const teens = [
//             'десять','одиннадцать','двенадцать','тринадцать',
//             'четырнадцать','пятнадцать','шестнадцать',
//             'семнадцать','восемнадцать','девятнадцать'
//         ];

//         const tens = [
//             '','десять','двадцать','тридцать','сорок',
//             'пятьдесят','шестьдесят','семьдесят',
//             'восемьдесят','девяносто'
//         ];

//         const hundreds = [
//             '','сто','двести','триста','четыреста',
//             'пятьсот','шестьсот','семьсот',
//             'восемьсот','девятьсот'
//         ];

//         function parse(num, female = false) {
//             let str = '';

//             let h = Math.floor(num / 100);
//             let t = Math.floor((num % 100) / 10);
//             let u = num % 10;

//             if (h) str += hundreds[h] + ' ';

//             if (t === 1) {
//                 str += teens[u] + ' ';
//             } else {
//                 if (t) str += tens[t] + ' ';
//                 if (u) str += units[u][female ? 1 : 0] + ' ';
//             }

//             return str.trim();
//         }

//         if (!num) return 'ноль рублей';

//         let result = '';

//         let millions = Math.floor(num / 1000000);
//         let thousands = Math.floor((num % 1000000) / 1000);
//         let rest = num % 1000;

//         if (millions) {
//             result += parse(millions) + ' ' +
//                 morph(millions, 'миллион', 'миллиона', 'миллионов') + ' ';
//         }

//         if (thousands) {
//             result += parse(thousands, true) + ' ' +
//                 morph(thousands, 'тысяча', 'тысячи', 'тысяч') + ' ';
//         }

//         if (rest) {
//             result += parse(rest) + ' ';
//         }

//         return (result + morph(num, 'рубль', 'рубля', 'рублей')).trim();
//     }


//     /* синхронизация input → data-output */
//     function syncInputs() {

//         $("[data-sync]").each(function () {

//             let key = $(this).data("sync");
//             let val = $(this).val();

//             $('[data-output="' + key + '"]').text(val);
//         });
//     }


//     function updateVAT() {

//         $("[data-vat-output]").each(function () {

//             let el = $(this);

//             let sumKey = el.data("vat-output");
//             let rateKey = el.data("rate");

//             let total = $('[data-output="' + sumKey + '"]').text()
//                 .replace(/\s/g, '')
//                 .replace(',', '.');

//             let rate = $('[data-output="' + rateKey + '"]').text()
//                 .replace(',', '.');

//             let totalNum = parseFloat(total);
//             let rateNum = parseFloat(rate);

//             if (isNaN(totalNum) || isNaN(rateNum)) return;

//             let vat = totalNum * rateNum / (100 + rateNum);

//             let rub = Math.floor(vat);
//             let kop = Math.round((vat - rub) * 100);

//             $('[data-vat-output="' + sumKey + '"]').text(vat.toFixed(2));

//             let text = numberToWords(rub) + ' ' + kop + ' копеек';

//             $('[data-vat-output-text="' + sumKey + '"]').text(text);
//         });
//     }


//     function updateAll() {
//         syncInputs();
//         updateVAT();
//     }


//     /* слушаем всё */
//     $(document).on("input change", "[data-sync]", function () {
//         updateAll();
//     });


//     /* первый запуск */
//     updateAll();

// });

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

