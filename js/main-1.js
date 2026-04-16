"use strict";

$(function(){


    window.__docOpenedAt = Date.now();

    if(!$('#creator').length){
        var creator = false;
    }

    $(document).on('hidden.bs.modal', function () {
        if ($('.modal.show').length) {
            $('body').addClass('modal-open');
        }
    });

    /*$('.open-preloader-click').on('click', function () {
        $('.preloader-wrapper').addClass('preloader-open');
    });*/

    $(document).on('click', '.check-order-next', function (e) {
        e.preventDefault();

        const $firstModal = $('#checkModalCab');

        // закрываем первую
        $firstModal.modal('hide');

        // через паузу открываем вторую
        setTimeout(function() {
            const $modal = $('#checkDocBody');

            // 👇 ставим флаг создания нового заказа
            $modal.find('input[name="order_new"]').val('true');

            $modal.modal({backdrop: 'static', keyboard: false});
            $modal.modal('show');

            // фокус в textarea
            $modal.find('textarea[name="body"]').focus();
        }, 400);
    });

    $('#checkDoc').on('hidden.bs.modal', function (e) {
        if ($(this).data('next') === '#checkDocHow') {
            $('#checkDocHow').modal('show');
            $(this).removeData('next');
        }
    });

    $(document).on('click', '.js-download-now', function () {
        $('#checkModalCab').modal('hide');
    });

    $(document).on('click', '.check-reg-btn', function (e) {
        e.preventDefault();

        const checkId   = $('#check-time-input').val() || '';
        const body      = $('textarea[name="body"]').val() || '';
        const checkMail = $('input[name="check_email"]').val().trim();

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkMail);
        if (!emailValid) {

            $('.error-check-email').addClass('error-check-show');
            return;
        } else {

            $('.error-check-email').removeClass('error-check-show');
        }

        $('#check-id-reg').val(checkId);
        $('#body-reg').val(body);
        $('#check-email-reg').val(checkMail);
        $('#log_username').val(checkMail);

        $('#getRate').attr('action', '/orders/set-check-order');

        $('#checkDocBody')
            .one('hidden.bs.modal', function () {
                $('#myModal1').modal('show');
            })
            .modal('hide');
    });

    $(document).on('input', 'input[name="check_email"]', function () {
        $('.error-check-email').removeClass('error-check-show');
    });

    $(document).on('click', '.rate-btn', function (e) {
        e.preventDefault();
        $('#getRate').attr('action', '/rates/get-rate');
        $('#check-id-reg, #body-reg, #check-email-reg').val('');
        $('#log_username').val('');
        $('#myModal1').modal('show');
    });

    /*$(document).on('click', '.solution-btn', function (e) {
        e.preventDefault();
        $('#getRate').attr('action', '/subscription/add-subscribe');
        $('#check-id-reg, #body-reg, #check-email-reg').val('');
        $('#log_username').val('');
        $('#myModal1').modal('show');
    });*/

    $(document).on('click', '.open-preloader-click', function (event) {
        event.preventDefault(); // Останавливаем стандартное поведение

        var $link = $(this);
        var confirmMessage = $link.data('confirm'); // Берём сообщение подтверждения
        var formId = $link.data('form-id'); // Берём ID формы

        // Показываем окно подтверждения
        if (confirmMessage && confirm(confirmMessage)) {
            // Если подтверждено, запускаем прелоадер
            $('.preloader-wrapper').addClass('preloader-open');

            // Отправляем форму
            $('#' + formId).submit();
        }
    });

    var action = $('#action').val();

    if(action != 'edit') {
        setSameSelect();
    }

    setAllSelfSame();
    setOprosnik();
    reNumberAll();
    reNumberFull();
    getLongField();
    //setSearchClass();

    hoverBth();
    hoverUslovie();
    //hoverField();

    setEditedTitle();

    setEditedBtnTitle();

    if($('#editnote').length && $('#howEditWork').length){

        if($('#editnote').val()){
            $('#howEditWork').modal('show');
        }
    }

    if($('#editend').length && $('#edit-end-good').length){
        if($('#editend').val()){
            $('#edit-end-good').modal('show');
        }
    }

    if($('#no-changes').length){

        $('#no-changes').modal('show');
    }

    // Проходим через все блоки .one-wrapper
    $('.one-wrapper').each(function() {
        if(action != 'edit'){
            var wrapper = $(this);
            //console.log('action', action);
            // Находим выбранную радиокнопку внутри .one-wrapper
            var selectedRadio = wrapper.find('input[type="radio"]:checked');

            // Проверяем, есть ли атрибут data-friends у выбранной радиокнопки
            var dataFriends = selectedRadio.attr('data-friends');
            if (dataFriends && dataFriends !== "") {
                try {
                    // Попытка преобразования data-friends в объект JSON
                    var friendsObject = JSON.parse(dataFriends.replace(/&quot;/g, '"'));

                    // Проходим по ключам и значениям data-friends
                    $.each(friendsObject, function(parent, child) {
                        // Ищем .one-wrapper с data-parent равным ключу из data-friends
                        var targetWrapper = $('.one-wrapper[data-parent="' + parent + '"]');

                        // Находим выбранную радиокнопку внутри targetWrapper
                        var targetSelectedRadio = targetWrapper.find('input[type="radio"]:checked');
                        var targetSelectedPart = targetSelectedRadio.data('part'); // Получаем data-part выбранной кнопки

                        // Внутри этого блока находим блоки .step-new-block и .single-part
                        targetWrapper.find('.single-part').each(function() {
                            var block = $(this);

                            // Проверяем, если data-child блока не совпадает с значением из data-friends
                            if (block.data('child') != child && block.data('child') != targetSelectedPart) {
                                // Заменяем содержимое из скрытых блоков
                                var hiddenBlock = $('.all-blocks-wrapper .single-part[data-parent="' + parent + '"][data-child="' + child + '"]');
                                if (hiddenBlock.length) {
                                    block.html(hiddenBlock.html()); // Заменяем HTML содержимое

                                }
                            }
                        });
                    });
                } catch (e) {
                    console.error("Ошибка при парсинге data-friends:", e);
                }
            }
        }

    });

    // При клике на кнопку "Содержание"
    $('.btn-article-content').click(function() {
        // Получаем родительский блок .content-article-block
        var parentBlock = $(this).closest('.content-article-block');

        // Добавляем класс активности для текущей кнопки и убираем у другой в этом блоке
        parentBlock.find('.btn-article-content').addClass('btn-article-active');
        parentBlock.find('.btn-article-source').removeClass('btn-article-active');

        // Показываем блок с содержанием и скрываем блок с источниками внутри этого блока
        parentBlock.find('.article-part').show();
        parentBlock.find('.sources-part').hide();
    });

    // При клике на кнопку "Источники"
    $('.btn-article-source').click(function() {
        // Найдем блок родителя .content-article-block
        var parentBlock = $(this).closest('.content-article-block');

        // Ищем выбранную радио-кнопку по всей странице или в нужном контейнере .new-one-block-article
        var selectedRadio = parentBlock.parents('.new-one-block-article').find('.check-part:checked');

        if (selectedRadio.length > 0) {
            // Получаем значение data-part выбранной радио-кнопки
            var selectedPart = selectedRadio.data('part');

            // Скрываем все блоки .source-part-one внутри родительского блока
            parentBlock.find('.sources-part .source-part-one').hide();

            // Показываем блок с соответствующим data-id
            parentBlock.find('.sources-part .source-part-one[data-id="' + selectedPart + '"]').show();

            // Добавляем класс активности для текущей кнопки и убираем у другой в этом блоке
            parentBlock.find('.btn-article-source').addClass('btn-article-active');
            parentBlock.find('.btn-article-content').removeClass('btn-article-active');

            // Показываем блок с источниками и скрываем блок с содержанием внутри этого блока
            parentBlock.find('.sources-part').show();
            parentBlock.find('.article-part').hide();

        }
    });

    // При клике на блок .check-part (это и есть ваши радио-кнопки)
    $('.new-one-block-article').on('click', '.check-part', function() {
        // Находим родительский блок .new-one-block-article
        var parentBlock = $(this).closest('.new-one-block-article');

        // Находим соответствующий .content-article-block (можно через ближайший родительский блок или в соответствии с вашей структурой)
        var contentBlock = parentBlock.find('.content-article-block');

        // В блоке .content-article-block скрываем блок с источниками
        contentBlock.find('.sources-part').hide();

        // Показываем блок с содержанием
        contentBlock.find('.article-part').show();

        // Добавляем класс активности для кнопки "Содержание"
        contentBlock.find('.btn-article-content').addClass('btn-article-active');

        // Убираем класс активности у кнопки "Источники"
        contentBlock.find('.btn-article-source').removeClass('btn-article-active');
    });

    // Функция для проверки источников по выбранной кнопке
    function updateSourceTab(checkedPart, parentBlock) {
        var hasSources = parentBlock.find('.sources-part .source-part-one[data-id="' + checkedPart + '"]').length > 0;
        console.log('checkedPart', checkedPart);
        console.log('parentBlock', parentBlock);
        console.log('hasSources', hasSources);
        if (hasSources) {
            parentBlock.find('.btn-article-source').show();
        } else {
            parentBlock.find('.btn-article-source').hide();
        }
    }

    // При клике на радиокнопку
    $('.source-part').click(function() {

        var parentBlock = $(this).closest('.new-one-block-article');
        var contentBlock = parentBlock.find('.content-article-block');

        var selectedPart = $(this).data('part');
        updateSourceTab(selectedPart, contentBlock);
    });

    // Инициализируем каждый блок при загрузке страницы
    $('.content-article-block').each(function() {
        $(this).find('.article-part').show();
        $(this).find('.sources-part').hide();
    });

    //getSame();

    $('.mail-ico').on('click', function () {
        $(this).removeClass('error-field');
        $(this).parents('.form-group1').find('.error-email').slideUp(300);
    });

    $('.burger-nav').click(function () {
        if($('.burger-lines').hasClass('burger-show')){
            $('.mobile-nav').addClass('mobile-nav-open');
            $('.burger-lines').removeClass('burger-show');
            $('.burger-cross').addClass('burger-show');
            $('.back-fon-nav').addClass('back-fon-nav-open');

            const mainBody = document.querySelector('.content');
            mainBody.style.overflow = "hidden";
            mainBody.style.height = "100vh";
            document.body.style.overflow = "hidden";


        }else{
            $('.back-fon-nav').removeClass('back-fon-nav-open');
            $('.mobile-nav').removeClass('mobile-nav-open');
            $('.burger-lines').addClass('burger-show');
            $('.burger-cross').removeClass('burger-show');

            const mainBody = document.querySelector('.content');
            mainBody.style.overflow = "";
            mainBody.style.height = "auto";
            document.body.style.overflow = "";
        }

    });

    $('.json-search-block').each(function () {
        const self = $(this);
        self.find('.search-doc').on('input', function () {
            const str = $(this).val();

            if(str.length > 4){
                $.ajax({
                    url: '/search/term',
                    type: "POST",
                    data: { 'str': str },
                    dataType: 'json',
                    cache: false,
                    success: function(res) {
                        console.log(res.contracts);
                        if(res.contracts !== '<div><div class="search-error-line">По запросу нет совпадений</div></div>'){
                            self.find('.search-data-result').html(res.contracts).slideDown(200);
                        }else{
                            self.find('.search-data-result').html('').slideUp(200);
                        }


                    }, error: function(res) {
                        self.find('.search-data-result').html('').slideUp(200);
                        return false;
                    }
                });
            }
        });

        self.find('.default-search-button').on('click', function () {
            const searchStr = self.find('.search-doc').val();
            if(searchStr.length < 3){
                return false;
            }
        });

    });

    $(document).mouseup(function (e) {
        var container = $('.json-search-block');
        if (container.has(e.target).length === 0){
            //container.find('.search-doc').val('');
            container.find('.search-data-result').html('').slideUp(200);
        }
    });

    $('.switch-wrapper').click(function () {
        var switcher = 'on';
        if($(this).hasClass('switcher-on')){
            switcher = 'off';
        }
        $.ajax({
            url: '/users/switcher',
            type: "POST",
            data: { 'switch': switcher },
            dataType: 'json',
            cache: false,
            success: function(res) {
                if(res.result.status === 'ok'){
                    if(res.result.switch === 'on'){
                        $('.switch-wrapper').addClass('switcher-on');
                    }else{
                        $('.switch-wrapper').removeClass('switcher-on');
                    }
                    setToast('ok', res.result.text);
                }else{
                    setToast('error', res.result.text);
                }

            }, error: function() {
                return false;
            }
        });


    });

    $('.password1').on('input', function () {
        validatePasswordFirst();
    });

    $('.password2').on('input', function () {
        validatePassword();
    });

    $('.password3').on('input', function () {
        validatePasswordFirst('edit');
    });

    $('.password4').on('input', function () {
        validatePassword('edit');
    });

    $('.valid-pas').click(function () {
        if(validatePasswordFirst() && validatePassword()){
            return true;
        }else{
            return false;
        }
    });

    $('.show-doc').click(function () {
        if(!$(this).hasClass('show-doc-open')) {
            $(this).addClass('show-doc-open');
            $('body').find('.hide-doc-block').slideDown(200);
            showTimeLine();
        }
    });

    $('.doc-pay-block').each(function() {
        const self = $(this);
        self.find('.promo-btn').click(function(){
            const orderId = $(this).data('order');
            const promo = self.find('.promo-field').val();
            const priceField = self.find('.new-reit-sum');
            if(promo != ''){
                $.ajax({
                    url: '/Orders/checkPromo',
                    type: "POST",
                    data: { 'order_id': orderId, 'promo' : promo, 'sum': priceField.text() },
                    dataType: 'json',
                    cache: false,
                    success: function(res) {

                        if(res.result.status === 'ok'){
                            priceField.text(res.result.price);
                            if($('#outsum').length) {
                                $('#outsum').val(res.result.price);
                                $('#signaturevalue').val(res.result.signature);
                                $('#receipt').val(res.result.receipt);
                            }
                            self.find('.result-promo').text(res.result.text).removeClass('result-promo-error').addClass('result-promo-success');
                            self.find('.promo-field').removeClass('error-field');
                        }else{
                            if($('#promo').length) {
                                $('#promo').val('');

                            }
                            self.find('.result-promo').text(res.result.text).addClass('result-promo-error');
                            self.find('.promo-field').addClass('error-field');
                        }

                    }, error: function(res) {
                        return false;
                    }
                });
            }
        });
    });

    $('.open-search-line').click(function(){

        if($('#spage').val() != '' || $('#spage1').val() != ''){
            return true;
        }else{
            if($(this).hasClass('nav-opened')){
                $('.top-search-form').css({'width':'40px'});
                $(this).removeClass('nav-opened');
                $('#empty-message').text('');
                $('#spage').val('');
            }else{
                $('.top-search-form').css({'width':'1000px'});
                $(this).addClass('nav-opened');

            }
            return false;
        }


    });

    $('.inst-go').click(function(){
        var instnext = $(this).data('next');

        if(instnext <= 3){
            var insback = $('#instimg-'+instnext).val();
            $('.inst-note').hide();
            $('#instnote-'+instnext).show();
            $('.insimg').css({'opacity':0});
            $('#insimg-'+instnext).css({'opacity':1});
            $('.inst-num').text(instnext);
            $('.istlli').removeClass('isactive');
            $('#istlli-'+instnext).addClass('isactive');

            var nextset = instnext+1;
            $('.inst-next').data({'next': nextset}).attr({'data-next':nextset});

        }else{
            var accept = 'yes';
            $.ajax({
                type: "POST",
                url: "/index/setInstCookie",
                dataType: "json",
                data: ({'accept': accept}),

                success: function( data ) {
                    $('.insruction-block').addClass('instuctstop');
                }
            });
        }


    });

    $('.inst-close').click(function(){
        var accept = 'yes';
        $.ajax({
            type: "POST",
            url: "/index/setInstCookie",
            dataType: "json",
            data: ({'accept': accept}),

            success: function( data ) {
                $('.insruction-block').addClass('instuctstop');
            }
        });


    });

    $('.open-instr').click(function(){
        $('.inst-next').data({'next': 2}).attr({'data-next':2});
        $('.insruction-block').css({'background':'url(../img/step-4.jpg) center top no-repeat', 'background-size':'cover'});
        $('.inst-note').hide();
        $('#instnote-1').show();
        $('.insimg').css({'opacity':0});
        $('#insimg-1').css({'opacity':1});
        $('.inst-num').text('1');
        $('.istlli').removeClass('isactive');
        $('#istlli-1').addClass('isactive');

        $('.insruction-block').removeClass('instuctstop');
    });

    $('.already-go').click(function(){

        var chw = $(this).data('change');

        //alert(chw);
        if(chw === 'Войти и скачать' || chw === 'Войти'){
            $('.yes-reg').slideUp(200);
            $('.no-reg').slideDown(200);
            $('.politics-reg').slideUp(200);
            $('.politics-login').slideDown(200);
            $('.modal-alr').text('Вход на сайт');
            $('.password2').addClass('password2-not').removeClass('password2').removeClass('error-field');
            $('.password4').addClass('password4-not').removeClass('password4').removeClass('error-field');
            $('.p-two-block').slideUp(200);
            $('.change-alr').text(chw);
        }else if(chw === 'Войти и оплатить'){
            $('.reit-title').text('ВХОД');
            $('.yes-reg').slideUp(200);
            $('.no-reg').slideDown(200);
            $('.politics-reg').slideUp(200);
            $('.politics-login').slideDown(200);
            $('.password2').addClass('password2-not').removeClass('password2').removeClass('error-field');
            $('.password4').addClass('password4-not').removeClass('password4').removeClass('error-field');
            $('.p-two-block').slideUp(200);
            $('.change-alr').text('Войти');
        }else if(chw === 'Зарегистрироваться и оплатить'){
            $('.reit-title').text('РЕГИСТРАЦИЯ');
            $('.no-reg').slideUp(200);
            $('.yes-reg').slideDown(200);
            $('.politics-reg').slideDown(200);
            $('.politics-login').slideUp(200);
            $('.modal-alr').text('Регистрация');
            $('.password2-not').addClass('password2').removeClass('password2-not');
            $('.password4-not').addClass('password4').removeClass('password4-not');
            $('.p-two-block').slideDown(200);
            $('.change-alr').text('Зарегистрироваться');
        }else{
            $('.no-reg').slideUp(200);
            $('.yes-reg').slideDown(200);
            $('.politics-reg').slideDown(200);
            $('.politics-login').slideUp(200);
            $('.modal-alr').text('Регистрация');
            $('.password2-not').addClass('password2').removeClass('password2-not');
            $('.password4-not').addClass('password4').removeClass('password4-not');
            $('.p-two-block').slideDown(200);
            $('.change-alr').text(chw);
        }
        $('.form-group1').each(function () {
           $(this).find('.error-email').slideUp(200);
           $(this).find('.no-valid-pass-con').slideUp(200);
           $(this).find('.default-field').removeClass('error-field').val('');
        });


    });

    $('.slide-doc').click(function(){

        if(!$(this).hasClass('notall')){
            var mymodal = $(this).data('target');
            slideDown(mymodal);
        }

        return false;
    });

    function slideDown(modal){
        var destPath = $('.destiny').offset().top;

        if(modal != ''){
            $('body, html').animate({ scrollTop: destPath-winHeight }, 2000, function(){ $(modal).delay(500).modal('toggle'); });
        }else{
            $('body, html').animate({ scrollTop: destPath-winHeight }, 2000);
        }
    }

    var int;
    $('.pop-timer').click(function(){

        $('.timer-hide').hide();
        $('.timer-weight').show();
        $('.end-timer-wrapper').show();
        $('.seconds').text(10);
        clearInterval(int);
        var _Seconds = $('.seconds').text();
        int = setInterval(function() {
            if (_Seconds > 0) {
                _Seconds--;
                $('.seconds').text(_Seconds);
            } else {
                clearInterval(int);
                $('.end-timer-wrapper').slideUp(200);

                $('.timer-weight').slideUp(200);
                $('.timer-hide').slideDown(200);
            }
        }, 1000);


    });

    $('.contract-accordione .card').each(function(){
        var self = $(this);
        self.on('click', '.acc-btn', function(){
            //alert('tut');
            $('.arTop').hide();
            $('.arBot').show();
            if(self.find('.collapse').hasClass('show')){
                //alert('tut');
                self.find('.arTop').hide();
                self.find('.arBot').show();
            }else{
                self.find('.arBot').hide();
                self.find('.arTop').show();
            }
        });
    });

    var clearDate = localStorage['lastDate'];
    if(clearDate !== undefined){
        if(new Date(GetTodayDate()) > new Date(clearDate)){
            clearStorage(true);
        }
    }else{

        localStorage['lastDate'] = GetTodayDate();
    }

    $('.clear-box1').click(function(){
        clearStorage(false);
        location.reload();
    });

    if($("div").is(".progress-wrapper")){
        showTimeLine();
    }

    function showTimeLine() {
        let canShoeLine = true;
        let hasHideParts = $('#hidepart').val();
        if(hasHideParts === '1' && !$('.show-doc').hasClass('show-doc-open')){
            canShoeLine = false;
        }
        if($("div").is(".progress-wrapper")){
            $(window).on("scroll resize", function() {

                if($(window).scrollTop() >= $('#doc-body').offset().top){
                    $('.progress-wrapper').show();
                }else{
                    $('.progress-wrapper').hide();
                }
                var startpos = $(window).scrollTop() - $('#doc-body').offset().top;
                var o = startpos / ($('#doc-body').height() - $(window).height());

                //$(".progress-bar").css({"width": (100 * o | 0) + "%"});
                //$('progress')[0].value = o;
                var prozent = (100 * o | 0);
                if(prozent > 100){
                    prozent = 100;
                }
                $('.progress-proz').text(prozent);

                $('.hint-line').each(function(){
                    var self = $(this);
                    var hintProzent = self.data('proz');

                    if(prozent >= hintProzent && !self.hasClass('hint-show')) {
                        // Удалить предыдущие активные hint'ы
                        $('.hint-line.hint-show').each(function(){
                            const prevHint = $(this);
                            if (prevHint[0] !== self[0]) {
                                prevHint.stop(true).css('opacity', 0).remove();
                            }
                        });

                        // Показать текущий
                        self.addClass('hint-show');
                        setTimeout(function(){
                            self.animate({'opacity': 0}, 200, function(){self.remove()});
                        }, 6000);
                    }
                    //console.log('hint', hintProzent+' - '+prozent);
                });
            });
        }
    }

    $('.sh-text').each(function(){
        $(this).hover(function(){
                var shTop = $(this).offset().top;
                $('.sh-text-info').css({'top':shTop-50, width:$('.container').width()-30, 'left':$('.podscazca-doc').offset().left+45}).show();
            },
            function(){
                $('.sh-text-info').hide().css({'top':0});
            });
    });

    $('.isp-block').each(function(){
        var self = $(this);
        self.on('click', '.isp-res', function(){
            $('.isp-hidden').hide(200);

            if($(this).hasClass('hiyes')){
                self.find('.isp-hidden').hide(200);
                $(this).removeClass('hiyes');
            }else{
                self.find('.isp-hidden').show(200);
                $('.isp-res').removeClass('hiyes');
                $(this).addClass('hiyes');
            }

        });

        self.on('click', '.close-isp', function(){
            self.find('.isp-hidden').hide(200);
            self.find('.isp-res').removeClass('hiyes');
        });
    });

    /*$('.same-field').each(function(){
        var same = $(this).text();
        $(this).parent().attr({'data-same':same}).data({'same':same});
        $(this).remove();
    });*/

    normalizeFieldMeta($('#doc-body'));
    normalizeFieldMeta($('.all-blocks-wrapper'));

    if(action != 'edit') {
        setDadtapicker();
    }

    $(".move-down").click(function () {

        var elementClick = $(this).attr("href");
        var destination = $(elementClick).offset().top;
        //alert(destination);
        $('body, html').animate({ scrollTop: destination }, 400);
        return false;
    });

    $('.step-block').each(function(){
        var self = $(this);
        var countSteps = $('#countstep').val();
        self.on('click', '.next-but', function(){

            var nStep = $(this).data('id');
            var nextStep = $(this).data('step');
            var hotStep = nextStep+1;

            //alert(hotStep);
            var prozStep = parseInt(nextStep*100/countSteps);
            $('.finish-rost').animate({width:prozStep+'%'}, 300);

            $('.finish-num').html(prozStep);

            $('.hot-block').slideUp(200);
            $('#hot_'+hotStep).slideDown(200);
            //alert(prozStep);
            self.slideUp(300);
            $(nStep).slideDown(300, function(){
                countBackHeight();
            });



        });
    });

    $('.open-eye').on('click', function(){
        if($(this).hasClass('eye-opened')){
            $(this).removeClass('eye-opened');
            $(this).html('<i class="fa fa-eye"></i>');
            $(this).parent().find('input').attr('type','password');
        }else{
            $(this).addClass('eye-opened');
            $(this).html('<i class="fa fa-eye-slash"></i>');
            $(this).parent().find('input').attr('type','text');
        }
    });

    $('.title-open').each(function(){
        var start_time = $(this).data('start');
        var delay_time = $(this).data('time');
        $(this).delay(start_time).fadeIn(800);
        $(this).delay(delay_time).fadeOut(800);
    });

    $('.close-title').click(function(){
        $(this).parent().css('display', 'none');
    });
    var docBlock;
    if($('#doc-body').length){
        docBlock = $('#doc-body');
    }else if($('#doc-body-end').length){
        docBlock = $('#doc-body-end');
    }else{
        docBlock = $('.header');
    }

    //console.log('docBlock', docBlock);

    var start_pos = $(window).height() - 40;
    var leftPos = docBlock.offset().left;
    var topPos = docBlock.offset().top;
    var docWidth = docBlock.width();
    var docHeight = docBlock.height();
    var docBottom = topPos + docHeight;
    var minusW = $('.plavaem').width()/2;
    var butPos = leftPos + (docWidth/2-minusW);

    var oprCont = 0;
    var totalReady = 0;
    if($('.alt-opros-block').length){
        var liteOpros = $('.alt-opros-block').offset().top;
        oprCont = $('.opt-container').offset().top;
        totalReady = $('.total-ready').offset().top;
    }

    var windowTop = $(window).scrollTop();

    countBackHeight();


    if(windowTop+$(window).height()-155 >= docBottom){
        $('.plavaem').css({'bottom':'auto', 'top':docHeight+95, 'position':'absolute'});
    }else{
        $('.plavaem').css({'bottom':'20px', 'top':'auto', 'position':'fixed'});
    }

    if($('.alt-opros-block').length){
        if(oprCont < windowTop-260){
            if(!$('.alt-opros-block').hasClass('fixedOpr')){
                $('.alt-opros-block').addClass('fixedOpr');
                $('.zaglushka').addClass('zaglushka-fix');
            }
        }else{
            if($('.alt-opros-block').hasClass('fixedOpr')){
                $('.alt-opros-block').removeClass('fixedOpr');
                $('.zaglushka').removeClass('zaglushka-fix');
            }

        }

        if(totalReady < windowTop+160){
            $('.alt-opros-block').addClass('fixedBottom').css({'top':docBottom-333});
        }else{
            $('.alt-opros-block').removeClass('fixedBottom').css({'top':-20});
        }
    }

    $(window).resize(function() {

        var leftPos = docBlock.offset().left;
        var docWidth = docBlock.width();
        var butPos = leftPos + (docWidth/2-120);
        //$('.plavaem').css({'left':butPos});


        countBackHeight();

    });

    $(window).scroll(function(){

        var docBlock;
        if($('#doc-body').length){
            docBlock = $('#doc-body');
        }else if($('#doc-body-end').length){
            docBlock = $('#doc-body-end');
        }else{
            docBlock = $('.header');
        }

        windowTop = $(window).scrollTop();
        topPos = docBlock.offset().top;
        docHeight = docBlock.height();
        docBottom = topPos + docHeight;
        //butTopPos = $('.plavaem').offset().top;
        leftPos = docBlock.offset().left;
        docWidth = docBlock.width();
        butPos = leftPos + (docWidth/2-120);


        if($('.alt-opros-block').length){
            liteOpros = $('.alt-opros-block').offset().top;
            oprCont = $('.opt-container').offset().top;
            totalReady = $('.total-ready').offset().top;

            if(oprCont < windowTop-260){
                if(!$('.alt-opros-block').hasClass('fixedOpr')){
                    $('.alt-opros-block').addClass('fixedOpr');
                    $('.zaglushka').addClass('zaglushka-fix');
                }
            }else{
                if($('.alt-opros-block').hasClass('fixedOpr')){
                    $('.alt-opros-block').removeClass('fixedOpr');
                    $('.zaglushka').removeClass('zaglushka-fix');
                }

            }

            if(totalReady < windowTop+160){
                $('.alt-opros-block').addClass('fixedBottom').css({'top':docBottom-333});
            }else{
                $('.alt-opros-block').removeClass('fixedBottom').css({'top':-20});
            }
        }


        if(windowTop+$(window).height()-155 >= docBottom){
            $('.plavaem').css({'bottom':'auto', 'top':docHeight+95, 'position':'absolute'});
        }else{
            $('.plavaem').css({'bottom':'20px', 'top':'auto', 'position':'fixed'});

        }
    });

    $('.single-part').each(function(){
        var self = $(this);

        self.on('click', '.znak', function(){
            $('.note-text').css({'display': 'none'});
            self.find($(this)).parent().find('.note-text').css({'display': 'block'});

        });

        self.on('click', '.note-close', function(){
            self.find('.note-text').css({'display': 'none'});

        });

    });

    var winWidth = $(window).width();
    //var winHeight = $(window).height();
    var winHeight = window.innerHeight;


    if(winWidth > 992){

        if($(".sidebar").length && !$(".sidebar").hasClass('noMove')) {
            var sidebar = new StickySidebar('.sidebar', {
                topSpacing: 0,
                bottomSpacing: 0,
                containerSelector: '.main-content',
                innerWrapperSelector: '.sidebar__inner'
            });
        }


    }


    $('.b-ts3-large-block').on("click", function() {

        var modal = $('.b_video');
        var data = $(this).find('a').attr("href");

        modal.find('.b_video__iframe').html("<iframe width='100%' height='100%' src='" + data + "?rel=0&amp;showinfo=0;autoplay=1' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");

        $('.b-ts3-fon').show(200);
        modal.fadeIn();
        return false;
    });


    $('.b_video__close').click(function(){

        var myModal = $('.b_video__iframe');

        $('.b_video').fadeOut(600);
        $('.b-ts3-fon').hide(200);
        myModal.html('');
    });


    var video_height = $(window).height()*0.5;
    var video_top = video_height/2;
    $('.b_video').css('height', video_height).css('margin-top', '-'+video_top+'px');

    $(window).resize(function() {
        winWidth = $(window).width();
        //winHeight = $(window).height();
        var winHeight = window.innerHeight;

        video_height = $(window).height()*0.5;
        video_top = video_height/2;

        $('.b_video').css('height', video_height).css('margin-top', '-'+video_top+'px');



    });


    var minLen = 6;
    $('#password').focusout( function(){
        var $this = $(this);
        if($this.val().length < minLen && $this.val().length != 0){
            $('.small-pass').slideDown(200);
        }else{
            $('.small-pass').slideUp(200);
        }
    });

    $('#password').focus(function(){
        $('.small-pass').slideUp(200);
    });

    $('#reg_pas').focusout( function(){
        var $this = $(this);
        if($this.val().length < minLen && $this.val().length != 0){
            $('.small-pass').slideDown(200);
        }else{
            $('.small-pass').slideUp(200);
        }
    });

    $('#reg_pas').focus(function(){
        $('.small-pass').slideUp(200);
    });

    $('.check-fields').click(function(){
        if(!$(this).hasClass('notall')){
            return true;

        }else {
            $('.ch-field').each(function(){
                if(!$(this).hasClass('yes-field')){
                    $(this).addClass('no-info');
                }
            });
            $('.date-f').each(function(){
                if(!$(this).hasClass('ch-color')){
                    $(this).addClass('no-info');
                }
            });

            if($("span").is(".no-info")){
                $('.error-fields').css({'display':'inline-block'});
                setTimeout(function(){$('.error-fields').animate({opacity:0}, 1000, function(){ $('.error-fields').css({'display':'none'}); })}, 6000);
                $('.check-fields').removeClass('notall');
                //$('.check-fields').addClass('fields-checked').html('<i class="fa fa-print" aria-hidden="true"></i> Все равно скачать');
            }

            return false;
        }
        return false;
    });

    $('.answer-comment').each(function(){
        var self = $(this);

        self.on('click', '.open-answer', function(){
            if(self.hasClass('com-open')){
                self.find('.show-answer-block').slideUp(200);
                self.find('.open-answer').html('Ответить');
                self.removeClass('com-open');
            }else{
                $('.show-answer-block').slideUp(200);
                $('.open-answer').html('Ответить');
                $('.answer-comment').removeClass('com-open');
                self.find('.show-answer-block').slideDown(200);
                self.find('.open-answer').html('Ответ');
                self.addClass('com-open');
            }
        });
    });

    $('.sumnds').each(function(){
        var self = $(this);

        if(self.hasClass('have_nds')){
            return false;
        }else{
            //self.append(' <span>(Сумма НДС прописью)</span>').addClass('have_nds');
            self.addClass('have_nds');
        }

    });

    var isCtrl = false;
    $(document).keyup(function (e) {
        if(e.which == 17) isCtrl=false;
    }).keydown(function (e) {
        if(e.which == 17) isCtrl=true;
        if(e.which == 80 && isCtrl == true) {

            return false;
        }
    });

    $('.next-but').click(function(){
        var destPath = $('.finish-block').offset().top;
        var totSteps = $('#countstep').val();
        var selfStep = $(this).data('step');

        if(totSteps == selfStep){
            $('body, html').animate({ scrollTop: $('.podscazca-doc').offset().top}, 600);
        }else{
            $('body, html').animate({ scrollTop: destPath }, 600);
        }


    });
    //$('input, select').styler();

    $('.b-video-block-link1').on("click", function(e) { // Пока отключим видео
        e.preventDefault();
        var modal = $('.b_video_index');
        var data = $(this).attr("href");

        if($(window).width() > 1200){
            modal.find('.b_video__iframe_index').html("<iframe width='534' height='296' src='" + data + "' frameborder='0' allowfullscreen></iframe>");

        }
        if($(window).width() <= 1200 && $(window).width() > 992){
            modal.find('.b_video__iframe_index').html("<iframe width='436' height='242' src='" + data + "' frameborder='0' allowfullscreen></iframe>");
        }
        if($(window).width() <= 992 && $(window).width() > 768){
            modal.find('.b_video__iframe_index').html("<iframe width='323' height='180' src='" + data + "' frameborder='0' allowfullscreen></iframe>");
        }

        modal.fadeIn();
        return false;
    });

    $('.b_video__close_index').click(function(){

        var myModal = $('.b_video__ifram_indexe');

        $('.b_video_index').fadeOut(600);
        myModal.html('');
    });

    $('.b-video-block-link').hover(function(){
            $(this).find('.b-video-img-hover').animate({opacity: "1"}, 300);
        },
        function(){
            $(this).find('.b-video-img-hover').animate({opacity: "0"}, 300);
        });


    $('.ch-field:contains("ИНН")').parent().parent().addClass('hasInn');
    $('.ch-field:contains("Наименование Стороны")').addClass('companyName');
    $('.ch-field:contains("Юридический адрес")').addClass('yurAddress');
    $('.ch-field:contains("ОГРН")').addClass('ogrn');
    $('.ch-field:contains("ИНН")').addClass('inn');
    $('.ch-field:contains("КПП")').addClass('kpp');
    $('.ch-field:contains("Фамилия и инициалы")').addClass('basicName');

    $('#doc-body').each(function(){


        var self1 = $(this);
        var action = $('#action').val();
        getClearBtn(self1);

        self1.on('change', '.co-select', function(){

            var $select = $(this);

            var selectedValue = $select.val(); // Получаем выбранное значение

            //console.log('selectedValue', selectedValue);
            //console.log('action', action);

            /*if(action != 'edit') {
                // Убираем атрибут `selected` у всех <option>
                $select.find('option').attr('selected', false).removeAttr('selected');

                // Устанавливаем атрибут `selected` только для варианта, соответствующего выбранному значению
                $select.find('option').filter(function () {
                    //console.log('$(this).text()', $(this).text());
                    //console.log('selectedValue 1', selectedValue);
                    return $(this).text() === selectedValue;
                }).attr('selected', 'selected').prop('selected', true);
            }*/


            //getLong($(this), 12.5);
            adjustSelectWidth($select);

            if(action != 'edit') {
                var nAttr = $select.data('same');
                if (nAttr !== undefined && window.SameStorage) {
                    SameStorage.patchDebounced(String(nAttr), selectedValue);
                }
                //console.log('nAttr', nAttr);
                if(nAttr !== undefined){
                    //var selectedText = $select.find("option:selected").text();
                    //localStorage[nAttr] = selectedValue;

                    //setSameSelect();
                }
            }




        });

        self1.on('change', '.date-f', function(){
            //console.log('action', action);
            if(action == 'edit'){
                var originalValue = $(this).data('original') || '';
                //console.log('originalValue data', originalValue);
            }
            getLong($(this), 11);
        });

        if(self1.hasClass('hasInn')){

            var inn_block = $('.block-inn-default').html();

            self1.prepend(inn_block);
        }

        self1.on('click', '.close-inn', function(){
            $(this).parent().parent().animate({height: '35', width: '35', 'left': '-60px'}, 400);
            $(this).parent().parent().find('.open-inn').animate({opacity: 1, height: '35', width: '35'}, 400);
        });

        self1.on('click', '.open-inn', function(){
            $(this).parent().animate({height: '140', width: '330', 'left': '20px'}, 400);
            $(this).animate({opacity: 0, height: '0', width: '0'}, 400);
        });

        if(action != 'edit') {
            //getSame(self1);

            if (!window.__SAME_SYNC_PENDING__) {
                getSame(self1);
            } else {
                // дождемся события
                $(document).one('same:sync', function () {
                    getSame(self1);
                    setSameSelect();
                });
            }


            self1.find('.my-dates').each(function () {
                var wrap = $(this);
                var nAttr = wrap.data('same');
                if (nAttr === undefined) return;

                var v = window.getSameValue(String(nAttr));
                if (v !== undefined && v !== null && String(v).trim() !== '') {
                    var sameLen = String(v).length * 10 + 7;
                    wrap.find('.date-f')
                        .val(v)
                        .attr('value', v)
                        .addClass('ch-color')
                        .css({'width': sameLen});

                    if ($("button").is(".clear-box") && $('.clear-box').hasClass('hideClear')) {
                        $('.clear-box').removeClass('hideClear');
                    }
                }
            });
        }


    });

    // Функция запуска процесса getApi
    function startApiProcess($parent, $same, $self) {
        console.log('startApiProcess called with:', $same);

        var orgType = "LEGAL";
        var searchType = "PARTY";
        var orgParam = {};

        if ($same === 'name2' || $same === 'name5') {
            orgType = "LEGAL";
            searchType = "PARTY";
            orgParam = { "type": "LEGAL" };
        } else if ($same === 'name3' || $same === 'name6') {
            orgType = "INDIVIDUAL";
            searchType = "PARTY";
            orgParam = { "type": "INDIVIDUAL" };
        } else if ($same === 'bik1' || $same === 'bik2' || $same === 'bank1' || $same === 'bank2') {
            orgType = '';
            searchType = "BANK";
            orgParam = {};
        }
        console.log('orgType:', orgType, 'searchType:', searchType, 'orgParam:', orgParam);

        $self.suggestions({
            token: "13b345a43a3d4448c8815d3ac09067f57def01fa",
            type: searchType,
            params: {
                type: orgType
            },
            noSuggestionsHint: false,
            hint: 'Выберите для автоматического заполнения реквизитов',
            minChars: 4,
            triggerSelectOnSpace: false,
            triggerSelectOnBlur: false,
            onSearchStart: function (query) {
                console.log('Search started:', query);
            },
            onSelect: function (suggestion) {
                console.log('Suggestion selected:', suggestion);
                // Обработка выбора пользователя
                handleSuggestionSelection($parent, $same, suggestion, $self);
            },
            onSearchComplete: function (query, suggestions) {
                console.log("Поиск завершён. Результаты:", suggestions);
            }
        });

    }

    function loadParties($parent, $same, $str) {
        // Находим (или создаем) контейнер для контрагентов
        var $partyBlock = $parent.find('.party-search-block');

        // Если строка пустая или короче 3 символов, удаляем блок и прекращаем выполнение
        if (!$str || $str.length < 3) {
            $partyBlock.remove();
            return;
        }

        $.ajax({
            url: '/parties/get-parties',
            type: "POST",
            data: {
                'str': $str,
                'same': $same
            },
            dataType: 'json',
            cache: false,
            success: function (res) {
                // Если контейнера нет, создаем
                if ($partyBlock.length === 0) {
                    $partyBlock = $('<div class="party-search-block"></div>');
                    $parent.append($partyBlock);
                } else {
                    $partyBlock.empty(); // Очищаем перед добавлением новых данных
                }

                // Определяем заголовок в зависимости от источника
                var titleText = res.result.source === 'self' ? 'Ваши контрагенты' : 'Поиск по открытым источникам';

                // Проверяем, есть ли данные
                if (res.result.status === 'ok' && res.result.parties.length > 0) {
                    var partiesHtml = `
                    <div class="party-search-data">
                        <div class="party-search-title">
                            <img src="/img/ico-22.svg" alt="" width="20"> ${titleText}
                        </div>
                        <div class="party-data-wrapper">
                `;

                    res.result.parties.forEach(function(party) {
                        let dataAttributes = '';

                        // Формируем data-атрибуты, исключая show_* поля
                        for (var key in party) {
                            let value = party[key] ? party[key] : ''; // Если значение пустое, добавляем пустую строку
                            if (!['show_title', 'show_inn', 'show_address'].includes(key)) {
                                dataAttributes += ` data-${key}="${value}"`;
                            }
                        }

                        // Генерируем HTML-код контрагента
                        let partyHtml = `
                            <div class="party-search-line" data-id="${party.inn || ''}" ${dataAttributes}>
                                <div class="party-search-name">${party.show_title}</div>
                        `;

                        // Добавляем ИНН, если он не пустой
                        if (party.show_inn && party.show_inn.trim() !== '') {
                            partyHtml += `<div class="party-search-inn">${party.show_inn}</div>`;
                        }

                        // Добавляем адрес, если он не пустой
                        if (party.show_address && party.show_address.trim() !== '') {
                            partyHtml += `<div class="party-search-address">${party.show_address}</div>`;
                        }

                        partyHtml += `</div>`; // Закрываем .party-search-line

                        // Добавляем в общий HTML
                        partiesHtml += partyHtml;
                    });

                    partiesHtml += `</div></div>`;

                    // Вставляем сгенерированный HTML
                    $partyBlock.html(partiesHtml);
                } else {
                    $partyBlock.remove();
                }
            },
            error: function () {
                console.warn("Ошибка при получении данных");
                $partyBlock.remove();
            }
        });
    }

    var lastClickedParty = null;

    $(document).on("mousedown", ".party-search-line", function () {
        lastClickedParty = $(this);
    });

    $(document).on("click", ".party-search-line", function (event) {
        setPartyData($(this));
    });

    function setPartyData($element) {
        if (!$element || !$element.length) return;

        var action = $('#action').val();

        $.each($element[0].dataset, function(key, value) {
            var $field = $('.ch-field[data-same="' + key + '"]');

            if ($field.length > 0) {
                var displayValue = (value && value.trim() !== "") ? value : "Укажите значение";

                if(displayValue !== "Укажите значение"){
                    $field.addClass('yes-field second-f user_edit');
                }else{
                    $field.removeClass('yes-field').removeClass('second-f').removeClass('user_edit');
                }

                if (action === 'edit') {
                    var creator = $('#creator').val();
                    if (creator) {
                        $field.html(displayValue).removeClass('input-here').removeClass('user-edit-field');
                    } else {
                        $field.html(displayValue).addClass('user-edit-field').removeClass('input-here');
                    }
                } else {
                    var documentId = $('#document').val();

                    $field.html(displayValue).removeClass('input-here');
                    $field.css({width: 'auto'});
                    if(displayValue != 'Укажите значение') {
                        localStorage[key] = displayValue;
                        localStorage[documentId + '_' + key] = displayValue;
                    }
                }

            }
        });

        // Удаляем список после выбора
        $(".party-search-block").remove();
    }

    $(document).on("input", ".input-load", function () {

        var $self = $(this);
        var $parent = $self.closest('.ch-field');
        var $same = $parent.data('same');
        var $str = $self.val();

        if ($parent.hasClass('searchcompany')) {
            loadParties($parent, $same, $str);
        }
    });

    $(document).on('click', '.ch-field', function () {
        lastClickedParty = null;
        var $self = $(this);
        var $same = $self.data('same');
        var action = $('#action').val();
        var suid = $('#suid').val();
        var old_width = $self.outerWidth();
        var old_height = $self.outerHeight();
        var doc_height = $('#doc-body').height();
        var doc_pos = $('#doc-body').offset().left;
        var doc_right = doc_pos + doc_height;
        var doc_middle = doc_height;


        // Сохраняем оригинальное значение текста, если оно еще не сохранено
        var originalValue = $self.data('original');

        if (originalValue === undefined) {
            var noteInside = $self.find('.pl-note');
            if(noteInside.length){
                originalValue = noteInside.text();
            }else{
                originalValue = $self.text();
            }
            $self.data('original', originalValue).attr('data-original', originalValue);
        }

        var helpText = String($self.attr('data-help') || '').trim();

        var currentText = String($self.text() || '').trim();
        var originalText = String(originalValue || '').trim();
        var showNote = false;

        if (!$self.hasClass('yes-field')) {
            showNote = true;
        } else {
            if (helpText && currentText === originalText) {
                showNote = true;
            }
        }

        var noteHtml = '';

        if (showNote) {
            if (helpText) {
                noteHtml =
                    '<span class="pl-before"></span>' +
                    '<span class="pl-note">' +
                    '<span class="pl-note-title">' + originalValue + '</span>' +
                    '<span class="pl-note-help">' + helpText + '</span>' +
                    '</span>';
            } else {
                noteHtml =
                    '<span class="pl-before"></span>' +
                    '<span class="pl-note">' + originalValue + '</span>';
            }
        }

        // Убираем ненужные классы или элементы
        if ($self.hasClass('no-info')) {
            $self.removeClass('no-info');
        }

        //$self.find('.w-ico').remove();

        // Добавляем input, если его еще нет
        if(!$self.hasClass('input-here')){

            $self.css({
                'width': old_width,
                'height': old_height
            });

            var input_pos = parseInt($self.offset().left);

            var input_right = input_pos+old_width+10;
            var value_field = '';
            if($self.hasClass('user_edit')){
                value_field = $self.text();
            }

            if(!$self.hasClass('closed-field')){
                $self.html(
                    noteHtml + '<input name="defauld-load" class="input-load" value="'+value_field+'" type="text"/>'
                ).addClass('input-here');
            }else{
                setDangerNote($self);
            }
            //console.log('value_field', value_field);
            /*if(!$self.hasClass('yes-field')){
                if(!$self.hasClass('closed-field')){
                    //$self.html(originalValue+'<span class="pl-before"></span><span class="pl-note">'+originalValue+'</span><input name="defauld-load" class="input-load" value="'+value_field+'" type="text"/>').addClass('input-here');
                    //$self.html('<span class="pl-before"></span><span class="pl-note">'+originalValue+'</span><input name="defauld-load" class="input-load" value="'+value_field+'" type="text"/>').addClass('input-here');

                    $self.html(noteHtml + '<input name="defauld-load" class="input-load" value="'+value_field+'" type="text"/>').addClass('input-here');
                }else{
                    setDangerNote($self);
                }

            }else{
                //$self.html(value_field+"<input name='defauld-load' class='input-load' value='"+value_field+"' type='text'/>").addClass('input-here');
                $self.html("<input name='defauld-load' class='input-load' value='"+value_field+"' type='text'/>").addClass('input-here');
            }*/

            $self.find('.input-load').css({
                'min-width': old_width - 4,
                'width': old_width - 4,
                'height': old_height + 2   // ← вот оно
            }).focus();

            if ($self.hasClass('searchcompany')) {
                var $str = $self.find('.input-load').val() || '';
                loadParties($self, $same, $str);
            }

            var windowWidth = $(window).width();
            var elementOffset = $self.offset().left;
            var elementWidth = $self.outerWidth();
            var elementCenter = elementOffset + elementWidth / 2;
            var comfortZone = 10; // Зона комфорта, чтобы избежать пограничных случаев

            if (elementCenter > windowWidth / 2 + comfortZone) {
                $self.find('.input-load').css({'min-width':old_width+2, 'width': old_width+2, 'right':0}).addClass('r-field').focus();
            } else if (elementCenter < windowWidth / 2 - comfortZone) {
                $self.find('.input-load').css({'min-width':old_width+2, 'width': old_width+2, 'left':0}).addClass('l-field').focus();
            } else {
                $self.find('.input-load').css({'min-width':old_width+2, 'width': old_width+2, 'left':0}).addClass('l-field').focus();
            }

            var input_new = input_pos;

            if(!$self.hasClass('closed-field')) {
                if ($self.find('.input-load').offset().left > input_pos + 1) {
                    $self.find('.input-load').offset({left: input_pos});
                }
            }

        }
    });

    $(document).on('focusout', '.ch-field .input-load', function () {

        if(lastClickedParty){
            setPartyData(lastClickedParty);
            lastClickedParty = null;
        }

        var $input = $(this);
        var $parent = $input.closest('.ch-field');

        var action = $('#action').val();

        var $wrapper = $input.closest('.one-wrapper');
        var old = $parent.data('original'); // Загружаем сохраненное оригинальное значение
        var newText = $input.val(); // Текущее значение input
        var old_width = $parent.width();


        if (newText === '') {
            // Если поле ввода пустое, возвращаем старое значение
            $(this).remove();
            $parent.html(old).css({'width':'auto', 'height':'auto'}).removeClass('input-here');

            if(action === 'edit'){
                //checkEditParams($(this));
                saveEditedDocument();
            }
        } else {
            // Если значение изменилось, обновляем текст элемента
            $parent.html(newText).removeClass('input-here').addClass('yes-field user_edit').css({'width':'auto', 'height':'auto'});
            $parent.data('original', newText); // Обновляем сохраненное значение

            var new_stavka = null;
            var def_id;
            var full_sum;
            var back_stavka = false;

            if ($parent.hasClass('nds')) {
                new_stavka = parseNum($(this).val());
            }
            //new_stavka = 20;
            //alert(new_stavka);
            $parent.html(newText).css({'width':'auto', 'height':'auto'}).removeClass('input-here').addClass('yes-field user_edit');

            var nAttr = $parent.data('same');


            setSame($parent, newText, nAttr);
            getIco();

            if($parent.hasClass('sum-nds')){
                var clearStr = $(this).val().split(' ').join('');
                //alert(clearStr);
                if(!$.isNumeric(clearStr) || +clearStr < 1){
                    $(this).remove();
                    $parent.html(old).css({'width':old_width+30, 'height':'auto'}).removeClass('input-here');
                    if(!$.isNumeric(old)){
                        $parent.removeClass('yes-field');
                    }
                    setSame($parent, old, nAttr);
                }else{

                    full_sum = clearStr;
                    def_id = $parent.data('sum');
                    $parent.html(full_sum);
                    if(full_sum !== undefined){
                        putWSum($parent, full_sum, def_id);
                    }
                    setSame($parent, full_sum, nAttr);
                }
                getIco();
            }

            if(new_stavka){

                if(!$.isNumeric(new_stavka)){

                    $(this).remove();
                    $parent.html(old).css({'width':old_width, 'height':'auto'}).removeClass('input-here').removeClass('yes-field');
                    return false;
                }

                def_id = $parent.data('nds');

                full_sum = parseNum($('.sum-nds[data-sum="'+def_id+'"]').text());

                if(full_sum){
                    var coef_nds = 100+parseInt(new_stavka);
                    //alert(coef_nds);
                    var sum_nds = full_sum*new_stavka/coef_nds;
                    //alert(sum_nds);
                    var full_pro_nds = fn(sum_nds.toFixed(2));

                    //var full_pro_nds = pro_nds;
                    //var full_pro_nds = pro_nds.charAt(0).toUpperCase() + pro_nds.substr(1);

                    $('.sumnds[data-sumnds='+def_id+']').html(sum_nds.toFixed(2)+' <span class="have_nds">('+full_pro_nds+')</span>');
                }

            }

            if(action === 'edit'){

                var $parentBlock = $parent.closest('.single-part');
                var $parentStep = $wrapper.find('.step-new-block');
                var dataParent = $parentStep.attr('data-parent');
                var dataChild = $parentStep.attr('data-child');

                var newContent = $parentBlock.html();

                // Создаём временный контейнер для обработки содержимого
                var $tempContainer = $('<div>').html(newContent);

                // Удаляем класс hasDatepicker и id у вложенных элементов с классом date-f
                $tempContainer.find('.date-f').removeClass('hasDatepicker').removeAttr('id');

                // Получаем обработанное содержимое
                newContent = $tempContainer.html();

                var targetBlock = $('.all-blocks-wrapper .single-part[data-parent="' + dataParent + '"][data-child="' + dataChild + '"]');

                // Заменяем содержимое в целевом блоке
                if (targetBlock.length) {
                    targetBlock.html(newContent);
                }

                saveEditedDocument();
            }

        }

        getIco();
        getDateIco();
    });

    function recalcNds(def_id){
        var full_sum = parseNum($('.sum-nds[data-sum="'+def_id+'"]').text());
        var stavka   = parseNum($('.nds[data-nds="'+def_id+'"]').text());

        if (!isFinite(full_sum) || !isFinite(stavka) || stavka <= 0) return;

        var coef = 100 + stavka;
        var sum_nds = full_sum * stavka / coef;

        var full_pro_nds = fn(sum_nds.toFixed(2)); // твоя функция прописью/текстом
        $('.sumnds[data-sumnds="'+def_id+'"]')
            .html(sum_nds.toFixed(2) + ' <span class="have_nds">(' + full_pro_nds + ')</span>');
    }

    function parseNum(v){
        if (v === null || v === undefined) return NaN;
        v = String(v).replace(/\s+/g,'').replace(',', '.'); // пробелы + запятая
        v = v.replace('%','');
        return parseFloat(v);
    }

    function num(v){
        if (v === null || v === undefined) return NaN;
        v = String(v)
            .replace(/\s+/g,'')   // пробелы
            .replace(',', '.')    // запятая
            .replace('%','');     // проценты
        return parseFloat(v);
    }

    function recalcNdsByDefId(def_id){
        if (def_id === undefined || def_id === null) return;

        var $sumEl = $('.sum-nds[data-sum="' + def_id + '"]').first();
        if (!$sumEl.length) return;

        var sum = num($sumEl.text()); // text(), не html()
        if (!isFinite(sum)) return;

        putWSum($sumEl, sum, def_id);
    }

    $(document).on('keydown', '.input-load', function(e){
        if(e.keyCode === 13) {
            $(this).focusout();
        }
    });

    $('.prind-doc').click(function(){
        var full_text = $('#doc-body').html();

        $.ajax({
            url: '/Contracts/check',
            type: "POST",
            data: { 'product_id': product_id, 'product_count' : product_count },
            dataType: 'json',
            cache: false,
            success: function(res) {
                $('.count-bascet').html(res.bascet_fast.num+' ед.');
                $('.sum-bascet').html(res.bascet_fast.sum+' руб.');
                $('.empty-bascet').hide();
                $('.bascet-button').show();

            }, error: function(res) {
                return false;
            }
        });

        //alert(full_text);
    });

    $('.addfree1').click(function(){
        var preloader = $('.preloader-wrapper');
        preloader.addClass('preloader-open');
        var co_id = $('#doc-body').data('coid');
        $.ajax({
            url: '/Contracts/getRemoveFree',
            type: "POST",
            data: { 'co_id': co_id},
            dataType: 'json',
            cache: false,
            success: function(res) {

                if(res.result.needPay == true){
                    document.location.href='/orders/pay/'+res.result.orderId;
                }else{
                    document.location.reload();
                }


            }, error: function(res) {
                return false;
            }
        });

    });

    $('.enter-docs').click(function(){
        var username;
        var pass;
        var validFirstPass = false;
        var validPass = false;
        var type = 'reg';
        var userField;
        var docType = $('#myModal1 #doctype').val();
        var preloader = $('.preloader-wrapper');

        if($(this).hasClass('contragent-doc')){
            userField = $('#log_username1');
            pass = $('#log_pas3').val();
            validFirstPass = validatePasswordFirst('edit');
            validPass = validatePassword('edit');
            docType = 'edit';

            preloader = $('.reg-preloader');

        }else{
            userField = $('#log_username');
            pass = $('#log_pas').val();
            validFirstPass = validatePasswordFirst();
            validPass = validatePassword();


        }
        username = userField.val();


        var modalReg = $('#myModal1');

        //return false;

        if(!validFirstPass || !validPass){
            if(!username){
                $('.error-email').slideDown(200);
                userField.addClass('error-field');
            }
            return false;
        }else{
            preloader.addClass('preloader-open');

            modalReg.addClass('no-visual');
            // Проверка на емейл
            getOrSetUser(username, pass, (canSave) => {
                if (canSave) {

                    $('.error-email').slideUp(200);
                    userField.removeClass('error-field');

                    if(docType === 'doc'){
                        ajaxSaveDoc(false);
                    }
                    if(docType === 'article'){
                        ajaxSaveDoc(true);
                    }
                    if(docType === 'edit'){
                        ajaxSaveDoc(false, 'edit');
                    }
                    if(docType === 'order'){
                        document.location.reload();
                    }
                    if(docType === 'subscribe'){
                        ajaxAddSudscribe();
                    }

                } else {

                    $('.error-email').slideDown(200);
                    userField.addClass('error-field');

                    preloader.removeClass('preloader-open');
                    modalReg.removeClass('no-visual');
                }
            });

        }

        return false;


    });

    $('.go-to-edit-link').click(function () {
        document.location.href=$('.copy-edit-link').data('target');
    });

    function ajaxAddSudscribe(){
        const quantity = $('.quantity').val();
        $.ajax({
            url: '/subscription/add-ajax-subscribe',
            type: "POST",
            data: {
                'quantity' : quantity
            },
            dataType: 'json',
            cache: false,
            success: function(res) {

                console.log(res);
                console.log(res.result.status);

                if(res.result.status === 'ок'){
                    document.location.href = res.result.url;
                }else{

                    $('.preloader-wrapper').removeClass('preloader-open');

                    setToast('error', res.result.error);
                }


            }, error: function(res) {
                $('.preloader-wrapper').removeClass('preloader-open');

                setToast('error', 'Ошибка оформления подписки');

                return false;
            }
        });
    }

    $('.check-price').click(function () {

        const p = updateModalPrice();

    });

    /*$('#myModal1').on('shown.bs.modal', function () {
        updateModalPrice();
    });*/

    $(document).on('change', '#doc-body input.check-part', function () {
        updateModalPrice();
    });

    function getInt(val, def = 0) {
        if (val === undefined || val === null) return def;
        val = String(val).trim();
        if (val === '') return def;

        val = val.replace(/[^\d-]/g, '');
        const n = parseInt(val, 10);
        return Number.isFinite(n) ? n : def;
    }

    function formatRub(n) {
        // 10000 -> "10 000 ₽"
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    }

    function updateModalPrice() {
        const $docBody = $('#doc-body');

        const dopPrice = getInt(calcDocPrice($docBody), 0);

        const basePrice = getInt($('#cprice').val(), 0);

        const total = basePrice + dopPrice;

        $('.contract-price-block .free-cost').text(formatRub(total));

        if (total > 0) {
            $('.contract-price-block .modal-free-note').show();
            $('.contract-price-block .already-reg').show();
        } else {
            // если у тебя бывают бесплатные документы
            $('.contract-price-block .modal-free-note').hide();
            $('.contract-price-block .already-reg').show(); // или hide — как хочешь
        }

        return { basePrice, dopPrice, total };
    }

    function ajaxSaveDoc(after, type = 'add'){
        var username;
        var password;
        if(type == 'add'){
            username = $('#log_username').val();
            password = $('#log_pas').val();
        }else{
            username = $('#log_username1').val();
            password = $('#log_pas3').val();
        }

        var contract = $('#log_contract').val();
        var contract_id = $('#log_id').val();
        var contract_type = $('#c_type').val();
        var print_w = $('#log_pw').val();
        var print_pdf = $('#log_pp').val();
        var change_text = $('#doc-body');

        var selectedParts = collectSelectedParts(change_text);

        var dData = {
            'dNum' : $('.second-f[data-same="nomer"]:first').text(),
            'ddate1' : $('.my-dates[data-same="date1"]:first').find('.date-f').val(),
            'ddate2' : $('.my-dates[data-same="date2"]:first').find('.date-f').val(),
            'ddate3' : $('.my-dates[data-same="date3"]:first').find('.date-f').val(),
            'ddate4' : $('.my-dates[data-same="date4"]:first').find('.date-f').val(),
            'dsum' : $('.second-f[data-same="summa"]:first').text(),
            'name1' : $('.second-f[data-same="name1"]:first').text(),
            'name2' : $('.second-f[data-same="name2"]:first').text(),
            'name3' : $('.second-f[data-same="name3"]:first').text(),
            'name4' : $('.second-f[data-same="name4"]:first').text(),
            'name5' : $('.second-f[data-same="name5"]:first').text(),
            'name6' : $('.second-f[data-same="name6"]:first').text(),
            'name7' : $('.second-f[data-same="name7"]:first').text(),
        };

        var openBtn = '1';
        if($('#open-btn').length){
            openBtn = $('#open-btn').val();
        }

        removeDatepicker();

        var def_text = $('#doc-body').html();
        clearText();
        clearSelect();
        clearSelf();

        var full_text = $('#doc-body').html();

        clearPdfText();
        var pdf_text = $('#doc-body').html();

        $('#doc-body').html(def_text);

        var suid = $('#suid').val();

        $.ajax({
            url: '/Auth/ajaxLogin',
            type: "POST",
            data: {
                'dData' : dData,
                'contract_type': contract_type,
                'username': username,
                'password' : password,
                'text' : full_text,
                'pdf_text' : pdf_text,
                'def_text' : def_text,
                'contract_id' : contract_id,
                'contract' : contract,
                'print_w' : print_w,
                'print_pdf' : print_pdf,
                'after' : after,
                'suid' : suid,
                'type' : type,
                'open_btn' : openBtn,
                'selected_parts': selectedParts
            },
            dataType: 'json',
            cache: false,
            success: function(res) {

                if(res.dogovor.id == null){
                    $('#message').html('Неверный логин или пароль');
                }else{

                    setOrUpdateParty().then(() => {
                        if (type === 'add') {
                            if (res.dogovor.needPay == true) {
                                document.location.href = '/orders/pay/' + res.dogovor.id;
                            } else {
                                if (after) {
                                    document.location.reload();
                                } else {
                                    document.location.href = '/orders';
                                }
                            }
                        } else {
                            $('.copy-edit-link').data('target', res.dogovor.url).attr('data-target', res.dogovor.url);
                            $('.edit-link').text(res.dogovor.url);

                            $('#qrcode').empty();

                            // Создаем QR-код из полученной ссылки
                            new QRCode(document.getElementById("qrcode"), {
                                text: res.dogovor.url, // Используем URL из ответа
                                width: 128,        // Ширина QR-кода
                                height: 128,       // Высота QR-кода
                            });

                            toggleModalStyles();

                            $('#edit-modal-3').modal('hide').addClass('no-visual');
                            $('#edit-modal-4').modal('show');

                            $('#edit-modal-3').on('hidden.bs.modal', function () {
                                $('.reg-preloader').removeClass('preloader-open');
                                toggleModalStyles();
                                if ($('.modal.show').length === 0) { // Проверяем, остались ли открытые модальные окна
                                    $('body').removeClass('modal-open').css('padding-right', '');
                                }
                            });
                        }
                    });

                }


            }, error: function(res) {
                if(type == 'add'){
                    $('.preloader-wrapper').removeClass('preloader-open');
                }else{
                    $('.reg-preloader').removeClass('preloader-open');
                }

                //modalReg.removeClass('no-visual');
                return false;
            }
        });
    }


    const getOrSetUser = (username, password, callback) => {
        $.ajax({
            url: '/users/validEmail',
            type: "POST",
            data: { 'username': username, 'password': password },
            dataType: 'json',
            cache: false,
            success: (res) => {
                let canSave = false;

                if (res.result.emailValid) {
                    if (res.result.userNew) {
                        canSave = true;
                    } else {

                        canSave = res.result.userValide ? true : false;
                    }
                }else{
                    $('.error-email').html('<div class="error-wrapper">Пожалуйста, укажите действующий E-mail адрес</div>').show();
                }

                callback(canSave);
            },
            error: () => {
                callback(false);
            }
        });
    };

    function buildPdfHtmlForPreview() {
        const $doc = $('#doc-body');

        const $clone = $doc.clone();

        removeDatepicker($clone);

        clearText($clone);
        clearSelect($clone);
        clearSelf(true, $clone);
        clearPdfText($clone);

        const pdf_text = $clone.html();

        return { pdf_text };
    }

    function openPreviewThenRegister() {
        const $doc = $('#doc-body');
        const contractId = $doc.data('coid');

        const { pdf_text } = buildPdfHtmlForPreview();

        $('.preloader-wrapper').addClass('preloader-open');

        $.ajax({
            url: '/previews/make',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                contract_id: contractId,
                pdf_html: pdf_text
            },
            success: function(res) {

                if (!res || !res.ok) return;

                $('.preloader-wrapper').removeClass('preloader-open');
                $('#previewImg').attr('src', res.url);
                $('#previewModal').modal('show');
            },
            error: function() {
                $('.preloader-wrapper').removeClass('preloader-open');

                $('#myModal1').modal('show');
            }
        });
    }

    $(function(){
        const $btn = $('#modal-reg');
        if (!$btn.length) return;

        $btn.on('click', function(e){
            const previewEnabled = parseInt($('#doc-body').data('preview'), 10) === 1;

            if ($btn.hasClass('show-check-modal')) return;

            // Всегда глушим дефолт (иначе могут быть переходы/двойные обработчики)
            e.preventDefault();

            if (!previewEnabled) {
                $('#myModal1').modal('show');
                return;
            }

            openPreviewThenRegister();
        });

        $('#previewContinue').on('click', function(){
            $('#previewModal').modal('hide');
            $('#previewModal').one('hidden.bs.modal', function () {
                $('#myModal1').modal('show');
            });
        });
    });

    $('.check-pass').click(function(){
        if($('#password').val().length < minLen){
            $('.small-pass').slideDown(200);
            return false;
        }
    });

    $('.close-check-note').click(function(){
        $('.need-check').slideUp(200);
    });

    $('.reg-docs').click(function(){

        if($('#reg_pas').val().length >= 6){


            if($('.close-check-note').prop('checked')){

                var username = $('#reg_username').val();
                var contract = $('#reg_contract').val();
                var contract_id = $('#log_id').val();
                var contract_type = $('#c_type').val();
                var name = $('#reg_name').val();
                var second_name = $('#reg_second').val();
                var password = $('#reg_pas').val();

                var dData = {
                    'dNum' : $('.second-f[data-same="nomer"]:first').text(),
                    'ddate1' : $('.my-dates[data-same="date1"]:first').find('.date-f').val(),
                    'ddate2' : $('.my-dates[data-same="date2"]:first').find('.date-f').val(),
                    'ddate3' : $('.my-dates[data-same="date3"]:first').find('.date-f').val(),
                    'ddate4' : $('.my-dates[data-same="date4"]:first').find('.date-f').val(),
                    'dsum' : $('.second-f[data-same="summa"]:first').text(),
                    'name1' : $('.second-f[data-same="name1"]:first').text(),
                    'name2' : $('.second-f[data-same="name2"]:first').text(),
                    'name3' : $('.second-f[data-same="name3"]:first').text(),
                    'name4' : $('.second-f[data-same="name4"]:first').text(),
                    'name5' : $('.second-f[data-same="name5"]:first').text(),
                    'name6' : $('.second-f[data-same="name6"]:first').text(),
                    'name7' : $('.second-f[data-same="name7"]:first').text(),
                };


                clearSelect();
                clearSelf();
                removeDatepicker();

                clearText();
                var def_text = $('#doc-body').html();

                var full_text = $('#doc-body').html();
                $('#doc-body').html(def_text);
                clearPdfText();
                var pdf_text = $('#doc-body').html();

                var suid = $('#suid').val();

                var print_w = $('#reg_pw').val();

                var print_pdf = $('#reg_pp').val();



                $.ajax({
                    url: '/Auth/ajaxReg',
                    type: "POST",
                    data: {
                        'dData' : dData,
                        'contract_type': contract_type,
                        'username': username,
                        'name': name,
                        'second_name' : second_name,
                        'password' : password,
                        'text' : full_text,
                        'pdf_text' : pdf_text,
                        'def_text' : def_text,
                        'contract_id' : contract_id,
                        'contract' : contract,
                        'print_w' : print_w,
                        'print_pdf' : print_pdf,
                        'suid' : suid
                    },
                    dataType: 'json',
                    success: function(res) {

                        if(res.dogovor == null){
                            $('#message').html('Ошибка регистрации. Попробуйте еще раз');
                        }else{

                            document.location.href='/orders/view/'+res.dogovor;
                        }


                    }, error: function(res) {
                        return false;
                    }
                });
            }else{


                $('.need-check').slideDown(200);


            }


            return false;

        }else{
            $('.small-pass').slideDown(200);

            if(!$('.jq-checkbox').hasClass('checked')){
                $('.need-check').slideDown(200);
            }

            return false;

        }

    });

    $('#modal-reg').click(function (){
        checkFullData();
        if($('#modal-reg').hasClass('show-check-modal')){
            $('#myModal7').modal('show');

        }else{
            //$('#myModal1').modal('show');
        }
    });

    $('#free-reg').click(function (){
        checkFullData();
        if($(this).hasClass('show-check-modal')){
            $('#myModal7').modal('show');
        }else{
            $(this).css({'display':'none'});
            $('.new-free-btn').css({'display':'inline-block'});
        }
    });

    $('.show-sample').click(function(){
        $('#myModal8').modal('show');
        $('#myModal7').modal('hide');
        $('body').addClass('pad-modal');

    });
    $('.remove-pad').click(function (){
        $('body').removeClass('pad-modal');
    });

    $('.show-red-sample').on('click', function(){
        $('.red-sample').each(function(){
            $(this).addClass('red-sample-start');

        });
        setTimeout(function () {
            hideRedSample();
        }, 10000);
    });

    function hideRedSample(){
        $('.red-sample').each(function(){
            $(this).removeClass('red-sample-start');
        });
    }

    $(document).on('click', '.new-version-btn', function () {
        var newDoc = $(this).data('save');
        $('#oneMoreDoc').modal('hide');

        saveDoc(newDoc);

    });

    $('#print-reg').click(function(){

        var $self = $(this);
        checkFullData();


        var oldDocument = getOldDocument();

        if(oldDocument){
            $('#oneMoreDoc').modal('show');
        }else{
            if($self.hasClass('fields-checked') && !$self.hasClass('show-check-modal')){

                saveDoc();

            }else if($(this).hasClass('show-check-modal')) {

                $('#myModal7').modal('show');

            }else{
                $('.ch-field').each(function(){
                    if(!$(this).hasClass('yes-field')){
                        $(this).addClass('no-info');
                    }
                });

                if($("span").is(".no-info")){
                    $('.error-fields').slideDown(200);
                    $('#print-reg').addClass('fields-checked').html('<i class="fa fa-print" aria-hidden="true"></i> Все равно скачать');
                }

                return false;
            }
        }

        return false;

    });

    function saveDoc(newDoc = 'new') {

        var $self = $('#print-reg');
        var $docBody = $('#doc-body');

        var selectedParts = collectSelectedParts($docBody);

        if($self.hasClass('need-preloader')){
            $('.preloader-wrapper').addClass('preloader-open');
        }

        setOrUpdateParty().then(() => {
            var dData = {
                'dNum' : $('.second-f[data-same="nomer"]:first').text(),
                'ddate1' : $('.my-dates[data-same="date1"]:first').find('.date-f').val(),
                'ddate2' : $('.my-dates[data-same="date2"]:first').find('.date-f').val(),
                'ddate3' : $('.my-dates[data-same="date3"]:first').find('.date-f').val(),
                'ddate4' : $('.my-dates[data-same="date4"]:first').find('.date-f').val(),
                'dsum' : $('.second-f[data-same="summa"]:first').text(),
                'name1' : $('.second-f[data-same="name1"]:first').text(),
                'name2' : $('.second-f[data-same="name2"]:first').text(),
                'name3' : $('.second-f[data-same="name3"]:first').text(),
                'name4' : $('.second-f[data-same="name4"]:first').text(),
                'name5' : $('.second-f[data-same="name5"]:first').text(),
                'name6' : $('.second-f[data-same="name6"]:first').text(),
                'name7' : $('.second-f[data-same="name7"]:first').text(),
            };

            clearSelect();
            clearSelf();
            removeDatepicker();
            //cleanDocBody();
            var def_text = $docBody.html();
            clearText();
            var full_text = $docBody.html();
            $docBody.html(def_text);
            clearPdfText();
            var pdf_text = $docBody.html();
            clearInn();

            var suid = $('#suid').val();

            var contract = $self.data('title');
            var contract_id = $self.data('id');
            var print_w = $self.data('word');
            var print_pdf = $self.data('pdf');

            $.ajax({
                url: '/Orders/saveDoc',
                type: "POST",
                data: { 'text' : full_text,
                    'pdf_text' : pdf_text,
                    'def_text' : def_text,
                    'contract_id' : contract_id,
                    'contract' : contract,
                    'print_w' : print_w,
                    'print_pdf' : print_pdf,
                    'dData' : dData,
                    'suid' : suid,
                    'newDoc' : newDoc,
                    'selected_parts': selectedParts
                },
                dataType: 'json',
                cache: false,
                success: function(res) {

                    if(res.dogovor.id == null){
                        $('#message').html('Упс! что-то пошло не так! Попробуйте еще раз');
                    }else{
                        if(res.dogovor.needPay == true){
                            document.location.href='/orders/pay/'+res.dogovor.id;
                        }else{
                            document.location.href='/orders';
                        }
                    }


                }, error: function(res) {
                    return false;
                }
            });
        });
    }

    function collectSelectedParts($root) {
        const parts = [];

        $root.find('input.check-part:checked').each(function () {
            const partId = $(this).data('part');

            if (partId) {
                parts.push(parseInt(partId, 10));
            }
        });

        return parts;
    }

    function calcDocPrice($root) {
        let total = 0;

        $root.find('input.check-part:checked').each(function () {

            let v = $(this).attr('data-price');
            if (v === undefined || v === null) return;

            v = String(v).trim();
            if (v === '') return;

            v = v.replace(',', '.');

            const num = parseFloat(v);
            if (!Number.isFinite(num)) return;

            total += num;
        });

        return total;
    }

    function getOldDocument() {
        if($('#last-contract').length){
            return $('#last-contract').val();
        }else{
            return null;
        }
    }

    // Если договор для редакции
    $('#print-save').click(function () {
        saveFullDoc()
            .then(function (response) {
                // Проверяем, существует ли response.id
                if (response.result.id) {
                    document.location.href = '/orders/editDoc/' + response.result.id;
                }
            })
            .catch(function (error) {
                console.error('Произошла ошибка:', error);
            });

        return false;
    });

    $(document).on('click', '.radio-open-btn', function () {
       if(!$(this).hasClass('radio-open-btn-active')){
            $('.radio-open-btn').removeClass('radio-open-btn-active');
            $(this).addClass('radio-open-btn-active');
            let openBtn = $(this).data('open');
            $('#open-btn').val(openBtn);
       }
    });

    function saveFullDoc() {

        return new Promise((resolve, reject) => {
            var dData = {
                'dNum' : $('.second-f[data-same="nomer"]:first').text(),
                'ddate1' : $('.my-dates[data-same="date1"]:first').find('.date-f').val(),
                'ddate2' : $('.my-dates[data-same="date2"]:first').find('.date-f').val(),
                'ddate3' : $('.my-dates[data-same="date3"]:first').find('.date-f').val(),
                'ddate4' : $('.my-dates[data-same="date4"]:first').find('.date-f').val(),
                'dsum' : $('.second-f[data-same="summa"]:first').text(),
                'name1' : $('.second-f[data-same="name1"]:first').text(),
                'name2' : $('.second-f[data-same="name2"]:first').text(),
                'name3' : $('.second-f[data-same="name3"]:first').text(),
                'name4' : $('.second-f[data-same="name4"]:first').text(),
                'name5' : $('.second-f[data-same="name5"]:first').text(),
                'name6' : $('.second-f[data-same="name6"]:first').text(),
                'name7' : $('.second-f[data-same="name7"]:first').text(),
            };

            removeDatepicker();
            //cleanDocBody();
            var def_text = $('#doc-body').html();
            var full_text = $('#doc-body').html();
            var pdf_text = $('#doc-body').html();

            var suid = $('#suid').val();
            var contract = $('#print-reg').data('title');
            var contract_id = $('#print-reg').data('id');
            var print_w = $('#print-reg').data('word');
            var print_pdf = $('#print-reg').data('pdf');
            var openBtn = '1';
            if($('#open-btn').length){
                openBtn = $('#open-btn').val();
            }

            $.ajax({
                url: '/Orders/saveForEditDoc',
                type: "POST",
                data: {
                    'text': full_text,
                    'pdf_text': pdf_text,
                    'def_text': def_text,
                    'contract_id': contract_id,
                    'contract': contract,
                    'print_w': print_w,
                    'print_pdf': print_pdf,
                    'dData': dData,
                    'suid': suid,
                    'open_btn': openBtn
                },
                dataType: 'json',
                cache: false,
                success: function (res) {
                    if (res.result != null) {
                        resolve(res.result); // Возвращаем результат
                    } else {
                        reject('Ошибка: result == null');
                    }
                },
                error: function () {
                    reject('Произошла ошибка при выполнении запроса');
                }
            });
        });
    }

    $('.end-edit-doc').click(function(){

        var finish = false;
        if($(this).hasClass('end-edit-finish')){
            finish = true;
        }
        if(finish){
            $('.odob-preloader').addClass('preloader-open');
        }else{
            $('.sogl-preloader').addClass('preloader-open');
        }

        var dData = {
            'dNum' : $('.second-f[data-same="nomer"]:first').text(),
            'ddate1' : $('.my-dates[data-same="date1"]:first').find('.date-f').val(),
            'ddate2' : $('.my-dates[data-same="date2"]:first').find('.date-f').val(),
            'ddate3' : $('.my-dates[data-same="date3"]:first').find('.date-f').val(),
            'ddate4' : $('.my-dates[data-same="date4"]:first').find('.date-f').val(),
            'dsum' : $('.second-f[data-same="summa"]:first').text(),
            'name1' : $('.second-f[data-same="name1"]:first').text(),
            'name2' : $('.second-f[data-same="name2"]:first').text(),
            'name3' : $('.second-f[data-same="name3"]:first').text(),
            'name4' : $('.second-f[data-same="name4"]:first').text(),
            'name5' : $('.second-f[data-same="name5"]:first').text(),
            'name6' : $('.second-f[data-same="name6"]:first').text(),
            'name7' : $('.second-f[data-same="name7"]:first').text(),
        };

        var suid = $('#suid').val();
        var order = $('#order').val();
        //cleanDocBody();
        var def_text = $('#doc-body').html();
        var full_text = '';
        var pdf_text = '';
        if(finish){
            clearInn();
            clearSelect();
            clearText();

            full_text = $('#doc-body').html();
            //$('#doc-body').html(def_text);
            clearPdfText();
            pdf_text = $('#doc-body').html();
            clearInn();
        }

        $.ajax({
            url: '/Orders/saveEndDoc',
            type: "POST",
            data: {
                'text' : full_text,
                'pdf_text' : pdf_text,
                'def_text' : def_text,
                'order' : order,
                'dData': dData,
                'suid' : suid,
                'finish': finish
            },
            dataType: 'json',
            cache: false,
            success: function(res) {

                if(res.result.status == 'error'){
                    $('.sogl-preloader').removeClass('preloader-open');
                    setToast('error', res.result.errors);
                }else{
                    if(finish){
                        document.location.href='/orders';
                    }else{

                        document.location.href=res.result.url;
                    }
                }


            }, error: function(res) {
                $('.sogl-preloader').removeClass('preloader-open');
                setToast('error', 'Ошибка');
                return false;
            }
        });

        return false;

    });

    $('.edit-creator').click(function(){

        var suid = $('#suid').val();
        var order = $('#order').val();
        var who = 'creator';
        if($(this).hasClass('user-time')){
            who = 'user';
        }

        $('.more-edit-preloader').addClass('preloader-open');

        $.ajax({
            url: '/Orders/moreEdit',
            type: "POST",
            data: {
                'order' : order,
                'suid' : suid,
                'who' : who
            },
            dataType: 'json',
            cache: false,
            success: function(res) {

                if(res.result.status == 'error'){
                    setToast('error', res.result.errors);
                    $('.more-edit-preloader').removeClass('preloader-open');
                }else{
                    document.location.href=res.result.url;
                }


            }, error: function(res) {
                setToast('error', 'Ошибка');
                $('.more-edit-preloader').removeClass('preloader-open');
                return false;
            }
        });

        return false;

    });

    $('.form-link').click(function(){
        var doc_id = $('#doc_id').html();
        $.ajax({
            url: '/Contracts/partnerLink',
            type: "POST",
            data: { 'doc_id' : doc_id },
            dataType: 'json',
            cache: false,
            success: function(res) {

                if(res.contract_link == null){
                    $('.partner-link-block').text('Ошибка создания партнерской ссылки. Попробуйте еще раз');
                    $('.open-part-block').slideDown(300);
                }else{
                    $('.partner-link-block').text(res.contract_link);
                    $('.form-link').remove();
                    $('.open-part-block').slideDown(300);
                }

            }, error: function(res) {
                return false;
            }
        });
    });




    function setOrUpdateParty() {
        return new Promise((resolve, reject) => {
            var dData = {}; // Объект для данных

            // Список всех возможных data-same
            var fields = [
                'name1', 'address1', 'fakt_add1', 'pasp1', 'bank1',
                'name2', 'dous21', 'name21', 'dous22', 'ur_adress1', 'fak_adress1',
                'ogrn1', 'inn1', 'kpp1', 'bik1', 'ks1', 'rs1',
                'name3', 'address_ip1', 'ogrnip1', 'inn_ip1',
                'name4', 'adress2', 'fakt_add2', 'pasport2', 'bank2', 'snils2', 'inn_fiz2',
                'isp_inostran_1', 'isp_inostran_2', 'isp_inostran_3',
                'name5', 'dous31', 'name51', 'dous32', 'ur_adress2', 'fak_adress2',
                'ogrn2', 'inn2', 'kpp2', 'bik2', 'ks2', 'rs2',
                'name6', 'address_ip2', 'ogrnip2', 'inn_ip2', 'name7'
            ];

            // Перебираем все указанные ключи и заполняем объект только непустыми значениями
            fields.forEach(function (key) {
                var value = $('.second-f[data-same="' + key + '"]:first').text().trim();

                if (value !== '' && value !== 'Укажите значение') {
                    dData[key] = value;
                }
            });

            if (Object.keys(dData).length === 0) {
                console.warn('Нет данных для отправки');
                resolve();
                return;
            }

            $.ajax({
                url: '/parties/set-update-party',
                type: 'POST',
                data: dData,
                dataType: 'json',
                success: function (response) {
                    console.log('Контрагент успешно обновлён:', response);
                    resolve(response);
                },
                error: function (error) {
                    console.error('Ошибка при обновлении контрагента:', error);
                    reject(error);
                }
            });
        });
    }

    $('.vser').click(function(){
        var ptype = $(this).data('type');
        $('.print-doc-modal').attr({'data-type':ptype}).data({'type':ptype});
    });

    $('#myModal4').on('hide.bs.modal', function (e) {
        $('.vser').removeAttr("data-toggle").removeAttr("data-target").addClass('modalfirst');
    });


    $('.free-link-btn').click(function(){

        if($(this).hasClass('modalfirst')){

            self = $(this);

            var printType = self.data('type');

            var def_text = $('#doc-body').html();

            clearSelect();
            clearSelf();

            if(printType == 'pdf'){
                clearPdfText();
            }else{
                clearText();
            }
            var full_text = $('#doc-body').html();


            $('#doc-body').html(def_text);



            setSameSelect();
            getLongField();
            setDadtapicker();
            getIco();
            getDateIco();
            setOprosnik();



            var contract_id = self.data('id');
            var contract_type = self.data('con');
            var contract_click = self.data('type');


            $.ajax({
                url: '/LightOrders/saveDoc',
                type: "POST",
                data: {
                    'text' : full_text,
                    'contract_id' : contract_id,
                    'contract_type' : contract_type,
                    'contract_click' : contract_click
                },
                dataType: 'json',
                cache: false,
                success: function(res) {

                    if(res.dogovor.id == null){
                        $('#message').html('Упс! что-то пошло не так! Попробуйте еще раз');
                    }else{



                        if(self.data('type') == 'pdf'){

                            self.attr('href', '/lightOrders/pdf/'+res.dogovor.id+'.pdf');
                            document.location.href='/lightOrders/pdf/'+res.dogovor.id+'.pdf';

                        }
                        if(self.data('type') == 'wd'){

                            self.attr('href', '/lightOrders/doc/'+res.dogovor.id);
                            document.location.href='/lightOrders/doc/'+res.dogovor.id;
                        }
                        $('.close-click').click();
                        $('#doc_id').val(res.dogovor.id);

                        reloadAsitor();
                        setSelfEvents();


                    }


                }, error: function(res) {

                    return false;
                }
            });



            return false;

        }

    });


    $('.soc-reit-block').each(function(){
        var self = $(this);

        self.on('click', '.ya-share2__item', function(){
            var contract_id = $('#doc-body').data('coid');
            if($(this).hasClass('ya-share2__item_service_vkontakte')){
                var socName = 'ВК';
            }else if($(this).hasClass('ya-share2__item_service_odnoklassniki')){
                var socName = 'Одноклассники';
            }else if($(this).hasClass('ya-share2__item_service_facebook')){
                var socName = 'Фейсбук';
            }else if($(this).hasClass('ya-share2__item_service_twitter')){
                var socName = 'Твиттер';
            }else{
                var socName = 'Вотсап';
            }

            $.ajax({
                url: '/LightOrders/setShare',
                type: "POST",
                data: { 'contract_id' : contract_id, 'soc_name' : socName },
                dataType: 'json',
                cache: false,
                success: function(res) {

                    return true;

                }, error: function(res) {

                    return false;
                }
            });

        });
    });


    $('.close-last').click(function(){
        $('.last-doc-block').hide(300);

        $.ajax({
            url: '/index/clearLast',
            type: "POST",
            data: { 'last' : 1 },
            dataType: 'json',
            cache: false,
            success: function(res) {
                return true;
            }, error: function(res) {
                return false;
            }
        });

    });


    $(document).on('click', '.podpr-note .podpr-open', function() {
        var self = $(this).closest('.podpr-note');
        $('.podpr-text').hide();
        self.find('.podpr-text').show();
    });

    $(document).on('click', '.podpr-note .close-last1', function() {
        var self = $(this).closest('.podpr-note');
        self.find('.podpr-text').hide();
    });

    // icons
    getIco();
    getDateIco();

    setSearchClass();
    getAllAsitor();
    setSelfEvents();

    //setSelfShare();


    var previousValue = null;
    $(document).on('change', '.check-part', function(e){

        var docBody = $('#doc-body');
        var parent_id = $(this).data('parent');
        var part_id = $(this).data('part');
        var hiddenCurrentBlocks = $(this).data('friends');
        var parentBlock = $(this).parents('.one-wrapper');
        var action = $('#action').val();


        var lastCurrentId = parentBlock.find('.step-new-block').data('child');

        var lastCurrentBtn = $('#pod_'+parent_id+'_'+lastCurrentId);
        var newCurrentBtn = $('#pod_'+parent_id+'_'+$(this).data('part'));


        var lastCurrentFriends = lastCurrentBtn.data('friends');
        var newCurrentFriends = newCurrentBtn.data('friends');

        //console.log('parent_id in first', parent_id);

        clearHiddenBlocks(parent_id);

        var blockTitle = parentBlock.find('.new-podcat');
        if(blockTitle.hasClass('red-sample')){
            blockTitle.removeClass('red-sample');
        }
        if(blockTitle.hasClass('red-sample-start')){
            blockTitle.removeClass('red-sample-start');
        }

        var sBut = $(this);
        var freeCo = $('#free').val();
        var sameBtn = null;



        var loadBlock = $('.all-blocks-wrapper').find('[data-child='+part_id+']');



        if(newCurrentFriends && typeof newCurrentFriends === 'object' && Object.keys(newCurrentFriends).length > 0) {

            for (const key in newCurrentFriends) {
                if (newCurrentFriends.hasOwnProperty(key)) {
                    //console.log('key bottom in first', key + ' - ' + newCurrentFriends[key]);

                    //clearHiddenBlocks(key);

                    // Выбор элемента с data-parent равным ключу и классом step-new-block
                    var stepBlock = $('#doc-body').find('.one-wrapper[data-parent="' + key + '"]');
                    //console.log('element', stepBlock);
                    stepBlock.find('.check-part').each(function(){
                        //console.log('.check-part step', $(this));



                        if($(this).data('part') == newCurrentFriends[key]){

                            //console.log("$(this).data('part') in first", $(this).data('part')+'-'+newCurrentFriends[key]);

                            var blockFriends = $(this).data('friends');
                            //console.log("blockFriends in first", blockFriends);

                            $(this).attr({'checked':true});
                            $(this).addClass('checked');
                            $(this).parents('.edit-podcat').addClass('checked-podcat');

                            openHiddenBlocks(blockFriends);
                        }else{
                            //$(this).attr({'checked':false});
                            $(this).removeClass('checked');
                            $(this).parents('.edit-podcat').removeClass('checked-podcat');
                        }
                    });


                }
                //console.log('key in first', key+' - '+newCurrentFriends[key]);
            }


        }

        openHiddenBlocks(newCurrentFriends);

        if(action == 'edit') {

            //replaceAllHiddenBlocks();

            saveEditedDocument();
        }
        //checkFullData();

    });

    $('.del-related-img').on('click', function () {
       var relId = $(this).data('id');
        $.ajax({
            url: '/related-contracts/delete-relation',
            type: "POST",
            data: { 'relation_id' : relId },
            dataType: 'json',
            cache: false,
            success: function(res) {
                if(res.result.status === 'ok'){
                    var relLine = $('#rel-' + relId);
                    var relParent = relLine.parents('.related-docs-wrapper');
                    var countBlocks = relParent.find('.related-one-line').length;
                    console.log('countBlocks', countBlocks);

                    if(countBlocks > 1) {
                        relLine.fadeOut(300, function () {
                            $(this).remove();
                        });
                    }else{
                        relLine.parents('.related-docs-block').fadeOut(300, function () {
                            $(this).remove();
                        });
                    }



                }
                setToast(res.result.status, res.result.text);

            }, error: function() {
                setToast('error', 'Ошибка удаления');

            }
        });
       return false;
    });

    $('.hover-show').each(function () {
        var screenWidth = $(window).width();
        var self = $(this);

        if(screenWidth > 1024 ){
            self.find('.open-line-btn').hover(function (event) {
                event.stopPropagation();
                event.preventDefault();
                self.find('.open-line-body').show();
            },
            function () {
                self.find('.open-line-body').hide();
            });
        }

    });

    // Обработчик клика по кнопке с классом .open-line-btn
    $('.open-line-btn').on('click', function(event) {

        var screenWidth = $(window).width();

        if(screenWidth <= 1024 ){
            // Предотвращение действия ссылки
            event.stopPropagation();
            event.preventDefault();



            var $currentBody = $(this).next('.open-line-body');

            // Скрыть все блоки подсказок, кроме текущего
            $('.open-line-body').not($currentBody).hide();

            // Переключить видимость текущего блока
            $currentBody.toggle();

            // Рассчитать и установить позицию для текущего блока
            if ($currentBody.is(':visible')) {

                var windowWidth = $(window).width();
                var offset = $(this).offset();
                var blockWidth = $currentBody.outerWidth();
                var newLeft = offset.left - blockWidth / 2 + $(this).outerWidth() / 2;

                if (windowWidth < 575) {
                    // Для экранов шириной менее 575px
                    var wrapperOffset = $(this).closest('.note-line-wrapper').offset().left;
                    newLeft = -wrapperOffset + 15;
                    $currentBody.css({
                        width: windowWidth - 30,
                        left: newLeft
                    });

                }
            }
        }


    });

    // Обработчик клика по кнопке закрытия подсказки
    $('.open-line-close').on('click', function(event) {
        // Предотвращение действия ссылки
        event.stopPropagation();
        event.preventDefault();

        // Скрыть блок подсказки
        $(this).closest('.open-line-body').hide();
    });

    // Скрыть все блоки подсказок при клике вне блока
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.note-line-wrapper').length) {
            $('.open-line-body').hide();
        }
    });

    $('#howEditWork .next-edit').on('click', function () {
        $('#howEditWork').modal('hide');
        $('#edit-modal-1').modal('show');
    });

    $('#howEditWork').on('hidden.bs.modal', function () {
        toggleModalStyles();
        if ($('.modal.show').length === 0) { // Проверяем, остались ли открытые модальные окна
            $('body').removeClass('modal-open').css('padding-right', '');
        }
    });

    $('#edit-modal-1 .click-edit-1').on('click', function () {
        $('#edit-modal-1').modal('hide');
        $('#edit-modal-2').modal('show');
    });

    $('#edit-modal-1').on('hidden.bs.modal', function () {
        toggleModalStyles();
        if ($('.modal.show').length === 0) { // Проверяем, остались ли открытые модальные окна
            $('body').removeClass('modal-open').css('padding-right', '');
        }
    });

    $('#edit-modal-2 .click-edit-2').on('click', function () {
        $('#edit-modal-2').modal('hide');
        $('#edit-modal-3').modal('show');
    });

    $('#edit-modal-2 .click-edit-3').on('click', function () {

        $('.qr-preloader').addClass('preloader-open');

        setOrUpdateParty();

        saveFullDoc()
            .then(function (response) {
                // Проверяем, существует ли response.id
                if (response.id) {

                    //console.log(response);
                    $('.qr-preloader').removeClass('preloader-open');
                    $('.copy-edit-link').data('target', response.url).attr('data-target', response.url);
                    $('.edit-link').text(response.url);

                    $('#qrcode').empty();

                    // Создаем QR-код из полученной ссылки
                    new QRCode(document.getElementById("qrcode"), {
                        text: response.url,
                        width: 128,
                        height: 128,
                    });

                    $('#edit-modal-2').modal('hide');

                    toggleModalStyles();

                    $('#edit-modal-4').modal('show');


                } else {
                    $('.qr-preloader').removeClass('preloader-open');
                    alert('Ошибка: ID не найден.');
                }
            })
            .catch(function (error) {
                $('.qr-preloader').removeClass('preloader-open');
                console.error('Произошла ошибка:', error);
                alert('Не удалось сохранить документ. Попробуйте еще раз.');
            });


    });

    $('#edit-modal-9 .click-edit-sogl').on('click', function () {
        $('#edit-modal-9').modal('hide');
        $('#edit-modal-10').modal('show');
    });

    $('#edit-modal-9').on('hidden.bs.modal', function () {
        toggleModalStyles();
        if ($('.modal.show').length === 0) {
            $('body').removeClass('modal-open').css('padding-right', '');
        }
    });

    $('#edit-modal-2').on('hidden.bs.modal', function () {
        toggleModalStyles();
        if ($('.modal.show').length === 0) { // Проверяем, остались ли открытые модальные окна
            $('body').removeClass('modal-open').css('padding-right', '');
        }
    });

    $('.copy-edit-link').on('click', function () {

        var targetValue = $(this).data('target');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(targetValue)
                .then(() => {
                    console.log('Текст успешно скопирован через navigator.clipboard');
                    setToast('ok', 'Ссылка скопирована', 'Ссылка');
                })
                .catch((err) => {
                    console.error('Ошибка при копировании через clipboard API:', err);
                    setToast('error', 'Ошибка копирования');
                });
        } else {
            console.error('Clipboard API недоступен');
            setToast('error', 'Clipboard API не поддерживается вашим браузером');
        }
    });


    if(action == 'edit') {
        replaceAllHiddenBlocks();

        setDadtapicker();

        reloadAsitor();

        getLongField();
    }


    $('.edit-open-title').click(function () {
       if($(this).hasClass('info-open')){
           $('.edit-open-body').slideUp(300);
           $(this).removeClass('info-open');
       } else{
           $('.edit-open-body').slideDown(300);
           $(this).addClass('info-open');
       }
    });


    $('.get-one-doc').on('click', function () {
       var orderId = $(this).data('id');
       var modalUrl = "/orders/unblock-order/"+orderId+"/back";
       $('.set-modal-link').attr('href', modalUrl);
    });

    $(document)
        .off('same:sync.same')
        .on('same:sync.same', function (e, payload) {

            window.__SAME_CACHE__ = payload || {};

            window.__SAME_LAST__ = payload || null;

            var action = $('#action').val();
            if (action != 'edit') {
                var self1 = $('#doc-body');
                if (self1.length) {
                    getSame(self1);
                    setSameSelect();
                    getIco();

                    setDadtapicker();
                }
            }
        });


});

