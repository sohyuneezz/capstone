"use strict";

class UserStorage { // class 안에 변수 선언 시 const 같은 선언자 필요없음
    static #users = {
        id: ["csh4540", "최강컴공", "캡스톤"],
        psword: ["1234", "1234", "1234"],
        name: ["컴공", "최컴", "캡스톤"],
    };

    static getUsers(...fields) {
        const users = this.#users;
        const newUsers = fields.reduce((newUsers, field) => {
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        return newUsers;
    }
    static getUserInfo(id) {
        const users = this.#users;
        const idx = users.id.indexOf(id);
        const usersKeys = Object.keys(users); // => [id, psword, name]
        const userInfo = usersKeys.reduce((newUser, info) => {
            newUser[info] = users[info][idx];
            return newUser;
        }, {});

        return userInfo;
    }
}

module.exports = UserStorage;