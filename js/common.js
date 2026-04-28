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

//плавный скролл
$(document).ready(function () {
  $('.go_to').click(function (e) {
    e.preventDefault();
    var scroll_el = $(this).attr('href');
    if ($(scroll_el).length !== 0) {
      $('html, body').animate({
        scrollTop: $(scroll_el).offset().top
      }, 500);
    }
    return false;
  });
});
//плавный скролл end

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


// $(function () {

//   /* =========================
//     DATE FORMAT
//   ========================= */
//   function formatDate(value) {
//     if (!value) return '';

//     let parts = value.split('-'); // YYYY-MM-DD
//     if (parts.length !== 3) return value;

//     return parts[2] + '.' + parts[1] + '.' + parts[0];
//   }


//   /* =========================
//     NUMBER → WORDS
//   ========================= */
//   function morph(n, f1, f2, f5) {
//     n = Math.abs(n) % 100;
//     let n1 = n % 10;
//     if (n > 10 && n < 20) return f5;
//     if (n1 > 1 && n1 < 5) return f2;
//     if (n1 == 1) return f1;
//     return f5;
//   }

//   function numberToWords(num) {

//     const units = [
//       ['', ''], ['один', 'одна'], ['два', 'две'], ['три', 'три'],
//       ['четыре', 'четыре'], ['пять', 'пять'], ['шесть', 'шесть'],
//       ['семь', 'семь'], ['восемь', 'восемь'], ['девять', 'девять']
//     ];

//     const teens = [
//       'десять', 'одиннадцать', 'двенадцать', 'тринадцать',
//       'четырнадцать', 'пятнадцать', 'шестнадцать',
//       'семнадцать', 'восемнадцать', 'девятнадцать'
//     ];

//     const tens = [
//       '', 'десять', 'двадцать', 'тридцать', 'сорок',
//       'пятьдесят', 'шестьдесят', 'семьдесят',
//       'восемьдесят', 'девяносто'
//     ];

//     const hundreds = [
//       '', 'сто', 'двести', 'триста', 'четыреста',
//       'пятьсот', 'шестьсот', 'семьсот',
//       'восемьсот', 'девятьсот'
//     ];

//     function parse(num, female = false) {
//       let str = '';

//       let h = Math.floor(num / 100);
//       let t = Math.floor((num % 100) / 10);
//       let u = num % 10;

//       if (h) str += hundreds[h] + ' ';

//       if (t === 1) {
//         str += teens[u] + ' ';
//       } else {
//         if (t) str += tens[t] + ' ';
//         if (u) str += units[u][female ? 1 : 0] + ' ';
//       }

//       return str.trim();
//     }

//     if (!num) return 'ноль рублей';

//     let result = '';

//     let millions = Math.floor(num / 1000000);
//     let thousands = Math.floor((num % 1000000) / 1000);
//     let rest = num % 1000;

//     if (millions) {
//       result += parse(millions) + ' ' +
//         morph(millions, 'миллион', 'миллиона', 'миллионов') + ' ';
//     }

//     if (thousands) {
//       result += parse(thousands, true) + ' ' +
//         morph(thousands, 'тысяча', 'тысячи', 'тысяч') + ' ';
//     }

//     if (rest) {
//       result += parse(rest) + ' ';
//     }

//     return (result + morph(num, 'рубль', 'рубля', 'рублей')).trim();
//   }


//   /* =========================
//     FORMAT VALUE
//   ========================= */
//   function formatValue($field) {

//     let value = $field.val();

//     if ($field.attr('type') === 'date') {
//       return formatDate(value);
//     }

//     if ($field.data('format') === 'money' && value) {
//       return Number(String(value).replace(/\s/g, '') || 0)
//         .toLocaleString('ru-RU');
//     }

//     return value;
//   }


//   /* =========================
//     VALIDATION
//   ========================= */
//   function validateField($field) {

//     let $label = $field.closest('label');
//     if (!$label.length) return;

//     let val = $field.val();

//     if ($field.prop('required')) {

//       if (!val || val === '' || val === 'Выберите') {
//         $label.addClass('error-label');
//       } else {
//         $label.removeClass('error-label');
//       }

//     }
//   }

//   function validateItem($item) {
//     $item.find('input, select, textarea').each(function () {
//       validateField($(this));
//     });
//   }


//   /* =========================
//     SYNC ALL
//   ========================= */
//   function syncAll() {

//     $('[data-sync]').each(function () {

//       let $field = $(this);
//       let key = $field.data('sync');
//       let value = formatValue($field);