function clearHiddenBlocks(parent_id) {
    var docBody = $('#doc-body');
    var parentBlock = docBody.find('.one-wrapper[data-parent='+parent_id+']');

    //console.log('parentBlock in function parent_id', parent_id);
    //console.log('parentBlock in function clearHiddenBlocks', parentBlock);

    parentBlock.find('.check-part').each(function () {
        var friendsInBlock = $(this).data('friends');

        //console.log('elem friends in function clearHiddenBlocks', friendsInBlock);

        if(friendsInBlock && typeof friendsInBlock === 'object' && Object.keys(friendsInBlock).length > 0){
            for (const key in friendsInBlock) {
                if (friendsInBlock.hasOwnProperty(key)) {
                    //console.log('key in function clearHiddenBlocks', key); // Выводит ключ
                    //console.log('Значение in function clearHiddenBlocks', friendsInBlock[key]); // Выводит значение

                    var dopBlock = docBody.find('.one-wrapper[data-parent='+key+']');
                    dopBlock.find('.check-part').each(function () {
                        var childFriensInBlock = $(this).data('friends');
                        //console.log('dopBlock .check-part in function clearHiddenBlocks', $(this).data('friends'));
                        if(childFriensInBlock && typeof childFriensInBlock === 'object' && Object.keys(childFriensInBlock).length > 0){
                            for (const childParentKey in childFriensInBlock) {
                                clearBlockHtml(childParentKey);
                            }
                        }
                    });


                    clearBlockHtml(key);

                }
            }
            //console.log('elem friens', $(this).data('friends'));
        }

    });
}

