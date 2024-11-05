"use strict";

const id = document.querySelector("#id"),
    name = document.querySelector("#name"),
    psword = document.querySelector("#psword"),
    confirmPsword = document.querySelector("#confirm-psword"),
    grade = document.querySelector("#grade-select"),  // 학년 선택 필드
    email = document.querySelector("#emailId"),       // 이메일 필드
    domain = document.querySelector("#domain"),
    registerBtn = document.querySelector("#register"),
    idChkBtn = document.querySelector("#idchk"); // 아이디 중복 확인 버튼

let isIdChecked = false; // 아이디 중복 확인 여부

document.addEventListener("DOMContentLoaded", () => {
    // 회원가입 버튼
    registerBtn.addEventListener("click", register);
    // 아이디 중복 확인 버튼 
    idChkBtn.addEventListener("click", checkIdDuplication);
});

//회원가입 함수
function register(event) {
    event.preventDefault(); // 기본 폼 제출 막기

    // 입력값 검증 순서대로 체크
    if (!name.value) {
        alert("이름을 입력해주십시오.");
        return;
    }
    if (grade.value === "directly") {
        alert("학년을 선택해주십시오.");
        return;
    }
    if (!id.value) {
        alert("아이디를 입력해주십시오.");
        return;
    }
    if (!isIdChecked) {
        alert("아이디 중복확인을 해주세요.");
        return;
    }
    if (!psword.value) {
        alert("비밀번호를 입력해주십시오.");
        return;
    }
    if (psword.value !== confirmPsword.value) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }
    if (!email.value || !domain.value) {
        alert("이메일을 입력해주십시오.");
        return;
    }

    // 이메일 주소 완성
    const fullEmail = `${email.value}@${domain.value}`;

    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
        grade: grade.value,
        email: fullEmail     
    };
    
    // 서버로 회원가입 요청 전송
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

// 아이디 중복확인 함수에서 중복확인이 완료되면 isIdChecked를 true로 설정
function checkIdDuplication(event) {
    if (!id.value) return alert("아이디를 입력해주십시오.");

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
            isIdChecked = true; // 중복확인 완료
        } else {
            alert(res.msg);
            isIdChecked = false;
        }
    })
    .catch((err) => {
        console.error("아이디 중복 확인 중 에러 발생", err);
        isIdChecked = false;
    });
}

// 도메인 필드 자동 채우기
document.querySelector("#select").addEventListener("change", (e) => {
    const domainInput = document.querySelector("#domain");
    if (e.target.value === "directly") {
        domainInput.value = "@"; // 직접 입력 시 기본값으로 @만 남김
        domainInput.disabled = false; // 직접 입력 가능
    } else {
        domainInput.value = "@" + e.target.value; // 선택한 도메인을 @ 뒤에 추가
        domainInput.disabled = true; // 자동으로 값 설정 후 수정 불가
    }
});
