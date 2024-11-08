// 컨트롤러 분리하기
"use strict";

const User = require("../../models/User");

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
    topicShare: (req, res) => { //주제공유
        res.render("home/share", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    write:(req, res) => { //글작성
        res.render("home/write", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
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
    myPosts: (req, res) => {
        if (!req.session.isLoggedIn) {
            return res.redirect("/login");
        }
        res.render("home/myposts", { // 나의 기록
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
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
};

// 객체를 꼭 모듈로 내보내줘야 함 그래야 밖에서 사용 가능
module.exports = {
    output,
    process,
};