function clearBlockHtml(block_id) {
    var docBody = $('#doc-body');
    if(docBody.find('.one-wrapper[data-parent='+block_id+']').find('.step-new-block').hasClass('step-hidden-block')){
        docBody.find('.one-wrapper[data-parent='+block_id+']').html('');
    }
}

function openHiddenBlocks(friendsObject) {

    //console.log('friendsObject in function openHiddenBlocks', friendsObject);
    var action = $('#action').val();
    if(action == 'edit'){
        var creator = $('#creator').val();
    }
    if(friendsObject && typeof friendsObject === 'object' && Object.keys(friendsObject).length > 0) {
        //console.log('deepCopy tut in function openHiddenBlocks');
        for (const key in friendsObject) {

            const documentWrapper = document.querySelector('#doc-body');
            const hiddenButtonsBlock = document.querySelector('.hidden-blocks-wrapper');
            const hiddenTextBlock = document.querySelector('.all-blocks-wrapper');

            //console.log('search key in function openHiddenBlocks', key);
            //console.log('checked button in function openHiddenBlocks', friendsObject[key]);
            const original = hiddenButtonsBlock.querySelector('#quest-' + key);
            const documentNewBlockWrapper = documentWrapper.querySelector('#doc-body .one-wrapper[data-parent="' + key + '"]');
            //console.log('original in function openHiddenBlocks', original);

            const newBlockTextWrapper = hiddenTextBlock.querySelector('.single-part[data-child="' + friendsObject[key] + '"]');

            const newBlockText = newBlockTextWrapper ? newBlockTextWrapper.innerHTML : '';

            //console.log('newBlockText in function openHiddenBlocks', newBlockText); // Тут еще верно

            if (original) {
                var deepCopy = original.cloneNode(true);

                //console.log('deepCopy in function openHiddenBlocks', deepCopy);

                var clonedButtons = deepCopy.querySelector('.step-new-block');

                var clonedText = deepCopy.querySelector('.single-part');


                if (clonedText && clonedText.hasAttribute('data-child')) {
                    // Меняем значение атрибута
                    clonedText.setAttribute('data-child', friendsObject[key]);
                }
                //console.log('clonedText in function openHiddenBlocks', clonedText);
                if(clonedText) {
                    clonedText.innerHTML = newBlockText;
                }
                var newTextBlock = clonedText ? clonedText.outerHTML : '';

                //console.log('newTextBlock in function openHiddenBlocks', newTextBlock); // и тут верно

                if(clonedButtons) {
                    //console.log('tut');
                    //console.log('clonedButtons', clonedButtons);
                    var allInputsBtns = clonedButtons.querySelectorAll('input[type="radio"]');

                    allInputsBtns.forEach(function (elem) {
                        var parentValue = elem.getAttribute('data-parent');
                        var partValue = elem.getAttribute('data-part');
                        const parent = elem.closest('.edit-podcat');

                        // Проверяем, есть ли соответствие в объекте friendsObject
                        if (friendsObject.hasOwnProperty(parentValue)) {
                            if (friendsObject[parentValue] === partValue) {

                                // Устанавливаем checked, если значение совпадает
                                //elem.checked = true;
                                //elem.classList.add('checked');
                                elem.setAttribute('checked', 'checked'); // Устанавливаем атрибут checked

                                $('#pod_'+partValue+'_'+parentValue).prop('checked', 'checked');

                                const $wrapper = $('.one-wrapper[data-parent='+parentValue+']'); // Родительский блок

                                if(action == 'edit'){
                                    var originalValue = $wrapper.data('original-radio');
                                    //console.log('originalValue in hidden', originalValue);
                                    //console.log('checked value in hidden', 'pod_'+partValue+'_'+parentValue);
                                    if(!creator){
                                        if(originalValue == 'pod_'+parentValue+'_'+partValue){
                                            parent.classList.remove('checked-by-user');
                                        }else{
                                            parent.classList.add('checked-by-user');
                                        }

                                    }else{
                                        parent.classList.remove('checked-by-user');
                                        $wrapper.data('original-radio', 'pod_'+parentValue+'_'+partValue).attr('data-original-radio', 'pod_'+parentValue+'_'+partValue); // Меняем ID выбранного радио
                                    }
                                }


                            } else {

                                // Снимаем checked, если значение не совпадает
                                //elem.checked = false;
                                elem.removeAttribute('checked'); // Убираем атрибут checked

                                elem.classList.remove('checked');

                                $('#pod_'+partValue+'_'+parentValue).prop('checked', false);
                            }
                        } else {

                            // Если parentValue нет в friendsObject, снимаем checked
                            //elem.checked = false;
                            elem.removeAttribute('checked'); // Убираем атрибут checked
                            elem.classList.remove('checked');

                            $('#pod_'+partValue+'_'+parentValue).prop('checked', false);
                        }

                        var name = elem.getAttribute('name');

                        // Удаляем первый символ из строки
                        if (name && name.length > 0) {
                            var newName = name.substring(1);
                            // Устанавливаем новое значение атрибута 'name'
                            elem.setAttribute('name', newName);
                        }

                        var oldId = elem.getAttribute('id');

                        // Удаляем первый символ из строки
                        if (oldId && oldId.length > 0) {
                            var newId = oldId.substring(1);
                            // Устанавливаем новое значение атрибута 'name'
                            elem.setAttribute('id', newId);
                        }


                    });
                    //console.log('newTextBlock 1 in function openHiddenBlocks', newTextBlock);
                    newTextBlock = clonedButtons.outerHTML+newTextBlock;
                    //var newOneBlock = clonedButtons.find('.new-one-block');

                }



                if (documentNewBlockWrapper) {
                    //console.log('point openHiddenBlocks');
                    documentNewBlockWrapper.innerHTML = newTextBlock;
                    //console.log('point openHiddenBlocks text', newTextBlock);
                    //console.log('point openHiddenBlocks wrapper for text', documentNewBlockWrapper);
                    //replaceAllHiddenBlocks();

                } else {
                    console.error('Element not found: .one-wrapper[data-parent="' + key + '"]');
                }

            }


        }

    }
}

