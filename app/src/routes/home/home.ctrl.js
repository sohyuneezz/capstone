"use strict";

const User = require("../../models/User");
const Board = require("../../models/BoardTemp");
const BoardStorage = require("../../models/BoardStorage");
const db = require("../../config/db");

// API 구축
const output = {
    home: (req, res) => { // 이크마스크립트 문법, function hello 랑 동일한 말
        res.render("home/index", {
            isLoggedIn: req.session.isLoggedIn || false, // 세션에 로그인 상태가 있으면 전달, 없으면 false
            username: req.session.username || null // 사용자 ID도 전달 (필요에 따라 사용)
        });
    },
    login: (req, res) => { // 앞에 슬래시(루트) 뺴먹으면 작동 안됨
        res.render("home/login", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    register: (req, res) => { // 회원가입
        res.render("home/register", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    welcome: (req, res) => { // 회원가입 성공 페이지 렌더링
        res.render("home/welcome", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    editProfile: async (req, res) => {
        if (!req.session.isLoggedIn) {
            return res.redirect("/login");
        }
        const userId = req.session.username;
        const user = await User.findById(userId); // 
    
        if (user) {
            res.render("home/editprofile", { 
                isLoggedIn: true, 
                user 
            }); // 
        } else {
            res.status(404).send("회원정보를 찾을 수 없습니다.");
        }
    },
    // 메뉴 렌더링
    employmentInfo: (req, res) => { // 취업정보
        res.render("home/employment_info", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    careerMap: (req, res) => { // 로드맵
        res.render("home/careerMap", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    //연구정보
    researchInfo: (req, res) => { // 공모전일정
        res.render("home/research_info", { 
            title: "대진 On 정보-연구 정보", 
            isLoggedIn: req.session.isLoggedIn || false });
    },
    contestSchedule: (req, res) => { // 학회일정
        res.render("home/contest_schedule");
    },
    academicSites: (req, res) => { //학술 사이트
        res.render("home/academic", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    //커뮤니티
    community: (req, res) => { //공지사항
        const isLoggedIn = req.session.isLoggedIn || false; // 세션에서 로그인 상태를 확인
        const notices = [
            { title: "회원 퇴출 규칙", url: "/notice/1", date: "2024-11-05" },
            { title: "대진 On 정보 이용 수칙", url: "/notice/2", date: "2024-11-04" }
        ];
        res.render("home/community", { isLoggedIn, notices }); // isLoggedIn과 notices 전달
    },  
    document: (req, res) => { //자료실
        res.render("home/document", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    topicShare: async (req, res) => { //주제공유
        try {
            const posts = await BoardStorage.getAllPosts();
            res.render("home/share", { posts, isLoggedIn: req.session.isLoggedIn || false });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글 목록을 불러오는 데 실패했습니다.");
        }
    },
    write: (req, res) => {
        if (!req.session.isLoggedIn) {
            return res.redirect("/login");
        }
        res.render("home/write", { isLoggedIn: true, title: "글 작성" });
    },
    //취업준비
    jobPreparation: (req, res) => { // 상담
        res.render("home/job_pre", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    test: (req, res) => {
        res.render("home/test", { // 검사
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    guide: (req, res) => {
        res.render("home/guide", { // 가이드북
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    //마이페이지
    myPage: (req, res) => {
        if (!req.session.isLoggedIn) {
            return res.redirect("/login");
        }
        res.render("home/mypage", { // 마이페이지
                isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    myPosts: async (req, res) => {
        if (!req.session.isLoggedIn) return res.redirect("/login");

        const userId = req.session.username; // 세션에서 사용자 ID 가져오기
        try {
            const posts = await BoardStorage.getPostsByUserId(userId);
            res.render("home/myposts", { isLoggedIn: true, posts });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글 목록을 불러오는 데 실패했습니다.");
        }
    },
    
    viewPost: async (req, res) => {
        const postId = req.params.id;
        try {
            const post = await BoardStorage.getPostById(postId); // 게시물 정보 가져오기
            const comments = await BoardStorage.getCommentsByPostId(postId); // 댓글 가져오기
    
            if (post) {
                res.render("home/post", { 
                    post, 
                    comments, 
                    isLoggedIn: req.session.isLoggedIn, 
                    username: req.session.username // 추가
                });
            } else {
                res.status(404).send("게시물을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글과 댓글을 불러오는 데 실패했습니다.");
        }
    },

    deletePost: async (req, res) => {
        const postId = req.params.id;
        try {
            const response = await BoardStorage.deletePost(postId);
            if (response.success) {
                res.redirect("/myposts"); // 삭제 후 마이페이지로 리다이렉트
            } else {
                res.status(500).send("게시글을 삭제하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("게시글 삭제 오류:", err);
            res.status(500).send("게시글을 삭제하는 도중 오류가 발생했습니다.");
        }
    },
    editPost: async (req, res) => {
        const postId = req.params.id;
        try {
            const post = await BoardStorage.getPostById(postId); // 게시글 정보를 불러옴
            if (post) {
                res.render("home/editPost", { post, isLoggedIn: req.session.isLoggedIn });
            } else {
                res.status(404).send("게시물을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글을 불러오는 데 실패했습니다.");
        }
    },
    viewComments: async (req, res) => {
        const postId = req.params.id;
        try {
            const post = await BoardStorage.getPostById(postId); // 게시물 정보 가져오기
            const comments = await BoardStorage.getCommentsByPostId(postId); // 해당 게시물의 댓글 가져오기
    
            if (post) {
                // 게시물과 댓글을 함께 렌더링
                res.render("home/post", { 
                    post, 
                    comments, 
                    isLoggedIn: req.session.isLoggedIn, 
                    username: req.session.username // username 추가
                });
            } else {
                res.status(404).send("게시물을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글과 댓글을 불러오는 데 실패했습니다.");
        }
    }
};


const process = {
    login: async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
        if (response.success) {
            req.session.isLoggedIn = true; // 로그인 상태를 세션에 저장
            req.session.username = user.body.id; // 사용자 ID를 세션에 저장
        }
        return res.json(response);
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error("세션 삭제 중 오류 발생:", err);
                return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
            }
            res.redirect("/"); // 메인 페이지로 리다이렉트
        });
    },
    register: async (req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);

    },
    checkId: async (req, res) => { // 아이디 중복 확인 API
        const user = new User(req.body);
        const response = await user.checkId();
        return res.json(response);
    },
    updateProfile: async (req, res) => {
        const userId = req.session.username;
        const { email, grade, psword } = req.body;
    
        // 비밀번호가 없는 경우 기존 비밀번호를 유지
        const userData = { email, grade };
        if (psword) { // 비밀번호가 있을 경우에만 추가
            userData.psword = psword;
        }

        const response = await User.update(userId, userData);
        if (response.success) {
            res.json({ success: true, message: "회원정보 수정이 완료되었습니다." });
        } else {
            res.status(500).json({ success: false, message: "회원정보 수정에 실패하였습니다." });
        }
    },
    
    submitPost: async (req, res) => {
        const { title, contents } = req.body;
        const userId = req.session.username;

        if (!title || !contents) {
            return res.status(400).send("제목과 내용을 모두 입력하세요.");
        }

        try {
            const board = new Board({ userId, title, contents });
            const response = await board.create();
            if (response.success) {
                res.redirect("/share"); // 글 작성 후 주제공유 페이지로 리다이렉트
            } else {
                res.status(500).send(response.msg);
            }
        } catch (err) {
            console.error("게시글 생성 오류:", err);
            res.status(500).send(err);
        }
    },
    deletePost: async (req, res) => {
        const postId = req.params.id;

        try {
            const response = await Board.delete(postId);
            if (response.success) {
                res.redirect("/myposts");
            } else {
                res.status(500).send("게시글을 삭제하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("게시글 삭제 오류:", err);
            res.status(500).send(err);
        }
    },
    updatePost: async (req, res) => {
        const postId = req.params.id;
        const { title, contents } = req.body;
        try {
            const response = await BoardStorage.updatePost(postId, { title, contents });
            if (response.success) {
                res.redirect("/myposts"); // 수정 후 마이페이지로 리다이렉트
            } else {
                res.status(500).send("게시글을 수정하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("게시글 수정 오류:", err);
            res.status(500).send("게시글을 수정하는 도중 오류가 발생했습니다.");
        }
    },
        // 댓글 생성
    createComment: async (req, res) => {
        const { content } = req.body;
        const postId = req.params.postId;
        const userId = req.session.username; // 세션에서 사용자 ID 가져오기

        if (!content) {
            return res.status(400).send("댓글 내용을 입력하세요.");
        }

        try {
            const response = await BoardStorage.createComment({ postId, userId, content });
            if (response.success) {
                res.redirect(`/post/${postId}`); // 댓글 작성 후 게시물 페이지로 리다이렉트
            } else {
                res.status(500).send(response.msg);
            }
        } catch (err) {
            console.error("댓글 생성 오류:", err);
            res.status(500).send("댓글 작성 중 오류가 발생했습니다.");
        }
    },
    // 댓글 삭제
    deleteComment: async (req, res) => {
        const commentId = req.params.commentId;

        try {
            const response = await BoardStorage.deleteComment(commentId);
            if (response.success) {
                res.redirect(req.get("Referrer") || "/"); // 삭제 후 이전 페이지로 리다이렉트 
            } else {
                res.status(500).send("댓글을 삭제하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("댓글 삭제 오류:", err);
            res.status(500).send("댓글 삭제 중 오류가 발생했습니다.");
        }
    },

};

// 객체를 꼭 모듈로 내보내줘야 함 그래야 밖에서 사용 가능
module.exports = {
    output,
    process,
};