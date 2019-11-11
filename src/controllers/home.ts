import { controller, action, Controller, getLogger } from "maishu-node-mvc";
import path = require("path");
import fs = require("fs");
import os = require("os");
import { settings, Settings, MyServerContext } from "../settings";
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
    initjs(@settings settings: MyServerContext["settings"]) {
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
    indexHtml(@settings settings: MyServerContext["settings"]) {
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
    clientFiles(@settings settings: MyServerContext["settings"]): string[] {
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
        logger.info(`Website config file path is ${staticConfigPath}.`)
        if (fs.existsSync(staticConfigPath)) {
            let mod = require(staticConfigPath);
            // logger.info(`Website config is ${JSON.stringify(mod)}`);
            config = mod["default"] || {};
        }

        let r = Object.assign({}, defaultConfig, config)
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

