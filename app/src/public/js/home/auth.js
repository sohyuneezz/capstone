"use strict";

// 정보 입력 받은 후 로그인 버튼을 누를 때 서버로 전달, 로직 처리
// 자바에서 제어하기 위한 객체 DOM(문서객체모델, 일종의 인터페이스)
// DOM을 이용해서 자바스크립트에서 html을 제어할 수 있게 함
const id = document.querySelector("#id"), // 태그 정보를 개발자 임의로 선택자로 부여
    psword = document.querySelector("#psword"),
    loginBtn = document.querySelector("#btnLogin"),
    name = document.querySelector("#name"),
    confirmPsword = document.querySelector("#confirm-psword"),
    grade = document.querySelector("#grade-select"),  // 학년 선택 필드
    email = document.querySelector("#emailId"),       // 이메일 필드
    domain = document.querySelector("#domain"),
    registerBtn = document.querySelector("#register"),
    idChkBtn = document.querySelector("#idchk"),
    domainSelect = document.querySelector("#select"); // 이메일 도메인 선택 필드

let isIdChecked = false; // 아이디 중복 확인 여부

// 페이지가 로드된 후 이벤트 핸들러 추가
document.addEventListener("DOMContentLoaded", () => {
    if (loginBtn) loginBtn.addEventListener("click", login); // 로그인 버튼 클릭 이벤트
    if (registerBtn) registerBtn.addEventListener("click", register); // 회원가입 버튼 클릭 이벤트
    if (idChkBtn) idChkBtn.addEventListener("click", checkIdDuplication); // 아이디 중복 확인 버튼 클릭 이벤트
    if (domainSelect) domainSelect.addEventListener("change", updateDomain); // 이메일 도메인 자동 채우기
});

// 로그인 함수
function login() {
    if (!id.value) return alert("아이디를 입력하세요");
    if (!psword.value) return alert("비밀번호를 입력하세요");

    const req = {
        id: id.value,
        psword: psword.value,
    };
    // 서버랑 프론트 경로 지정
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req), //문자열 객체로 저장
    })
    //로그인 인증 기능
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = "/"; // 로그인 성공 시 메인 페이지로 이동
        } else {
            alert(res.msg); // 로그인 실패 시 서버에서 보내는 메시지 표시
        }
    })
    // 에러 발생 시 에러 처리
    .catch((err) => {
        console.error("로그인 중 에러 발생", err);
    });
}

// 회원가입 함수
function register(event) {
    event.preventDefault(); // 기본 폼 제출 막기

    // 입력값 검증
    if (!name.value) return alert("이름을 입력해주십시오.");
    if (grade.value === "directly") return alert("학년을 선택해주십시오.");
    if (!id.value) return alert("아이디를 입력해주십시오.");
    if (!isIdChecked) return alert("아이디 중복확인을 해주세요.");
    if (!psword.value) return alert("비밀번호를 입력해주십시오.");
    if (psword.value !== confirmPsword.value) return alert("비밀번호가 일치하지 않습니다.");
    if (!email.value || !domain.value) return alert("이메일을 입력해주십시오.");

    // 이메일 주소 완성
    const fullEmail = `${email.value}@${domain.value}`;

    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
        grade: grade.value,
        email: fullEmail,
    };
    // 서버로 회원가입 요청 전송
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = "/"; // 회원가입 성공 시 홈으로 이동
        } else {
            alert(res.msg); // 회원가입 실패 시 서버에서 보내는 메시지 표시
        }
    })
    .catch((err) => {
        console.error("회원가입 중 에러 발생", err);
    });
}

// 아이디 중복 확인 함수
function checkIdDuplication() {
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
            isIdChecked = true; // 중복 확인 성공
        } else {
            alert(res.msg);
            isIdChecked = false; // 중복 확인 실패
        }
    })
    .catch((err) => {
        console.error("아이디 중복 확인 중 에러 발생", err);
        isIdChecked = false;
    });
}

// 이메일 도메인 자동 채우기 함수
function updateDomain(e) {
    if (!domain) return; // 도메인 필드가 없으면 실행 중지

    if (e.target.value === "directly") {
        domain.value = "@"; // 직접 입력 시 기본값으로 @만 남김
        domain.disabled = false; // 직접 입력 가능
    } else {
        domain.value = "@" + e.target.value; // 선택한 도메인을 @ 뒤에 추가
        domain.disabled = true; // 자동 설정 후 수정 불가
    }
}
