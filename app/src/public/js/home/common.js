
$(function () {
    //변수 선언
    var _w = $(window);
    var $body = $("body");
    //윈도우 스크롤 액션
    _w.on("scroll", function(){
        moveTopEvent();
        if ( $body.find(".sticky-area .sticky-menu").length > 0 ) { stickyListScroll(); }// 스티키스크롤
        if ( $body.find(".swiper.tab").length > 0 ) { swiperTabMenu(); }
    });
    moveTopEvent();// 상단가기클릭
    $(".topmove-area .top").on("click", moveTopClick);// 상단가기클릭
    gnbAction();// Gnb hover
    if ( $body.find(".sticky-area").length > 0 ) { stickyListClick(); }// 스티키클릭
    $(".tab-con:first").addClass("on");//탭 첫번째 컨텐츠
    $(".duty-con:first").addClass("on");//탭 첫번째 컨텐츠
    tabClickAction(".tab-sports > li > a", ".tab-con");// Tab 메뉴클릭
    tabClickAction(".tab-list > li > a", ".tab-con");// Tab 메뉴클릭
    tabClickAction(".duty-list > li > a", ".duty-con");// Tab 메뉴클릭
    $(".layer-pop").on("click", modalAction);// 레이어팝업
    $(".input.calendar").on("click", calendarAction);// 달력 레이어팝업
    $(".input.calendar").keydown(function(key){
        if(key.keyCode == 13){
            $(this).addClass('current');
            calendarAction();
        }
    });
    $(".all-menu").on("click", allmenuAction);// 모바일 전체메뉴
    $(".mo-lnb .close").on("click", moLnbAction);// 모바일 전체메뉴 닫기
    $(".family-menu .txt").on("click", footerFamily);// 연관사이트 바로가기
    $(".form-area .input, .form-area .textarea").on("input", inputFocus);// 텍스트필드 포커스
    $(".check-area input[name=agreeType]").on("change", agreeChk);// 체크박스 전체선택
    $(".check-area #agreeChkAll").on("change", agreeChkAll);// 체크박스 전체선택
    $(".application-list input[type=checkbox]").on("change", courseChk);// 수강신청리스트 체크박스
    if ( $body.find(".swiper.tab").length > 0 ) { swiperTabMenu(); }// 탭스와이프 메뉴
    if ( $body.find(".swiper.sports-slide").length > 0 ) { swiperSlideImg(); }// 종목안내 이미지 슬라이드
    if ( $body.find(".faq-list").length > 0 ) { faqAction(); }// 자주찾는질문
    icoTouchAction();//모바일 테이블 스크롤액션
    $(".tbl-wrap").on("scroll", icoTouchAction);//모바일 테이블 스크롤액션 아이콘
    var $fileBox = null;
	fileUpload();// 파일첨부 버튼이미지
    findIdAction();//아레나 로그인 아이디찾기 슬라이드
    inputValueCheck();//input value값 체크확인
});
/* 상단가기클릭 */
function moveTopEvent() {
    var _sT = $(window).scrollTop();
        _wH = $(window).height();
        footerTop = $('.footer').offset().top;

    if (_sT + _wH >= footerTop) {
        $('body').addClass('footer-visible');
    } else {
        $('body').removeClass('footer-visible');
    }
    if( _sT > 0) {
        $('body').addClass('body-scroll');
    } else {
        $('body').removeClass('body-scroll');
    }
}
function moveTopClick(e) {
    e.preventDefault();
    htmlBody = $('html, body');
    htmlBody.animate({
        scrollTop : 0
    }, 500);
}
/* Gnb hover */
function gnbAction() {
    var $topWrap = $(".header .top-wrap");
    var $gnbBg = $(".gnb-bg");
    var $gnbSubList = $('.gnb-menu .sub-list');
    var $utilMenu = $('.top-wrap .util-menu');

    // depth1 메뉴 항목에 마우스를 올리거나 포커스를 맞췄을 때
    $(".gnb-menu .depth1").on("mouseenter focusin", function () {
        $gnbBg.show();
        $gnbSubList.show();
        $(this).addClass("hover").parent("li").siblings().find(".depth1").removeClass("hover");
        $(document).on('keydown', function (e) {
            if (e.keyCode === 27) { // ESC 키를 눌렀을 때 메뉴 숨기기
                $gnbBg.hide();
                $gnbSubList.hide();
            }
        });
        $topWrap.addClass("hover");
    });

    // 메뉴 영역에서 마우스를 떠났을 때
    $topWrap.mouseleave(function () {
        $gnbBg.hide();
        $gnbSubList.hide();
        $(this).removeClass("hover");
    });

    // util-menu에 마우스를 올렸을 때 서브메뉴 보여주기
    $utilMenu.on("mouseenter", function () {
        $gnbBg.show();      // 서브 메뉴 배경 보여주기
        $gnbSubList.show(); // 서브 메뉴 보여주기
        $topWrap.addClass("hover"); // 탑 랩 활성화 효과 추가
    });

    // home-logo에 마우스 포커스를 맞췄을 때 서브메뉴 숨기기
    $(".home-logo").on("mouseenter focusin", function () {
        $gnbBg.hide();
        $gnbSubList.hide();
        $topWrap.removeClass("hover");
    });
}


