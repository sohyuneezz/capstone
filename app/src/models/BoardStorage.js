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

    // 모든 게시글 조회
    static async getAllPosts() {
        const query = `
            SELECT posts.id, posts.title, posts.contents, posts.category,
            DATE_FORMAT(posts.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,  -- 날짜와 시간까지 표시
            users.name AS author_name,
            users.id AS author_id
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `;
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

    // 카테고리별 게시글 조회 
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
    
    // 전체 게시글 수
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

    // 게시글 상세 조회
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

    // 모든 댓글 조회
    static async getAllComments() {
        const query = `
            SELECT comments.id, comments.content, 
            DATE_FORMAT(comments.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            users.name AS author_name,
            users.id AS author_id,
            posts.title AS post_title,
            posts.category AS post_category
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

    // 댓글 삭제
    static async deleteComment(commentId) {
        const query = "DELETE FROM comments WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [commentId], (err, result) => {
                if (err) {
                    console.error("댓글 삭제 오류:", err);
                    reject({ success: false, msg: "댓글을 삭제하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "댓글이 삭제되었습니다." });
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

    // 모든 자료실 글 가져오기
    static async getDocuments() {
        const query = `
            SELECT documents.id, documents.title,
            DATE_FORMAT(documents.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            users.name AS author_name
            FROM documents
            JOIN users ON documents.user_id = users.id
            ORDER BY documents.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("자료실 조회 오류:", err);
                    reject("자료실 글 목록을 불러오는 데 실패했습니다.");
                } else {
                    resolve(results);
                }
            });
        });
    }

    // 자료실 글 생성
    static async createDocument(documentData) {
        const { title, content, userId } = documentData;
        if (!title || !content) {
            return { success: false, msg: "제목과 내용을 모두 입력하세요." };
        }
        const query = "INSERT INTO documents (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())";
        return new Promise((resolve, reject) => {
            db.query(query, [userId, title, content], (err, result) => {
                if (err) {
                    console.error("자료실 글 생성 오류:", err);
                    reject({ success: false, msg: "자료실 글을 작성하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "자료실 글이 생성되었습니다." });
                }
            });
        });
    }

    // 자료실 글 삭제
    static async deleteDocument(documentId) {
        const query = "DELETE FROM documents WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [documentId], (err, result) => {
                if (err) {
                    console.error("자료실 글 삭제 오류:", err);
                    reject({ success: false, msg: "자료실 글을 삭제하는 데 실패했습니다." });
                } else {
                    resolve({ success: true, msg: "자료실 글이 삭제되었습니다." });
                }
            });
        });
    }

    // 카테고리별 검색
    static searchPostsByCategory(category, query) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.id, p.title, p.contents, p.created_at, u.name AS author_name
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.category = ? AND (LOWER(p.title) LIKE ? OR LOWER(p.contents) LIKE ?)
            `;
            const params = [category, `%${query}%`, `%${query}%`];
    
            db.query(sql, params, (error, results) => {
                if (error) {
                    reject(`${error}`);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = BoardStorage;