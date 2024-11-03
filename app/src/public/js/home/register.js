"use strict";

const id = document.querySelector("#id"),
    name = document.querySelector("#name"),
    psword = document.querySelector("#psword"),
    confirmPsword = document.querySelector("#confirm-psword"),
    registerBtn = document.querySelector("#button");

registerBtn.addEventListener("click", register);

function register() {
    if (!id.value) return alert("아이디를 입력해주십시오.");
    if (psword.value !== confirmPsword.value) {
        return alert("비밀번호가 일치하지 않습니다.");
    }
    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
    };

    // 서버랑 프론트를 어떤 경로로 전달할 건지 지정해줘야함
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), //문자열 객체로 저장됨
    })
    //로그인 인증 기능 
    .then((res) => res.json())
    .then((res) => {
        if (res.success) { // res 가 트루이면 링크로 이동시키기
            location.href = "/"; // 이동할 링크 걸기(지금은 루트경로)
        } else {
            alert(res.msg); // 실패할 시 서버에서 보내는 메시지 띄움
        }
    });
    // 에러 발생 시 에러 처리
    // .catch((err) => {
    //     console.error("회원가입 중 에러 발생");
    // });
}
