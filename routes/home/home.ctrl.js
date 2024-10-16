// 컨트롤러 분리하기
"use strict";

const home = (req, res) => { // 이크마스크립트 문법, function hello 랑 동일한 말
    res.render("home/index");
};

const login = (req, res) => { // 앞에 슬래시(루트) 뺴먹으면 작동 안됨
    res.render("home/login");
};

// 객체를 꼭 모듈로 내보내줘야 함 그래야 밖에서 사용 가능
module.exports = {
    home,
    login,
};

