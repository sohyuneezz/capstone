"use strict";

const express = require("express");
const router = express.Router();
const adminCtrl = require("./admin.ctrl");
const isAdmin = require("./admin");

// 관리 페이지 접근
router.get("/", isAdmin, adminCtrl.dashboard);
router.get("/posts", isAdmin, adminCtrl.managePosts);   
router.get("/users", isAdmin, adminCtrl.manageUsers);
router.get("/comments", isAdmin, adminCtrl.manageComments);

// 게시글 삭제
router.delete("/posts/:id/delete", isAdmin, adminCtrl.deletePost);

// 사용자 삭제
router.delete("/users/:id/delete", isAdmin, adminCtrl.deleteUser);

// 댓글 삭제
router.delete("/comments/:id/delete", isAdmin, adminCtrl.deleteComment);

// 자료실 
router.get("/documents", isAdmin, adminCtrl.manageDocuments); // 자료실 목록 
router.get("/documents/write", isAdmin, adminCtrl.writeDocument); // 자료실 글 작성 
router.post("/documents/create", isAdmin, adminCtrl.createDocument); // 자료실 글 생성 
router.delete("/documents/:id/delete", isAdmin, adminCtrl.deleteDocument); // 자료실 글 삭제 



module.exports = router;
