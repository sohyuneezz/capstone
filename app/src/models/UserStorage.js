// DB CRUB(생성, 읽기, 수정, 삭제) 역할
"use strict";

const db = require("../config/db");


class UserStorage {

    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE id = ?";
            db.query(query,[id], (err, data) => {
                if (err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    }

    // 아이디 중복 확인 
    static checkUserId(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT id FROM users WHERE id = ?";
            db.query(query, [id], (err, data) => {
                if (err) return reject(`${err}`);
                resolve(data.length > 0); // 아이디가 존재하면 true 반환
            });
        });
    }

    // 회원정보 저장
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
    // ID로 사용자 조회
    static findById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE id = ?";
            db.query(query, [id], (err, data) => {
                if (err) return reject(`${err}`);
                resolve(data[0]);
            });
        });
    }
    // 사용자 정보 업데이트
    static update(id, { email, grade, psword }) {
        return new Promise((resolve, reject) => {
            let query = "UPDATE users SET email = ?, grade = ?";
            const params = [email, grade];
    
            if (psword) { // 비밀번호가 있는 경우에만 쿼리에 추가
                query += ", psword = ?";
                params.push(psword);
            }
    
            query += " WHERE id = ?";
            params.push(id);
    
            db.query(query, params, (err, result) => {
                if (err) return reject(`${err}`);
                resolve({ success: result.affectedRows > 0 });
            });
        });
    }
    
    static async getAllUsers() {
        const query = "SELECT * FROM users";
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("사용자 조회 오류:", err);
                    reject("사용자 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }
    
    // UserStorage.js

    static async deleteUser(userId) {
        const query = "DELETE FROM users WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, result) => {
                if (err) {
                    console.error("사용자 삭제 오류:", err);
                    reject({ success: false, msg: "사용자 삭제 실패" });
                } else {
                    resolve({ success: true, msg: "사용자 삭제 성공" });
                }
            });
        });
    }  
}

module.exports = UserStorage;