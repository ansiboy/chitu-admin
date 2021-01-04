import * as ReactDOM from "react-dom";
import { SimpleMasterPage } from "./masters/simple-master-page";
import { MainMasterPage } from "./masters/main-master-page";
import * as React from "react";
import { MasterPage } from "./masters/master-page";
import * as chitu_react from 'maishu-chitu-react';
import * as ui from "maishu-ui-toolkit";
import { Less } from "maishu-ui-toolkit";
import init from "./init";
import { Application as IApplication } from "./init";

export class Application extends chitu_react.Application implements IApplication {
    private _mainMaster: MainMasterPage;
    private _simpleMaster: MasterPage<any>;

    constructor(simpleContainer: HTMLElement, mainContainer: HTMLElement, blankContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer,
                blank: blankContainer,
            },
        })

        this.error.add((sender, error) => Application.errorHandle(error, this));
        this.createMasterPages(this).then(o => {
            this._mainMaster = o.default;
            this._simpleMaster = o.simple;

            init(this);

            this.run();
        });
        Less.renderByRequireJS("admin_style_default");
    }

    private async createMasterPages(app: Application) {
        let mainProps: MainMasterPage["props"] = { app };
        let simplePorps: SimpleMasterPage["props"] = { app };
        let r = await Promise.all([
            this.renderElement(SimpleMasterPage as any, simplePorps, document.getElementById('simple-master')),
            this.renderElement(MainMasterPage as any, mainProps, document.getElementById('main-master')),
        ]);

        return {
            simple: r[0] as MasterPage<any>,
            default: r[1] as MainMasterPage
        }
    }

    get mainMaster() {
        return this._mainMaster;
    }

    get simpleMaster() {
        return this._simpleMaster;
    }

    private renderElement(componentClass: React.ComponentClass, props: any, container: HTMLElement) {
        return new Promise((resolve) => {
            props.ref = function (e) {
                if (!e) return;
                resolve(e);
            }

            let element = React.createElement(componentClass, props);
            ReactDOM.render(element, container)
        })
    }

    static errorHandle(error: Error, app?: Application) {

        let errorMessages: { [key: string]: string } = {
            "726": "没有权限访问"
        }

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

}






export let app: Application | null = window["app"] = window["app"] || new Application(
    document.getElementById('simple-master'),
    document.getElementById('main-master'),
    document.getElementById('blank-master')
)


