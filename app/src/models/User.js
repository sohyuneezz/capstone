// UserStorage 데이터 검증 및 조작
"use strict";

const { response } = require("express");
const UserStorage = require("./UserStorage");

class User {
    constructor(body) {
        this.body = body;
    }
    
    // 로그인 메서드
    async login() {
        const client = this.body;
        try {
            const {id, psword} = await UserStorage.getUserInfo(client.id);
        
            if (id) {
                if (id === client.id && psword === client.psword) {
                    return { success: true };
                }
                return { success: false, msg: "비밀번호가 틀렸습니다."};
            }
        return { success: false, msg: "존재하지 않는 아이디입니다."};
        } catch(err) {
            return { success: false, mag: err };
        }
    }

    // 회원가입 메서드
    async register() {
        const client = this.body;
        try {
            const userInfo = {
                id: client.id,
                name: client.name,
                psword: client.psword,
                grade: client.grade,    // 추가된 부분
                email: client.email     // 추가된 부분
            };
            const response = await UserStorage.save(client);
        
            return response;
        } catch (err) {
            return { success: false, msg: err };
        }
    }
     // 아이디 중복 확인 메서드
    async checkId() {
        const client = this.body;
        try {
            const isIdExist = await UserStorage.checkUserId(client.id);
            if (isIdExist) {
                return { success: false, msg: "이미 사용 중인 아이디입니다." };
            }
            return { success: true, msg: "사용 가능한 아이디입니다." };
        } catch (err) {
            return { success: false, msg: "서버 오류가 발생했습니다." };
        }
    }
    // 아이디로 회원 정보 가져오기 메서드
    static async findById(id) {
        try {
            return await UserStorage.findById(id);
        } catch (err) {
            throw new Error("사용자 정보를 불러오는 데 실패했습니다.");
        }
    }
    // 사용자 정보 업데이트 메서드
    static async update(id, userData) {
        try {
            return await UserStorage.update(id, userData);
        } catch (err) {
            throw new Error("사용자 정보를 업데이트하는 데 실패했습니다.");
        }
    }
}

module.exports = User;