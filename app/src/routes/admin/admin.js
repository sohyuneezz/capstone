"use strict";

const isAdmin = (req, res, next) => {
    if (req.session && req.session.isLoggedIn && req.session.isAdmin) {
        return next(); // 관리자인 경우 다음 미들웨어로 이동
    } else {
        // 관리자가 아닌 경우 홈 페이지로 리다이렉트
        res.redirect("/"); // 접근 권한이 없으면 홈으로 리다이렉트
    }
};

module.exports = isAdmin;
