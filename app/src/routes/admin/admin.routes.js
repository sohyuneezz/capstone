"use strict";

const express = require("express");
const router = express.Router();
const adminCtrl = require("./admin.ctrl");
const isAdmin = require("./admin");

// 관리 페이지에 접근할 때 관리자 미들웨어 사용
router.get("/", isAdmin, adminCtrl.dashboard);
router.get("/posts", isAdmin, adminCtrl.managePosts);   
router.get("/users", isAdmin, adminCtrl.manageUsers);
router.get("/comments", isAdmin, adminCtrl.manageComments);

// 게시글 삭제 라우트
router.delete("/posts/:id/delete", isAdmin, adminCtrl.deletePost);

// 사용자 삭제 라우트
router.delete("/users/:id/delete", isAdmin, adminCtrl.deleteUser);

router.delete("/comments/:id/delete", isAdmin, adminCtrl.deleteComment);

// 자료실 관련 라우트
router.get("/documents", isAdmin, adminCtrl.manageDocuments); // 자료실 목록 보기
router.get("/documents/write", isAdmin, adminCtrl.writeDocument); // 자료실 글 작성 페이지
router.post("/documents/create", isAdmin, adminCtrl.createDocument); // 자료실 글 생성 처리
router.delete("/documents/:id/delete", isAdmin, adminCtrl.deleteDocument); // 자료실 글 삭제 처리



module.exports = router;
