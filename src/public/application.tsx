import { UserService, Service, PermissionService } from 'maishu-services-sdk'
import * as chitu_react from 'maishu-chitu-react';
import { config } from './config';
import { MasterPage } from './master-page';
import React = require('react');
import ReactDOM = require('react-dom');
import { MainMasterPage } from './masters/main-master-page';
import 'text!content/admin_style_default.less'
import { SimpleMasterPage } from 'masters/simple-master-page';
import { AppService } from 'app-service';
// import fs = require("fs");

export let gatewayHost = '60.190.16.30:8084'
PermissionService.baseUrl = `http://${gatewayHost}`

config.firstPanelWidth = "130px"
config.login.title = "好易微商城"

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
            debugger
        })
    }

    createPageElement(pageName: string, containerName: string) {
        let element = super.createPageElement(pageName, containerName);
        let master = masterPages[containerName];
        console.assert(master != null);
        master.pageContainer.appendChild(element);
        return element;
    }

    showPage(pageUrl: string, args?: any, forceRender?: boolean) {
        args = args || {}
        let d = this.parseUrl(pageUrl)
        let names = ['auth/login', 'auth/forget-password', 'auth/register']
        if (names.indexOf(d.pageName) >= 0) {
            args.container = 'simple'
        }
        return super.showPage(pageUrl, args, forceRender)
    }

    // setPageMaster(pageName: string, masterName: string) {
    //     this.pageMasters[pageName] = masterName
    // }

    // private getPageMaster(pageName: string) {
    //     let masterName = this.pageMasters[pageName]
    //     if (!masterName)
    //         masterName = masterPageNames.main

    //     return masterName
    // }

    // createMasterPage(type: MasterPageConstructor) {
    //     let reactElement = React.createElement(type, { app: this })
    //     let htmlElement = document.createElement('div')
    //     document.body.appendChild(htmlElement)
    //     let masterPage = ReactDOM.render(reactElement, htmlElement)
    //     if (!masterPage.name)
    //         throw errors.masterPageNameCanntEmpty()

    //     if (this.masterPages[masterPage.name])
    //         throw errors.masterPageExists(masterPage.name)

    //     this.masterPages[masterPage.name] = masterPage
    //     this.masterElements[masterPage.name] = htmlElement
    //     return masterPage
    // }

    // showPage(pageName: string, args?: object, forceRender?: boolean) {
    //     let pageMasterName = this.getPageMaster(pageName)
    //     let names = Object.getOwnPropertyNames(this.masterElements)
    //     for (let i = 0; i < names.length; i++) {
    //         if (names[i] == pageMasterName) {
    //             this.masterElements[names[i]].style.removeProperty('display')
    //         }
    //         else {
    //             this.masterElements[names[i]].style.display = 'none'
    //         }
    //     }

    //     let page = super.showPage(pageName, args, forceRender)
    //     return page
    // }

    // createPageElement(pageName: string): HTMLElement {
    //     let masterName = this.getPageMaster(pageName)
    //     let master = this.masterPages[masterName]
    //     if (!master)
    //         throw errors.masterNotExists(masterName)

    //     let element: HTMLElement = document.createElement("div");
    //     if (!master)
    //         throw errors.masterContainerIsNull(masterName)

    //     master.pageContainer.appendChild(element);
    //     return element;
    // }

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
        let str: string = require('text!content/admin_style_default.less')
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
        // let simpleMasterElement = document.createElement('div')
        // simpleMasterElement.style.display = 'none';
        // simpleMasterElement.className = 'simple'

        // let mainMaserElement = document.createElement('div')
        // mainMaserElement.style.display = 'none';
        // mainMaserElement.className = 'main'

        // container.appendChild(simpleMasterElement)
        // container.appendChild(mainMaserElement)

        // let simpleMasterPage: SimpleMasterPage
        // let mainMasterPage: MainMasterPage
        // ReactDOM.render(<>
        //     <SimpleMasterPage ref={e => masterPages.simple = e || masterPages.simple} />
        //     <MainMasterPage ref={e => masterPages.default = e || masterPages.default} />

        // </>, container, () => {
        //     resolve({ simple: masterPages.simple.element, main: masterPages.default.element })
        // })

        ReactDOM.render(<SimpleMasterPage app={app} ref={e => masterPages.simple = e || masterPages.simple} />, document.getElementById('simple-master'))
        ReactDOM.render(<MainMasterPage app={app} ref={e => masterPages.default = e || masterPages.default} />, document.getElementById('main-master'))
        document.body.appendChild(container)

        let appService = app.createService(AppService)
        appService.menuList().then(menuItems => {
            masterPages.default.setMenus(menuItems)
        })
    })
}


let app = new Application(document.getElementById('simple-master'), document.getElementById('main-master'))

createMasterPages(app)//.then(r => {

app.run()

// let ps = app.createService(PermissionService)
// ps.getMenuResources().then(d => {
//     debugger
//     let menuItems = d.dataItems.filter(o => o.parent_id == null).map(o => ({ name: o.name } as MenuItem))
//     masterPages.default.setMenus(menuItems)
//     app.run()
// })

// })









