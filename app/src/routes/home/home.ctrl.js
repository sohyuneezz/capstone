"use strict";

const User = require("../../models/User");
const Board = require("../../models/BoardTemp");
const UserStorage = require("../../models/UserStorage"); 
const BoardStorage = require("../../models/BoardStorage");
const db = require("../../config/db");
const { getUserInfo } = require("../../models/UserStorage");
const axios = require("axios");


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
        const user = await User.findById(userId); 
    
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
    // 자료실 페이지
    document: async (req, res) => {
        const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값: 1)
        const limit = 10; // 페이지당 게시글 수
        const offset = (page - 1) * limit;

        try {
            // 현재 페이지의 자료실 게시글 가져오기
            const documents = await BoardStorage.getPostsByCategory('document', page, limit);
            
            // 전체 자료실 게시글 수 가져오기
            const totalDocuments = await BoardStorage.countPostsByCategory('document');
            const totalPages = Math.ceil(totalDocuments / limit); // 전체 페이지 수 계산

            // EJS로 데이터 전달
            res.render("home/document", { 
                documents, 
                currentPage: page, 
                totalPages,
                isLoggedIn: req.session.isLoggedIn || false,
                isAdmin: req.session.isAdmin || false,
                username: req.session.username || ""
            });
        } catch (err) {
            console.error("자료실 글 조회 오류:", err);
            res.status(500).send("자료실 글을 불러오는 데 실패했습니다.");
        }
    },
    documentDetail: async (req, res) => {
        const postId = req.params.id;
    
        try {
            // 게시글 상세 정보 가져오기
            const post = await BoardStorage.getPostById(postId);
    
            if (!post) {
                return res.status(404).send("해당 게시글을 찾을 수 없습니다.");
            }
    
            // 자료실에서는 댓글 없이 게시글만 렌더링
            res.render("home/post", {
                post,
                isLoggedIn: req.session.isLoggedIn || false,
                isAdmin: req.session.isAdmin || false,
                username: req.session.username || ""
            });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글을 불러오는 도중 오류가 발생했습니다.");
        }
    },
    
    //커뮤니티
    community: async (req, res) => {
        const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값: 1)
        const limit = 10; // 페이지당 게시글 수
        const offset = (page - 1) * limit;

        try {
            // 현재 페이지의 게시글 가져오기
            const posts = await BoardStorage.getPostsByCategory('community', page, limit);
            
            // 전체 게시글 수 가져오기
            const totalPosts = await BoardStorage.countPostsByCategory('community');
            const totalPages = Math.ceil(totalPosts / limit); // 전체 페이지 수 계산

            // EJS로 데이터 전달 (currentPage와 totalPages를 추가)
            res.render("home/community", { 
                posts, 
                currentPage: page, 
                totalPages,
                isLoggedIn: req.session.isLoggedIn || false 
            });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글 목록을 불러오는 데 실패했습니다.");
        }
    },
    
    topicShare: async (req, res) => {
        const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값: 1)
        const limit = 10; // 페이지당 게시글 수
        const offset = (page - 1) * limit;

        try {
            // 현재 페이지의 게시글 가져오기
            const posts = await BoardStorage.getPostsByCategory('share', page, limit);
            
            // 전체 게시글 수 가져오기
            const totalPosts = await BoardStorage.countPostsByCategory('share');
            const totalPages = Math.ceil(totalPosts / limit); // 전체 페이지 수 계산

            // EJS로 데이터 전달
            res.render("home/share", { 
                posts, 
                currentPage: page, 
                totalPages,
                isLoggedIn: req.session.isLoggedIn || false 
            });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글 목록을 불러오는 데 실패했습니다.");
        }
    },

    //글쓰기
    write: (req, res) => {
        if (!req.session.isLoggedIn) {
            return res.redirect("/login");
        }
        const userId = req.session.username;
        const category = req.query.category || "share"; // 카테고리를 URL 쿼리로 받음
        res.render("home/write", { isLoggedIn: true, userId, category, title: "글 작성" });
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
    myPage: (req, res) => { // 학습진척도 - 수정예정
        if (!req.session.isLoggedIn) {
            return res.redirect("/login");
        }
        res.render("home/mypage", { 
                isLoggedIn: req.session.isLoggedIn || false 
        });
    },

    myPosts: async (req, res) => {
        if (!req.session.isLoggedIn) return res.redirect("/login");

        const userId = req.session.username; 
        const username = req.session.username; // 세션에서 username 가져오기
        try {
            const posts = await BoardStorage.getPostsByUserId(userId);
            const comments = await BoardStorage.getCommentsByUserId(userId); // 사용자 댓글 가져오기
            res.render("home/myposts", { isLoggedIn: true, posts, comments, username });
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글 목록을 불러오는 데 실패했습니다.");
        }
    },
    
    
    viewPost: async (req, res) => {
        const postId = req.params.id;  // URL에서 게시물 ID 가져오기
        try {
            // BoardStorage를 사용하여 게시글과 댓글을 조회
            const post = await BoardStorage.getPostById(postId);
            const comments = await BoardStorage.getCommentsByPostId(postId);  // 댓글 목록 가져오기
            const isLoggedIn = req.session.isLoggedIn || false;
            const username = req.session.username || null;  
    
            if (post) {
                res.render("home/post", { 
                    post, 
                    comments, 
                    isLoggedIn,
                    username  
                });
            } else {
                res.status(404).send("게시물을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("게시글 조회 오류:", err);
            res.status(500).send("게시글을 불러오는 데 실패했습니다.");
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
            const post = await BoardStorage.getPostById(postId);
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
    // 검색 요청 처리 (변경 사항 반영)
    search: async (req, res) => {
        const query = req.body.query.trim().toLowerCase();
        const category = req.body.category || '';
    
        if (!query) {
            return res.render('home/search', {  
                categorizedResults: [], 
                error: '검색어를 입력하세요', 
                isLoggedIn: req.session.isLoggedIn || false, 
                username: req.session.username || null
            });
        }
    
        try {
            let sql = `
                SELECT * 
                FROM posts 
                WHERE (LOWER(title) LIKE ? OR LOWER(contents) LIKE ?)
            `;
            let params = [`%${query}%`, `%${query}%`];
    
            if (category) {
                sql += ' AND category = ?';
                params.push(category);
            }
    
            const [results] = await new Promise((resolve, reject) => {
                db.query(sql, params, (error, results) => {
                    if (error) reject(error);
                    else resolve([results]);
                });
            });
    
            const categorizedResults = {
                '자료실': [],
                '주제공유': [], // 기존 'share'를 '주제공유'로 변경
                '자유게시판': []
            };
            
            results.forEach(item => {
                if (item.category === 'share') {
                    categorizedResults['주제공유'].push(item); // '주제공유'로 추가
                } else if (item.category === 'document') {
                    categorizedResults['자료실'].push(item);
                } else if (item.category === 'community') {
                    categorizedResults['자유게시판'].push(item);
                }
            });
            
    
            res.render('home/search', { 
                categorizedResults, 
                error: null,  
                isLoggedIn: req.session.isLoggedIn || false,
                username: req.session.username || null
            });
        } catch (error) {
            console.error("Database Error:", error);
            res.render('home/search', {  
                categorizedResults: [], 
                error: '검색 중 오류가 발생했습니다.',
                isLoggedIn: req.session.isLoggedIn || false,
                username: req.session.username || null
            });
        }
    },
    getGraph: async (req, res) => {
        console.log("getGraph 함수 호출됨");
        try {
            // Flask 서버에서 그래프 이미지 가져오기
            const response = await axios.get("http://127.0.0.1:5000/graph", {
                responseType: "arraybuffer", // 이미지 데이터를 배열 버퍼 형식으로 처리
            });

            // 클라이언트에 그래프 이미지 전송
            res.set("Content-Type", "image/png");
            res.send(response.data);
        } catch (error) {
            console.error("Flask 서버에서 그래프 가져오기 실패:", error.message);
            res.status(500).send("그래프를 가져오는 데 실패했습니다.");
        }
    },
    sbn: (req, res) => {
        res.render("home/sbn", {
            title: "대진 On 정보 - 졸업자 취업 현황",
            isLoggedIn: req.session.isLoggedIn || false,
        });
    },
     // 공모전 데이터 가져오기
    getContests: async (req, res) => {
        const category = req.query.category || ""; // 카테고리 파라미터 가져오기

        try {
            // 데이터베이스에서 카테고리에 맞는 공모전 데이터 가져오기
            const sql = category
                ? `SELECT * FROM contests WHERE category = ?`
                : `SELECT * FROM contests`;

            const results = await db.query(sql, [category]); // Promisify된 db.query 사용
            res.json(results); // JSON 데이터 반환
        } catch (error) {
            console.error("데이터 가져오기 실패:", error.message);
            res.status(500).json({ error: "데이터 가져오기 실패" });
        }
    },
};


const process = {
    login: async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
        if (response.success) {
            const userInfo = await UserStorage.getUserInfo(user.body.id); // 사용자의 모든 정보 가져오기
            req.session.isLoggedIn = true; // 로그인 상태를 세션에 저장
            req.session.username = userInfo.id; // 사용자 ID를 세션에 저장
            req.session.isAdmin = userInfo.isAdmin; // 사용자 관리자인지 여부를 세션에 저장

            
            // 관리자 여부에 따른 응답을 JSON 형태로 반환
            if (userInfo.isAdmin) {
                return res.json({ success: true, redirectUrl: "/admin" }); // 관리자는 관리자 페이지로 이동
            } else {
                return res.json({ success: true, redirectUrl: "/" }); // 일반 사용자는 홈 페이지로 이동
            }
        } else {
            // 로그인 실패 시 JSON 형태로 응답
            return res.json({ success: false, msg: response.msg });
        }
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
    checkId: async (req, res) => { // 아이디 중복 확인 
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
        const userId = req.session.username; // 로그인된 사용자의 ID 가져오기
        const { title, contents, category } = req.body; // 폼에서 받은 데이터
        
        if (!userId || !title || !contents || !category) {
            return res.status(400).send("제목, 내용, 카테고리 모두 입력해야 합니다.");
        }

        try {
            const postData = { userId, title, contents, category };
            const response = await BoardStorage.createPost(postData); // 게시글 저장
            if (response.success) {
                // 저장 성공 후 카테고리에 맞는 페이지로 리다이렉트
                if (category === "share") {
                    res.redirect("/share");
                } else {
                    res.redirect("/community");
                }
            } else {
                res.status(500).send(response.msg);
            }
        } catch (err) {
            console.error("게시글 작성 중 오류:", err);
            res.status(500).send("게시글 작성에 실패했습니다.");
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
        const { title, contents, category } = req.body;  // 카테고리도 받아오기
        try {
            const response = await BoardStorage.updatePost(postId, { title, contents, category });
            if (response.success) {
                res.redirect(`/${category}`); // 수정 후 해당 카테고리 페이지로 리다이렉트
            } else {
                res.status(500).send("게시글을 수정하는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("게시글 수정 오류:", err);
            res.status(500).send("게시글을 수정하는 도중 오류가 발생했습니다.");
        }
    },
    
    
    // 댓글 추가
    createComment: async (req, res) => {
        const postId = req.params.id;  // 게시글 아이디 가져옴
        const userId = req.session.username;  // 로그인 사용자의 아이디
        const { content } = req.body;  // 댓글 내용

        if (!userId) {
            return res.status(401).send("로그인이 필요합니다.");  // 로그인이 되어있지 않다면 에러 반환
        }

        if (!content) {
            return res.status(400).send("댓글 내용을 입력하세요.");  // 댓글 내용이 없을 때 에러 반환
        }

        try {
            const board = new Board();
            const response = await board.createComment(postId, userId, content);

            if (response.success) {
                res.redirect(`/post/${postId}`);  // 댓글 작성 후 리다이렉트
            } else {
                res.status(400).send(response.msg);
            }
        } catch (error) {
            console.error("댓글 작성 중 오류:", error);
            res.status(500).send("댓글 작성 중 오류가 발생했습니다.");
        }
    },

    deleteComment: async (req, res) => {
        const commentId = req.params.id;
        const userId = req.session.username; // 로그인한 사용자의 아이디
        try {
            const response = await BoardStorage.deleteComment(commentId, userId);
            if (response.success) {
                res.redirect("back"); // 삭제 후 원래 페이지로 리다이렉트
            } else {
                res.status(500).send(response.msg);
            }
        } catch (error) {
            console.error("댓글 삭제 중 오류:", error);
            res.status(500).send("댓글 삭제 중 오류가 발생했습니다.");
        }
    }
    
};


// 객체를 꼭 모듈로 내보내줘야 함 그래야 밖에서 사용 가능
module.exports = {
    output,
    process,
};