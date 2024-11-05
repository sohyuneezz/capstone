"use strict";

const id = document.querySelector("#id"),
    name = document.querySelector("#name"),
    psword = document.querySelector("#psword"),
    confirmPsword = document.querySelector("#confirm-psword"),
    registerBtn = document.querySelector("#register"),
    idChkBtn = document.querySelector("#idchk"); // 아이디 중복 확인 버튼

document.addEventListener("DOMContentLoaded", () => {
    // 회원가입 버튼
    registerBtn.addEventListener("click", register);
    // 아이디 중복 확인 버튼 
    idChkBtn.addEventListener("click", checkIdDuplication);
});

//회원가입 함수
function register(event) {
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
            location.href = "/"; // 홈으로 이동
        } else {
            alert(res.msg); // 실패할 시 서버에서 보내는 메시지 띄움
        }
    })
    // 에러 발생 시 에러 처리
    .catch((err) => {
        console.error("회원가입 중 에러 발생", err);
    });
}

// 아이디 중복 확인 함수
function checkIdDuplication(event) {

    if (!id.value) return alert("아이디를 입력해주십시오.");

    // 중복 확인 요청을 서버에 전송
    fetch(`/check-Id`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id.value }),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            alert("사용 가능한 아이디입니다.");
        } else {
            alert(res.msg); // 이미 사용 중인 경우 메시지 표시
        }
    })
    .catch((err) => {
        console.error("아이디 중복 확인 중 에러 발생", err);
    });
}

// 도메인 필드 자동 채우기
document.querySelector("#select").addEventListener("change", (e) => {
    const domainInput = document.querySelector("#domain");
    if (e.target.value === "directly") {
        domainInput.value = "";
        domainInput.disabled = false; // 직접 입력 가능
    } else {
        domainInput.value = e.target.value;
        domainInput.disabled = true; // 자동으로 값 설정 후 수정 불가
    }
});