function setOprosnik(){

    var self2 = $('#doc-body');


    self2.find('.one-wrapper').each(function (){
        var self = $(this);

        var ndstsParent = self.data('parent');

        self.on('click', '.check-part', function(e){

            if($(this).hasClass('checked')){
                return false;
            }

            var suid = $('#suid').val();

            var action = $('#action').val();

            var parent_id = $(this).data('parent');
            var part_id = $(this).data('part');
            var hiddenCurrentBlocks = $(this).data('friends');

            var sBut = $(this);
            var freeCo = $('#free').val();
            var sameBtn = null;
            var otherSame = [];
            if($(this).hasClass('has-same')){
                sameBtn = $(this).data('same');
                $(this).parents('.new-one-block').find('.has-same').each(function () {
                    if($(this).data('same') !== sameBtn) {
                        //console.log("$(this).data('same')", $(this).data('same'));
                        otherSame.push($(this).data('same'));
                    }
                });

            }

            var loadBlock = $('.all-blocks-wrapper .single-part[data-child="' + part_id + '"]');


            var setBlock = false;
            if(loadBlock.length){
                var newBlock = loadBlock.clone();

                var html = newBlock.html();
                var cleanedHtml = html.trim();

                $('.change-panel').find('.single-part[data-parent='+parent_id+']').html(cleanedHtml);

                setDadtapicker();

                if(action != 'edit') {
                    setSameSelect();
                }

                getLongField();
                getIco();
                getDateIco();
                reNumberAll();
                reNumberFull();
                setSearchClass();
                removeAllPreloaders();
                hoverBth();
                hoverUslovie();
                //hoverField();
                setEditedTitle();
                setEditedBtnTitle();
                //setSelfShare();
                setSelfEvents();
                setBlock = true;
            }


            $(this).parents('.step-new-block').find('.check-part').each(function(){
                if($(this).data('part') == part_id){

                    $(this).attr({'checked':true});
                    $(this).addClass('checked');
                    $(this).parents('.edit-podcat').addClass('checked-podcat');

                }else{
                    $(this).attr({'checked':false});
                    $(this).removeClass('checked');
                    $(this).parents('.edit-podcat').removeClass('checked-podcat');
                }
            });


            if($(this).hasClass('clear-hidden')){

                var hAttr = String($(this).data('hidden')).split(',');
                //console.log(hAttr);
                $.each(hAttr, function(index,value){
                    //clearHiddenBlock(value);
                });
            }

            //clearDopBlock(parent_id);

            var check = false;
            var checkbox = false;
            if($(this).data('check')){
                check = $(this).prop("checked");
                checkbox = true;

            }
            //alert('asdasdasd');
            checkFullData();

            var elapsedMs = Date.now() - (window.__docOpenedAt || Date.now());

            var docStateJson = JSON.stringify(window.__DOC_SESSION_DOG || {});

            $.ajax({
                type: "POST",
                url: "/Contracts/getPart",
                dataType: "json",
                data: {
                    'parent' : parent_id,
                    'new_part' : part_id,
                    'checkbox' : checkbox,
                    'check_res' : check,
                    'free' : freeCo,
                    'sameBtn': sameBtn,
                    'otherSame': otherSame,
                    'type': 'total',
                    'action': action,
                    'suid' : suid,
                    'elapsed_ms': elapsedMs,
                    'doc_state_json': docStateJson
                },
                error: function () {
                    alert( "При выполнении запроса произошла ошибка. Возможно, проблема с подключением. Перезагрузите пожалуйста страницу." );
                },
                success: function ( data ) {

                    /*if(action == 'edit') {
                        return true;
                    }*/

                    if(action == 'edit') {
                        replaceAllHiddenBlocks();
                    }

                    if(data.inn == 'yes'){

                        var inn_block = $('.block-inn-default').html();
                        if(action != 'edit') {

                            if (!setBlock) {
                                $('.change-panel').find('[data-parent=' + data.put_id + ']').addClass('hasInn').html(data.put_part.body).attr('data-child', data.put_part.questionnaire_id).prepend(inn_block);
                            } else {
                                $('.change-panel').find('[data-parent=' + data.put_id + ']').addClass('hasInn').attr('data-child', data.put_part.questionnaire_id).prepend(inn_block);
                            }
                        }


                        $('.change-panel').find('[data-parent='+data.put_id+']').find('.ch-field:contains("Наименование Стороны")').addClass('companyName');
                        $('.change-panel').find('[data-parent='+data.put_id+']').find('.ch-field:contains("Юридический адрес")').addClass('yurAddress');
                        $('.change-panel').find('[data-parent='+data.put_id+']').find('.ch-field:contains("ОГРН")').addClass('ogrn');
                        $('.change-panel').find('[data-parent='+data.put_id+']').find('.ch-field:contains("ИНН")').addClass('inn');
                        $('.change-panel').find('[data-parent='+data.put_id+']').find('.ch-field:contains("КПП")').addClass('kpp');
                        $('.change-panel').find('[data-parent='+data.put_id+']').find('.ch-field:contains("Фамилия и инициалы")').addClass('basicName');



                    }else{
                        if(!setBlock){
                            //$('.change-panel').find('.single-part[data-parent='+data.put_id+']').removeClass('hasInn').html(data.put_part.body).attr('data-child', data.put_part.questionnaire_id);
                        }else{
                            //$('.change-panel').find('.single-part[data-parent='+data.put_id+']').removeClass('hasInn').attr('data-child', data.put_part.questionnaire_id);
                        }

                        if(action != 'edit') {

                            $('.change-panel').find('.step-dop-block[data-parent=' + data.put_id + ']').attr('data-child', data.put_part.questionnaire_id);
                            $('.change-panel').find('.step-new-block[data-parent=' + data.put_id + ']').attr('data-child', data.put_part.questionnaire_id);
                        }


                        if(action != 'edit') {

                            if ($("div").is("#self_" + data.put_part.questionnaire_id)) {
                                var editorId = "#self_" + data.put_part.questionnaire_id;
                                getAsitor(editorId);

                            }
                        }else{
                            reloadAsitor();
                        }

                    }
                    //hiddenArr
                    if(action != 'edit') {

                        if(data.commArr != null){
                            $.each(data.commArr, function(index,value){

                                $('.change-panel').find('.single-part[data-parent='+value.parent_id+']').removeClass('hasInn').html(value.body).attr('data-child', value.child_id);
                                $('#pod_'+value.parent_id+'_'+value.child_id).prop('checked','checked');
                            });

                        }


                        if (data.set_opros != null) {
                            $('.one-wrapper[data-parent=' + parent_id + ']').append(data.set_opros);
                        }
                        if (data.set_dopbody != null) {
                            $('.one-wrapper[data-parent=' + parent_id + ']').append(data.set_dopbody);
                        }
                    }

                    if(action != 'edit') {
                        if (data.hiddenArr != null) {
                            var dHidden = [];
                            $.each(data.hiddenArr, function (index, value) {
                                dHidden.push(value.parent_id);
                            });

                            self.find('.check-part').addClass('clear-hidden').attr('data-hidden', dHidden);
                        }
                    }

                    if(action != 'edit') {
                        getAllSame();
                    }
                    //console.log('point getPart ajax end');
                    if(action == 'edit') {
                        replaceAllHiddenBlocks();
                    }

                    setAllSelfSame();
                    setDadtapicker();

                    self.find('.sh-text').each(function(){
                        var self1 = $(this);
                        self1.hover(function(){
                                var shTop = self1.offset().top;
                                $('.sh-text-info').css({'top':shTop-50, width:$('.container').width()-30, 'left':$('.podscazca-doc').offset().left+45}).show();
                            },
                            function(){
                                $('.sh-text-info').hide().css({'top':0});
                            });
                    });

                    //changeButtonsBlock();
                    checkFullData();

                    setSameSelect();
                    getLongField();
                    getIco();
                    getDateIco();
                    reNumberAll();
                    reNumberFull();
                    setSearchClass();

                    removeAllPreloaders();

                    hoverBth();
                    hoverUslovie();
                    //hoverField();

                    setEditedTitle();
                    setEditedBtnTitle();

                    //setSelfShare();
                    setSelfEvents();

                    if(action == 'edit') {
                        replaceAllHiddenBlocks();
                    }

                    recalcAllNds();

                }

            });


        });

    });

}

