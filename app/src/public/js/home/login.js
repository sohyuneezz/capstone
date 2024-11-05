"use strict";

// 정보 입력 받은 후 로그인 버튼을 누를 때 서버로 전달, 로직 처리
// 자바에서 제어하기 위한 객체 DOM(문서객체모델, 일종의 인터페이스)
// DOM을 이용해서 자바스크립트에서 html을 제어할 수 있게 함
const id = document.querySelector("#id"), // 태그 정보를 개발자 임의로 선택자로 부여
    psword = document.querySelector("#psword"),
    loginBtn = document.querySelector("#btnLogin");

// 로그인 버튼 클릭 시 login 함수 호출
loginBtn.addEventListener("click", login);

function login() {
    // 아이디, 비밀번호 입력 확인
    if (!id.value) {
        alert("아이디를 입력하세요");
        return;
    }
    if (!psword.value) {
        alert("비밀번호를 입력하세요");
        return;
    }

    const req = {
        id: id.value,
        psword: psword.value,
    };

    // 서버랑 프론트를 어떤 경로로 전달할 건지 지정해줘야함
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), //문자열 객체로 저장됨
    })

    //로그인 인증 기능 
    .then((res) => res.json())
    .then((res) => {
        if (res.success) { 
            location.href = "/"; //로그인 성공 시 메인 페이지로 이동
        } else {
            alert(res.msg); // 실패할 시 서버 메시지
        }
    })
    // 에러 발생 시 에러 처리
    .catch((err) => {
        console.error("로그인 중 에러 발생");
    });
};
