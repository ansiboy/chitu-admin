"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
/**
 * Temp 控制器
 */
let TempController = class TempController {
    /**
     * Index 页面
     * @param d 路由数据
     * @param d.mobile 手机号码
     * @param d.password 密码
     * @param d.smsId 短信编号
     * @param d.verifyCode 手机接收到的验证码
     */
    index(d) {
        return "Demo Index";
    }
};
__decorate([
    maishu_node_mvc_1.action(),
    __param(0, maishu_node_mvc_1.routeData),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TempController.prototype, "index", null);
TempController = __decorate([
    maishu_node_mvc_1.controller("demo/temp")
], TempController);
exports.default = TempController;
