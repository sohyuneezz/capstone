// Board.js
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
}

module.exports = Board;
