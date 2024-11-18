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

$(document).ready(function () {
    // 햄버거 메뉴 열기
    $('#menuToggle').on('click', function () {
        const mainsideContent = $('#mainsideContent').html(); // mainside 내용 가져오기
        const slideMenu = $('#slideMenu');
        slideMenu.html(mainsideContent + '<button id="closeMenu" class="close-btn">닫기</button>'); // 내용 복사 후 닫기 버튼 추가
        slideMenu.addClass('active');

        // 닫기 버튼 이벤트 추가
        $('#closeMenu').on('click', function () {
            slideMenu.removeClass('active');
        });

        // 서브 메뉴 토글
        $('.slide-menu .list-area ul > li > a').on('click', function (e) {
            const subList = $(this).next('.sub-list');
            if (subList.length > 0) {
                e.preventDefault(); // 기본 링크 동작 방지
                subList.slideToggle();
            }
        });
    });
});

// Toggle Chatbot Visibility
function toggleChatbot() {
    const popup = document.getElementById("chatbot-popup");

    // 현재 상태를 토글
    if (popup.style.display === "flex") {
        popup.style.display = "none"; // 팝업 닫기
    } else {
        popup.style.display = "flex"; // 팝업 열기
    }
}

// Send Message Functionality
function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (message) {
        addMessage("user", message); // 사용자 메시지 추가
        input.value = ""; // 입력 필드 초기화

        // Simulate AI Response
        setTimeout(() => {
            addMessage("bot", "안녕하세요 대진 On 정보 챗봇입니다.");
        }, 500);
    }
}

// Add Messages to Chat Window
function addMessage(sender, text) {
    const messagesDiv = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);

    // 메시지 추가 후 스크롤 하단으로 이동
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle Enter Key Press
document.getElementById("chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage(); // Enter 키 입력 시 메시지 전송
        event.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
    }
});

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("chatbot-popup");
    popup.style.display = "none"; // 초기 상태는 숨김
});


function search() {
    const query = document.getElementById("searchKeyword").value.trim();

    if (!query) {
        alert("검색어를 입력하세요.");
        return;
    }

    // 검색 폼 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/search";

    // 검색어 추가
    const queryInput = document.createElement("input");
    queryInput.type = "hidden";
    queryInput.name = "query";
    queryInput.value = query;
    form.appendChild(queryInput);

    document.body.appendChild(form);
    form.submit();
}
