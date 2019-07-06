import { UserService, Service, PermissionService } from 'maishu-services-sdk'
import * as chitu_react from 'maishu-chitu-react';
import { config } from './config';
import { MasterPage } from './masters/master-page';
import React = require('react');
import ReactDOM = require('react-dom');
import { MainMasterPage } from './masters/main-master-page';
import 'text!../content/admin_style_default.less'
import { SimpleMasterPage } from './masters/simple-master-page';
import { AppService } from './service';
import { PageData, Page } from "maishu-chitu"

config.login = config.login || {} as any;
config.login.showForgetPassword = true;
config.login.showRegister = true;
config.firstPanelWidth = "130px";
config.login.title = "好易微商城";

PermissionService.baseUrl = "http://127.0.0.1:2857";


export class Application extends chitu_react.Application {
    pageMasters: { [key: string]: string } = {}
    masterPages: { [key: string]: MasterPage<any> } = {}
    masterElements: { [key: string]: HTMLElement } = {}
    masterPage: MainMasterPage;

    constructor(simpleContainer: HTMLElement, mainContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer
            }
        })

        this.error.add((sender, error) => {
        })
    }

    createPageElement(pageName: string, containerName: string) {
        let element = super.createPageElement(pageName, containerName);
        let master = masterPages[containerName];
        console.assert(master != null);
        master.pageContainer.appendChild(element);
        return element;
    }

    showPage(pageUrl: string, args?: PageData, forceRender?: boolean): Page {
        args = args || {}
        let d = this.parseUrl(pageUrl)
        let names = ['login', 'forget-password', 'register']
        if (names.indexOf(d.pageName) >= 0) {
            args.container = 'simple'
        }
        return super.showPage(pageUrl, args, forceRender)
    }

    get userId() {
        if (Service.loginInfo.value == null)
            return null

        return Service.loginInfo.value.userId
    }

    get token() {
        if (Service.loginInfo.value == null)
            return null

        return Service.loginInfo.value.token
    }

    get config() {
        return config
    }

    logout() {
        let s = this.createService<UserService>(UserService)
        s.logout()
        if (config.logoutRedirectURL) {
            location.href = config.logoutRedirectURL
        }
    }

    // protected defaultPageNodeParser() {
    //     let nodes: { [key: string]: chitu.PageNode } = {}
    //     let p: chitu.PageNodeParser = {
    //         actions: {},
    //         parse: (pageName) => {
    //             let node = nodes[pageName];
    //             if (node == null) {
    //                 let path = `modules/${pageName}`;
    //                 node = { action: this.createDefaultAction(path, this.loadjs), name: pageName };
    //                 nodes[pageName] = node;
    //             }
    //             return node;
    //         }
    //     }
    //     return p
    // }

    /** 加载样式文件 */
    loadStyle() {
        let str: string = require('text!../content/admin_style_default.less')
        if (this.config.firstPanelWidth) {
            str = str + `\r\n@firstPanelWidth: ${this.config.firstPanelWidth};`
        }

        if (this.config.secondPanelWidth) {
            str = str + `\r\n@secondPanelWidth: ${this.config.secondPanelWidth};`
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

    run() {
        super.run()
        this.loadStyle()
    }
}

let masterPages = {
    simple: null as MasterPage<any>,
    default: null as MainMasterPage
}
async function createMasterPages(app: Application): Promise<{ simple: HTMLElement, main: HTMLElement }> {
    return new Promise<{ simple: HTMLElement, main: HTMLElement }>((resolve, reject) => {
        let container = document.createElement('div')

        ReactDOM.render(<SimpleMasterPage app={app} ref={e => masterPages.simple = e || masterPages.simple} />, document.getElementById('simple-master'))
        ReactDOM.render(<MainMasterPage app={app} ref={e => masterPages.default = e || masterPages.default} />, document.getElementById('main-master'))
        document.body.appendChild(container)


        let appService = app.createService(AppService)
        if(app.userId){
            appService.menuList().then(menuItems => {
                masterPages.default.setMenus(menuItems)
            })
        }
    })
}


export let app = new Application(document.getElementById('simple-master'), document.getElementById('main-master'))

createMasterPages(app)










