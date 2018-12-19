"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const masterPage_1 = require("./masterPage");
let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
let masterPage = ReactDOM.render(React.createElement(masterPage_1.MasterPage, null), element);
exports.app = masterPage.application;
