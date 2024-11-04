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


    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO users(id, name, psword) VALUES(?, ?, ?)";
            db.query(
                query,
                [userInfo.id, userInfo.name, userInfo.psword], 
                (err) => {
                    if (err) reject(`${err}`);
                    resolve({ success: true });
            });
        });
    }
}

module.exports = UserStorage;