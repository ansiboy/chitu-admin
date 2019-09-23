import { controller, action, Controller } from "maishu-node-mvc";
import path = require("path");
import fs = require("fs");
import os = require("os");
import { settings, Settings, MyServierContext } from "../settings";
import defaultConfig from "../static/assert/config";
import { context } from "maishu-node-mvc";
import { errors } from "../errors";

@controller("/")
export class HomeController extends Controller {
    @action()
    index() {
        return 'Hello World'
    }

    @action("/clientjs_init.js")
    initjs(@settings settings: Settings) {
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

    @action("/")
    indexHtml(@settings settings: Settings) {
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

    @action()
    clientFiles(@settings settings: Settings): string[] {
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

    // @action()
    // config(@context context: MyServierContext) {
    //     if (context.settings.clientStaticRoot) {
    //         let p = path.join(context.settings.clientStaticRoot, "config.js");
    //         if (fs.existsSync(p)) {
    //             let mod = require(p);
    //             if (mod != null) {
    //                 let config = Object.assign(defaultConfig, mod["default"] || {});
    //                 return config;
    //             }
    //         }
    //     }

    //     return defaultConfig;
    // }
}