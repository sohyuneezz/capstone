
"use strict";

const db = require("../config/db");

class BoardStorage {
    // 게시글 생성 메서드
    static createPost({ title, contents, userId }) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO board (title, contents, user_id) VALUES (?, ?, ?)";
            db.query(query, [title, contents, userId], (err, result) => {
                if (err) return reject(`${err}`);
                resolve({ success: true, postId: result.insertId });
            });
        });
    }

    // 게시글 조회 메서드
    static getPostById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM board WHERE id = ?";
            db.query(query, [id], (err, data) => {
                if (err) return reject(`${err}`);
                resolve(data[0]);
            });
        });
    }

    // 특정 사용자의 모든 게시글 조회 메서드
    static getPostsByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM board WHERE user_id = ?";
            db.query(query, [userId], (err, data) => {
                if (err) return reject(`${err}`);
                resolve(data);
            });
        });
    }

    // 게시글 수정 메서드
    static updatePost(id, { title, contents }) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE board SET title = ?, contents = ? WHERE id = ?";
            db.query(query, [title, contents, id], (err, result) => {
                if (err) return reject(`${err}`);
                resolve({ success: result.affectedRows > 0 });
            });
        });
    }

    // 게시글 삭제 메서드
    static deletePost(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM board WHERE id = ?";
            db.query(query, [id], (err, result) => {
                if (err) return reject(`${err}`);
                resolve({ success: result.affectedRows > 0 });
            });
        });
    }
}

module.exports = BoardStorage;
