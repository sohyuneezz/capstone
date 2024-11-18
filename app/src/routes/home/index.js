"use  strict"; // 자바스크립트 파일 만들 때 상단에 이크마 스크립트 문법을 준수하겠다 명시하는 게 좋음

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

// router 는 클라이언트의 요청을 연결해주는 부분

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/logout", ctrl.process.logout); // 로그아웃 경로 설정
router.get("/welcome", ctrl.output.welcome); // 회원가입 완료 페이지 추가
router.get("/editprofile", ctrl.output.editProfile);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
router.post("/check-id", ctrl.process.checkId); // 아이디 중복 확인 라우트 추가
router.post("/update-profile", ctrl.process.updateProfile);
router.post("/submit", ctrl.process.submitPost);
// 검색 요청 처리
router.post("/search", ctrl.output.search);
// 각 게시판에서의 검색 처리 라우팅
router.post("/community/search", ctrl.output.searchCommunity);
router.post("/document/search", ctrl.output.searchDocument);
router.post("/share/search", ctrl.output.searchShare);

// 메뉴 라우팅
router.get("/employment_info", ctrl.output.employmentInfo);
router.get("/careerMap", ctrl.output.careerMap);
router.get("/research_info", ctrl.output.researchInfo);
router.get("/academic", ctrl.output.academicSites);
router.get("/community", ctrl.output.community);
router.get("/document", ctrl.output.document);
router.get("/documents/:id", ctrl.output.documentDetail);

router.get("/share", ctrl.output.topicShare);
router.get("/guide", ctrl.output.guide);
router.get("/mypage", ctrl.output.myPage);
router.get("/myposts", ctrl.output.myPosts);
router.get("/job_pre", ctrl.output.jobPreparation); 
router.get("/test", ctrl.output.test);

router.get("/write", ctrl.output.write);
router.get("/post/:id", ctrl.output.viewPost);
router.get("/delete/:id", ctrl.process.deletePost); 
router.get("/edit/:id", ctrl.output.editPost); 
router.post("/edit/:id", ctrl.process.updatePost); 

// 댓글
router.post("/post/:id/comment", ctrl.process.createComment); 
// 라우터에 댓글 삭제 경로 추가
router.delete("/comment/:id", ctrl.process.deleteComment);


// Flask에서 그래프 이미지를 가져오는 경로
router.get("/graph", ctrl.output.getGraph);

// 신규 추가: /sbn 라우트
router.get("/sbn", ctrl.output.sbn);

router.get("/api/contests", ctrl.output.getContests);


module.exports = router;