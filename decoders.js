"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserId = exports.currentAppId = void 0;
const maishu_nws_mvc_1 = require("maishu-nws-mvc");
exports.currentAppId = maishu_nws_mvc_1.createParameterDecorator((context, routeData) => __awaiter(void 0, void 0, void 0, function* () {
    let name = "application-id";
    let appId = context.req.headers[name] || routeData[name];
    return appId;
}));
exports.currentUserId = maishu_nws_mvc_1.createParameterDecorator((context, routeData) => __awaiter(void 0, void 0, void 0, function* () {
    let name = "user-id";
    let appId = context.req.headers[name] || routeData[name];
    return appId;
}));
