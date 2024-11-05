// DB CRUB(생성, 읽기, 수정, 삭제) 역할
"use strict";

const db = require("../config/db");


class UserStorage { // class 안에 변수 선언 시 const 같은 선언자 필요없음

    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE id = ?";
            db.query(query,[id], (err, data) => {
                if (err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    }

 // 아이디 중복 확인 메서드 추가
 static checkUserId(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT id FROM users WHERE id = ?";
        db.query(query, [id], (err, data) => {
            if (err) return reject(`${err}`);
            resolve(data.length > 0); // 아이디가 존재하면 true 반환
        });
    });
}

    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO users(id, name, psword, grade, email) VALUES(?, ?, ?, ?, ?)";
            db.query(
                query,
                [userInfo.id, userInfo.name, userInfo.psword, userInfo.grade, userInfo.email], 
                (err, result) => { // 쿼리 결과를 확인
                    if (err) {
                        return reject(`${err}`);
                    }
            
                    resolve({ success: true });
                    // (err) => {
                //     if (err) reject(`${err}`);
                //     resolve({ success: true });
            });
        });
    }
}

module.exports = UserStorage;