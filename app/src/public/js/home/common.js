$(function () {
    var _w = $(window);
    var $body = $("body");
    gnbAction();
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

// 페이지 네이션
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

// 검색 
function search() {
    const query = document.getElementById("searchKeyword").value.trim();

    if (!query) {
        alert("검색어를 입력하세요.");
        return;
    }

    const currentUrl = window.location.pathname;

    if (currentUrl === '/' || currentUrl === '/index' || currentUrl === '/home' || currentUrl.includes('/search')) {
        // 메인 페이지나 통합 검색 페이지에서 검색할 경우
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/search";
        const queryInput = document.createElement("input");
        queryInput.type = "hidden";
        queryInput.name = "query";
        queryInput.value = query;
        form.appendChild(queryInput);
        document.body.appendChild(form);
        form.submit();
    } else if (currentUrl.includes('/community') || currentUrl.includes('/document') || currentUrl.includes('/share')) {
        // 각 게시판 페이지에서는 AJAX로 검색
        $.ajax({
            url: currentUrl + '/search', // 검색 요청
            type: 'POST',
            data: { query: query },
            success: function (data) {
                $('table.board-list tbody').empty();

                // JSON으로 반환된 데이터 기반으로 테이블 업데이트
                if (data.posts && data.posts.length > 0) {
                    data.posts.forEach(function(post, index) {
                        const row = `
                            <tr>
                                <td class="list-num">${index + 1}</td>
                                <td class="list-tit"><a href="/post/${post.id}">${post.title}</a></td>
                                <td class="list-author">${post.author_name ? post.author_name : '익명'}</td>
                                <td class="list-date">${new Date(post.created_at).toISOString().split('T')[0]}</td>
                            </tr>
                        `;
                        $('table.board-list tbody').append(row);
                    });
                } else {
                    // 검색 결과가 없을 경우 처리
                    $('table.board-list tbody').append(`
                        <tr>
                            <td colspan="4" class="no-result">검색 결과가 없습니다.</td>
                        </tr>
                    `);
                }

            },
            error: function () {
                alert("검색 중 오류가 발생했습니다.");
            }
        });
    }
}




// 챗봇 열고 닫기 기능
function toggleChatbot() {
    const popup = document.getElementById("chatbot-popup");
    const messagesDiv = document.getElementById("chat-messages");

    if (popup.style.display === "flex") {
        popup.style.display = "none"; // 챗봇 닫기
        messagesDiv.innerHTML = ""; // 메시지 초기화
    } else {
        popup.style.display = "flex"; // 챗봇 열기
        messagesDiv.innerHTML = ""; // 기존 메시지 초기화
        initializeChatbot(); // 챗봇 초기화
    }
}

// 메시지 추가 함수
function addMessage(sender, text) {
    const messagesDiv = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;

    if (sender === "bot") {
        messageDiv.innerHTML = text;
    } else {
        messageDiv.textContent = text;
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // 스크롤 하단으로 이동
}

// 챗봇 초기화
function initializeChatbot() {
    const welcomeMessage = `
        안녕하세요 디온이 입니다.<br>
        아래 버튼을 눌러 디온이를 이용해보세요!
        <div class="buttons-container">
            <button class="choose-button" onclick="showGuide()">디온이 가이드</button>
            <button class="choose-button" onclick="showScheduleOptions()">공모전 일정 안내</button>
            <button class="choose-button" onclick="showNavigationOptions()">홈페이지 안내</button> <!-- 새로 추가된 버튼 -->
        </div>
    `;
    addMessage("bot", welcomeMessage);
}

// "디온이 가이드" 버튼 클릭 시 실행되는 함수
function showGuide() {
    const guideMessage = `
        디온이를 이용해 주셔서 감사합니다!<br>
        1. 공모전 일정을 확인하려면 '공모전 일정 안내'를 클릭하세요.<br>
        2. 원하는 공모전 분야를 선택하면 해당 정보를 제공받을 수 있습니다.<br>
        디온이를 통해 유용한 정보를 얻어가세요!
    `;
    addMessage("bot", guideMessage);
}

// 웹사이트 내비게이션 보여주는 함수
function showNavigationOptions() {
    const navigationMessage = `
        홈페이지 안내<br>
        원하는 페이지로 이동하세요!<br>
        <div class="buttons-container nbcb">
            <button class="category-button" onclick="window.open('/employment_info', '_blank')">취업정보</button><br>
            <button class="category-button" onclick="window.open('/research_info', '_blank')">연구정보</button><br>
            <button class="category-button" onclick="window.open('/community', '_blank')">커뮤니티</button><br>
            <button class="category-button" onclick="window.open('/job_pre', '_blank')">취업준비</button>
        </div>
    `;
    addMessage("bot", navigationMessage);
}


// 공모전 카테고리 버튼 표시
function showScheduleOptions() {
    const categories = ["AI", "빅데이터", "SW", "게임", "보안", "앱"]; // 카테고리 이름을 한글로 변경
    let buttonsHTML = '<div class="buttons-container">';
    categories.forEach((category) => {
        buttonsHTML += `<button class="category-button" onclick="handleCategorySelection('${category}')">${category}</button>`;
    });
    buttonsHTML += "</div>";

    const scheduleMessage = `
        아래에서 관심 있는 공모전 분야를 선택하세요!
        ${buttonsHTML}
    `;
    addMessage("bot", scheduleMessage);
}


async function handleCategorySelection(category) {
    // 카테고리 맵핑 (한글 → 영어)
    const categoryMap = {
        "AI": "AI",
        "빅데이터": "BigData",
        "SW": "Software",
        "게임": "Game",
        "보안": "Security",
        "앱": "App",
    };

    const englishCategory = categoryMap[category]; // 한글 이름을 영어로 변환
    if (!englishCategory) {
        addMessage("bot", "잘못된 카테고리를 선택하셨습니다.");
        return;
    }

    addMessage("user", `공모전 분야: ${category}`);

    try {
        const response = await fetch(`/api/contests?category=${englishCategory}`);
        const contests = await response.json();

        if (contests.length === 0) {
            addMessage("bot", `'${category}' 분야의 공모전이 없습니다.`);
        } else {
            let responseMessage = `'${category}' 분야의 공모전 일정은 다음과 같습니다:<br>`;
            contests.forEach((contest, index) => {
                responseMessage += `- ${index + 1}. <strong>${contest.title}</strong>: ${contest.period} (${contest.status})<br>`;
            });
            addMessage("bot", responseMessage);
        }
    } catch (error) {
        console.error("공모전 데이터 가져오기 실패:", error);
        addMessage("bot", "공모전 데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.");
    }
}

// 페이지 로드 시 챗봇 초기 상태 설정
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("chatbot-popup");
    popup.style.display = "none"; // 기본 상태는 닫힘
});