function setSelfShare() {
    $('body').find('.req-all').each(function () {
        $(this).hover(onIn, onOut);
        $(this).click(function () {

            var self = $(this);
            var questId = self.parents('.one-wrapper').data('parent');
            var text = self.parents('.one-wrapper').find('.my-fieald').text();
            var fullText = self.parents('.one-wrapper').find('.my-fieald').html();
            var oldText = self.parents('.one-wrapper').find('.my-fieald').data('old');

            if(text !== oldText){
                self.parent().append('<div class="pre-btn"><img src="/img/preloader.svg" alt="" /></div>');
                var contractId = $('#doc-body').data('coid');

                $.ajax({
                    url: '/SelfBlocks/add-share',
                    type: "POST",
                    data: { 'contract_id' : contractId, 'questionnaire_id' : questId, 'body' : fullText, 'share' : '1' },
                    dataType: 'json',
                    cache: false,
                    success: function(res) {
                        self.parent().find('.pre-btn').remove();
                        if(res.result){
                            self.parent().append('<div class="pre-result"><img src="/img/accept_1.svg" alt="" /></div>');
                        }else{
                            self.parent().append('<div class="pre-result"><img src="/img/accept_1-1.png" alt="" /></div>');
                        }
                        self.parent().find('.pre-result').delay(3000).animate({'opacity': 0}, 500, function () {
                            $(this).remove();
                        });
                        return true;
                    }, error: function() {
                        self.parent().append('<div class="pre-result"><img src="/img/accept_1-1.png" alt="" /></div>');
                        return true;
                    }
                });

            }

        });
    });
}

