const mysql = require("mysql");
const util = require("util");
require("dotenv").config(); // .env 파일 로드

// MySQL 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,      
    password: process.env.DB_PSWORD, 
    database: process.env.DB_DATABASE, 
    port: process.env.DB_PORT || 3306, // 기본 포트 3306
    connectionLimit: 10,           // 풀의 최대 연결 개수
    multipleStatements: true       // 여러 SQL문 실행 가능
});

// 연결
db.getConnection((err) => {
    if (err) {
        console.error("MySQL 연결 실패:", err.message);
    } else {
        console.log("MySQL 연결 성공");
    }
});

// Promise로 사용 가능하도록 설정
db.query = util.promisify(db.query);

module.exports = db;
