const mysql = require("mysql");
const util = require("util");
require("dotenv").config(); // .env 파일 로드

// MySQL 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,      // 데이터베이스 호스트 (예: localhost)
    user: process.env.DB_USER,      // 데이터베이스 사용자명
    password: process.env.DB_PSWORD, // 데이터베이스 비밀번호
    database: process.env.DB_DATABASE, // 데이터베이스 이름
    port: process.env.DB_PORT || 3306, // 기본 포트 3306
    connectionLimit: 10,           // 풀의 최대 연결 개수
    multipleStatements: true       // 여러 SQL문 실행 가능
});

// 연결 테스트
db.getConnection((err) => {
    if (err) {
        console.error("MySQL 연결 실패:", err.message);
    } else {
        console.log("MySQL 연결 성공");
    }
});

// db.query()를 Promise로 사용 가능하도록 설정
db.query = util.promisify(db.query);

module.exports = db;