/* 파일첨부 버튼이미지 */
function fileUpload() { 
	$fileBox = $('.form-area.file'); 
	$.each($fileBox, function(idx){ 
		var $this = $fileBox.eq(idx),
			$btnUpload = $this.find('[type="file"]'),
			$label = $this.find('.file-label'); 
		
		$btnUpload.on('change', function() { 
			var $target = $(this), 
				fileName = $target.val(), 
				$fileText = $target.siblings('.file-name'); 
			$fileText.val(fileName); 
            console.log(">>>>파일이 첨부되었습니다.");
		}) 
		$btnUpload.on('focusin focusout', function(e) { 
			e.type == 'focusin' ? 
			$label.addClass('file-focus') : $label.removeClass('file-focus'); 
		}) 
	}) 
}
/* 스티키스크롤 */
function stickyListScroll() {
    var $stickyCon = $(".sticky-con");
        _sT = $(this).scrollTop();

    $stickyCon.each(function(index){
        var stickyTop = $(".sticky-menu").offset().top;
            stickyThis = $(this);
            stickyTop = Math.floor(stickyThis.offset().top - ($(".header").height() + $('.sticky-area').height()));
        if(_sT >= stickyTop) {
            $('.sticky-menu li').eq(index).addClass('current').siblings().removeClass('current');
        }
    });
}
/* 스티키클릭 */
function stickyListClick() {
    $(".container .content").addClass("sticky");
    $(".sticky-area .sticky-menu li > a").on("click", function(e){
        var $stickyCon = $(".sticky-con");
            stickydIdx = $(this).parent().index();
            htmlBody = $('html, body');
            targetSet = $stickyCon.eq(stickydIdx).offset().top - ($('.header').height() + $(".sticky-area").height());

        e.preventDefault();
        htmlBody.animate({
            scrollTop : targetSet
        }, 500);
    })
}
/* Tab 메뉴클릭 */
function tabClickAction(tmSelect, tcSelect) {
    var tabMenus = $(tmSelect);
    var tabCons = $(tcSelect);
    var tabWrap = $(tmSelect).parent().parent();
    
    tabMenus.each(function (index) {
        var tabMenu = $(this);
        var tabCon = tabCons.eq(index);
        tabMenu.on("click", function () {
            tabMenu.parent().addClass("on").siblings().removeClass("on");
            tabCon.addClass("on").siblings().removeClass("on");
            tabWrap.stop().animate({
                scrollLeft:parseInt(tabWrap.scrollLeft() + tabWrap.find("li").eq(index - (index > 0 ? 1 : 0) ).position().left)}, 300
            );
        });
    });
}
/* 레이어팝업 */
function modalAction(e) {
    e.preventDefault();
    var $this = $(this);
    var modalPop = $("#" + $(this).attr("data-modal"));
    var modalCloseBtn = modalPop.find(".layer-close")
    modalPop.addClass("open");
    modalPop.attr("tabindex", 0).focus();
    modalPop.append('<a href="#none" class="layer-last-focus"></a>');//레이어팝업안에서만 focus 이동하도록하기위함
    $('a.layer-last-focus').on('focus', function(){
		setTimeout(function(){modalPop.focus();}, 10); /*모바일을위한 트릭 시간차를 위해 스크린리더가 캐치할 수 잇도록*/
	});
    $("body").addClass("scroll-lock");
    modalCloseBtn.on("click", modalClose);
    //레이어 닫기
    function modalClose() {
        modalPop.removeClass("open");
        $("body").removeClass("scroll-lock");
        modalPop.find('a.layer-last-focus').remove();
        $this.focus();
    }
    // Esc키 : 레이어 닫기
    $(document).on("keydown.lp_keydown", function(e) {
        
        var keyType = e.keyCode || e.which;
      
        if (keyType === 27 && modalPop.hasClass("open")) {
          modalClose();
        }
    });
}
/* 달력 레이어팝업 */
function calendarAction() {
    var $this = $(this);
    var calendarPop = $(".calendar-pop");
    var calendarCloseBtn = calendarPop.find(".calendar-close")
    calendarPop.addClass("open");
    calendarPop.attr("tabindex", 0).focus();
    calendarPop.append('<a href="#none" class="layer-last-focus"></a>');//달력레이어팝업안에서만 focus 이동하도록하기위함
    $('a.layer-last-focus').on('focus', function(){
		setTimeout(function(){calendarPop.focus();}, 10); /*모바일을위한 트릭 시간차를 위해 스크린리더가 캐치할 수 잇도록*/
	});
    calendarCloseBtn.on("click", calendarClose);
    //레이어 닫기
    function calendarClose() {
        calendarPop.removeClass("open");
        calendarPop.find('a.layer-last-focus').remove();
        $this.focus();
        $(".current").focus();
	    $(".current").removeClass('current');
    }
}
/* 모바일 전체메뉴 */
function allmenuAction() {
    var $this = $(this);
        $allBtn = $(".all-menu");
        $moLnb = $(".mo-lnb");
        $body = $("body");

    $body.addClass("scroll-lock");
    $this.toggleClass("active");
    $moLnb.addClass("active");
    $moLnb.after("<div class='bg-lnb'></div>");
}
/* 모바일 전체메뉴 닫기 */
function moLnbAction() {
    var $allBtn = $(".all-menu");
        $moLnb = $(".mo-lnb");
        $body = $("body");

    $body.removeClass("scroll-lock");
    $moLnb.removeClass("active");
    $allBtn.removeClass("active");
    $body.find(".bg-lnb").remove();
}
/* 연관사이트 바로가기 */
function footerFamily() {
    $(this).toggleClass("on");
    $(".family-menu .menu-sub").toggleClass("on");
}
/* 텍스트필드 포커스 */
function inputFocus() {
    if ($(this).val().trim() !== "") {
        $(this).addClass("focused");
    } else {
        $(this).removeClass("focused");
    }
}
/* 체크박스 전체선택 */
function agreeChk() {
    var chkChecked = $(".check-area input[name=agreeType]:checked").length;
    var chkCheck = $(".check-area input[name=agreeType]").length;
    if( chkChecked === chkCheck ) {
        $("#agreeChkAll").prop("checked", true);
        $("#agreeChkAll").addClass("com");
    } else {
        $("#agreeChkAll").prop("checked", false);
    }
}
function agreeChkAll() {
    $(".check-area input[type='checkbox']").prop("checked", $(this).prop("checked"));
}
/* 수강신청리스트 체크박스 */
function courseChk() {
    var checked = $(this).is(':checked');
    var checkCurrent = $(this).parent("").parent("").parent("");
    
    if(checked) {
        checkCurrent.addClass("check");

    } else {
        checkCurrent.removeClass("check");
    }
}
/* 탭스와이프 메뉴 */
function swiperTabMenu() {
    var slide = new Swiper('.swiper.tab', {
        slidesPerView: "auto",
        loop: false,
        pagination: true,
        autoplay: false,
        freeMode:true,
        navigation: {
            nextEl: '.swiper-button-next',
        },
        observer: false,
        observeParents: false,
        a11y: false,
    })
    $(".swiper.tab .swiper-slide").on("click", function(){
        var target = $(this);
        var winWidth = $(window).width();
        setTimeout(function () {
            if( winWidth < 540) {
                tabCenter(target);
            }
        }, 500);
    });
    $(".swiper.tab.type1 .swiper-slide").on("click", function(){
        var target = $(this);
        target.addClass("current").siblings().removeClass("current");
    });
    $(".swiper.tab .swiper-slide").each(function(){
        var target = $(this);
        var winWidth = $(window).width();
        if( winWidth < 540) {
            if($(this).hasClass("current") == true){
                tabCenter(target);
            }
        }
    });
}
/* 탭스와이프 메뉴 화면중앙 */
function tabCenter(target){
    var tabSwp = $(".swiper.tab");
    var tabSwpHalf = tabSwp.width()/2;
    var tabSwpWrap = $(".swiper.tab .swiper-wrapper");
    var tabPos = target.position();
    var pos;
    var wrapWidth = 0;
    var currentTabPos = tabPos.left + target.outerWidth()/2;
    var tabGra = $(".swiper-button-next");
    tabSwpWrap.find(".swiper-slide").each(function(){
        wrapWidth += $(this).outerWidth();
    });
    if (currentTabPos <= tabSwpHalf) { // left
        pos = 0;
    }else if ((wrapWidth - currentTabPos) <= tabSwpHalf) { //right
        pos = wrapWidth-tabSwp.width();
        tabGra.addClass("swiper-button-disabled");
    }else {
        pos = currentTabPos - tabSwpHalf;
        tabGra.removeClass("swiper-button-disabled");
    }
    setTimeout(function(){tabSwpWrap.css({
        "transform": "translate3d("+ (pos*-1) +"px, 0, 0)",
        "transition-duration": "500ms"
    })}, 200);
}
/* 종목안내 이미지 슬라이드 */
function swiperSlideImg() {
    var slideImg = new Swiper(".swiper.sports-slide", {
        navigation: {
          nextEl: ".slide-next",
          prevEl: ".slide-prev",
        },
    });
}
/* 자주찾는질문 */
function faqAction() {
    var $faqQcon = $(".faq-list .question");
    var $faqAcon = $(".faq-list .answer");

    $faqAcon.hide();
    $faqQcon.on("click", function(){
        var $this = $(this);
        if( !$this.hasClass("open") ){
            $faqQcon.removeClass("open");
            $faqAcon.slideUp(300);
        }
        $(this).toggleClass("open");
        $(this).next(".answer").slideToggle(300);
    });
}
/* 아레나 로그인 아이디찾기 슬라이드 */
function findIdAction() {
    var $findId = $(".login-wrap .id-find");
    var $findCon = $(".login-wrap .find-con");
    
    $findCon.hide();
    $(".find-wrap .find-con:first").show();
    
    $findId.on("click", function(){
        var $this = $(this);
        if( !$this.hasClass("on") ){
            $findId.removeClass("on");
            $findCon.slideUp(500);
        }
        $(this).toggleClass("on");
        $(this).next(".find-con").slideToggle(500);
    });
}
/* input value값 체크확인 */
function inputValueCheck() {
    $(".form-area .input").each(function(){
        if ($(this).val().trim() !== "") {
            $(this).addClass("focused");
        } else {
            $(this).removeClass("focused");
        }
    });
}
/* 모바일 테이블 스크롤액션 아이콘 */
function icoTouchAction() {
    if($(this).scrollLeft() > 0){
        $(this).find(".ico-touch").fadeOut(200);
    }else {
        $(this).find(".ico-touch").fadeIn(500);
    }
}

