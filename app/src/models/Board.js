// src/routes/board/board.ctrl.js
"use strict";

const BoardStorage = require("../../models/BoardStorage");

const boardController = {
    // 글쓰기 페이지 렌더링
    writePage: (req, res) => {
        res.render("home/write", { isLoggedIn: true });
    },

    // 게시글 생성 (POST 요청)
    createPost: async (req, res) => {
        const { title, contents } = req.body;
        const userId = req.session.username;

        if (!title || !contents) {
            return res.status(400).send("제목과 내용을 모두 입력하세요.");
        }

        try {
            const response = await BoardStorage.createPost({ title, contents, userId });
            res.redirect("/board/myPosts");
        } catch (err) {
            console.error("게시글 생성 오류:", err);
            res.status(500).send("게시글을 작성하는 데 실패했습니다.");
        }
    },

    // 게시글 조회 (특정 게시글)
    getPost: async (req, res) => {
        const postId = req.params.id;
        try {
            const post = await BoardStorage.getPostById(postId);
            if (!post) return res.status(404).send("해당 게시글을 찾을 수 없습니다.");
            res.render("edit", { post, isLoggedIn: true });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글을 불러오는 데 실패했습니다.");
        }
    },

    // 게시글 수정
    updatePost: async (req, res) => {
        const postId = req.params.id;
        const { title, contents } = req.body;

        if (!title || !contents) {
            return res.status(400).send("제목과 내용을 모두 입력하세요.");
        }

        try {
            const response = await BoardStorage.updatePost(postId, { title, contents });
            if (response.success) {
                res.redirect("/board/myPosts");
            } else {
                res.status(404).send("해당 게시글을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("게시글 수정 오류:", err);
            res.status(500).send("게시글을 수정하는 데 실패했습니다.");
        }
    },

    // 게시글 삭제
    deletePost: async (req, res) => {
        const postId = req.params.id;

        try {
            const response = await BoardStorage.deletePost(postId);
            if (response.success) {
                res.redirect("/board/myPosts");
            } else {
                res.status(404).send("해당 게시글을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("게시글 삭제 오류:", err);
            res.status(500).send("게시글을 삭제하는 데 실패했습니다.");
        }
    }
};

module.exports = Board;
