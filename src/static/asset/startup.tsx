import ReactDOM = require("react-dom");
import { SimpleMasterPage } from "./masters/simple-master-page";
import { MainMasterPage } from "./masters/main-master-page";
import React = require("react");
import { MasterPage } from "./masters/master-page";
import { MyService } from "./services/my-service";
import { WebsiteConfig } from "../types";
import 'text!admin_style_default';
import * as chitu_react from 'maishu-chitu-react';
import * as ui from "maishu-ui-toolkit";
import less = require("lessjs");

export default async function startup(requirejs: RequireJS) {
    async function createMasterPages(app: Application) {
        let mainProps: MainMasterPage["props"] = { app };
        let simplePorps: SimpleMasterPage["props"] = { app };
        let r = await Promise.all([
            renderElement(SimpleMasterPage, simplePorps, document.getElementById('simple-master')),
            renderElement(MainMasterPage, mainProps, document.getElementById('main-master')),
        ]);

        return {
            simple: r[0] as MasterPage<any>,
            default: r[1] as MainMasterPage
        }
    }

    let app = new Application(
        requirejs,
        document.getElementById('simple-master'),
        document.getElementById('main-master'),
        document.getElementById('blank-master')
    )

    let service = app.createService(MyService);
    let config = await service.config();
    loadStyle(config);
    console.assert(config.menuItems != null);

    let masterPages = await createMasterPages(app);
    masterPages.default.setMenu(...config.menuItems);

    requirejs(["clientjs_init.js"], function (initModule) {
        console.assert(masterPages.default != null);
        if (initModule && typeof initModule.default == 'function') {
            let args: InitArguments = {
                app, mainMaster: masterPages.default, requirejs
            };
            let result = initModule.default(args) as Promise<any>;
            if (result != null && result.then != null) {
                result.then(() => {
                    app.run();
                })

                return;
            }
        }

        app.run();
    })
}

function renderElement(componentClass: React.ComponentClass, props: any, container: HTMLElement) {
    return new Promise((resolve, reject) => {
        props.ref = function (e) {
            if (!e) return;
            resolve(e);
        }

        let element = React.createElement(componentClass, props);
        ReactDOM.render(element, container)
    })
}

/** 加载样式文件 */
function loadStyle(config: WebsiteConfig) {

    let str: string = require('text!admin_style_default')
    if (config.firstPanelWidth) {
        str = str + `\r\n@firstPanelWidth: ${config.firstPanelWidth}px;`
    }

    if (config.secondPanelWidth) {
        str = str + `\r\n@secondPanelWidth: ${config.secondPanelWidth}px;`
    }

    // let less = (window as any)['less']
    less.render(str, function (e: Error, result: { css: string }) {
        if (e) {
            console.error(e)
            return
        }

        let style = document.createElement('style')
        document.head.appendChild(style)
        style.innerText = result.css
    })
}

export type InitArguments = {
    app: Application,
    mainMaster: MainMasterPage,
    requirejs: RequireJS
}

export class Application extends chitu_react.Application {
    constructor(requirejs: RequireJS, simpleContainer: HTMLElement, mainContainer: HTMLElement, blankContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer,
                blank: blankContainer,
            }
        })

        this.error.add((sender, error, page) => errorHandle(error, sender, page as chitu_react.Page));
    }

}

export interface RequireJS {
    (modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
    ({ context: string }, modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
}


let errorMessages = {
    "726": "没有权限访问"
}

export function errorHandle(error: Error, app?: Application, page?: chitu_react.Page) {
    error.message = errorMessages[error.name] || error.message;

    ui.alert({
        title: "错误",
        message: error.message
    })
}



