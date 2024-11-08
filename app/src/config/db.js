// 환경변수로 중요한 데이터들 감춰놓기
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err.stack);
        return;
    }
    console.log('MySQL 연결 성공');
});

module.exports = db;