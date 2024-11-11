"use strict";

const BoardStorage = require("./BoardStorage");

class Board {
    constructor(data) {
        this.data = data;
    }

    // 게시글 생성
    async create() {
        return await BoardStorage.createPost(this.data);
    }

    // 게시글 조회
    static async getPostById(postId) {
        return await BoardStorage.getPostById(postId);
    }

    // 게시글 수정
    async update(postId) {
        return await BoardStorage.updatePost(postId, this.data);
    }

    // 게시글 삭제
    static async delete(postId) {
        return await BoardStorage.deletePost(postId);
    }
    // 댓글 생성
    async createComment(postId, userId, content) {
        const commentData = {
            postId: postId,
            userId: userId,
            content: content,
        };
        return await BoardStorage.createComment(commentData);
    }

    // 특정 게시글의 댓글 조회
    static async getCommentsByPostId(postId) {
        return await BoardStorage.getCommentsByPostId(postId);
    }

    // 댓글 삭제
    static async deleteComment(commentId, userId) {
        return await BoardStorage.deleteComment(commentId, userId);
    }
}

module.exports = Board;