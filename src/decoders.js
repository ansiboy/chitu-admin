"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_nws_mvc_1 = require("maishu-nws-mvc");
exports.currentAppId = maishu_nws_mvc_1.createParameterDecorator(async (context, routeData) => {
    let name = "application-id";
    let appId = context.req.headers[name] || routeData[name];
    return appId;
});
exports.currentUserId = maishu_nws_mvc_1.createParameterDecorator(async (context, routeData) => {
    let name = "user-id";
    let appId = context.req.headers[name] || routeData[name];
    return appId;
});
