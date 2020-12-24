import * as ReactDOM from "react-dom";
import { SimpleMasterPage } from "./masters/simple-master-page";
import { MainMasterPage } from "./masters/main-master-page";
import * as React from "react";
import { MasterPage } from "./masters/master-page";
import * as chitu_react from 'maishu-chitu-react';
import * as ui from "maishu-ui-toolkit";
import { Less } from "maishu-ui-toolkit";

let app: Application | null = null;
export default async function startup() {

    async function createMasterPages(app: Application) {
        let mainProps: MainMasterPage["props"] = { app };
        let simplePorps: SimpleMasterPage["props"] = { app };
        let r = await Promise.all([
            renderElement(SimpleMasterPage as any, simplePorps, document.getElementById('simple-master')),
            renderElement(MainMasterPage as any, mainProps, document.getElementById('main-master')),
        ]);

        return {
            simple: r[0] as MasterPage<any>,
            default: r[1] as MainMasterPage
        }
    }

    app = new Application(
        document.getElementById('simple-master'),
        document.getElementById('main-master'),
        document.getElementById('blank-master')
    )

    Less.renderByRequireJS("admin_style_default");
    createMasterPages(app);
    app.run();
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
    constructor(simpleContainer: HTMLElement, mainContainer: HTMLElement, blankContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer,
                blank: blankContainer,
            },
        })

        this.error.add((sender, error) => errorHandle(error, this));

        // this.pageCreated.add((sender, page) => this.onPageCreated(page))
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




startup();