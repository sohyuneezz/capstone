"use strict";

// 정보 입력 받은 후 로그인 버튼을 누를 때 서버로 전달, 로직 처리
// 자바에서 제어하기 위한 객체 DOM(문서객체모델, 일종의 인터페이스)
// DOM을 이용해서 자바스크립트에서 html을 제어할 수 있게 함
const id = document.querySelector("#id"), // 태그 정보를 개발자 임의로 선택자로 부여
    psword = document.querySelector("#psword"),
    loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", login);

function login() {
    const req = {
        id: id.value,
        psword: psword.value,
    };
    console.log(req);   
}
