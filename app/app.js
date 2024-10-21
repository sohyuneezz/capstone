// 전체 주석 ctrl + / , 주석 해제 ctrl + k -> ctrl + u
//라우팅 해보기
"use strict";

// 모듈
const express = require("express");
const app = express();

// 라우팅
const home = require("./src/routes/home"); // home 폴더 안에 있는 자바스크립트를 읽어와줘

// 앱세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`)); // dirname은 현재 있는 파일의 위치를 반환함 그 위치 안에 있는 파일(src/public)에 정적 경로로 추가해준다

app.use("/", home); // use -> 미들웨어를 등록해주는 메서드.

module.exports = app; // www.js랑 연결해주는 것. app을 내보내줌
