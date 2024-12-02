"use  strict"; // 이크마 스크립트 문법

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

// router 는 클라이언트의 요청을 연결해주는 부분

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/logout", ctrl.process.logout); 
router.get("/welcome", ctrl.output.welcome); 
router.get("/editprofile", ctrl.output.editProfile);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
router.post("/check-id", ctrl.process.checkId); 
router.post("/update-profile", ctrl.process.updateProfile);
router.post("/submit", ctrl.process.submitPost);

// 검색 
router.post("/search", ctrl.output.search);
router.post("/community/search", ctrl.output.searchCommunity);
router.post("/document/search", ctrl.output.searchDocument);
router.post("/share/search", ctrl.output.searchShare);

// 메뉴 
router.get("/employment_info", ctrl.output.employmentInfo);
router.get("/careerMap", ctrl.output.careerMap);
router.get("/research_info", ctrl.output.researchInfo);
router.get("/academic", ctrl.output.academicSites);
router.get("/community", ctrl.output.community);
router.get("/document", ctrl.output.document);
router.get("/documents/:id", ctrl.output.documentDetail);

router.get("/share", ctrl.output.topicShare);
router.get("/guide", ctrl.output.guide);
router.get("/myposts", ctrl.output.myPosts);
router.get("/job_pre", ctrl.output.jobPreparation); 
router.get("/test", ctrl.output.test);
router.get("/sbn", ctrl.output.sbn);

router.get("/write", ctrl.output.write);
router.get("/post/:id", ctrl.output.viewPost);
router.get("/delete/:id", ctrl.process.deletePost); 
router.get("/edit/:id", ctrl.output.editPost); 
router.post("/edit/:id", ctrl.process.updatePost); 

router.post("/post/:id/comment", ctrl.process.createComment); 
router.delete("/comment/:id", ctrl.process.deleteComment);

// 그래프 이미지
router.get("/graph", ctrl.output.getGraph);

// 공모전 일정
router.get("/api/contests", ctrl.output.getContests);

// recruit 페이지와 API 라우트 추가
router.get("/recruit", ctrl.output.recruitPage); // 채용 공고 페이지 렌더링
router.get("/api/recruit", ctrl.process.getRecruitNoti); // 채용 공고 데이터


module.exports = router;