import { controller, action, Controller, getLogger, serverContext } from "maishu-node-mvc";
import path = require("path");
import fs = require("fs");
import os = require("os");
import { settings, Settings, ServerContext } from "../settings";
import { errors } from "../errors";
import { WebsiteConfig } from "../static/types";
import { PROJECT_NAME } from "../global";

/** 
 * Home 控制器 
 */
@controller("/")
export class HomeController extends Controller {
    /** 
     * Index 页面，用于测试 
     */
    @action()
    index() {
        return 'Hello World'
    }

    /** 
     * 客户端初始化脚本 
     * @param settings 设置，由系统注入。
     */
    @action("/clientjs_init.js")
    initjs(@settings settings: ServerContext<any>["settings"]) {
        let initJS = `define([],function(){
            return {
                default: function(){
                    
                }
            }
        })`;

        if (settings.clientStaticRoot) {
            let initJSPath = path.join(settings.clientStaticRoot, "init.js");
            if (fs.existsSync(initJSPath)) {
                let buffer = fs.readFileSync(initJSPath);
                initJS = buffer.toString();
            }
        }
        return initJS;
    }

    /**
     * 首页 HTML 文件
     * @param settings 设置，由系统注入。   
     */
    @action("/")
    indexHtml(@settings settings: ServerContext<any>["settings"]) {
        let html: string = null;
        if (settings.clientStaticRoot) {
            let indexHtmlPath = path.join(settings.clientStaticRoot, "index.html");
            if (fs.existsSync(indexHtmlPath)) {
                let buffer = fs.readFileSync(indexHtmlPath);
                html = buffer.toString();
            }
        }

        if (!html) {
            let indexHtmlPath = path.join(settings.innerStaticRoot, "index.html");
            if (!fs.existsSync(indexHtmlPath))
                throw errors.fileNotExists(indexHtmlPath);

            let buffer = fs.readFileSync(indexHtmlPath);
            html = buffer.toString()
        }

        return this.content(html, "text/html");
    }

    /**
     * 获取客户端文件
     * @param settings 设置，由系统注入。   
     */
    @action()
    clientFiles(@settings settings: ServerContext<any>["settings"]): string[] {
        console.assert(settings.clientStaticRoot != null);
        if (!fs.existsSync(settings.clientStaticRoot))
            return null;

        let s = fs.statSync(settings.clientStaticRoot);
        console.assert(s.isDirectory());

        let paths: string[] = [];
        let stack = [settings.clientStaticRoot];
        while (stack.length > 0) {
            let parentPath = stack.pop();

            let files = fs.readdirSync(parentPath);
            for (let i = 0; i < files.length; i++) {
                let p = path.join(parentPath, files[i]);
                let s = fs.statSync(p);
                if (s.isDirectory())
                    stack.push(p);
                else {
                    let filePath = path.relative(settings.clientStaticRoot, p);
                    paths.push(filePath);
                    path.resolve()
                }
            }
        }

        if (os.platform() == "win32") {
            paths.forEach((p, i) => {
                paths[i] = p.replace(/\\/g, "/")
            })
        }

        return paths;
    }

    /**
     * 获取站点配置
     * @param settings 设置，由系统注入。   
     */
    @action()
    websiteConfig(@settings settings: Settings): WebsiteConfig {
        let config = {} as WebsiteConfig;
        let staticConfigPath = path.join(settings.rootDirectory, "website-config.js");
        let logger = getLogger(PROJECT_NAME);
        if (fs.existsSync(staticConfigPath)) {
            let mod = require(staticConfigPath);
            logger.info(`Website config is ${JSON.stringify(mod)}`);
            if (mod["default"] == null) {
                logger.error(`Website config file '${staticConfigPath}' has not default export.`);
            }
            let modDefault = mod["default"] || {};
            if (typeof modDefault == "function") {
                config = modDefault(settings.serverContextData || {});
            }
            else {
                config = modDefault;
            }
        }
        else {
            logger.warn(`Website config file '${staticConfigPath}' is not exists.`)
        }
        if (settings.station) {
            config.gateway = settings.station.gateway;
        }
        let r = Object.assign({}, defaultConfig, config);
        r.requirejs.paths = Object.assign(defaultPaths, r.requirejs.paths || {});
        return r;
    }

    /**
     * 获取站点设置
     * @param settings 设置，由系统注入。   
     */
    @action()
    settings(@settings settings: Settings) {
        return settings;
    }
}

let defaultConfig: WebsiteConfig = {
    requirejs: {},
    firstPanelWidth: 130,
    secondPanelWidth: 130,
    menuItems: []
}

let node_modules = '/node_modules'
let lib = 'assert/lib'
let defaultPaths = {
    css: `${lib}/css`,
    less: `${lib}/require-less-0.1.5/less`,
    lessc: `${lib}/require-less-0.1.5/lessc`,
    normalize: `${lib}/require-less-0.1.5/normalize`,
    text: `${lib}/text`,
    json: `${lib}/requirejs-plugins/src/json`,

    jquery: `${lib}/jquery-2.1.3`,
    "jquery.event.drag": `${lib}/jquery.event.drag-2.2/jquery.event.drag-2.2`,
    "jquery.event.drag.live": `${lib}/jquery.event.drag-2.2/jquery.event.drag.live-2.2`,

    "js-md5": `${node_modules}/js-md5/src/md5`,

    pin: `${lib}/jquery.pin/jquery.pin.min`,

    "react": `${node_modules}/react/umd/react.development`,
    "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
    "maishu-chitu": `${node_modules}/maishu-chitu/dist/index`,
    "maishu-chitu-admin/static": `${node_modules}/maishu-chitu-admin/out/static/index`,
    "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index`,
    "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index`,
    "maishu-dilu": `${node_modules}/maishu-dilu/dist/index`,
    "maishu-services-sdk": `${node_modules}/maishu-services-sdk/dist/index`,
    "maishu-image-components": `${node_modules}/maishu-image-components/index`,
    "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`,
    "maishu-node-auth": `${node_modules}/maishu-node-auth/dist/client/index`,
    "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index`,
    "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index`,
    "swiper": `${node_modules}/swiper/dist/js/swiper`,
    "xml2js": `${node_modules}/xml2js/lib/xml2js`,
    "polyfill": `${node_modules}/@babel/polyfill/dist/polyfill`,
    "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
};
