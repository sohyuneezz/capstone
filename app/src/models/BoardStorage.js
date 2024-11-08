// BoardStorage.js
"use strict";

const db = require("../config/db");

class BoardStorage {
    // 게시글 생성
    static async createPost(postData) {
        const { title, contents, userId } = postData;
        if (!title || !contents) {
            return { success: false, msg: "제목과 내용을 모두 입력하세요." };
        }
        const query = "INSERT INTO posts (user_id, title, contents, created_at) VALUES (?, ?, ?, NOW())";
        return new Promise((resolve, reject) => {
            db.query(query, [userId, title, contents], (err, result) => {
                if (err) {
                    console.error("게시글 생성 오류:", err);
                    reject({ success: false, msg: "게시글을 작성하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "게시글이 생성되었습니다." });
                }
            });
        });
    }
    static async getAllPosts() {
        const query = "SELECT id, title, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM posts ORDER BY created_at DESC";
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("게시글 조회 오류:", err);
                    reject("게시글 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }
    // 게시글 조회
    static async getPostsByUserId(userId) {
        const query = "SELECT id, title, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC";
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error("사용자 게시글 조회 오류:", err);
                    reject("사용자 게시글을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getPostById(postId) {
        const query = `
            SELECT posts.id, posts.title, posts.contents, 
                DATE_FORMAT(posts.created_at, '%Y-%m-%d') AS created_at, 
                users.name AS author_name  -- 작성자 이름 가져오기
            FROM posts 
            JOIN users ON posts.user_id = users.id  -- users 테이블과 조인
            WHERE posts.id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [postId], (err, results) => {
                if (err) {
                    console.error("게시물 조회 오류:", err);
                    reject("게시글을 불러오는 데 실패했습니다.");
                } else if (results.length > 0) {
                    resolve(results[0]); // 게시물 데이터와 작성자 이름 반환
                } else {
                    resolve(null); // 게시물이 없으면 null 반환
                }
            });
        });
    }

    // 게시글 수정
    static async updatePost(postId, postData) {
        const { title, contents } = postData;
        const query = "UPDATE posts SET title = ?, contents = ?, updated_at = NOW() WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [title, contents, postId], (err, result) => {
                if (err) {
                    console.error("게시글 수정 오류:", err);
                    reject({ success: false, msg: "게시글을 수정하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "게시글이 수정되었습니다." });
                }
            });
        });
    }

    // 게시글 삭제
    static async deletePost(postId) {
        const query = "DELETE FROM posts WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [postId], (err, result) => {
                if (err) {
                    console.error("게시글 삭제 오류:", err);
                    reject({ success: false, msg: "게시글을 삭제하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "게시글이 삭제되었습니다." });
                }
            });
        });
    }    
}

module.exports = BoardStorage;
