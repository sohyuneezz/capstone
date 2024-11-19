//설정안함
function getCookie(cname) {
    console.log(`쿠키 가져오기: ${cname}`);
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            console.log(`쿠키 값: ${c.substring(name.length, c.length)}`);
            return c.substring(name.length, c.length);
        }
    }
    console.log("쿠키가 없습니다.");
    return "";
}

function pad(n, width) {
    console.log(`숫자 채우기: ${n}, 너비: ${width}`);
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

// 변수 선언
let objLeftTime, objClickInfo, latestTime, expireTime;
const timeInterval = 1000; // 1초 간격 호출
let firstLocalTime = 0;
let elapsedLocalTime = 0;
let stateExpiredTime = false;
const logoutUrl = "/auth/actionLogout.do";
let timer;

// 세션 타이머 초기화
function init() {
    objLeftTime = document.getElementById("leftTimeInfo");
    if (objLeftTime == null) {
        return;
    }

    objClickInfo = document.getElementById("clickInfo");
    latestTime = getCookie("egovLatestServerTime");
    expireTime = getCookie("egovExpireSessionTime");

    firstLocalTime = (new Date()).getTime();
    console.log(`첫 로컬 시간 설정: ${firstLocalTime}`);
    showRemaining();

    timer = setInterval(showRemaining, timeInterval);
    console.log("세션 타이머 시작.");
}

// 남은 세션 시간 표시
function showRemaining() {
    console.log("남은 세션 시간 계산 중...");
    elapsedLocalTime = (new Date()).getTime() - firstLocalTime;

    const timeRemaining = expireTime - latestTime - elapsedLocalTime;
    console.log(`남은 시간: ${timeRemaining}ms`);
    if (timeRemaining < timeInterval) {
        clearInterval(timer);
        objLeftTime.innerHTML = "00:00:00";
        objClickInfo.textContent = '시간 만료';
        stateExpiredTime = true;
        alert('로그인 세션 시간이 만료되었습니다.');
        
        $("#sessionInfo").hide();
        parent.frames["_content"].location.href = logoutUrl;
        console.log("세션이 만료되어 로그아웃 URL로 리디렉션합니다.");
        return;
    }

    const timeHour = Math.floor(timeRemaining / 1000 / 60 / 60);
    const timeMin = Math.floor((timeRemaining / 1000 / 60) % 60);
    const timeSec = Math.floor((timeRemaining / 1000) % 60);
    objLeftTime.innerHTML = `${pad(timeHour, 2)}:${pad(timeMin, 2)}:${pad(timeSec, 2)}`;
    console.log(`남은 시간 표시: ${objLeftTime.innerHTML}`);
}

// AJAX 요청으로 세션 연장
function reqTimeAjax() {
    console.log("세션 연장 시도 중...");
    if (stateExpiredTime) {
        alert('시간을 연장할 수 없습니다.');
        console.log("세션 연장 실패: 세션이 이미 만료되었습니다.");
        return;
    }

    $.ajax({
        url: '/uat/uia/refreshSessionTimeout.do',
        type: 'get',
        success: function(data) {
            console.log("세션 연장 성공:", data);

            latestTime = getCookie("egovLatestServerTime");
            expireTime = getCookie("egovExpireSessionTime");
            init();
        },
        error: function(err) {
            console.error("오류 발생:", err);
            alert("오류 발생: " + err.statusText);
        }
    });
    console.log("세션 연장 요청 전송됨.");
    return false;
}

// 로그아웃 함수
function logout() {
    if (confirm("로그아웃을 진행하시겠습니까?")) {
        console.log("로그아웃 확인됨.");
        location.href = logoutUrl;
    } else {
        console.log("로그아웃 취소됨.");
    }
}

// 문서가 준비되면 세션 타이머 초기화
$(document).ready(() => {
    init();
});
