function getCookie(cname) { /* 기존 getCookie 함수 내용 */ }
function pad(n, width) { /* 기존 pad 함수 내용 */ }

let objLeftTime, objClickInfo, latestTime, expireTime;
const timeInterval = 1000; // 1초 간격 호출
let firstLocalTime = 0;
let elapsedLocalTime = 0;
let stateExpiredTime = false;
const logoutUrl = "/auth/actionLogout.do";
let timer;

function init() { /* 기존 init 함수 내용 */ }
function showRemaining() { /* 기존 showRemaining 함수 내용 */ }
function reqTimeAjax() { /* 기존 reqTimeAjax 함수 내용 */ }
function logout() { /* 기존 logout 함수 내용 */ }
