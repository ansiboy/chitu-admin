import { Application, RequireJS } from "./application";
import ReactDOM = require("react-dom");
import { SimpleMasterPage } from "./masters/simple-master-page";
import { MainMasterPage } from "./masters/main-master-page";
import React = require("react");
import { MasterPage } from "./masters/master-page";
import { MyService } from "./services/service";
import { WebSiteConfig } from "./config";

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
function loadStyle(config: WebSiteConfig) {

    let str: string = require('text!../content/admin_style_default.less')
    if (config.firstPanelWidth) {
        str = str + `\r\n@firstPanelWidth: ${config.firstPanelWidth}px;`
    }

    if (config.secondPanelWidth) {
        str = str + `\r\n@secondPanelWidth: ${config.secondPanelWidth}px;`
    }

    let less = (window as any)['less']
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


