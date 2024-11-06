"use strict";

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session"); // 세션 모듈
const dotenv = require("dotenv");
const cors = require("cors"); // 외부 API 접근을 위한 CORS 설정

dotenv.config(); // dotenv 모듈을 사용하면 어떤 OS를 사용하든 동일하게 환경변수 등록하고 가져올수 있게 함

const app = express();

// 라우팅
const home = require("./src/routes/home"); // home 폴더 안에 있는 자바스크립트를 읽어와줘

// 앱세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`)); // dirname은 현재 있는 파일의 위치를 반환함 그 위치 안에 있는 파일(src/public)에 정적 경로로 추가해준다
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// 세션 설정 추가
app.use(session({
    secret: process.env.SESSION_SECRET, // 세션 암호화를 위한 키
    resave: false,             // 세션을 항상 저장할지 여부 (false 권장)
    saveUninitialized: true,   // 초기화되지 않은 세션을 저장할지 여부
    cookie: { secure: false }  // HTTPS를 사용할 경우 true로 설정 (개발 환경에서는 false)
}));

// CORS 설정
app.use(cors());

// API 프록시 라우트 추가
app.get("/api/contest", async (req, res) => {
    const numOfRows = req.query.numOfRows || 10;
    const pageNo = req.query.pageNo || 1;
    const apiUrl = `https://www.chungnam.go.kr/cnbbs/openApiMainFxList.do?numOfRows=${numOfRows}&pageNo=${pageNo}`;

    try {
        const fetch = (await import("node-fetch")).default; // 동적 import 사용
        let textData = await (await fetch(apiUrl)).text();

        textData = textData.replace(/"sdate":([^,}]+)/g, '"sdate":"$1"');
        textData = textData.replace(/"edate":([^,}]+)/g, '"edate":"$1"');

        const data = JSON.parse(textData);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from external API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// 라우터 연결
app.use("/", home); // use -> 미들웨어를 등록해주는 메서드.

module.exports = app; // www.js랑 연결해주는 것. app을 내보내줌