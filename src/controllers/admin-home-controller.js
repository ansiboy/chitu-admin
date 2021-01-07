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
var HomeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_nws_mvc_1 = require("maishu-nws-mvc");
const path = require("path");
const fs = require("fs");
const os = require("os");
const global_1 = require("../global");
const js_transform_1 = require("../js-transform");
/**
 * Home 控制器
 */
let HomeController = HomeController_1 = class HomeController extends maishu_nws_mvc_1.Controller {
    /**
     * Index 页面，用于测试
     */
    index() {
        return 'Hello World';
    }
    /**
     * 客户端初始化脚本
     */
    initjs(context) {
        let initJS = `define([],function(){
            return {
                default: function(){
                    
                }
            }
        })`;
        let staticRoot = context.rootDirectory.findDirectory("static");
        let initJSPath = staticRoot.findFile("init.js");
        if (initJSPath && fs.existsSync(initJSPath)) {
            let buffer = fs.readFileSync(initJSPath);
            initJS = buffer.toString();
            initJS = js_transform_1.commonjsToAmd(initJS);
        }
        return initJS;
    }
    /**
     * 获取客户端文件
     * @param settings 设置，由系统注入。
     */
    getClientFiles(context) {
        console.assert(context.data.staticRoot != null);
        let clientFiles = [];
        let staticDir = context.rootDirectory.findDirectory("static");
        if (staticDir == null) {
            let logger = maishu_nws_mvc_1.getLogger(global_1.PROJECT_NAME, context.logLevel);
            logger.warn("Static directory is not exists.");
            return clientFiles;
        }
        let stack = [staticDir];
        while (stack.length > 0) {
            let dir = stack.pop();
            let filesDic = dir.files();
            let files = Object.getOwnPropertyNames(filesDic)
                .map(n => path.join(dir.virtualPath.substr("static/".length), n));
            clientFiles.push(...files);
            let childrenDic = dir.directories();
            for (let name in childrenDic) {
                if (name == "node_modules" || name == "lib")
                    continue;
                stack.push(childrenDic[name]);
            }
        }
        if (os.platform() == "win32") {
            clientFiles.forEach((p, i) => {
                clientFiles[i] = p.replace(/\\/g, "/");
            });
        }
        return clientFiles;
    }
    /**
     * 获取站点配置
     * @param context 设置，由系统注入。
     */
    websiteConfig(context) {
        return HomeController_1.getWebsiteConfig(context, context.logLevel);
    }
    static getWebsiteConfig(context, logLevel) {
        let config = {};
        let staticConfigPath;
        let data = context.data || {};
        // if (data.websiteConfig == null) {
        staticConfigPath = context.rootDirectory.findFile("website-config.js"); //path.join(data.rootDirectory, "website-config.js");
        // }
        // else {
        //     config = data.websiteConfig;
        // }
        let logger = maishu_nws_mvc_1.getLogger(global_1.PROJECT_NAME, logLevel);
        if (staticConfigPath) {
            let mod = require(staticConfigPath);
            logger.info(`Website config is ${JSON.stringify(mod)}`);
            if (mod["default"] == null) {
                logger.error(`Website config file '${staticConfigPath}' has not default export.`);
            }
            let modDefault = mod["default"] || {};
            if (typeof modDefault == "function") {
                config = modDefault(context || {});
            }
            else {
                config = modDefault;
            }
        }
        else {
            logger.warn(`Website config file  is not exists.`);
        }
        if (data.station) {
            config.gateway = data.station.gateway;
        }
        let r = Object.assign({ requirejs: {}, menuItems: [] }, config);
        r.requirejs.paths = Object.assign(defaultPaths, r.requirejs.paths || {});
        r.requirejs.shim = Object.assign(defaultShim, r.requirejs.shim || {});
        if (data.station) {
            r.requirejs.context = data.station.path;
            r.requirejs.baseUrl = data.station.path;
        }
        if (data.websiteConfig != null && data.websiteConfig.requirejs != null) {
            r.requirejs.shim = Object.assign(r.requirejs.shim || {}, data.websiteConfig.requirejs.shim || {});
            r.requirejs.paths = Object.assign(r.requirejs.paths, data.websiteConfig.requirejs.paths || {});
        }
        return r;
    }
};
__decorate([
    maishu_nws_mvc_1.action(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "index", null);
__decorate([
    maishu_nws_mvc_1.action("/clientjs_init.js"),
    __param(0, maishu_nws_mvc_1.serverContext),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HomeController.prototype, "initjs", null);
__decorate([
    maishu_nws_mvc_1.action("/clientFiles"),
    __param(0, maishu_nws_mvc_1.serverContext),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], HomeController.prototype, "getClientFiles", null);
__decorate([
    maishu_nws_mvc_1.action("/websiteConfig"),
    __param(0, maishu_nws_mvc_1.serverContext),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], HomeController.prototype, "websiteConfig", null);
HomeController = HomeController_1 = __decorate([
    maishu_nws_mvc_1.controller("/")
], HomeController);
exports.HomeController = HomeController;
// let defaultConfig: WebsiteConfig & { _requirejs: WebsiteConfig["requirejs"] } = {
//     _requirejs: {},
//     get requirejs() {
//         return this._requirejs;
//     },
//     set requirejs(value) {
//         this._requirejs = value;
//     },
//     menuItems: []
// }
let node_modules = '/node_modules';
let lib = 'lib';
let defaultShim = {
    "react-dom": {
        deps: ["react"]
    }
};
let defaultPaths = {
    css: `${node_modules}/maishu-requirejs-plugins/lib/css`,
    lessjs: `${node_modules}/less/dist/less`,
    less: `${lib}/require-less-0.1.5/less`,
    lessc: `${lib}/require-less-0.1.5/lessc`,
    normalize: `${lib}/require-less-0.1.5/normalize`,
    text: `${node_modules}/maishu-requirejs-plugins/lib/text`,
    json: `${node_modules}/maishu-requirejs-plugins/src/json`,
    noext: `${node_modules}/maishu-requirejs-plugins/src/noext`,
    jquery: `${lib}/jquery-2.1.3`,
    "jquery.event.drag": `${lib}/jquery.event.drag-2.2/jquery.event.drag-2.2`,
    "jquery.event.drag.live": `${lib}/jquery.event.drag-2.2/jquery.event.drag.live-2.2`,
    "js-md5": `${node_modules}/js-md5/src/md5`,
    pin: `${lib}/jquery.pin/jquery.pin.min`,
    "react": `${node_modules}/react/umd/react.development`,
    "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
    "maishu-chitu": `${node_modules}/maishu-chitu/dist/index.min`,
    "maishu-chitu-admin/static": `${node_modules}/maishu-chitu-admin/dist/static.min`,
    "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index.min`,
    "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index.min`,
    "maishu-dilu": `${node_modules}/maishu-dilu/dist/index.min`,
    "maishu-services-sdk": `${node_modules}/maishu-services-sdk/dist/index`,
    "maishu-image-components": `${node_modules}/maishu-image-components/index`,
    "maishu-toolkit": `${node_modules}/maishu-toolkit/dist/index.min`,
    "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index.min`,
    "maishu-node-auth": `${node_modules}/maishu-node-auth/dist/client/index`,
    "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index.min`,
    "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index.min`,
    "swiper": `${node_modules}/swiper/dist/js/swiper`,
    "xml2js": `${node_modules}/xml2js/lib/xml2js`,
    "polyfill": `${node_modules}/@babel/polyfill/dist/polyfill`,
    "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
    "admin_style_default": "content/admin_style_default.less",
};
