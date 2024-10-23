"use strict";

class UserStorage { // class 안에 변수 선언 시 const 같은 선언자 필요없음
    static #users = {
        id: ["csh4540", "최강컴공", "캡스톤"],
        psword: ["1234", "1234", "1234"],
        name: ["컴공", "최컴", "캡스톤"],
    };

    static getUsers(...fields) {
        const users = this.#users;
        const newUsers = fields.reduce((newUsers, fieled) => {
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        return newUsers;
    }
}

module.exports = UserStorage;