//       if (!value || value === '' || value === 'Выберите') {
//         value = '____________';
//       }

//       $('[data-output="' + key + '"]').text(value);

//       if ($field.data('format') === 'money') {
//         let num = parseFloat(value.replace(/\s/g, '').replace(',', '.'));
//         if (!isNaN(num)) {
//           $('[data-output-text="' + key + '"]')
//             .text(numberToWords(Math.floor(num)));
//         }
//       }

//     });

//   }


//   /* =========================
//     VAT
//   ========================= */
//   function updateVAT() {

//     $('[data-vat-output]').each(function () {

//       let el = $(this);

//       let sumKey = el.data("vat-output");
//       let rateKey = el.data("rate");

//       let total = $('[data-output="' + sumKey + '"]').text().replace(/\s/g, '');
//       let rate = $('[data-output="' + rateKey + '"]').text();

//       let totalNum = parseFloat(total);
//       let rateNum = parseFloat(rate);

//       if (isNaN(totalNum) || isNaN(rateNum)) return;

//       let vat = totalNum * rateNum / (100 + rateNum);

//       $('[data-vat-output="' + sumKey + '"]').text(vat.toFixed(2));
//       $('[data-vat-output-text="' + sumKey + '"]')
//         .text(numberToWords(Math.floor(vat)));

//     });

//   }


//   /* =========================
//     SLIDER
//   ========================= */
//   $(".slider-range").each(function () {

//     let slider = $(this);
//     if (slider.hasClass("ui-slider")) return;

//     let key = slider.data("sync");

//     slider.slider({
//       min: 0,
//       max: 1,
//       step: 0.1,
//       value: 0.1,
//       range: "min",

//       create: function () {
//         if (!slider.find(".slider-value").length) {
//           slider.find(".ui-slider-handle")
//             .append('<div class="slider-value"></div>');
//         }
//         update(slider.slider("value"));
//       },

//       slide: function (e, ui) {
//         update(ui.value);
//       },

//       change: function () {
//         update(slider.slider("value"));
//       }
//     });

//     function update(val) {
//       let v = val.toFixed(1);

//       slider.find(".slider-value").text(v + "%");

//       if (key) {
//         $('[data-output="' + key + '"]').text(v);
//       }
//     }

//   });

//   /* =========================
//   CONDITIONAL BLOCKS (UNIVERSAL)
// ========================= */
//   function toggleConditionalBlocks() {

//     $('[data-toggle]').each(function () {

//       let $control = $(this);

//       let key = $control.data('toggle');
//       let requiredValue = $control.data('toggle-value');
//       let currentValue = $control.val();

//       let $targets = $('[data-toggle-target="' + key + '"]');

//       if (currentValue === requiredValue) {

//         $targets.stop(true, true).slideDown(200);

//         $targets
//           .find('input, select, textarea')
//           .prop('disabled', false);

//       } else {

//         $targets.stop(true, true).slideUp(200);

//         $targets
//           .find('input, select, textarea')
//           .prop('disabled', true)
//           .val('');

//         $targets.find('label').removeClass('error-label');
//       }

//     });

//   }

//   /* =========================
//      STEPS LOGIC
//   ========================= */

//   // добавить этап
//   function addStep($block) {
//     let template = $('.step-template').html();
//     $block.find('.steps-wrapper').append(template);
//   }

//   // показать / скрыть блок
//   function toggleSteps($block) {

//     let val = $block.find('[data-sync="payment_step_select"]').val();

//     if (val === 'Да') {

//       $block.find('.steps-wrapper, .btn-add-step').stop(true, true).slideDown(200);

//       if (!$block.find('.step-item').length) {
//         addStep($block);
//       }

//     } else {

//       $block.find('.steps-wrapper, .btn-add-step').stop(true, true).slideUp(200);
//       $block.find('.steps-wrapper').empty();

//       updateStepsOutput($block);
//     }
//   }


//   // генерация текста этапов
//   function updateStepsOutput($block) {

//     let result = [];

//     $block.find('.step-item').each(function (index) {

//       let name = $(this).find('.step-name').val();
//       let sum = $(this).find('.step-sum').val();
//       let date = $(this).find('.step-date').val();

//       if (name && sum && date) {

//         let num = Number(String(sum).replace(/\s/g, '') || 0);

//         let sumFormatted = num.toLocaleString('ru-RU');
//         let sumText = numberToWords(Math.floor(num));

//         result.push(
//           (index + 1) + ' этап — ' +
//           name + ', ' +
//           sumFormatted + ' руб. (' + sumText + '), срок: ' +
//           date
//         );