function normalizeFieldMeta($root) {
    $root.find('.ch-field').each(function () {
        var $field = $(this);

        var $same = $field.find('.same-field:first');
        var $help = $field.find('.help-field:first');

        var same = $same.length ? $.trim($same.text()) : '';
        var help = $help.length ? $.trim($help.text()) : '';

        if (same) {
            $field.attr('data-same', same).data('same', same);
        }

        if (help) {
            $field.attr('data-help', help).data('help', help);
        }

        $same.remove();
        $help.remove();
    });
}

// Функция которая отработает при наведении курсора на элемент
function onIn() {
    let newElem = $('<div class="req-note"><span class="pl-req-before"></span><span class="pl-req-note">Помогите улучшить документ своим предложением. Персональные данные не будут опубликованы.</span></div>');
    $(this).parent().append(newElem);
}
// Функция которая отработает при выходе курсора за элемент
function onOut() {
    $(this).parent().find('.req-note').remove();
}

function setSelfEvents(){
    $('.single-part').each(function(){
        var self = $(this);

        self.on('click', '.failres', function(){

            $(this).delay(2500).addClass('saved-self').text('Сохранено');
            $(this).parents('.self-var').find('.my-fieald').addClass('saved-textarea');

        });
        //var oldText = self.parents('.one-wrapper').find('.my-fieald').data('old');
        self.on('focus', '.my-fieald', function(){
            if($(this).text() === $(this).data('old')){
                $(this).html('');
            }
        });

        self.on('focusout', '.my-fieald', function(){
            if($(this).text() === ''){
                $(this).html($(this).data('old'));
            }else{
                var nAttr = $(this).data('same');
                setSame(self, $(this).text(), nAttr);
            }
        });

        self.on('input', '.my-fieald', function(){
            if(self.find('.failres').hasClass('saved-self')){
                $(this).removeClass('saved-textarea');
                self.find('.failres').removeClass('saved-self').text('Сохранить');
            }
        });

        self.on('click', '.toolbar-bold', function(){
            document.execCommand('bold', false, null);
            return false;
        });

        self.on('click', '.toolbar-italic', function(){
            document.execCommand('italic', false, null);
            return false;
        });

    });
}

function removeDatepicker($root = $(document)){
    $root.find('.date-f').each(function () {
        $(this).removeClass('hasDatepicker').removeAttr('id');
    });
}

window.__SAME_DATEPICKER_WAITING__ = window.__SAME_DATEPICKER_WAITING__ || false;

function setDadtapicker(){

    if (window.__SAME_SYNC_PENDING__) {
        if (!window.__SAME_DATEPICKER_WAITING__) {
            window.__SAME_DATEPICKER_WAITING__ = true;
            $(document).one('same:sync', function () {
                window.__SAME_DATEPICKER_WAITING__ = false;
                setDadtapicker();
            });
        }
        return;
    }

    var self = $('#doc-body');
    var action = $('#action').val();

    if(action == 'edit') {
        var creator = $('#creator').val();
    }
    // Создаём наблюдателя для отслеживания изменений атрибута id
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'id' && !$(mutation.target).hasClass('observed')) {
                //$(mutation.target).addClass('observed');
                //console.log('ID attribute changed or added:', mutation.target);
            }
        });
    });

    self.find('.datepicker1').each(function(index) {

        // Подключаем наблюдателя к текущему элементу
        //observer.observe(this, { attributes: true });

        // Удаляем ID, если он есть
        if ($(this).attr('id')) {
            //console.log(`Removing unexpected ID: ${$(this).attr('id')}`);
            $(this).removeAttr('id');
        }

        // Удаляем старую инициализацию, если есть
        if ($(this).hasClass('hasDatepicker')) {
            if ($(this).data('datepicker')) {
                //console.log('Destroying existing datepicker for:', $(this));
                $(this).datepicker('destroy').removeClass('hasDatepicker');
            }
        }

        // Работа с элементами внутри .my-dates
        if(action != 'edit') {
            self.find('.my-dates').each(function () {

                var same = $(this).data('same');
                var wSame = window.getSameValue(same);

                if (wSame !== undefined && wSame !== null && String(wSame).trim() !== '') {
                    $(this).find('.date-f').val(wSame).attr('value', wSame).addClass('ch-color');

                    getLong($(this).find('.date-f'), 11);
                    getDateIco();

                }
            });
        }

        // Удаляем ID перед самой инициализацией
        if ($(this).attr('id')) {
            //console.log(`Removing ID again before datepicker initialization: ${$(this).attr('id')}`);
            $(this).removeAttr('id');
        }

        if (!$(this).data('datepicker')) {
            // Инициализация datepicker
            $(this).datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: "dd.mm.yy",
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "flipfit"
                }
            }).on("change", function() {

                //console.log('Date changed:', $(this).val());

                if ($(this).length) {
                    $(this).addClass('ch-color');

                    var newMyDate = $(this).val();
                    var nAttr = $(this).parent().data('same');

                    $(this).attr('value', newMyDate);

                    if (nAttr !== undefined && nAttr !== null) {
                        if(action != 'edit'){

                            var documentId = parseInt($('#document').val() || window.DOCUMENT_CONTRACT_ID || '0', 10);

                            if (window.SameStorage) {
                                // Если даты "глобальные" (как было в localStorage):
                                SameStorage.patchDebounced(String(nAttr), newMyDate);

                                // Если надо, чтобы дата была и глобальная, и привязанная к документу:
                                // SameStorage.patchBothDebounced(String(nAttr), documentId + '_' + String(nAttr), newMyDate);
                            }

                        }

                        $('.my-dates[data-same="' + nAttr + '"]').each(function() {
                            if(action == 'edit'){
                                if(creator){
                                    $(this).find('.date-f').val(newMyDate).attr('value', newMyDate).addClass('ch-color').removeClass('user-edit-field');
                                }else{
                                    $(this).find('.date-f').val(newMyDate).attr('value', newMyDate).addClass('ch-color user-edit-field');
                                }
                            }else{
                                $(this).find('.date-f').val(newMyDate).attr('value', newMyDate).addClass('ch-color').removeClass('user-edit-field');
                            }

                            getLongField();
                            //getDateIco();
                        });
                    }

                    if(action == 'edit'){

                        // console.log('creator in date', creator);
                        //var originalValue = $(this).find('.date-f').data('original');
                        var originalValue = $(this).data('original');
                        if(originalValue != newMyDate && !creator){
                            $(this).addClass('user-edit-field');
                        }else{
                            $(this).removeClass('user-edit-field');
                        }

                    }

                    getDateIco();

                    if(action == 'edit'){
                        saveEditedDocument();
                    }

                }
            });
        }

    });

}

function setAllEvnts() {

}

function getLong(obj, wi){
    //console.log(obj);
    var strLenth = obj.val().length;
    //console.log('strLenth', strLenth);
    var longField = strLenth*wi;
    longField = longField.toFixed();
    obj.css({'width':longField});
}

function getLongField(){

    $('.co-select').each(function(){
        adjustSelectWidth($(this));
    });

    adjustWidth();

}

function adjustSelectWidth($select) {
    // Получаем текст выбранного <option>
    var selectedText = $select.find('option:selected').text();

    // Создаем скрытый <span> для измерения ширины текста
    var $span = $('<span>').css({
        'visibility': 'hidden', // Скрываем элемент
        'white-space': 'nowrap', // Отключаем переносы
        'font-size': $select.css('font-size'), // Используем стили <select>
        'font-family': $select.css('font-family') // Используем шрифт <select>
    }).text(selectedText).appendTo('body'); // Временно добавляем в DOM

    // Измеряем ширину текста
    var newWidth = $span.width();
    $span.remove(); // Удаляем временный элемент

    // Устанавливаем ширину <select>, добавляя место для стрелки
    $select.css('width', (newWidth + 30) + 'px'); // 20px — запас для стрелки и отступов
}

function adjustWidth() {

    $('.date-f').each(function(){
        var text = $(this).val();

        var test = $('<span>').hide().appendTo(document.body);

        test.text(text).css({
            fontSize: $(this).css('fontSize'),
            fontFamily: $(this).css('fontFamily'),
            fontWeight: $(this).css('fontWeight'),
            letterSpacing: $(this).css('letterSpacing'),
            whiteSpace: 'pre'
        });

        var width = test.width();
        test.remove();
        $(this).width(width);

    });
}

function countBackHeight(){
    if($('#doc-body').length){
        var leftPos = $('#doc-body').offset().left;
        //var rightPos = $('.news-dop-wrapper').offset().left;
        var leftFone = leftPos - $('.sidebar-freez').width();
        var rightWidth = $('.news-dop-wrapper').innerWidth();


        var topHeight = $('.finish-block').innerHeight();
        var bottomHeight = $('.hot-wrapper').innerHeight();
        var bottomPos = $('.finish-block').innerWidth();



        $('.left-fon').css({'right':bottomPos-1,'width':leftFone});
        $('.top-fon').css({'right':bottomPos-1,'width':leftFone});
        $('.bottom-fon').css({'right':bottomPos-1,'width':leftFone});
        $('.pril-fon').css({'right':bottomPos-1,'width':leftFone});
    }

}

function clearInn(){
    $('.single-part').each(function(){
        $(this).find('.inn-block-find').remove();
    });
}

function clearSelect($root = $('#doc-body')){
    $root.find('.co-choise').each(function(){
        var self = $(this);
        var choisen = self.find('.co-select option:selected').text();

        self.text(choisen);
    });

    $root.find('.my-dates').each(function(){
        var self = $(this);
        var chDate = self.find('.date-f').val();

        if(self.find('.date-f').hasClass('ch-color')){
            self.addClass('yes-field user_edit');
        }

        self.text(chDate).addClass('ch-field');
    });
}

function clearSelf(preview = false, $root = $('#doc-body')){
    var countBlocks = 1;

    $root.find('.self-var').each(function(){
        var $selfVar = $(this);

        var defaultText = $selfVar.find('.my-fieald').html();
        var selfText = '';

        var selfNumber = '';

        selfNumber = $selfVar.parent().find(".selfnumber").html();

        if(!selfNumber){
            selfNumber = '';
        }

        var countP = 0;
        $selfVar.find('p').each(function(){

            var attr = $(this).attr('style');
            var setAttr = 'style="text-align: justify;"';
            if (typeof attr !== typeof undefined && attr !== false) {
                setAttr = 'style="'+$(this).attr('style')+'"';
            }

            var pStr = $(this).html();
            if(countP == 0){
                selfText = '<p '+setAttr+'>'+selfNumber+' '+pStr+'<p>';
                countP++;
            }else{

                if(pStr != ''){
                    selfText = selfText+'<p '+setAttr+'>'+pStr+'<p>';
                    countP++;
                }
            }

        });

        if(countP == 0){
            if(selfNumber){
                selfText = '<p>'+selfNumber+' '+$selfVar.find('.my-fieald').html()+'<p>';
            }else{
                selfText = '<p>'+$selfVar.find('.my-fieald').html()+'<p>';
            }
        }

        if($selfVar.find('.my-fieald').text() !== $selfVar.find('.my-fieald').data('old') ){
            $selfVar.parent().find(".selfnumber").remove();
            $selfVar.html(selfText);

            // contract_id берем из root, чтобы preview-клоны не тянули реальный #doc-body
            var contract_id = $root.data('coid');

            if(!preview) {
                $.ajax({
                    url: '/SelfBlocks/add',
                    type: "POST",
                    data: {'contract_id': contract_id, 'number': countBlocks, 'body': selfText},
                    dataType: 'json',
                    cache: false,
                    success: function (res) {
                        return true;
                    }, error: function (res) {
                        return true;
                    }
                });
            }

        }else{
            $selfVar.html('');
        }

        countBlocks = countBlocks+1;
    });
}

function clearText($root = $('#doc-body')){

    $root.find('.note-wrapper').each(function(){
        $(this).remove();
    });

    $root.find('.step-new-block').each(function(){
        $(this).remove();
    });

    $root.find('.ch-field').each(function(){
        if(!$(this).hasClass('yes-field')){

            var strText = $(this).text();

            $(this).html('<span style="text-decoration: underline">'+strText+'</span>');
        }

    });

    $root.find('.w-ico').remove();
}

