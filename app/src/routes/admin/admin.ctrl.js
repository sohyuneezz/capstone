"use strict";

const BoardStorage = require("../../models/BoardStorage");
const UserStorage = require("../../models/UserStorage");

const adminCtrl = {
    dashboard: (req, res) => {
        res.render("admin/dashboard", {
            isLoggedIn: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
            username: req.session.username,
        });
    },

    managePosts: async (req, res) => {
        try {
            const posts = await BoardStorage.getAllPosts(); // 게시글 데이터 가져오기
            res.render("admin/managePosts", {
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
                username: req.session.username,
                posts, // 가져온 게시글 데이터를 EJS로 전달
            });
        } catch (err) {
            console.error("게시글 불러오기 오류:", err);
            res.status(500).send("게시글을 불러오는 데 실패했습니다.");
        }
    },

    manageUsers: async (req, res) => {
        try {
            const users = await UserStorage.getAllUsers(); // 모든 사용자 데이터 가져오기
            res.render("admin/manageUsers", {
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
                username: req.session.username,
                users,
            });
        } catch (err) {
            console.error("회원 정보 불러오기 오류:", err);
            res.status(500).send("회원 정보를 불러오는 데 실패했습니다.");
        }
    },

    manageComments: async (req, res) => {
        try {
            const comments = await BoardStorage.getAllComments(); // 댓글 데이터 가져오기
            res.render("admin/manageComments", {
                isLoggedIn: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
                username: req.session.username,
                comments,
            });
        } catch (err) {
            console.error("댓글 정보 불러오기 오류:", err);
            res.status(500).send("댓글 정보를 불러오는 데 실패했습니다.");
        }
    },
    deletePost: async (req, res) => {
        const postId = req.params.id;
        try {
            const response = await BoardStorage.deletePost(postId);
            if (response.success) {
                res.redirect("/admin/posts"); // 삭제 후 관리 페이지로 리다이렉트
            } else {
                res.status(500).send("게시글을 삭제하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("게시글 삭제 오류:", err);
            res.status(500).send("게시글을 삭제하는 도중 오류가 발생했습니다.");
        }
    },

    // 사용자 삭제 함수
    deleteUser: async (req, res) => {
        const userId = req.params.id; // URL 파라미터로 아이디 받기
        try {
            const response = await UserStorage.deleteUser(userId); // UserStorage의 삭제 메서드 호출
            if (response.success) {
                res.redirect("/admin/users"); // 삭제 후 사용자 관리 페이지로 리다이렉트
            } else {
                res.status(500).send("사용자를 삭제하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("사용자 삭제 오류:", err);
            res.status(500).send("사용자를 삭제하는 도중 오류가 발생했습니다.");
        }
    },    
};


module.exports = adminCtrl;
