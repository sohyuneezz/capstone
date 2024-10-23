// 컨트롤러 분리하기
"use strict";

// API 구축
const output = {
    home: (req, res) => { // 이크마스크립트 문법, function hello 랑 동일한 말
        res.render("home/index");
    },
    login: (req, res) => { // 앞에 슬래시(루트) 뺴먹으면 작동 안됨
        res.render("home/login");
    },
};

const users = {
    id: ["csh4540", "최강컴공", "캡스톤"],
    psword: ["1234", "1234", "1234"],
};

const process = {
    login: (req, res) => {
        const id = req.body.id,
            psword = req.body.psword;
        
        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.psword[idx] === psword) {
                return res.json ({
                    success: true,
                });
            }
        }
        
        return res.json({
            success: false,
            msg: "로그인에 실패하셨습니다.",
        });
    },
};

// 객체를 꼭 모듈로 내보내줘야 함 그래야 밖에서 사용 가능
module.exports = {
    output,
    process,
};

