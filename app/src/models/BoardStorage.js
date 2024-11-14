"use strict";

const db = require("../config/db");

class BoardStorage {
    // 게시글 생성
    static async createPost(postData) {
        const { title, contents, userId, category } = postData;
        if (!title || !contents) {
            return { success: false, msg: "제목과 내용을 모두 입력하세요." };
        }
        const query = "INSERT INTO posts (user_id, title, contents, created_at, category) VALUES (?, ?, ?, NOW(), ?)";
        return new Promise((resolve, reject) => {
            db.query(query, [userId, title, contents, category], (err, result) => {
                if (err) {
                    console.error("게시글 생성 오류:", err);
                    reject({ success: false, msg: "게시글을 작성하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "게시글이 생성되었습니다." });
                }
            });
        });
    }
    

    // 모든 게시글 조회 (카테고리별)
    static async getPostsByCategory(category, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT posts.id, posts.title, DATE_FORMAT(posts.created_at, '%Y-%m-%d') AS created_at, users.name AS author_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.category = ?
            ORDER BY posts.created_at DESC
            LIMIT ? OFFSET ?
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [category, limit, offset], (err, results) => {
                if (err) {
                    console.error("게시글 조회 오류:", err);
                    reject("게시글 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }
    
    // 전체 게시글 수를 가져오는 메서드 추가
    static async countPostsByCategory(category) {
        const query = `
            SELECT COUNT(*) AS total FROM posts WHERE category = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [category], (err, results) => {
                if (err) {
                    console.error("게시글 수 조회 오류:", err);
                    reject("게시글 수를 불러오는 데 실패했습니다.");
                } else {
                    resolve(results[0].total);
                }
            });
        });
    }
    


    // 특정 사용자 게시글 조회
    static async getPostsByUserId(userId) {
        const query = `
                SELECT id, title, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at 
                FROM posts 
                WHERE user_id = ? ORDER BY created_at DESC`;
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
                users.name AS author_name 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
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
        const { title, contents, category } = postData;
        const query = "UPDATE posts SET title = ?, contents = ?, category = ?, updated_at = NOW() WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [title, contents, category, postId], (err, result) => {
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
    // 댓글 생성
    static async createComment(commentData) {
        const { postId, userId, content } = commentData;
        if (!content) {
            return { success: false, msg: "댓글 내용을 입력하세요." };
        }
        const query = "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())";
        return new Promise((resolve, reject) => {
            db.query(query, [postId, userId, content], (err, result) => {
                if (err) {
                    console.error("댓글 생성 오류:", err);
                    reject({ success: false, msg: "댓글을 작성하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "댓글이 생성되었습니다." });
                }
            });
        });
    }

    // 특정 게시글의 댓글 조회
    static async getCommentsByPostId(postId) {
        const query = `
            SELECT comments.id, comments.user_id, comments.content, 
            DATE_FORMAT(comments.created_at, '%Y-%m-%d %H:%i') AS created_at,
            users.name AS author_name
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at ASC
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [postId], (err, results) => {
                if (err) {
                    console.error("댓글 조회 오류:", err);
                    reject("댓글 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async deleteComment(commentId, userId) {
        const query = "DELETE FROM comments WHERE id = ? AND user_id = ?"; // 댓글 삭제 쿼리
        return new Promise((resolve, reject) => {
            db.query(query, [commentId, userId], (err, result) => {
                if (err) {
                    console.error("댓글 삭제 오류:", err);
                    reject({ success: false, msg: "댓글을 삭제하는 데 실패했습니다." });
                } else if (result.affectedRows === 0) {
                    resolve({ success: false, msg: "삭제 권한이 없거나 댓글이 존재하지 않습니다." });
                } else {
                    resolve({ success: true, msg: "댓글이 삭제되었습니다." });
                }
            });
        });
    }
    
    // 모든 댓글 조회 - 추가할 부분
    static async getAllComments() {
        const query = `
            SELECT comments.id, comments.content, comments.created_at, 
                    users.name AS author_name, posts.title AS post_title 
            FROM comments
            JOIN users ON comments.user_id = users.id
            JOIN posts ON comments.post_id = posts.id
            ORDER BY comments.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("댓글 조회 오류:", err);
                    reject("댓글 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }
    // 특정 사용자가 작성한 댓글 조회
    static async getCommentsByUserId(userId) {
        const query = `
            SELECT comments.id, comments.content, 
                DATE_FORMAT(comments.created_at, '%Y-%m-%d') AS created_at,  -- 날짜 포맷팅
                posts.title AS post_title, posts.id AS post_id
            FROM comments
            JOIN posts ON comments.post_id = posts.id
            WHERE comments.user_id = ?
            ORDER BY comments.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error("댓글 조회 오류:", err);
                    reject("댓글 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = BoardStorage;