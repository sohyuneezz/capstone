// app.listen 모듈화; 최적화
"use strict";

const app = require("../app");
const PORT = 3000;

app.listen(PORT, () => { // function () 랑 () => 같은 의미
    console.log("서버-가동");
});