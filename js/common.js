// $('[name="phone"]').mask('+7 (999) 999-99-99');

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



$(function () {

  /* =========================
    DATE FORMAT
  ========================= */
  function formatDate(value) {
    if (!value) return '';
    if (value.includes('.')) return value;

    let parts = value.split('-');
    if (parts.length === 3) {
      return parts[2] + '.' + parts[1] + '.' + parts[0];
    }

    return value;
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

  function calcVAT(sum, percent) {
    sum = getNumber(sum);
    percent = getNumber(percent);
    if (!sum || !percent) return 0;
    return sum * percent / 100;
  }

  /* =========================
    SYNC
  ========================= */

  function syncAll() {

    $('[data-sync]').each(function () {

      let $f = $(this);
      let key = $f.data('sync');
      let val = $f.val();

      if ($f.attr('type') === 'date' || $f.data('type') === 'date') {
        val = formatDate(val);
      }

      if (!val) val = '____________';

      $('[data-output="' + key + '"]').text(val);

      let num = getNumber(val);
      let $textOut = $('[data-output-text="' + key + '"]');

      if ($textOut.length) {
        if ($f.data('format') === 'percent') {
          $textOut.text(num + '%');
        } else {
          $textOut.text(numberToWords(num));
        }
      }

    });

    updateVATOutputs();
  }

  /* =========================
    VAT (ЕДИНЫЙ)
  ========================= */

  function updateVATOutputs() {

    $('[data-vat-output]').each(function () {

      let $el = $(this);

      let rateKey = $el.data('rate'); // nds_cost
      let baseKey = $el.data('vat-output'); // total_cost

      let sum = getNumber($('[data-sync="' + baseKey + '"]').val());
      let percent = getNumber($('[data-sync="' + rateKey + '"]').val());

      let vat = calcVAT(sum, percent);

      $el.text(vat.toLocaleString('ru-RU'));
    });

    $('[data-vat-output-text]').each(function () {

      let $el = $(this);

      let rateKey = $el.data('rate');
      let baseKey = $el.data('vat-output-text');

      let sum = getNumber($('[data-sync="' + baseKey + '"]').val());
      let percent = getNumber($('[data-sync="' + rateKey + '"]').val());

      let vat = calcVAT(sum, percent);

      $el.text(numberToWords(vat));
    });

  }

  /* =========================
    SLIDER
  ========================= */

  function initSliders() {

    $(".slider-range").each(function () {

      let slider = $(this);
      if (slider.hasClass("ui-slider")) return;

      let key = slider.data("target");
      let $input = $('[data-sync="' + key + '"]');

      slider.slider({
        min: 0,
        max: 5,
        step: 0.1,
        value: 0.1,
        range: "min",

        create: function () {
          slider.find(".ui-slider-handle")
            .append('<div class="slider-value"></div>');
          update(slider.slider("value"));
        },

        slide: function (e, ui) {
          update(ui.value);
        }
      });

      function update(val) {
        let v = parseFloat(val).toFixed(1);

        slider.find(".slider-value").text(v + "%");

        if ($input.length) {
          $input.val(v).trigger('change');
        }

        $('[data-output="' + key + '"]').text(v);
      }

    });
  }

  /* =========================
    STEPS
  ========================= */

  function addStep($block) {
    let tpl = $('.step-template').html();
    let index = $block.find('.step-item').length + 1;

    let $tpl = $(tpl);
    $tpl.find('.step-name').val('Этап ' + index);

    $block.find('.steps-wrapper').append($tpl);
  }

  function toggleSteps($block) {

    let val = $block.find('[data-sync="payment_step_select"]').val();
    let $wrapper = $block.find('.steps-wrapper');
    let $btn = $block.find('.btn-add-step');

    if (val === 'Да') {

      $wrapper.slideDown(200);
      $btn.show();

      if ($block.find('.step-item').length === 0) {
        addStep($block);
        addStep($block);
      }

    } else {
      $wrapper.slideUp(200);
      $btn.hide();
      $wrapper.empty();
    }
  }

  /* =========================
    CONTRACT
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
      let date = formatDate($(this).find('.step-date').val());

      html += `
        <p>
          2.3.${i + 1}. ${name || 'Этап ' + (i + 1)}
          — ${sum.toLocaleString('ru-RU')} (${numberToWords(sum)}) руб.
          — срок: ${date || '___'} дней
        </p>
      `;
    });

    // let vat = calcVAT(
    //   $('[data-sync="sum"]').val(),
    //   $('[data-sync="nds_cost"]').val()
    // );

    // html += `
    //   <p>
    //     НДС ${$('[data-sync="nds_cost"]').val()}% —
    //     ${vat.toLocaleString('ru-RU')}
    //     (${numberToWords(vat)}) руб.
    //   </p>
    // `;

    $contract.html(html);
  }

  /* =========================
 PROGRESS
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

    $('.btn-contract').toggleClass('disabled', percent !== 100);
  }

  /* =========================
    BLOCK NEXT STEP INPUT
  ========================= */

  $(document).on(
    'focus mousedown',
    '.accordion-item input, .accordion-item select, .accordion-item textarea',
    function (e) {

      let $current = $(this).closest('.accordion-item');
      let $prev = $current.prev('.accordion-item');

      if ($prev.length && !isComplete($prev)) {

        $prev.addClass('no-checked');

        // подсветка ошибок
        $prev.find('input, select, textarea').each(function () {
          let $f = $(this);
          let $label = $f.closest('label');

          if ($f.prop('required') && !$f.val()) {
            $label.addClass('error-label');
          }
        });

        e.preventDefault();
        $(this).blur();

        $('html, body').animate({
          scrollTop: $prev.offset().top - 100
        }, 300);

        return false;
      }
    }
  );

  $(document).on('input change', '.step-item input', function () {
    renderContract();
    updateProgress();
  });

  /* =========================
    WARRANTY TOGGLE
  ========================= */

  function toggleWarranty() {

    let val = $('[data-sync="warranty_select"]').val();
    let $block = $('.warranty-text');

    if (val === 'Нет') {

      $block.slideUp(200);

      $block.find('input, select, textarea')
        .prop('disabled', true);

    } else {

      $block.slideDown(200);

      $block.find('input, select, textarea')
        .prop('disabled', false);

    }

  }

  /* =========================
  CONFIDENTIALITY TOGGLE
========================= */

  function toggleConfidentiality() {

    let val = $('[data-sync="confidentiality_select"]').val();
    let $block = $('.confidentiality-text');

    if (val === 'Соблюдать') {

      $block.slideDown(200);

      // включаем поля внутри
      $block.find('input, select, textarea')
        .prop('disabled', false);

    } else {

      $block.slideUp(200);

      // отключаем поля (важно для валидации)
      $block.find('input, select, textarea')
        .prop('disabled', true);

    }

  }

  /* =========================
    PARTICIPANT LOGIC
  ========================= */

  function toggleParticipant($block) {

    let type = $block.find('.participant-type').val();

    let $nameLabel = $block.find('.field-name-label');
    let $docLabel = $block.find('.field-doc-label');

    let $fields = $block.find('[data-field]');

    // сначала всё скрываем и отключаем
    $fields.each(function () {
      $(this)
        .closest('.col-12, .col-lg-6')
        .hide()
        .find('input')
        .prop('required', false)
        .prop('disabled', true);
    });

    function show(field, required = true) {
      let $f = $block.find('[data-field="' + field + '"]');

      $f.closest('.col-12, .col-lg-6').show();

      $f.prop('disabled', false);

      if (required) {
        $f.prop('required', true);
      }
    }

    /* ===== ТИПЫ ===== */

    if (type === 'Физ. лицо') {

      $nameLabel.text('ФИО');
      $docLabel.text('Паспорт');

      show('name');
      show('address');
      show('document');

    }

    else if (type === 'ИП') {

      $nameLabel.text('ФИО ИП');
      $docLabel.text('ОГРНИП');

      show('name');
      show('address');
      show('inn');
      show('document');

    }

    else if (type === 'Самозанятый') {

      $nameLabel.text('ФИО');
      $docLabel.text('ИНН');

      show('name');
      show('inn');

    }

    else if (type === 'Юр. лицо') {

      $nameLabel.text('Наименование организации');
      $docLabel.text('ОГРН');

      show('name');
      show('address');
      show('inn');
      show('document');

      // можно добавить доп поля позже:
      // директор, основание, должность
    }

    else if (type === 'Иностранный гражданин') {

      $nameLabel.text('ФИО');
      $docLabel.text('Документ');

      show('name');
      show('document');
      show('country');
      show('work_permission');

    }

  }

  $(document).on('change', '.participant-type', function () {

    let $block = $(this).closest('.participant-block');

    toggleParticipant($block);

    updateProgress();
  });

  $('.participant-block').each(function () {
    toggleParticipant($(this));
  });

  /* =========================
  NDS TEXT
========================= */

  function updateNDSText() {

    let type = $('[data-sync="nds_select"]').val();
    let percent = $('[data-sync="nds_cost"]').val();

    let sum = getNumber($('[data-sync="total_cost"]').val());
    let vat = calcVAT(sum, percent);

    let html = '';

    if (type === 'Нет') {

      html = `
      2.2. НДС не применяется в соответствии с действующим законодательством.
    `;

    } else if (type === 'Включен') {

      html = `
      2.2. НДС составляет ${percent}% и включен в стоимость Услуг.
      Сумма НДС: ${vat.toLocaleString('ru-RU')} (${numberToWords(vat)}) руб.
    `;

    } else {

      html = `
      2.2. НДС составляет ${percent}% в размере 
      ${vat.toLocaleString('ru-RU')} (${numberToWords(vat)}) руб.
      и не включен в стоимость Услуг.
    `;

    }

    $('.nds-text').html(html);
  }

  /* =========================
    PAYMENT METHOD
  ========================= */

  function togglePaymentDetails() {

    let type = $('[data-sync="variable_payment_select"]').val();

    let $block = $('.payment-details-block');

    let $card = $block.find('.payment-card');
    let $bank = $block.find('.payment-bank');

    // всё скрываем
    $block.hide();
    $card.hide();
    $bank.hide();

    // отключаем всё
    $block.find('input').prop('disabled', true).prop('required', false);

    if (type === 'Перевод') {

      $block.show();
      $card.show();

      $card.find('input')
        .prop('disabled', false)
        .prop('required', true);

    }

    else if (type === 'Расчетный (банковский) счет') {

      $block.show();
      $bank.show();

      $bank.find('input')
        .prop('disabled', false)
        .prop('required', true);

    }

    // Наличные → ничего не показываем

  }

  /* =========================
    PARTICIPANTS TEXT (SMART)
  ========================= */

  function updateParticipantsText() {

    /* ===== ЗАКАЗЧИК ===== */
    let typeC = $('[data-sync="type_customer"]').val();
    let nameC = $('[data-sync="name_customer"]').val() || '____________';
    let docC = $('[data-sync="document_customer"]').val() || '____________';

    let customerHTML = '';

    if (typeC === 'ИП') {

      customerHTML = `
      Индивидуальный предприниматель ${nameC},
      зарегистрированный в реестре индивидуальных предпринимателей под № ${docC}
      (далее – "Заказчик")
    `;

    } else {
      // физ / юр / самозанятый — как было
      customerHTML = `
      ${nameC}, действующий как ${typeC}
      (далее – "Заказчик")
    `;
    }

    $('[data-block="customer-text"]').html(customerHTML);


    /* ===== ИСПОЛНИТЕЛЬ ===== */
    let typeE = $('[data-sync="type_executor"]').val();
    let nameE = $('[data-sync="name_executor"]').val() || '____________';
    let docE = $('[data-sync="document_executor"]').val() || '____________';
    let countryE = $('[data-sync="country_executor"]').val() || '____________';
    let workE = $('[data-sync="work_permission_executor"]').val() || '____________';

    let executorHTML = '';

    if (typeE === 'ИП') {

      executorHTML = `
      Индивидуальный предприниматель ${nameE},
      зарегистрированный в реестре индивидуальных предпринимателей под № ${docE}
      (далее – "Исполнитель")
    `;

    }

    else if (typeE === 'Самозанятый') {

      executorHTML = `
      ${nameE}, действующий как физическое лицо с применением налогового режима
      "налог на профессиональный доход"
      (далее – "Исполнитель")
    `;

    }

    else if (typeE === 'Иностранный гражданин') {

      executorHTML = `
      ${nameE}, гражданин ${countryE},
      основанием пребывания на территории Российской Федерации является ${docE},
      наличие разрешения на работу подтверждается ${workE}
      (далее – "Исполнитель")
    `;

    }

    else {
      // физ лицо / юр лицо — как было
      executorHTML = `
      ${nameE}, зарегистрированный в ${typeE}
      под № ${docE}
      (далее – "Исполнитель")
    `;
    }

    $('[data-block="executor-text"]').html(executorHTML);

  }

  function renderExecutorRequisites() {

    let type = $('[data-sync="type_executor"]').val();
    let payment = $('[data-sync="variable_payment_select"]').val();

    let name = $('[data-sync="name_executor"]').val() || '____________';
    let inn = $('[data-sync="inn_executor"]').val() || '____________';
    let doc = $('[data-sync="document_executor"]').val() || '____________';
    let address = $('[data-sync="address_executor"]').val() || '____________';

    let bank = $('[data-sync="executor_bank"]').val() || '____________';
    let bik = $('[data-sync="executor_bik"]').val() || '____________';
    let ks = $('[data-sync="executor_ks"]').val() || '____________';
    let account = $('[data-sync="executor_account"]').val() || '____________';

    let html = `
    <p>Исполнитель ${name}</p>
    <p>Тип: ${type}</p>
    <p>Адрес: ${address}</p>
  `;

    /* ===== ИНН / ОГРН ===== */

    if (type === 'ИП') {

      html += `<p>ОГРНИП ${doc}, ИНН ${inn}</p>`;

    } else if (type === 'Самозанятый') {

      // ❗ БЕЗ ОГРНИП
      html += `<p>ИНН ${inn}</p>`;

    } else if (type === 'Юр. лицо') {

      html += `<p>ОГРН ${doc}, ИНН ${inn}</p>`;

    } else if (type === 'Физ. лицо') {

      html += `<p>Паспорт: ${doc}</p>`;

    }

    /* ===== БАНК (только если НЕ перевод) ===== */

    if (payment === 'Расчетный (банковский) счет') {

      html += `
      <p>Банк: ${bank}</p>
      <p>БИК: ${bik}</p>
      <p>Кор/счет: ${ks}</p>
      <p>Расчетный счет: ${account}</p>
    `;

    }

    $('[data-block="executor-requisites"]').html(html);
  }

  function setTodayDate() {

    let $date = $('[data-sync="contract_date"]'); // ← проверь ключ

    if (!$date.length) return;

    // если уже есть значение — не трогаем
    if ($date.val()) return;

    let now = new Date();

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');

    let formatted = `${year}-${month}-${day}`;

    $date.val(formatted).trigger('change');
  }

  /* =========================
    EVENTS
  ========================= */

  $(document).on('click', '.btn-add-step', function (e) {
    e.preventDefault();
    let $block = $(this).closest('.payment-steps-block');
    addStep($block);
    renderContract();
  });

  $(document).on('click', '.btn-remove-step', function (e) {
    e.preventDefault();
    let $block = $(this).closest('.payment-steps-block');
    let $wrapper = $block.find('.steps-wrapper');

    $(this).closest('.step-item').remove();

    if ($wrapper.find('.step-item').length === 0) {
      $block.find('[data-sync="payment_step_select"]')
        .val('Нет')
        .trigger('change');
    }

    renderContract();
  });

  $(document).on('input change', '[data-sync]', function () {
    let $block = $(this).closest('.payment-steps-block');
    if ($(this).data('field') === 'card') return;
    if ($(this).attr('name') === 'phone') return;

    toggleSteps($block);
    syncAll();
    updateNDSText();
    renderContract();
    updateProgress();
    toggleWarranty();
    toggleConfidentiality();
    togglePaymentDetails();
    updateParticipantsText();
    renderExecutorRequisites();

  });



  /* =========================
    INIT
  ========================= */

  initSliders();
  setTodayDate();
  syncAll();
  toggleSteps($('.payment-steps-block'));
  toggleWarranty();
  toggleConfidentiality();
  updateNDSText();
  renderContract();
  updateProgress();
  togglePaymentDetails();
  updateParticipantsText();
  renderExecutorRequisites();
});


$('[name="phone"]').on('input', function () {

  let v = $(this).val().replace(/\D/g, '');

  if (v.startsWith('8')) v = '7' + v.slice(1);
  if (!v.startsWith('7')) v = '7' + v;

  v = v.substring(0, 11);

  let result = '+7';

  if (v.length > 1) result += ' (' + v.substring(1, 4);
  if (v.length >= 4) result += ') ' + v.substring(4, 7);
  if (v.length >= 7) result += '-' + v.substring(7, 9);
  if (v.length >= 9) result += '-' + v.substring(9, 11);

  $(this).val(result);

});

$('[data-field="card"]').on('input', function () {

  let v = $(this).val().replace(/\D/g, '').substring(0, 16);

  let result = v.replace(/(\d{4})(?=\d)/g, '$1 ');

  $(this).val(result);

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

