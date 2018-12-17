"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
//=============================================
// 用于 requirejs
define('react', function () {
    return require('react');
});
define('react-dom', function () {
    return require('react-dom');
});
//=============================================
let app = new application_1.Application();
app.run();