function cleanDocBody() {
    var content = $('#doc-body').html(); // Получаем HTML содержимое
    if (content) {
        // Удаляем неразрывные пробелы, лишние пробелы, пустые теги и лишние символы
        content = content.replace(/&nbsp;/g, ' ') // Заменяем неразрывные пробелы обычными пробелами
            .replace(/\s+/g, ' ')    // Заменяем последовательности пробелов одним пробелом
            .replace(/>\s+</g, '><') // Убираем пробелы между HTML тегами
            .replace(/<[^>]+>\s*<\/[^>]+>/g, '') // Удаляем пустые HTML элементы
            .trim();                // Убираем пробелы в начале и конце текста

        // Устанавливаем очищенное содержимое обратно в #doc-body
        $('#doc-body').html(content);
    }
}

function getAsitor(e){

    var self = $('#doc-body');
    self.find(e).easyEditor({
        //buttons: ['bold', 'italic', 'h2', 'h3', 'h4', 'alignleft', 'aligncenter', 'alignright', 'x', 'source'],
        buttons: ['bold', 'italic', 'alignleft', 'aligncenter', 'alignright'],
        buttonsHtml: {
            'bold': '<img class="firstbtn" src="/img/red_1.svg" alt=""/><img class="scndbtn" src="/img/red_11.svg" alt=""/>',
            'italic': '<img class="firstbtn" src="/img/red_2.svg" alt=""/><img class="scndbtn" src="/img/red_21.svg" alt=""/>',
            'link': '<i class="fas fa-link"></i>',
            'header-2': '<i class="fas fa-heading"></i>2',
            'header-3': '<i class="fas fa-heading"></i>3',
            'header-4': '<i class="fas fa-heading"></i>4',
            'align-left': '<img class="firstbtn" src="/img/red_3.svg" alt=""/><img class="scndbtn" src="/img/red_31.svg" alt=""/>',
            'align-center': '<img class="firstbtn" src="/img/red_4.svg" alt=""/><img class="scndbtn" src="/img/red_41.svg" alt=""/>',
            'align-right': '<img class="firstbtn" src="/img/red_5.svg" alt=""/><img class="scndbtn" src="/img/red_51.svg" alt=""/>',
            'quote': '<i class="fas fa-quote-left"></i>',
            'code': '<i class="fas fa-code"></i>',
            'remove-formatting': '<i class="fas fa-ban"></i>'
        }
    });

}

function getAllAsitor(){

    $('.self-var').each(function(){
        self = $(this);
        var selfId = '#self_'+self.parent().data('child');
        getAsitor(selfId);

    });
}

function reloadAsitor(){

    $('#doc-body').each(function(){
        var self = $(this);

        self.find('.self-var').each(function(){
            var self1 = $(this);
            var selfId = self1.find('.my-fieald').attr('id');
            var selfText = self1.find('.my-fieald').html();

            if(self1.find('.my-fieald').hasClass('user-edit-field')){
                self1.html('<div class="my-fieald user-edit-field" id="'+selfId+'">'+selfText+'</div><div class="failres-wrap"><div class="failres">Сохранить</div><div class="req-wrap"><div class="req-all">Сгенерировать с ИИ</div></div></div>');
            }else{
                self1.html('<div class="my-fieald" id="'+selfId+'">'+selfText+'</div><div class="failres-wrap"><div class="failres">Сохранить</div><div class="req-wrap"><div class="req-all">Сгенерировать с ИИ</div></div></div>');
            }

            var maxLimit = window.USER_AI_REQUESTS_LIMIT || initialLeft;

            // Добавить служебный блок, если его нет
            if (self1.find('.ai-meta').length === 0) {
                var initialLeft = self1.data('requests-left');

                var metaHtml =
                    '<div class="ai-meta">' +
                    '  <div class="ai-requests-left"><img src="/img/ico-50-1.svg" alt="" width="24" height="24"><div class="ai-requests-in"><strong>Доступно запросов:</strong> <span>' + initialLeft + '</span>/'+ maxLimit +'</div></div>' +
                    '  <div class="ai-warning" style="display:none;"><img src="/img/ico-24.svg" alt="" width="24" height="24"><div class="ai-requests-in"><strong>Внимание:</strong> текст сгенерирован ИИ и требует проверки юристом.</div></div>' +
                    '  <div class="ai-note" style="display:none;"></div>' +
                    '</div>';
                self1.append(metaHtml);
            }

            getAsitor('#'+selfId);

        });


    });


}

function clearPdfText($root = $('#doc-body')){

    $root.find('.note-wrapper').each(function(){
        $(this).remove();
    });

    $root.find('.step-new-block').each(function(){
        $(this).remove();
    });

    $root.find('.ch-field').each(function(){
        if(!$(this).hasClass('yes-field')){

            var strText = $(this).text();
            $(this).text(strText.replace(/./g,'_'));

            //$(this).remove();<u><ins>
        }
    });

    $root.find('.w-ico').remove();
}

