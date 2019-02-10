

import React = require('react');
import * as chitu_react from 'maishu-chitu-react';
import * as fs from 'fs';
import * as ReactDOM from 'react-dom';

export interface Config {
    firstPanelWidth: string,
    secondPanelWidth: string,
    authServiceHost: string,
    menuType: string,
}

export type MenuItem = {
    id?: string,
    name: string,
    path?: string,
    icon?: string,
    parent?: MenuItem,
    children?: MenuItem[],
    visible?: boolean,
};

interface State {
    currentPageName?: string,
    toolbar?: JSX.Element,
    menus: MenuItem[],
    resourceId?: string,
    /** 不显示菜单的页面 */
    hideMenuPages?: string[],
}

interface Props {
}

export class MasterPage extends React.Component<Props, State>  {
    pageContainer: HTMLElement;
    private app: Application;

    constructor(props: Props) {
        super(props);

        this.state = { menus: [] }
        this.app = new Application(this)
        this.pageContainer = document.createElement('div')
    }

    private showPageByNode(node: MenuItem) {
        let children = node.children || []
        if (!node.path && (node.children || []).length > 0) {
            this.showPageByNode(children[0])
            return
        }
        let pageName = node.path;
        if (pageName == null && children.length > 0) {
            node = children[0];
            pageName = node.name;
        }

        if (pageName == null && children.length > 0) {
            node = children[0];
            pageName = node.name;
        }

        if (pageName) {
            this.app.redirect(pageName)
        }

    }

    private findMenuItemByResourceId(menuItems: MenuItem[], resourceId: string) {
        let stack = new Array<MenuItem>()
        stack.push(...menuItems)
        while (stack.length > 0) {
            let item = stack.pop()
            if (item == null)
                return

            // if (item.path) {
            //     let obj = this.app.parseUrl(item.path)
            // if (obj.pageName == pageName)
            //     return item
            // }
            if (item.id == resourceId)
                return item

            let children = item.children || []
            stack.push(...children)
        }

        return null
    }

    private findMenuItemByPageName(menuItems: MenuItem[], pageName: string) {
        let stack = new Array<MenuItem>()
        stack.push(...menuItems)
        while (stack.length > 0) {
            let item = stack.pop()
            if (item == null)
                throw new Error("item is null")

            if (item.path) {
                let obj = this.app.parseUrl(item.path) || { pageName: '' }
                if (obj.pageName == pageName)
                    return item
            }

            let children = item.children || []
            stack.push(...children)
        }

        return null
    }

    /** 设置工具栏 */
    setToolbar(toolbar: JSX.Element) {
        this.setState({ toolbar })
    }

    /** 设置菜单 */
    setMenus(menus: MenuItem[]) {
        menus = menus || []

        let currentPageName = this.app.currentPage ? this.app.currentPage.name : undefined;
        let resourceId = this.app.currentPage ? this.app.currentPage.data.resourceId || this.app.currentPage.data.resource_id : undefined
        this.setState({ menus, currentPageName: currentPageName, resourceId: resourceId })
    }

    setHideMenuPages(pageNames: string[]) {
        this.setState({ hideMenuPages: pageNames || [] })
    }

    get application(): Application {
        return this.app;
    }

    componentDidMount() {
        // this.app = new Application(this)
        this.app.pageCreated.add((sender, page) => {
            page.shown.add(() => {
                this.setState({ currentPageName: page.name })
                this.setState({ resourceId: page.data.resourceId || page.data.resource_id })
            })
        })

    }

    render() {
        let menuData = this.state.menus;
        let currentPageName: string = this.state.currentPageName || '';

        let firstLevelNodes = menuData.filter(o => o.visible == null || o.visible == true);
        let currentNode: MenuItem | null | undefined
        if (this.state.resourceId) {
            currentNode = this.findMenuItemByResourceId(firstLevelNodes, this.state.resourceId)
        }
        else if (currentPageName) {
            currentNode = this.findMenuItemByPageName(firstLevelNodes, currentPageName)
        }
        let firstLevelNode: MenuItem | null = null;
        let secondLevelNode: MenuItem;


        if (currentNode != null) {
            if (currentNode.parent == null) {
                firstLevelNode = currentNode
            }
            else if (currentNode.parent.parent == null) {   //二级菜单
                firstLevelNode = currentNode.parent
                secondLevelNode = currentNode
            }
            else if (currentNode.parent.parent.parent == null) {   //三级菜单
                firstLevelNode = currentNode.parent.parent
                secondLevelNode = currentNode.parent
            }
        }

        let nodeClassName = '';
        let hideMenuPages = this.state.hideMenuPages || []
        if (hideMenuPages.indexOf(currentPageName) >= 0) {
            nodeClassName = 'hideFirst';
        }
        else if (firstLevelNode == null || (firstLevelNode.children || []).filter(o => o.visible != false).length == 0) {
            nodeClassName = 'hideSecond';
        }

        return (
            <div className={nodeClassName}>
                <div className="first">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {firstLevelNodes.map((o, i) =>
                            <li key={i} className={o == firstLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.visible == false ? "none" : '' }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon} style={{ fontSize: 16 }}></i>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="second">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {(firstLevelNode ? (firstLevelNode.children || []) : []).filter(o => o.visible != false).map((o, i) =>
                            <li key={i} className={o == secondLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.visible == false ? "none" : '' }}
                                onClick={() => this.showPageByNode(o)}>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="main" ref={e => {
                    if (e == null) return
                    e.appendChild(this.pageContainer)
                }}>
                    <nav className="navbar navbar-default" style={{ padding: "10px 10px 10px 10px" }}>
                        {this.state.toolbar}
                    </nav>
                    {/* <div style={{ padding: 20 }}
                        ref={(e: HTMLElement) => this.pageContainer = e || this.pageContainer}>
                    </div> */}
                </div>
            </div >
        );
    }
}

export class Application extends chitu_react.Application {
    private _masterPage: MasterPage;

    constructor(masterPage: MasterPage) {
        super({ container: masterPage.pageContainer })

        this._masterPage = masterPage;
    }

    get masterPage() {
        return this._masterPage;
    }

    get config(): Config {
        (window as any)['maishu-chitu-admin-config'] = (window as any)['maishu-chitu-admin-config'] || {}
        return (window as any)['maishu-chitu-admin-config']
    }

    protected defaultPageNodeParser() {
        let nodes: { [key: string]: chitu.PageNode } = {}
        let p: chitu.PageNodeParser = {
            actions: {},
            parse: (pageName) => {
                let node = nodes[pageName];
                if (node == null) {
                    let path = `modules/${pageName}`;
                    node = { action: this.createDefaultAction(path, loadjs), name: pageName };
                    nodes[pageName] = node;
                }
                return node;
            }
        }
        return p
    }

    /** 加载样式文件 */
    loadStyle() {
        let str = fs.readFileSync("content/admin_style_default.less").toString();
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

    createMasterPage() {
    }

    run() {
        super.run()
        this.loadStyle()
    }
}

function loadjs(path: string): Promise<any> {
    return new Promise<Array<any>>((reslove, reject) => {
        requirejs([path],
            function (result: any) {
                reslove(result);
            },
            function (err: Error) {
                reject(err);
            });
    });
}

let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
let masterPage = ReactDOM.render(<MasterPage />, element) as MasterPage;

export let app = masterPage.application;
