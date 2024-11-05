"use  strict"; // 자바스크립트 파일 만들 때 상단에 이크마 스크립트 문법을 준수하겠다 명시하는 게 좋음

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

// router 는 클라이언트의 요청을 연결해주는 부분
// "/login" 이 요청, (req, res)~ 부터가 실제 수행하는 부분 = 컨트롤러  
// router.get("/login", (req, res) => { // 앞에 슬래시(루트) 뺴먹으면 작동 안됨
//     res.render("home/login");
// });

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
router.post("/check-id", ctrl.process.checkId); // 아이디 중복 확인 라우트 추가

module.exports = router;
 