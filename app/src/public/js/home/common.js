$(function () {
    //변수 선언
    var _w = $(window);
    var $body = $("body");
    gnbAction();// Gnb hover
    if ( $body.find(".sticky-area").length > 0 ) { stickyListClick(); }// 스티키클릭
    $(".tab-con:first").addClass("on");//탭 첫번째 컨텐츠

});

/* Gnb hover - 헤더 */
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

    // DJ-logo에 마우스 포커스를 맞췄을 때 서브메뉴 숨기기
    $(".home-logo").on("mouseenter focusin", function () {
        $gnbBg.hide();
        $gnbSubList.hide();
        $topWrap.removeClass("hover");
    });
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

// 페이지 네이션(main.js)
document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        }
    });

});
function toggleContent() {
    const items = document.querySelectorAll("#following-content ul li:not(.close)");
    const button = document.getElementById("toggle-button");

    if (items[0].style.display === "none") {
        items.forEach(item => item.style.display = "list-item");
        button.textContent = "닫힘";
    } else {
        items.forEach(item => item.style.display = "none");
        button.textContent = "열림";
    }
}
