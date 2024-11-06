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
        res.render("home/login");
    },
    register: (req, res) => {
        res.render("home/register");
    },
    welcome: (req, res) => { // 회원가입 성공 페이지 렌더링
        res.render("home/welcome");
    },
    // 메뉴 렌더링
    //취업정보
    employmentInfo: (req, res) => {
        const jobSites = [
            {
                name: "클린아이잡",
                link: "https://job.cleaneye.go.kr/",
                image: "/image/cleaneyejob.jpg",
                description: "국내학회 및 학술단체에서 발행하는 저널의 원문 제공"
            },
            {
                name: "미디어잡",
                link: "https://www.mediajob.co.kr/",
                image: "/image/mediajob.png",
                description: "대진대학교 학위논문 원문 제공"
            },
            {
                name: "이공계인력중개센터",
                link: "https://www.rndjob.or.kr/",
                image: "/image/RnDjob.png",
                description: "국내 650여 학회 및 학술단체에서 발행되는 전 주제 분야의 학술저널 원문 제공"
            },
            {
                name: "잡코리아",
                link: "https://www.jobkorea.co.kr/",
                image: "/image/jobkorea.png",
                description: "구글에서 제공하는 학술정보 검색 서비스"
            },
            {
                name: "사람인",
                link: "https://www.saramin.co.kr/zf_user/",
                image: "/image/saramin.png",
                description: "한국연구재단에서 구축한 한국 학술지"
            },
            {
                name: "잡플래닛",
                link: "https://www.jobplanet.co.kr/welcome/index",
                image: "/image/jobplanet.png",
                description: "국내 학회 및 연구기관 1,436기관에서 발간하는 e-Journal 2,060종, Proceeding 543건, eBook 877권의 학술자료 제공"
            },
            {
                name: "나라일터",
                link: "https://www.gojobs.go.kr/mainIndex.do",
                image: "/image/nara.png",
                description: " - 교육부와 국가평생교육진흥원이 운영하는 한국형 온라인 공개강좌 서비스 - 서울대, 연세대, 고려대, KAIST 등 국내 주요 대학 및 기관의 강좌 무료 이용 가능"
            },
            {
                name: "청년워크넷",
                link: "https://www.work.go.kr/jobyoung/main.do",
                image: "/image/worknet.png",
                description: "국내 고등교육 교수학습자료 공동활용 서비스, 국내 대학 강의, 노벨상 수상자 및 석학 특강 제공"
            },
            {
                name: "HRD-Net",
                link: "https://www.hrd.go.kr/hrdp/ma/pmmao/newIndexRenewal.do",
                image: "/image/HRD-net.png",
                description: "국내 임상의학분야 저널의 서지 및 초록정보 무료제공"
            },
            {
                name: "큐넷",
                link: "https://www.q-net.or.kr/man001.do?gSite=Q",
                image: "/image/Qnet.png",
                description: "대한의학학술지편집인협의회에서 제공하는 임상의학분야 190여종 저널 원문 제공"
            },
            
        ];
        const isLoggedIn = req.session.isLoggedIn || false; // 로그인 상태 확인
        res.render("home/employment_info", { jobSites, isLoggedIn }); // 데이터를 EJS에 전달
    },
    careerMap: (req, res) => {
        res.render("home/careerMap", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    employmentSupport: (req, res) => {
        res.render("home/employment_support");
    },
    researchInfo: (req, res) => {
        res.render("home/research_info", { title: "연구정보-지식on대진", isLoggedIn: req.session.isLoggedIn || false });
    },
    conferenceSchedule: (req, res) => {
        res.render("home/conference_schedule");
    },
    contestSchedule: (req, res) => {
        res.render("home/contest_schedule");
    },
    academicSites: (req, res) => {
        res.render("home/academic_sites");
    },
    //커뮤니티
    community: (req, res) => {
        const isLoggedIn = req.session.isLoggedIn || false; // 세션에서 로그인 상태를 확인
        const notices = [
            { title: "회원 퇴출 규칙", url: "/notice/1", date: "2024-11-05" },
            { title: "대진 On 정보 이용 수칙", url: "/notice/2", date: "2024-11-04" }
        ];
        res.render("home/community", { isLoggedIn, notices }); // isLoggedIn과 notices 전달
    },  
    faq: (req, res) => {
        res.render("home/faq");
    },
    notice: (req, res) => {
        res.render("home/notice");
    },
    resources: (req, res) => {
        res.render("home/resources");
    },
    topicShare: (req, res) => {
        res.render("home/topic_share");
    },
    //취업준비
    jobPreparation: (req, res) => {
        res.render("home/job_pre", { 
            isLoggedIn: req.session.isLoggedIn || false 
        });
    },
    counsel: (req, res) => {
        res.render("home/counsel");
    },
    test: (req, res) => {
        res.render("home/test");
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
};

// 객체를 꼭 모듈로 내보내줘야 함 그래야 밖에서 사용 가능
module.exports = {
    output,
    process,
};

