import { controller, action, Controller, getLogger, serverContext, ServerContext } from "maishu-node-mvc";
import path = require("path");
import fs = require("fs");
import os = require("os");
import { Settings, ServerContextData } from "../settings";
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
     */
    @action("/clientjs_init.js")
    initjs(@serverContext context: ServerContext<ServerContextData>) {
        let initJS = `define([],function(){
            return {
                default: function(){
                    
                }
            }
        })`;

        if (context.data.clientStaticRoot) {
            let initJSPath = path.join(context.data.clientStaticRoot, "init.js");
            if (fs.existsSync(initJSPath)) {
                let buffer = fs.readFileSync(initJSPath);
                initJS = buffer.toString();
            }
        }
        return initJS;
    }

    /**
     * 首页 HTML 文件
     */
    @action("/")
    indexHtml(@serverContext context: ServerContext<ServerContextData>) {
        let html: string = null;
        if (context.data.clientStaticRoot) {
            let indexHtmlPath = path.join(context.data.clientStaticRoot, "index.html");
            if (fs.existsSync(indexHtmlPath)) {
                let buffer = fs.readFileSync(indexHtmlPath);
                html = buffer.toString();
            }
        }

        if (!html) {
            let indexHtmlPath = path.join(context.data.innerStaticRoot, "index.html");
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
    clientFiles(@serverContext context: ServerContext<ServerContextData>): string[] {
        console.assert(context.data.clientStaticRoot != null);
        if (!fs.existsSync(context.data.clientStaticRoot))
            return null;

        let s = fs.statSync(context.data.clientStaticRoot);
        console.assert(s.isDirectory());

        let paths: string[] = [];
        let stack = [context.data.clientStaticRoot];
        while (stack.length > 0) {
            let parentPath = stack.pop();

            let files = fs.readdirSync(parentPath);
            for (let i = 0; i < files.length; i++) {
                let p = path.join(parentPath, files[i]);
                let s = fs.statSync(p);
                if (s.isDirectory())
                    stack.push(p);
                else {
                    let filePath = path.relative(context.data.clientStaticRoot, p);
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
     * @param context 设置，由系统注入。   
     */
    @action()
    websiteConfig(@serverContext context: ServerContext<ServerContextData>): WebsiteConfig {
        return HomeController.getWebsiteConfig(context.data)
    }

    static getWebsiteConfig(data: ServerContextData) {
        let config = {} as WebsiteConfig;
        let staticConfigPath = path.join(data.rootDirectory, "website-config.js");
        let logger = getLogger(PROJECT_NAME);
        if (fs.existsSync(staticConfigPath)) {
            let mod = require(staticConfigPath);
            logger.info(`Website config is ${JSON.stringify(mod)}`);
            if (mod["default"] == null) {
                logger.error(`Website config file '${staticConfigPath}' has not default export.`);
            }
            let modDefault = mod["default"] || {};
            if (typeof modDefault == "function") {
                config = modDefault(data || {});
            }
            else {
                config = modDefault;
            }
        }
        else {
            logger.warn(`Website config file '${staticConfigPath}' is not exists.`)
        }
        if (data.station) {
            config.gateway = data.station.gateway;
        }
        let r = Object.assign({}, defaultConfig, config);
        r.requirejs.paths = Object.assign(defaultPaths, r.requirejs.paths || {});

        if (data.requirejs) {
            r.requirejs.shim = Object.assign(r.requirejs.shim || {}, data.requirejs.shim || {});
            r.requirejs.paths = Object.assign(r.requirejs.paths, data.requirejs.paths || {});
        }

        return r;
    }


}

let defaultConfig: WebsiteConfig = {
    requirejs: {},
    firstPanelWidth: 130,
    secondPanelWidth: 130,
    menuItems: []
}

let node_modules = '/node_modules'
let lib = '/asset/lib'
let defaultPaths = {
    css: `${lib}/css`,
    less: `${lib}/require-less-0.1.5/less`,
    lessc: `${lib}/require-less-0.1.5/lessc`,
    normalize: `${lib}/require-less-0.1.5/normalize`,
    lessjs: `${node_modules}/less/dist/less`,
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
    "maishu-chitu-admin/static": `${node_modules}/maishu-chitu-admin/dist/index`,
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

    "admin_style_default": "/asset/content/admin_style_default.less",
    // "startup": `${node_modules}/maishu-chitu-admin/out/static/asset/startup`,
};
