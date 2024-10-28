"use strict";

const id = document.querySelector("#id"),
    name = document.querySelector("name"),
    psword = document.querySelector("#psword"),
    confirmPsword = document.querySelector("#confirm-psword"),
    registerBtn = document.querySelector("#btnregister");

registerBtn.addEventListener("click", register);

function register() {
    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
        confirmPsword: confirmPsword.value,
    };
    console.log(req);
    // 서버랑 프론트를 어떤 경로로 전달할 건지 지정해줘야함
    // fetch("/register", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(req), //문자열 객체로 저장됨
    // })
    // //로그인 인증 기능 
    // .then((res) => res.json())
    // .then((res) => {
    //     if (res.success) { // res 가 트루이면 링크로 이동시키기
    //         location.href = "/"; // 이동할 링크 걸기(지금은 루트경로)
    //     } else {
    //         alert(res.msg); // 실패할 시 서버에서 보내는 메시지 띄움
    //     }
    // });
    // // 에러 발생 시 에러 처리
    // // .catch((err) => {
    // //     console.error("로그인 중 에러 발생");
    // // });
}