function onlyNum(input) { //숫자만 입력가능 onkeyup에 호출해서 사용
	 input.value = input.value.replace(/\D/g, '');
}
function onlyNumEn(input) { //숫자+영어만 입력가능 onkeyup에 호출해서 사용
	input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
}
function onlyKrEn(input) { //한글+영어만 입력가능 onkeyup에 호출해서 사용
	input.value = input.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/g, '');
}
function onlytxt(input) { //숫자 제외 모두 입력가능 onkeyup에 호출해서 사용
	input.value = input.value.replace(/[0-9]/g, '');
}
function onlyNumHyphen(input) { //숫자만 입력가능 입력시 날짜형식 하이픈 자동
   	// 입력값에서 숫자와 하이픈만 남기기
    input.value = input.value.replace(/[^\d-]/g, '');

    // 하이픈이 연속으로 들어오지 않도록 처리
    input.value = input.value.replace(/--+/g, '-');

    // 맨 앞과 맨 뒤에 하이픈이 오면 제거
    input.value = input.value.replace(/^-/, ''); // 맨 앞
    input.value = input.value.replace(/-$/, ''); // 맨 뒤

	// "yyyy-mm-dd" 형식으로 유지하기 위해 년도, 월, 일 사이에 하이픈 추가
    if (input.value.length >= 5 && input.value.charAt(4) !== '-') {
        input.value = input.value.slice(0, 4) + '-' + input.value.slice(4);
    }
    if (input.value.length >= 8 && input.value.charAt(7) !== '-') {
        input.value = input.value.slice(0, 7) + '-' + input.value.slice(7);
    }

	// 월이 1부터 12까지의 값인지 확인하고, 그렇지 않으면 제거
    var parts = input.value.split('-');
    var month = parseInt(parts[1], 10);
    if (!isNaN(month) && (month < 1 || month > 12)) {
        input.value = input.value.replace(/-?\d{2}-/, '');
    }

    // 일이 01부터 31까지의 값인지 확인하고, 그렇지 않으면 제거
    var day = parseInt(parts[2], 10);
    if (!isNaN(day) && (day < 1 || day > 31)) {
        input.value = input.value.replace(/-\d{2}-/, '-');
    }
}


function onlydate(date) { //날짜 정규식
	var dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	return dateRegex.test(date);
}
function onlyEmail(email) { //이메일 정규식
	var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
	return emailRegex.test(email);
	
}
function onlyCarNum(carNum) { //차량번호 정규식
	var carRegex = /^[0-9]{2,3}[가-힣][0-9]{4}$/;
	return carRegex.test(carNum);
}
// slider.js (Swiper 슬라이드 초기화 전용 파일)
document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
});
