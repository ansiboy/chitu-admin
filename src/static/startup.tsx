import ReactDOM = require("react-dom");
import { SimpleMasterPage } from "./masters/simple-master-page";
import { MainMasterPage } from "./masters/main-master-page";
import React = require("react");
import { MasterPage } from "./masters/master-page";
import { MyService } from "./services/my-service";
import * as chitu_react from 'maishu-chitu-react';
import * as ui from "maishu-ui-toolkit";
import { Less } from "maishu-ui-toolkit";
import { Page } from "maishu-chitu";
import { pathConcat } from "maishu-toolkit";

let app: Application | null = null;
export default async function startup(requirejs: RequireJS) {

    console.assert(requirejs != null);

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

    app = new Application(
        requirejs,
        document.getElementById('simple-master'),
        document.getElementById('main-master'),
        document.getElementById('blank-master')
    )

    let service = app.createService(MyService);
    let config = await service.config();
    Less.renderByRequireJS("admin_style_default");
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
    return new Promise((resolve) => {
        props.ref = function (e) {
            if (!e) return;
            resolve(e);
        }

        let element = React.createElement(componentClass, props);
        ReactDOM.render(element, container)
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
            },
            modulesPath: "/"

        })

        this.error.add((sender, error) => errorHandle(error, this));

        this.pageCreated.add((sender, page) => this.onPageCreated(page))
    }

    private async onPageCreated(page: Page) {
        let lessFilePath: string;
        if (page.name.indexOf(":")) {
            let arr = page.name.split(":");
            lessFilePath = `modules/${arr[1]}.less`;
        }
        else {
            lessFilePath = `modules/${page.name}.less`;
        }

        let pageClassName = page.name.split("/").filter(o => o != "").join("-");
        pageClassName = pageClassName.split(":").join("-");
        page.element.className = `admin-page ${pageClassName}`;

        let stationPath = getStationPath(page.name);
        let myService = this.createService(MyService);
        let files = await myService.files(stationPath);
        let pageLessFiles = files.filter(o => o.startsWith("modules") && o.endsWith(".less"));
        if (pageLessFiles.indexOf(lessFilePath) >= 0) {
            this.loadPageLess(lessFilePath, pageClassName, stationPath);
        }
    }

    private loadPageLess(lessFilePath: string, pageClassName: string, stationPath: string) {
        let url = stationPath ? pathConcat(stationPath, lessFilePath) : lessFilePath;
        Less.load(url, { wrapperClassName: pageClassName, name: pageClassName })
    }

}

export interface RequireJS {
    (modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void): any;
    (arg: { context: string }, modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err: Error) => void);
}


let errorMessages: { [key: string]: string } = {
    "726": "没有权限访问"
}

export function errorHandle(error: Error, app?: Application) {
    error.message = errorMessages[error.name] || error.message;
    if (error.name == "718" && app != null) {
        // app.redirect("login");
        location.hash = "#login";
        return;
    }
    ui.alert({
        title: "错误",
        message: error.message
    })
}

function getStationPath(path: string) {
    if (path.indexOf(":") >= 0) {
        let arr = path.split(":");
        let stationPath = arr[0];
        if (stationPath.startsWith("/") == false) {
            stationPath = "/" + stationPath;
        }
        if (stationPath.endsWith("/") == false) {
            stationPath = stationPath + "/";
        }

        return stationPath;
    }

    return null;
}