//       }

//     });

//     let text = result.length ? result.join('\n') : '____________';

//     $('[data-output="steps_text"]').text(text);
//   }


//   /* =========================
//      EVENTS
//   ========================= */

//   // добавить этап
//   $(document).on('click', '.btn-add-step', function () {
//     let $block = $(this).closest('.payment-steps-block');
//     addStep($block);
//   });

//   // удалить этап
//   $(document).on('click', '.btn-remove-step', function () {

//     let $block = $(this).closest('.payment-steps-block');

//     if ($block.find('.step-item').length > 1) {
//       $(this).closest('.step-item').remove();
//     }

//     updateStepsOutput($block);
//   });


//   // изменение любого поля внутри блока
//   $(document).on('input change', '.payment-steps-block input, .payment-steps-block select', function () {

//     let $block = $(this).closest('.payment-steps-block');

//     toggleSteps($block);
//     updateStepsOutput($block);

//   });


//   /* =========================
//      INIT
//   ========================= */

//   $('.payment-steps-block').each(function () {
//     let $block = $(this);
//     toggleSteps($block);
//     updateStepsOutput($block);
//   });

//   /* =========================
//     CHECK STEP COMPLETE
//   ========================= */
//   function isComplete($item) {

//     let ok = true;

//     $item.find('input, select, textarea').each(function () {

//       let $f = $(this);

//       if ($f.prop('required') && !$f.prop('disabled')) {

//         let val = $f.val();

//         if (!val || val === '' || val === 'Выберите') {
//           ok = false;
//         }
//       }

//     });

//     return ok;
//   }


//   /* =========================
//     PROGRESS + CHECKED
//   ========================= */
//   function updateProgress() {

//     let $items = $('.accordion-item');
//     let total = $items.length;
//     let completed = 0;

//     $items.each(function () {

//       let $item = $(this);

//       if (isComplete($item)) {
//         $item.addClass('checked').removeClass('no-checked');
//         completed++;
//       } else {
//         $item.removeClass('checked');
//       }

//     });

//     let percent = Math.round((completed / total) * 100);

//     $('.completed-line__progress')
//       .stop(true)
//       .animate({ width: percent + '%' }, 200);

//     $('.completed-line span').text(percent + '%');

//     if (percent === 100) {
//       $('.btn-contract').removeClass('disabled');
//     } else {
//       $('.btn-contract').addClass('disabled');
//     }

//   }


//   /* =========================
//     BLOCK NEXT STEP INPUT
//   ========================= */
//   $(document).on('focus mousedown', '.accordion-item input, .accordion-item select, .accordion-item textarea', function (e) {

//     let $current = $(this).closest('.accordion-item');
//     let $prev = $current.prev('.accordion-item');

//     if ($prev.length && !isComplete($prev)) {

//       $prev.addClass('no-checked');
//       validateItem($prev);

//       e.preventDefault();
//       $(this).blur();

//       $('html, body').animate({
//         scrollTop: $prev.offset().top - 100
//       }, 300);

//       return false;
//     }

//   });


//   /* =========================
//     EVENTS
//   ========================= */
//   $(document).on('input change', '[data-sync]', function () {

//     let $field = $(this);
//     let $item = $field.closest('.accordion-item');

//     validateField($field);

//     if (isComplete($item)) {
//       $item.removeClass('no-checked');
//     }

//     syncAll();
//     updateVAT();
//     updateProgress();

//   });


//   /* INIT */
//   syncAll();
//   updateVAT();
//   updateProgress();

// });


