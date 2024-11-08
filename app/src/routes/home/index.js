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
router.get("/logout", ctrl.process.logout); // 로그아웃 경로 설정
router.get("/welcome", ctrl.output.welcome); // 회원가입 완료 페이지 추가

router.get("/deletePost/:id", ctrl.process.deletePost);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
router.post("/check-id", ctrl.process.checkId); // 아이디 중복 확인 라우트 추가
router.post("/update-profile", ctrl.process.updateProfile);
router.post("/submitPost", ctrl.process.submitPost);

// 메뉴 라우팅
router.get("/employment_info", ctrl.output.employmentInfo);
router.get("/careerMap", ctrl.output.careerMap);

router.get("/research_info", ctrl.output.researchInfo);
router.get("/contest_schedule", ctrl.output.contestSchedule);
router.get("/academic", ctrl.output.academicSites);

router.get("/community", ctrl.output.community);
router.get("/document", ctrl.output.document);
router.get("/share", ctrl.output.topicShare);
router.get("/write", ctrl.output.write);

router.get("/job_pre", ctrl.output.jobPreparation);
router.get("/test", ctrl.output.test);

router.get("/guide", ctrl.output.guide);
router.get("/mypage", ctrl.output.myPage);
router.get("/myposts", ctrl.output.myPosts);
router.get("/editprofile", ctrl.output.editProfile);


module.exports = router;