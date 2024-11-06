// 전체 주석 ctrl + / , 주석 해제 ctrl + k -> ctrl + u
//라우팅 해보기
"use strict";

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session"); // 세션 모듈
const dotenv = require("dotenv");
dotenv.config(); // dotenv 모듈을 사용하면 어떤 OS를 사용하든 동일하게 환경변수 등록하고 가져올수 있게 함

const app = express();

// 라우팅
const home = require("./src/routes/home"); // home 폴더 안에 있는 자바스크립트를 읽어와줘

// 앱세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`)); // dirname은 현재 있는 파일의 위치를 반환함 그 위치 안에 있는 파일(src/public)에 정적 경로로 추가해준다
app.use(bodyParser.json());

// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 설정 추가
app.use(session({
    secret: process.env.SESSION_SECRET, // 세션 암호화를 위한 키
    resave: false,             // 세션을 항상 저장할지 여부 (false 권장)
    saveUninitialized: true,   // 초기화되지 않은 세션을 저장할지 여부
    cookie: { secure: false }  // HTTPS를 사용할 경우 true로 설정 (개발 환경에서는 false)
}));

// 라우터 연결
app.use("/", home); // use -> 미들웨어를 등록해주는 메서드.

module.exports = app; // www.js랑 연결해주는 것. app을 내보내줌