$(function () {

  /* =========================
    DATE FORMAT
  ========================= */
  function formatDate(value) {
    if (!value) return '';
    let parts = value.split('-');
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
      ['', ''], ['один', 'одна'], ['два', 'две'], ['три', 'три'],
      ['четыре', 'четыре'], ['пять', 'пять'], ['шесть', 'шесть'],
      ['семь', 'семь'], ['восемь', 'восемь'], ['девять', 'девять']
    ];

    const teens = [
      'десять', 'одиннадцать', 'двенадцать', 'тринадцать',
      'четырнадцать', 'пятнадцать', 'шестнадцать',
      'семнадцать', 'восемнадцать', 'девятнадцать'
    ];

    const tens = [
      '', 'десять', 'двадцать', 'тридцать', 'сорок',
      'пятьдесят', 'шестьдесят', 'семьдесят',
      'восемьдесят', 'девяносто'
    ];

    const hundreds = [
      '', 'сто', 'двести', 'триста', 'четыреста',
      'пятьсот', 'шестьсот', 'семьсот',
      'восемьсот', 'девятьсот'
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

    if (millions) result += parse(millions) + ' ' + morph(millions, 'миллион', 'миллиона', 'миллионов') + ' ';
    if (thousands) result += parse(thousands, true) + ' ' + morph(thousands, 'тысяча', 'тысячи', 'тысяч') + ' ';
    if (rest) result += parse(rest) + ' ';

    return (result + morph(num, 'рубль', 'рубля', 'рублей')).trim();
  }

  function getNumber(v) {
    return parseFloat(String(v || '').replace(/\s/g, '').replace(',', '.')) || 0;
  }

  /* =========================
    VALIDATION (ВОЗВРАЩЕНО)
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
    PROGRESS (ВОЗВРАЩЕНО)
  ========================= */

  function isComplete($item) {
    let ok = true;

    $item.find('input, select, textarea').each(function () {

      let $f = $(this);

      if ($f.prop('required') && !$f.prop('disabled')) {
        if (!$f.val()) ok = false;
      }

    });

    return ok;
  }

  function updateProgress() {

    let $items = $('.accordion-item');
    let total = $items.length;
    let completed = 0;

    $items.each(function () {

      if (isComplete($(this))) {
        $(this).addClass('checked').removeClass('no-checked');
        completed++;
      } else {
        $(this).removeClass('checked');
      }

    });

    let percent = total ? Math.round((completed / total) * 100) : 0;

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
    SYNC
  ========================= */

  function syncAll() {

  $('[data-sync]').each(function () {

    let $f = $(this);
    let key = $f.data('sync');
    let val = $f.val();

    if (!val) val = '____________';

    // обычный output
    $('[data-output="' + key + '"]').text(val);

    let num = getNumber(val);

    // 💥 ВАЖНО: всегда проверяем data-output-text, независимо от format
    let $textOut = $('[data-output-text="' + key + '"]');

    if ($textOut.length) {

      if ($f.data('format') === 'percent') {
        $textOut.text(num + '%');
      }
      else {
        $textOut.text(numberToWords(num));
      }

    }

  });
}

  /* =========================
    SLIDER (ВОЗВРАЩЕН И ПОЧИНЕН)
  ========================= */

  function initSliders() {

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

  }

  /* =========================
    STEPS
  ========================= */

  function addStep($block) {
    let tpl = $('.step-template').html();
    $block.find('.steps-wrapper').append(tpl);
  }

  function toggleSteps($block) {

    let val = $block.find('[data-sync="payment_step_select"]').val();

    if (val === 'Да') {

      $block.find('.steps-wrapper, .btn-add-step').slideDown(200);

      if ($block.find('.step-item').length === 0) {
        addStep($block);
        addStep($block); // сразу 2 этапа
      }

    } else {
      $block.find('.steps-wrapper, .btn-add-step').slideUp(200);
      $block.find('.steps-wrapper').empty();
    }

  }

  /* =========================
    CONTRACT RENDER
  ========================= */

  function renderContract() {

    let enabled = $('[data-sync="payment_step_select"]').val() === 'Да';
    let $contract = $('[data-output="steps_text"]');

    if (!enabled) {
      $contract.hide();
      return;
    }

    $contract.show();

    let html = '<p>2.3. Заказчик оплачивает Услуги согласно этапам:</p>';

    $('.step-item').each(function (i) {

      let name = $(this).find('.step-name').val();
      let sum = getNumber($(this).find('.step-sum').val());
      let date = $(this).find('.step-date').val();

      html += `
        <p>
          2.3.${i + 1}. ${name || 'Этап ' + (i + 1)}
          — ${sum.toLocaleString('ru-RU')} (${numberToWords(sum)}) руб.
          — срок: ${date || '___'}
        </p>
      `;

    });

    $contract.html(html);
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

  $(document).on('click', '.btn-add-step', function () {
    addStep($(this).closest('.payment-steps-block'));
    renderContract();
  });

  $(document).on('click', '.btn-remove-step', function () {

    if ($('.step-item').length > 1) {
      $(this).closest('.step-item').remove();
    }

    renderContract();
  });

  $(document).on('input change', '.payment-steps-block input, .payment-steps-block select', function () {

    let $block = $(this).closest('.payment-steps-block');

    toggleSteps($block);

    syncAll();
    renderContract();
    updateProgress();
  });

  $(document).on('input change', '[data-sync]', function () {

    syncAll();
    updateProgress();
  });

  /* =========================
    INIT
  ========================= */

  syncAll();
  initSliders();
  updateProgress();
  renderContract();

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

