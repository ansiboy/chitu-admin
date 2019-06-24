import { UserService, Service, PermissionService } from 'maishu-services-sdk'
import * as chitu_react from 'maishu-chitu-react';
import { config } from './config';
import { MasterPage, MasterPageConstructor } from './master-page';
import React = require('react');
import ReactDOM = require('react-dom');
import { errors } from './errors';
import { masterPageNames } from './masters/names';
import { MainMasterPage } from './masters/main-master-page';
import * as chitu from 'maishu-chitu'
import 'text!content/admin_style_default.less'
import { SimpleMasterPage } from 'masters/simple-master-page';
// import fs = require("fs");

export let gatewayHost = '60.190.16.30:8084'
PermissionService.baseUrl = `http://${gatewayHost}`


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

    renderMasterPages() {
        let mainContainer = document.getElementById('main-container')
        console.assert(mainContainer != null)
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

async function createMasterPages(): Promise<{ simple: HTMLElement, main: HTMLElement }> {
    return new Promise<{ simple: HTMLElement, main: HTMLElement }>((resolve, reject) => {
        let container = document.createElement('div')
        let simpleMasterElement = document.createElement('div')
        let mainMaserElement = document.createElement('div')
        container.appendChild(simpleMasterElement)
        container.appendChild(mainMaserElement)

        let simpleMasterPage: SimpleMasterPage
        let mainMasterPage: MainMasterPage
        ReactDOM.render(<>
            <SimpleMasterPage ref={e => simpleMasterPage = e || simpleMasterPage} />
            <MainMasterPage ref={e => mainMasterPage = e || mainMasterPage} />

        </>, container, () => {
            resolve({ simple: simpleMasterPage.pageContainer, main: mainMasterPage.pageContainer })
        })

        document.body.appendChild(container)

    })
}

createMasterPages().then(r => {
    let app = new Application(r.simple, r.main)
    app.run()
})