var parseNumber = function(){
    var dictionary = [
        [ "", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять",
            "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать",
            "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать" ],
        [ "", "десять", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто" ],
        [ "", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот" ],
        [ "тысяч|а|и|", "миллион||а|ов", "миллиард||а|ов", "триллион||а|ов" ]
    ];
    function getNumber(number, limit){
        var temp = number.match(/^\d{1,3}([,|\s]\d{3})+/);
        if(temp) return temp[0].replace(/[,|\s]/g, "");
        temp = Math.abs( parseInt(number) );
        if( temp !== temp || temp > limit ) return null;
        return String(temp);
    };
    function setEnding(variants, number){
        variants = variants.split("|");
        number = number.charAt( number.length - 2 ) === "1" ? null : number.charAt( number.length - 1 );
        switch(number){
            case "1":
                return variants[0] + variants[1];
            case "2": case "3": case "4":
                return variants[0] + variants[2];
            default:
                return variants[0] + variants[3];
        };
    };
    function getPostfix(postfix, number){
        if( typeof postfix === "string" || postfix instanceof String ){
            if( postfix.split("|").length < 3 ) return " " + postfix;
            return " " + setEnding(postfix, number);
        };
        return "";
    };

    return function(number, postfix){
        if(typeof number === "undefined")
            return "999" + new Array(dictionary[3].length + 1).join(" 999");
        number = String( number );
        var minus = false;
        number.replace(/^\s+/, "").replace(/^-\s*/, function(){
            minus = true;
            return "";
        });
        number = getNumber(number, Number( new Array(dictionary[3].length + 2).join("999") ));
        if(!number) return "";
        postfix = getPostfix(postfix, number);
        if(number === "0") return "ноль" + postfix;
        var position = number.length, i = 0, j = 0, result = [];
        while(position--){
            result.unshift( dictionary[ i++ ][ number.charAt(position) ] );
            if(i === 2 && number.charAt(position) === "1" )
                result.splice(0, 2, dictionary[0][ number.substring( position, position + 2 ) ]);
            if(i === 3 && position !== 0 ){
                i = 0;
                if( position > 3 && number.substring( position - 3, position ) === "000" ){
                    j++; continue;
                };
                result.unshift( setEnding(dictionary[3][j++], number.substring( 0, position )) );
            };
        };
        //position = result.length - 5;
        position = 0;
        //console.log('dictionary', dictionary);
        //console.log('result', result);
        // Проверка и замена для "тысяч"
        if (result[1] === "тысяча" || result[1] === "тысячи") {
            //console.log('result[position]', result[position]);
            switch (result[position]) {
                case "один":
                    result[position] = "одна"; // Для тысяч: одна тысяча
                    break;
                case "два":
                    result[position] = "две"; // Для тысяч: две тысячи
                    break;
            }
        }

        if(minus) result.unshift("минус");
        return result.join(" ").replace(/\s+$/, "").replace(/\s+/g, " ") + postfix;
    };
}();

var parseWord = function(){
    function setEnding(variants, number){
        variants = variants.split("|");
        number = number.charAt( number.length - 2 ) === "1" ? null : number.charAt( number.length - 1 );
        switch(number){
            case "1":
                return variants[0] + variants[1];
            case "2": case "3": case "4":
                return variants[0] + variants[2];
            default:
                return variants[0] + variants[3];
        };
    };
    function getPostfix(postfix, number){
        if( typeof postfix === "string" || postfix instanceof String ){
            if( postfix.split("|").length < 3 ) return " " + postfix;

            return " " + setEnding(postfix, number);
        };
        return "";
    };

    return function(number, postfix){
        postfix = getPostfix(postfix, number);
        return postfix;
    };
}();

function fn(num){

    num = (''+num).split(/[.,]/);
    num[0] = +num[0] ? parseNumber(num[0],"рубл|ь|я|ей") : '';
    num[1] = +num[1] ? parseNumber(num[1],"копе|йка|йки|ек") : '';

    if(num[1] == ''){
        num[1] = 'ноль копеек';
    }

    //alert(num[0]);
    return   num.join( num[0] && num[1] ? " " : "")
}

function GetTodayDate() {

    var date = new Date();
    date.setDate(date.getDate() + 7);
    var dd = date.getDate();
    var MM = date.getMonth();
    var yyyy = date.getFullYear();
    var currentDate= yyyy + "-" +( MM+1) + "-" + dd;

    return currentDate;
}

function clearStorage(full = false){

    let documentId = $('#document').val();

    if (!documentId || full) {
        localStorage.clear();
    }else{
        let keysToKeep = {};
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (!key.startsWith(documentId+"_")) {
                keysToKeep[key] = localStorage.getItem(key);
            }
        }
        //console.log('keysToKeep', keysToKeep);
        // Очищаем весь localStorage
        localStorage.clear();

        // Восстанавливаем сохраненные ключи
        for (let key in keysToKeep) {
            localStorage.setItem(key, keysToKeep[key]);
        }
    }
    localStorage.clear();
}

function putWSum(self, full_sum, def_id){
    if(full_sum === undefined) return;

    var action = $('#action').val();
    var def_id = self.data('sum');

    // сумма -> число
    var sum = num(full_sum);
    if (!isFinite(sum)) return;

    var text = fn(String(sum));
    $('.p-sum[data-psum="'+def_id+'"]').html('(' + text + ')');
    $('.nrubles[data-psum="'+def_id+'"]').html(parseWord(String(sum), "рубл|ь|я|ей"));

    if(action === 'edit'){
        var creator = $('#creator').val();
        if(creator){
            $('.p-sum[data-psum="'+def_id+'"]').removeClass('user-edit-color');
        } else {
            $('.p-sum[data-psum="'+def_id+'"]').addClass('user-edit-color');
        }
    }

    // ставка -> число
    var ndsRaw = getNdsProz(def_id);
    var nds = num(ndsRaw);
    if (!isFinite(nds) || nds < 0) nds = 20;

    var coef_nds = 100 + nds;
    var sum_nds = sum * nds / coef_nds;

    var pro_nds = fn(sum_nds.toFixed(2));
    var full_pro_nds = pro_nds.charAt(0) + pro_nds.substr(1);

    var sword1 = parseWord(String(Math.trunc(sum_nds)), "рубл|ь|я|ей");

    $('.sumnds[data-sumnds="'+def_id+'"]')
        .html(sum_nds.toFixed(2) + ' <span class="have_nds">(' + full_pro_nds + ')</span>');

    $('.nrubles1[data-psum="'+def_id+'"]').html(sword1);
}

function num(v){
    if (v === null || v === undefined) return NaN;
    v = String(v).replace(/\s+/g,'').replace(',', '.').replace('%','');
    return parseFloat(v);
}

function recalcNdsByDefId(def_id){
    if (def_id === undefined || def_id === null) return;

    var $sumEl = $('#doc-body').find('.sum-nds[data-sum="' + def_id + '"]').first();
    if (!$sumEl.length) return;

    var sum = num($sumEl.text());
    if (!isFinite(sum)) return;

    putWSum($sumEl, sum, def_id);
}

function setSame(self, new_text, nAttr){

    if(nAttr !== undefined){

        self.addClass('second-f');

        var documentId = parseInt($('#document').val() || window.DOCUMENT_CONTRACT_ID || '0', 10);
        var suid = $('#suid').val();
        var action = $('#action').val();

        if(action === 'edit'){

            var creator = $('#creator').val();
            var originalValue = $(this).data('original');

            if(creator){
                $(this).html(new_text).removeClass('user-edit-field').data('original', originalValue).attr('data-original', originalValue);
            }else{
                $(this).html(new_text).addClass('user-edit-field').data('original', originalValue).attr('data-original', originalValue);
            }

            $('.ch-field[data-same=' + nAttr + ']').each(function(){
                if(creator){
                    $(this).html(new_text).addClass('yes-field second-f user_edit').removeClass('user-edit-field');
                }else{
                    $(this).html(new_text).addClass('yes-field second-f user_edit user-edit-field');
                }

            });

        }else{
            if(new_text != 'Укажите значение') {

                if (window.SameStorage) {

                    SameStorage.patchBothDebounced(
                        nAttr,
                        documentId + '_' + nAttr,
                        new_text
                    );
                }

                $('.ch-field').filter(function () {
                    return $(this).data('same') === nAttr;
                }).each(function () {
                    $(this)
                        .html(new_text)
                        .addClass('yes-field second-f user_edit');
                });

            }

        }



        if($("button").is(".clear-box")){
            if($('.clear-box').hasClass('hideClear')){
                //$('.clear-box').removeClass('hideClear');
            }
        }

    }
}

function applySameFromServer(wrapper, doneCb) {
    var action = $('#action').val();
    if (action === 'edit') {
        if (doneCb) doneCb(false);
        return;
    }

    // docId берём устойчиво
    var docId = parseInt(window.DOCUMENT_CONTRACT_ID || $('#document').val() || '0', 10);
    if (!docId) {
        if (doneCb) doneCb(false);
        return;
    }

    // соберём уникальные ключи из DOM
    var map = {};
    wrapper.find('[data-same]').each(function () {
        var k = String($(this).data('same') || '').trim();
        if (/^[a-z][a-z0-9_]{0,63}$/i.test(k)) map[k] = 1;
    });

    // плюс ключи из .same-field, если они ещё не конвертированы в data-same
    wrapper.find('.same-field').each(function () {
        var k = String($(this).text() || '').trim();
        if (/^[a-z][a-z0-9_]{0,63}$/i.test(k)) map[k] = 1;
    });

    var keys = Object.keys(map);
    if (!keys.length) {
        if (doneCb) doneCb(true);
        return;
    }

    $.ajax({
        url: '/same-storage/get-doc',
        method: 'GET',
        dataType: 'json',
        cache: false,
        data: { doc_id: docId, keys: keys.join(',') }
    }).done(function (resp) {
        var data = (resp && resp.data) ? resp.data : {};

        // 1) .ch-field
        wrapper.find('.ch-field').each(function () {
            var $el = $(this);
            var k = String($el.data('same') || '').trim();
            if (!k) return;

            var v = data[k];
            if (v === undefined || v === null) return;

            v = String(v).trim();
            if (!v || v === 'Укажите значение') return;

            $el.html(v).addClass('yes-field second-f user_edit');
        });

        // 2) .my-fieald
        wrapper.find('.my-fieald').each(function () {
            var $el = $(this);
            var k = String($el.data('same') || '').trim();
            if (!k) return;

            var v = data[k];
            if (v === undefined || v === null) return;

            v = String(v).trim();
            if (!v || v === 'Укажите значение') return;

            $el.html(v);
        });

        // 2.5) .co-select
        wrapper.find('.co-select').each(function () {
            var $sel = $(this);
            var k = String($sel.data('same') || '').trim();
            if (!k) return;

            var v = data[k];
            if (v === undefined || v === null) return;

            v = String(v).trim();
            if (!v || v === 'Укажите значение') return;

            $sel.find('option').each(function () {
                if ($(this).text() == v) {
                    $(this).prop('selected', true).attr('selected', 'selected');
                } else {
                    $(this).prop('selected', false).removeAttr('selected');
                }
            });
        });

        // 3) .same-field (старый маркер)
        wrapper.find('.same-field').each(function () {
            var $marker = $(this);
            var $parent = $marker.parent();
            var $help = $parent.find('.help-field:first');

            var same = String($marker.text() || '').trim();
            var help = $help.length ? String($help.text() || '').trim() : '';

            if (!same) {
                $marker.remove();
                $help.remove();
                return;
            }

            $parent.attr({'data-same': same}).data({'same': same});

            if (help) {
                $parent.attr({'data-help': help}).data({'help': help});
            }

            var v = data[same];
            if (v === undefined || v === null) {
                $marker.remove();
                $help.remove();
                return;
            }

            v = String(v).trim();
            if (!v || v === 'Укажите значение') {
                $marker.remove();
                $help.remove();
                return;
            }

            $parent
                .html(v)
                .addClass('yes-field second-f user_edit');
        });

        // для отладки можно сохранить
        try {
            window.__SAME_CACHE__ = window.__SAME_CACHE__ || {};
            window.__SAME_CACHE__.doc = resp;
        } catch(e) {}

        getIco();
        if (doneCb) doneCb(true);
    }).fail(function () {
        if (doneCb) doneCb(false);
    });
}

function getSame(wrapper){
    var documentId = parseInt($('#document').val() || '0', 10);
    if (!documentId) documentId = null;

    var action = $('#action').val();

    var cache = window.__SAME_CACHE__ || {};
    var data = cache.data || {};

    function normalize(v){
        if (v === null || v === undefined) return null;
        v = String(v).trim();
        if (!v || v === 'Укажите значение') return null;
        return v;
    }

    // helper: получить значение с приоритетом docKey
    function getValue(nAttr){
        if (!nAttr) return null;
        nAttr = String(nAttr).trim();

        // edit — не автозаполняем
        if (action === 'edit') return null;

        if (documentId) {
            var docKey = String(documentId) + '_' + nAttr;
            if (Object.prototype.hasOwnProperty.call(data, docKey)) {
                var v1 = normalize(data[docKey]);
                if (v1 !== null) return v1;
            }
        }

        if (Object.prototype.hasOwnProperty.call(data, nAttr)) {
            var v2 = normalize(data[nAttr]);
            if (v2 !== null) return v2;
        }

        return null;
    }

    wrapper.find('.ch-field').each(function(){
        var self = $(this);
        var nAttr = self.data('same');
        if (nAttr === undefined) return;

        var wSame = getValue(nAttr);
        if (wSame !== null) {
            self.html(wSame).addClass('yes-field second-f user_edit');
        }

        if (self.hasClass('sum-nds')) {
            var def_id = self.data('sum');
            var full_sum = null;

            if (nAttr !== undefined) {
                full_sum = getValue(nAttr);
                if (full_sum) putWSum(self, full_sum, def_id);
            } else {
                var haveNum = parseInt(self.html(), 10);
                if ($.isNumeric(haveNum)) {
                    full_sum = String(self.html()).trim();
                    putWSum(self, full_sum, def_id);
                }
            }
        }
    });

    wrapper.find('.my-fieald').each(function(){
        var selfSame = $(this);
        var nAttr = selfSame.data('same');
        if (nAttr === undefined || nAttr === '') return;

        var wSame = getValue(nAttr);
        if (wSame !== null) {
            selfSame.html(wSame);
        }
    });
}

function ensureOptionValues($select) {
    $select.find('option').each(function () {
        // если value нет или пустой — делаем value = текст
        if (!this.hasAttribute('value') || this.value === '') {
            this.value = $.trim($(this).text());
        }
    });
}

window.__SAME_SELECT_LOCK__ = window.__SAME_SELECT_LOCK__ || {};

function setSameSelect() {
    $('#doc-body').each(function () {
        var self1 = $(this);
        if (self1.hasClass('edoc')) return;

        var action = $('#action').val();
        if (action === 'edit') {
            getLongField();
            return;
        }

        // если SAME еще не готов — подождем
        if (window.__SAME_SYNC_PENDING__) {
            $(document).one('same:sync', function () {
                setSameSelect();
            });
            return;
        }

        var documentId = parseInt($('#document').val() || window.DOCUMENT_CONTRACT_ID || '0', 10);
        if (!documentId) documentId = null;

        // источник истины
        var cache = window.__SAME_CACHE__ || window.__SAME_LAST__ || {};
        var data = cache.data || {};

        function normalize(v) {
            if (v === null || v === undefined) return null;
            v = String(v).trim();
            if (!v || v === 'Укажите значение') return null;
            return v;
        }

        function getValue(nAttr) {
            if (!nAttr) return null;
            nAttr = String(nAttr).trim();

            if (documentId) {
                var docKey = documentId + '_' + nAttr;
                if (Object.prototype.hasOwnProperty.call(data, docKey)) {
                    var v1 = normalize(data[docKey]);
                    if (v1 !== null) return v1;
                }
            }

            if (Object.prototype.hasOwnProperty.call(data, nAttr)) {
                var v2 = normalize(data[nAttr]);
                if (v2 !== null) return v2;
            }

            return null;
        }

        self1.find('.co-select').each(function () {
            var $select = $(this);
            var nAttr = $select.data('same');
            if (nAttr === undefined) return;

            var wSame = getValue(nAttr);
            if (wSame === null) return;

            // 1) пробуем выставить напрямую по value
            // (теперь ты именно value сохраняешь в SAME)
            if ($select.find('option[value="' + String(wSame).replace(/"/g, '\\"') + '"]').length) {
                $select.val(wSame);
                adjustSelectWidth($select);
                return;
            }

            // 2) fallback: если в базе вдруг лежит текст (legacy) — найдём по text
            var foundValue = null;
            $select.find('option').each(function () {
                if ($.trim($(this).text()) === wSame) {
                    foundValue = $(this).val();
                    return false;
                }
            });

            if (foundValue !== null) {
                $select.val(foundValue);
                adjustSelectWidth($select);
            }
        });

        getLongField();
    });
}

function getClearBtn(self1){
    var haveSame = 0;
    self1.find('.ch-field').each(function(){
        var self = $(this);
        var nAttr = self.data('same');

        if(nAttr !== undefined){
            var wSame = localStorage[nAttr];
            if(wSame !== undefined){
                haveSame++;
            }
        }


    });
    if(haveSame > 0){
        if($("button").is(".clear-box")){
            $('.clear-box').removeClass('hideClear');
        }
    }

}

function getAllSame() {
    var $doc = $('#doc-body');

    // Сначала вытаскиваем служебные маркеры в data-атрибуты
    normalizeFieldMeta($doc);

    // Потом применяем уже заполненные значения из second-f
    $doc.find('.ch-field[data-same]').each(function () {
        var $field = $(this);
        var same = String($field.data('same') || '').trim();

        if (!same) {
            return;
        }

        var nText = $('.second-f[data-same="' + same + '"]:first').text();
        if (nText !== '') {
            $field.html(nText).addClass('yes-field second-f user_edit');
        }
    });

    applySameFromServer($doc, function (ok) {
        if (!ok) {
            setNds(); // оно уже с fallback
        }
        recalcAllNds();
    });
}

function recalcAllNds(){
    $('#doc-body').find('.sum-nds').each(function(){
        var def_id = $(this).data('sum');
        recalcNdsByDefId(def_id);
    });
}

function setAllSelfSame() {
    $('.my-fieald').each(function(){
        $(this).on('DOMSubtreeModified', function(){
            var nAttr = $(this).data('same');

            if(nAttr !== undefined && nAttr !== ''){
                var selectedText = $(this).html();
                //localStorage[nAttr] = selectedText;

            }
        });

    });
}

function setNds(){
    $('#doc-body').each(function(){
        var self = $(this);

        applySameFromServer(self, function(ok){
            if (!ok) {
                getSame(self);
            }
        });
    });
}

function getNdsProz(def_id){
    var result = null;
    $('#doc-body').each(function(){
        var self = $(this);
        result = self.find('.nds[data-nds="' + def_id + '"]').first().text();
    });
    return result;
}

function clearDopBlock(parent_id){
    var selector = $('.one-wrapper[data-parent="' + parent_id + '"]');
    if (selector.length > 0) {
        selector.find('.step-dop-block').remove();
        selector.find('.dop-single-part').remove();
    }

}

function clearHiddenBlock(parent_id){
    var selector = $('.one-wrapper[data-parent="' + parent_id + '"]');

    if (selector.length > 0) {
        selector.find('.step-new-block').remove();
        selector.find('.single-part').remove();
    }

}

function getIco(){
    $('#doc-body').each(function(){
        var self = $(this);
        self.find('.ch-field').each(function(){
            $(this).find('.w-ico').remove();
            if($(this).hasClass('yes-field')){
                $(this).append('<span class="w-ico yes-ico"></span>');
            }
        });

    });
}

function getDateIco(){
    $('#doc-body').each(function(){
        var self = $(this);
        self.find('.my-dates').each(function(){
            $(this).find('.w-ico').remove();
            if($(this).find('.date-f').hasClass('ch-color')){
                $(this).append('<span class="w-ico d-ico yes-ico"></span>');
            }
            /*else{
             $(this).append('<span class="w-ico d-ico qest-ico"></span>');
            }*/
        });

    });
}

function reNumberAll(){
    $('#doc-body').each(function(){
        var self = $(this);
        var firstArr = [];
        self.find('.renumber').each(function(){
            let str = $(this).text();
            let arr = str.split('.');
            arr = arr.filter(function(elem){
                return elem != "";
            });
            firstArr.push(arr[0]);
            //console.log(arr);
            //console.log(arr.length);

        });

        firstArr = unique(firstArr);
        //console.log(firstArr);


        $.each(firstArr,function(index,value){
            var chNum = 1;
            var mayNum = chNum;
            self.find('.renumber').each(function(){

                let str = $(this).text();
                let arr = str.split('.');
                arr = arr.filter(function(elem){
                    return elem != "";
                });

                if(arr[0] == value){

                    if(arr.length == 2){
                        arr[1] = chNum;
                        mayNum = chNum;
                        chNum++;
                    }

                    if(arr.length == 3){
                        arr[1] = mayNum;
                    }

                    var newStr = getNumString(arr);
                    $(this).html(newStr);
                    //console.log(newStr);

                }

                //console.log(arr.length);

            });
            //console.log(value);

        });

    });
}

function reNumberFull(){

    $('#doc-body').each(function(){
        var self = $(this);

        var chNum = 1;
        var mayNum = chNum;
        var index = 1;
        var oldIndex = 1;
        self.find('.reallnumber').each(function(){

            let str = $(this).text();
            let arr = str.split('.');
            arr = arr.filter(function(elem){
                return elem != "";
            });

            if(arr.length == 1){
                //console.log(arr);
                //console.log(arr[0]+' - '+index);
                oldIndex = arr[0];
                arr[0] = index;
                mayNum = index;
                index++;
            }

            if(arr.length == 2){
                //if(arr[0] == oldIndex){
                arr[0] = mayNum;
                //}
            }

            if(arr.length == 3){
                //if(arr[0] == oldIndex){
                arr[0] = mayNum;
                //}
            }

            var newStr = getNumString(arr);
            $(this).html(newStr);


        });


    });

    reNumberFull2();

}

function reNumberFull2(){
    $('#doc-body').each(function(){
        var self = $(this);
        var firstArr = [];
        self.find('.reallnumber').each(function(){
            let str = $(this).text();
            let arr = str.split('.');
            arr = arr.filter(function(elem){
                return elem != "";
            });
            firstArr.push(arr[0]);

        });

        firstArr = unique(firstArr);

        $.each(firstArr,function(index,value){
            var chNum = 1;
            var mayNum = chNum;
            self.find('.reallnumber').each(function(){

                let str = $(this).text();
                let arr = str.split('.');
                arr = arr.filter(function(elem){
                    return elem != "";
                });

                if(arr[0] == value){

                    if(arr.length == 2){
                        arr[1] = chNum;
                        mayNum = chNum;
                        chNum++;
                    }

                    if(arr.length == 3){
                        arr[1] = mayNum;
                    }

                    var newStr = getNumString(arr);
                    $(this).html(newStr);

                }

            });

        });

    });
}

function unique(arr) {
    let result = [];

    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }

    return result;
}

function getNumString(forStrArr){
    var str = '<strong>';
    $.each(forStrArr,function(index,value){
        str = str+value+'.';
    });
    str = str+'</strong>';
    return str;
}

function setSearchClass(){
    $('#doc-body').each(function(){
        var self = $(this);

        self.find('.ch-field[data-same=name1]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=name4]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=name2]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=name3]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=name5]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=name6]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=name7]').each(function(){
            $(this).addClass('searchcompany');
        });

        self.find('.ch-field[data-same=inn_fiz2]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=inn1]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=inn_ip1]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=inn2]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=inn_ip2]').each(function(){
            $(this).addClass('searchcompany');
        });

        self.find('.ch-field[data-same=ogrn1]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=ogrn2]').each(function(){
            $(this).addClass('searchcompany');
        });

        self.find('.ch-field[data-same=ogrnip1]').each(function(){
            $(this).addClass('searchcompany');
        });
        self.find('.ch-field[data-same=ogrnip2]').each(function(){
            $(this).addClass('searchcompany');
        });
    });
}

function removeAllPreloaders() {
    $('#doc-body').each(function(){
        var self = $(this);
        self.find('.pre-btn').remove();

    });
}

function hoverBth() {
    $('#doc-body').each(function(){
        var self = $(this);

        self.find('.custom-control-label').each(function () {
            let newElem = $('<div class="btn-note"><span class="pl-btn-before"></span><span class="pl-btn-note">Это условие выбрано</span></div>');
            $(this).hover(function () {
                if ($(this).parent().find('.check-part').is(':checked')){
                    let coords = $(this).offset();
                    $('body').append(newElem);
                    newElem.css({ left: coords.left, top: coords.top });


                }
            }, function () {
                newElem.remove();
            });
        })


    });

}

function hoverUslovie() {
    $('#doc-body').each(function(){
        var self = $(this);

        self.find('.open-edit-btn, .open-edit-title').each(function () {
            let newElem = $('<div class="uslovie-note"><span class="pl-req-before"></span><span class="pl-req-note">Вы можете изменить название условия</span></div>');
            $(this).hover(function () {
                let coords = $(this).offset()
                $('body').append(newElem);
                newElem.css({ left: coords.left, top: coords.top, opacity: 1 });

            }, function () {
                newElem.animate({'opacity': 0}, 200, function () {
                    newElem.remove();
                })

            })
        })

        self.find('.open-edit-btn-note, .open-edit-title-note').each(function () {
            let newElem = $('<div class="uslovie-note"><span class="pl-req-before"></span><span class="pl-req-note pl-req-note-1">После авторизации вы можете переименовать условие под себя</span></div>');
            $(this).hover(function () {
                let coords = $(this).offset()
                $('body').append(newElem);
                newElem.css({ left: coords.left, top: coords.top, opacity: 1 });

            }, function () {
                newElem.animate({'opacity': 0}, 200, function () {
                    newElem.remove();
                })

            })
        })


    });
}

function hoverField() {

    var self = $('#doc-body');

    self.find('.ch-field').each(function () {
        let newElem;

        $(this).hover(function () {

            if(!$(this).hasClass('input-here')){
                let countShow = 0;
                let canPut = true;

                if($(this).hasClass('yes-field')){
                    countShow = +$.cookie('green');

                    newElem = $('<div class="field-green-note"><span class="pl-req-before"></span><span class="pl-req-note">При необходимости отредактируйте поле</span></div>');

                }else{
                    if(!$(this).hasClass('closed-field')){
                        countShow = +$.cookie('broun');
                        newElem = $('<div class="field-broun-note"><span class="pl-req-before"></span><span class="pl-req-note">Заполните поле онлайн или на своём устройстве</span></div>');
                    }else{
                        countShow = +$.cookie('red');
                        newElem = $('<div class="secure-note"><span class="pl-req-before"></span><span class="pl-req-note">Для безопасности заполните это поле на своем устройстве</span></div>');
                    }

                }
                if(!countShow){
                    countShow = 0;
                }
                //console.log('countShow 1', countShow)
                if(countShow > 3){
                    canPut = false;
                }
                countShow = countShow +1;

                if(canPut){
                    let elemWidth = $(this).innerWidth();
                    let newElemBrounWidth = 394;
                    let newElemGreenWidth = 342;
                    let newElemRedWidth = 470;

                    let coords = $(this).offset();
                    $('body').append(newElem);
                    newElem.css({ left: coords.left, top: coords.top, opacity: 1 });
                    newElem.find('.pl-req-before').css({ left: elemWidth/2});
                    let offsetNote;
                    if($(this).hasClass('yes-field')){
                        offsetNote = (342 - elemWidth)/2;
                        //console.log('countShow 2', countShow)
                        $.cookie('green', String(countShow), {expires: 30, path: '/'});
                    }else{
                        if(!$(this).hasClass('closed-field')) {
                            offsetNote = (394 - elemWidth) / 2;
                            $.cookie('broun', String(countShow), {expires: 30, path: '/'});
                        }else{
                            offsetNote = (470 - elemWidth) / 2;
                            $.cookie('red', String(countShow), {expires: 30, path: '/'});
                        }
                    }
                    newElem.find('.pl-req-note').css({ left: -offsetNote});
                }
            }


        }, function () {
            if(newElem){
                newElem.animate({'opacity': 0}, 200, function () {
                    newElem.remove();
                })
            }


        });
    });


}

function setDangerNote(self) {
    let newElem = $('<div class="secure-note"><span class="pl-req-before"></span><span class="pl-req-note">Для безопасности заполните это поле на своем устройстве</span></div>');
    let elemWidth = self.innerWidth();

    let coords = self.offset();
    $('body').append(newElem);
    newElem.css({ left: coords.left, top: coords.top, opacity: 1 });
    newElem.find('.pl-req-before').css({ left: elemWidth/2});
    let offsetNote = (470 - elemWidth) / 2;
    newElem.find('.pl-req-note').css({ left: -offsetNote});
    newElem.delay(1000).animate({opacity: 0}, 400, function () {
        newElem.remove();
    })
}

function setEditedTitle(){
    $('#doc-body').each(function(){
        var self = $(this);

        self.find('.one-wrapper').each(function () {
            var wrapper = $(this);
            if(wrapper.find('.open-edit-title').length === 1){
                var titleField = wrapper.find('.edited-block');
                var titleWrapper = wrapper.find('.new-podcat');
                var titleWidth = titleWrapper[0].offsetWidth;
                var oldText = titleField.text();
                wrapper.on('click', '.open-edit-title', function (e) {
                    titleWidth = titleWrapper[0].offsetWidth;
                    titleWrapper.css({'min-width': (titleWidth)+'px'});
                    titleField.text('').attr({'contenteditable': true}).focus().addClass('edit-start');

                })
                titleField.focusout(function () {
                    //alert('out')
                    if($(this).text() === '' || $(this).text() === oldText){
                        $(this).text(oldText).attr({'contenteditable': false}).removeClass('edit-start');
                        titleWrapper.css({'min-width': '1px'});
                    }else{
                        titleWrapper.append('<div class="pre-btn"><img src="/img/preloader.svg" alt="" /></div>');
                        $.ajax({
                            url: '/questionnaires/save',
                            type: "POST",
                            data: { 'quest_id' : $(this).data('id'), 'text': $(this).text() },
                            dataType: 'json',
                            cache: false,
                            success: function(res) {

                                if(res.result) {
                                    titleField.attr({'contenteditable': false}).removeClass('edit-start');
                                    oldText = titleField.text();
                                    titleWidth = titleWrapper[0].offsetWidth;
                                }else{
                                    titleField.text(oldText).attr({'contenteditable': false}).removeClass('edit-start');
                                }
                                titleWrapper.css({'min-width': '1px'});
                                titleWrapper.find('.pre-btn').remove();
                            }, error: function(res) {
                                titleField.text(oldText).attr({'contenteditable': false}).removeClass('edit-start');
                                titleWrapper.css({'min-width': '1px'});
                                titleWrapper.find('.pre-btn').remove();
                            }
                        });
                    }

                    //alert($(this).text());
                })
            }

        })


    });

}

function setEditedBtnTitle(){
    $('#doc-body').each(function(){
        var self = $(this);

        self.find('.one-wrapper').each(function () {
            var wrapper = $(this);
            wrapper.find('.edit-podcat').each(function () {
                var btnWrapper = $(this);

                if(btnWrapper.find('.open-edit-btn').length === 1){
                    var titleField = btnWrapper.find('.edited-btn-block');
                    //var titleField = $(this).parents('.custom-radio').find('.edited-btn-block');

                    //var titleWrapper = wrapper.find('.new-podcat');
                    var titleWidth = btnWrapper[0].offsetWidth;
                    var oldText = titleField.text();
                    var editBtn = btnWrapper.find('.open-edit-btn');

                    editBtn.click(function (e) {

                        //console.log(e);
                        titleWidth = btnWrapper[0].offsetWidth;
                        btnWrapper.css({'min-width': (titleWidth)+'px'});
                        titleField.text('').attr({'contenteditable': true}).focus().addClass('edit-start');
                        titleField.parents('.custom-radio').find('.check-part').addClass('no-check')
                    })

                    titleField.focusout(function () {
                        if(titleField.hasClass('edit-start')){
                            let canClose = true

                            if(canClose){
                                if($(this).text() === '' || $(this).text() === oldText){
                                    $(this).text(oldText).attr({'contenteditable': false}).removeClass('edit-start');
                                    btnWrapper.css({'min-width': '1px'});
                                    $(this).parents('.custom-radio').find('.check-part').removeClass('no-check')
                                }else{
                                    btnWrapper.append('<div class="pre-btn"><img src="/img/preloader.svg" alt="" /></div>');
                                    $.ajax({
                                        url: '/questionnaires/save',
                                        type: "POST",
                                        data: { 'quest_id' : $(this).data('id'), 'text': $(this).text() },
                                        dataType: 'json',
                                        cache: false,
                                        success: function(res) {
                                            console.log(res);
                                            if(res.result) {
                                                titleField.attr({'contenteditable': false}).removeClass('edit-start');
                                                oldText = titleField.text();
                                                titleWidth = btnWrapper[0].offsetWidth;
                                            }else{
                                                titleField.text(oldText).attr({'contenteditable': false}).removeClass('edit-start');
                                            }
                                            btnWrapper.css({'min-width': '1px'});
                                            btnWrapper.find('.pre-btn').remove();
                                            titleField.parents('.custom-radio').find('.check-part').removeClass('no-check')
                                        }, error: function(res) {
                                            titleField.text(oldText).attr({'contenteditable': false}).removeClass('edit-start');
                                            btnWrapper.css({'min-width': '1px'});
                                            btnWrapper.find('.pre-btn').remove();
                                            titleField.parents('.custom-radio').find('.check-part').removeClass('no-check')
                                        }
                                    });
                                }
                            }
                        }



                    })

                }
            });

        })


    });

}

var previousValue = '';

function validatePasswordFirst(type = 'reg') {
    // Регулярное выражение для запрещенных символов и пробелов
    var invalidChars = /[^a-zA-Z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/\\|`~]/;
    var pas1;
    var pas2;
    if(type == 'reg') {
        pas1 = $('.password1');
        pas2 = $('.password2');
    }else{
        pas1 = $('.password3');
        pas2 = $('.password4');
    }
    var passwordValue = pas1.val();
    var passwordLength = passwordValue.length;

    if (invalidChars.test(passwordValue)) {
        pas1.val(previousValue).addClass('error-field');
        $('.no-valid-pass1').html('<div class="error-wrapper">Пароль может содержать только латинские буквы, цифры и специальные символы</div>').show();

        return false
    }else{

        if(passwordLength < 6){
            if(pas2.length !== 0) {

                previousValue = passwordValue;
                $('.no-valid-pass1').html('<div class="error-wrapper">Минимальная длина пароля 6 символов</div>').show();
                pas1.val(previousValue).addClass('error-field');
                return false
            }else{

                if(passwordLength < 1){
                    previousValue = passwordValue;
                    $('.no-valid-pass1').html('<div class="error-wrapper">Поле обязательно для заполнения</div>').show();
                    pas1.val(previousValue).addClass('error-field');
                    return false
                }else{
                    previousValue = passwordValue;
                    $('.no-valid-pass1').text('').hide();
                    pas1.val(previousValue).removeClass('error-field');
                    return true
                }
            }
        }else if (passwordLength > 64){
            pas1.val(previousValue);
            $('.no-valid-pass1').html('<div class="error-wrapper">Максимальная длина пароля 64 символов</div>').show();
            pas1.val(previousValue).addClass('error-field');
            return false
        }else {
            previousValue = passwordValue;
            $('.no-valid-pass1').text('').hide();
            pas1.val(previousValue).removeClass('error-field');
            return true
        }


    }

}

function validatePassword(type = 'reg') {

    var pas1;
    var pas2;
    if(type == 'reg') {
        pas1 = $('.password1');
        pas2 = $('.password2');
    }else{
        pas1 = $('.password3');
        pas2 = $('.password4');
    }
    //console.log('pas2.length', pas2.length)
    if(pas2.length === 0){
        return true

    }else{

        if(pas1.val() !== pas2.val()){
            $('.no-valid-pass').html('<div class="error-wrapper">Пароли не совпадают</div>').show();
            pas2.addClass('error-field');
            return false
        }else{
            $('.no-valid-pass').text('').hide();
            pas2.removeClass('error-field');
            return true
        }

    }

}

function setToast(status, text, title = null) {
    let newElem = null;
    if(status === 'error'){
        newElem = $('<div class="doc-toast doc-toast-error"><div class="doc-toast-status">Ошибка!</div><div class="doc-toast-body">'+text+'</div></div>');
    }else{
        if(!title){
            title = 'Изменено';
        }
        newElem = $('<div class="doc-toast doc-toast-ok"><div class="doc-toast-status">'+title+'</div><div class="doc-toast-body">'+text+'</div></div>');
    }
    $('body').append(newElem);
    newElem.delay(2000).animate({opacity: 0}, 500, function () {
        newElem.remove();
    });
}

function toggleModalStyles() {
    if ($(window).width() > 1199) {
        $('body').addClass('modal-open').css('padding-right', '17px');
    } else {
        $('body').addClass('modal-open').css('padding-right', '');
    }
}

// ---- SAME helpers (global) ----
window.getSameValue = function (key) {
    key = String(key || '').trim();
    if (!key) return undefined;

    // приоритет: старый кэш (его использует getSame)
    var cache = window.__SAME_CACHE__ || null;
    if (cache && cache.data && !Array.isArray(cache.data) &&
        Object.prototype.hasOwnProperty.call(cache.data, key)) {
        return cache.data[key];
    }

    // fallback: новый кэш
    var last = window.__SAME_LAST__ || null;
    if (last && last.data && !Array.isArray(last.data) &&
        Object.prototype.hasOwnProperty.call(last.data, key)) {
        return last.data[key];
    }

    if (cache && cache.doc) {
        var d = cache.doc.data || cache.doc;
        if (d && !Array.isArray(d) && Object.prototype.hasOwnProperty.call(d, key)) {
            return d[key];
        }
    }

    return undefined;
};


