"use strict";

const isAdmin = (req, res, next) => {
    if (req.session && req.session.isLoggedIn && req.session.isAdmin) {
        return next(); // 관리자인 경우 
    } else {
        // 관리자가 아닌 경우
        res.redirect("/"); 
    }
};

module.exports = isAdmin;
