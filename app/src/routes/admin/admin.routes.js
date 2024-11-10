"use strict";

const express = require("express");
const router = express.Router();
const adminCtrl = require("./admin.ctrl");
const isAdmin = require("./admin");

// 관리 페이지에 접근할 때 관리자 미들웨어 사용
router.get("/", isAdmin, adminCtrl.dashboard);
router.get("/posts", isAdmin, adminCtrl.managePosts);    // 기존에는 "/managePosts" 였다면 여기를 "/posts"로 통일하세요.
router.get("/users", isAdmin, adminCtrl.manageUsers);
router.get("/comments", isAdmin, adminCtrl.manageComments);

// 게시글 삭제 라우트
router.delete("/posts/:id/delete", isAdmin, adminCtrl.deletePost);

// 사용자 삭제 라우트
router.delete("/users/:id/delete", isAdmin, adminCtrl.deleteUser);

module.exports = router;
