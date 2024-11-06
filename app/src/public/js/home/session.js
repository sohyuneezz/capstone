// sessionHandler.js

// Helper functions
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

// Variables
let objLeftTime, objClickInfo, latestTime, expireTime;
const timeInterval = 1000; // 1초 간격 호출
let firstLocalTime = 0;
let elapsedLocalTime = 0;
let stateExpiredTime = false;
const logoutUrl = "/auth/actionLogout.do";
let timer;

// Initialize session timer
function init() {
    objLeftTime = document.getElementById("leftTimeInfo");
    if (objLeftTime == null) return;

    objClickInfo = document.getElementById("clickInfo");
    latestTime = getCookie("egovLatestServerTime");
    expireTime = getCookie("egovExpireSessionTime");

    firstLocalTime = (new Date()).getTime();
    showRemaining();

    timer = setInterval(showRemaining, timeInterval);
}

// Display remaining session time
function showRemaining() {
    elapsedLocalTime = (new Date()).getTime() - firstLocalTime;

    const timeRemaining = expireTime - latestTime - elapsedLocalTime;
    if (timeRemaining < timeInterval) {
        clearInterval(timer);
        objLeftTime.innerHTML = "00:00:00";
        objClickInfo.textContent = '시간만료';
        stateExpiredTime = true;
        alert('로그인 세션시간이 만료 되었습니다.');
        
        $("#sessionInfo").hide();
        parent.frames["_content"].location.href = logoutUrl;

        return;
    }
    const timeHour = Math.floor(timeRemaining / 1000 / 60 / 60);
    const timeMin = Math.floor((timeRemaining / 1000 / 60) % 60);
    const timeSec = Math.floor((timeRemaining / 1000) % 60);

    objLeftTime.innerHTML = `${pad(timeHour, 2)}:${pad(timeMin, 2)}:${pad(timeSec, 2)}`;
}

// AJAX request to refresh session
function reqTimeAjax() {
    if (stateExpiredTime) {
        alert('시간을 연장할수 없습니다.');
        return;
    }

    $.ajax({
        url: '/uat/uia/refreshSessionTimeout.do',
        type: 'get',
        success: function(data) {
            latestTime = getCookie("egovLatestServerTime");
            expireTime = getCookie("egovExpireSessionTime");
            init();
        },
        error: function(err) {
            alert("오류 발생: " + err.statusText);
        }
    });
    return false;
}

// Logout function
function logout() {
    if (confirm("로그아웃을 진행 하시겠습니까?")) {
        location.href = logoutUrl;
    }
}

// Initialize session timer on document ready
$(document).ready(() => {
    init();
});
