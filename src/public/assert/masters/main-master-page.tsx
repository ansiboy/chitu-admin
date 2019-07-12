import React = require('react');
import { Application } from '../application';
import { MasterPage, MasterPageProps } from './master-page';
import { masterPageNames } from './names';
import { Resource } from 'entities';
import { errors } from 'assert/errors';
import { PermissionService, Service } from 'assert/services/index';
import { translateToMenuItems } from 'assert/dataSources';

export type MenuItem = Resource & { icon?: string, parent: MenuItem, children: MenuItem[] }

interface State {
    currentPageName?: string,
    toolbar?: JSX.Element,
    menus: MenuItem[],
    resourceId?: string,
    /** 不显示菜单的页面 */
    hideMenuPages?: string[],
    username?: string,
}

export class MainMasterPage extends MasterPage<State> {

    name = masterPageNames.main

    pageContainer: HTMLElement;
    element: HTMLElement;
    private app: Application;
    ps: PermissionService;

    constructor(props: MasterPageProps) {
        super(props);

        let username = Service.loginInfo.value ? Service.loginInfo.value.username : "";
        this.state = { menus: [], username }

        this.app = props.app;
        Service.loginInfo.add((value) => {
            if (value) {
                this.setState({ username: value.username })
            }
        })

        this.ps = this.app.createService(PermissionService);
    }

    private showPageByNode(node: MenuItem) {
        let children = node.children || []
        if (!node.page_path && (node.children || []).length > 0) {
            this.showPageByNode(children[0])
            return
        }
        let pagePath = node.page_path;
        if (pagePath == null && children.length > 0) {
            node = children[0];
            pagePath = node.page_path;
        }

        if (!pagePath) {
            console.log(`MenuItem ${node.name} page name is empty.`);
            return;
        }

        if (pagePath.startsWith("#")) {
            pagePath = pagePath.substr(1);
            this.app.redirect(pagePath, { resourceId: node.id });
            return;
        }

        throw errors.notImplement()
    }

    private findMenuItemByResourceId(menuItems: MenuItem[], resourceId: string) {
        let stack = new Array<MenuItem>()
        stack.push(...menuItems)
        while (stack.length > 0) {
            let item = stack.pop()
            if (item == null)
                return

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

            if (item.page_path) {
                let obj = this.app.parseUrl(item.page_path) || { pageName: '' }
                if (obj.pageName == pageName)
                    return item
            }

            let children = item.children || []
            stack.push(...children)
        }

        return null
    }

    // /** 设置菜单 */
    // setMenus(menus: MenuItem[]) {
    //     let stack = new Array<MenuItem>(...menus)
    //     while (stack.length > 0) {
    //         let item = stack.pop()
    //         if (item.page_path) {
    //             let arr = item.page_path.split('/')
    //             if (item.page_path.indexOf('?') >= 0) {
    //                 item.page_path = `${item.page_path}&resourceId=${item.id}`
    //             }
    //             else {
    //                 item.page_path = `${item.page_path}?resourceId=${item.id}`
    //             }
    //         }
    //         stack.push(...(item.children || []))
    //     }

    //     let currentPageName = this.app.currentPage ? this.app.currentPage.name : undefined;
    //     let resourceId = this.app.currentPage ? (this.app.currentPage.data.resourceId || this.app.currentPage.data.resourceId) as string : undefined
    //     this.setState({ menus, currentPageName: currentPageName, resourceId: resourceId })
    // }

    logout() {
        let s = this.app.createService(PermissionService)
        s.user.logout()
        location.href = `?${Date.now()}#login`
    }

    loadMenuItmes() {
        this.ps.resource.list().then(resources => {
            let menuItems = translateToMenuItems(resources).filter(o => o.parent == null);
            this.setState({ menus: menuItems });
        })
    }

    componentDidMount() {
        this.app.pageCreated.add((sender, page) => {
            page.shown.add(() => {
                this.setState({ currentPageName: page.name })
                this.setState({ resourceId: (page.data.resourceId || page.data.resource_id) as string })
            })
        })

        if (Service.loginInfo.value) {
            this.loadMenuItmes();
        }
        else {
            Service.loginInfo.add((value) => {
                if (value) {
                    this.loadMenuItmes();
                }
                else {
                    this.setState({ menus: [] })
                }
            });
        }

    }

    render() {
        let { menus: menuData, username } = this.state;
        let currentPageName: string = this.state.currentPageName || '';

        let firstLevelNodes = menuData.filter(o => o.type == "menu");
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
        else if (firstLevelNode == null || (firstLevelNode.children || []).filter(o => o.type == "menu").length == 0) {
            nodeClassName = 'hideSecond';
        }

        return (
            <div className={`${nodeClassName}`} ref={e => this.element = e || this.element}>
                <div className="first">
                    <ul className="list-group">
                        {firstLevelNodes.map((o, i) =>
                            <li key={i} className={o == firstLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.type != "menu" ? "none" : '' }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon}></i>
                                <span>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="second">
                    <ul className="list-group">
                        {(firstLevelNode ? (firstLevelNode.children || []) : []).filter(o => o.type == "menu").map((o, i) =>
                            <li key={i} className={o == secondLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.type != "menu" ? "none" : '' }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon}></i>
                                <span>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="main" ref={e => {
                    if (e == null) return
                    // e.appendChild(this.pageContainer)
                }}>
                    <nav className="navbar navbar-default">
                        <ul className="toolbar">
                            {this.state.toolbar}
                            <li className="light-blue pull-right" onClick={() => this.logout()}>
                                <i className="icon-off"></i>
                                <span style={{ paddingLeft: 4, cursor: "pointer" }}>退出</span>
                            </li>
                            <li className="light-blue pull-right" style={{ marginRight: 10 }}>
                                {username || ""}
                            </li>
                        </ul>
                    </nav>
                    <div className="page-container"
                        ref={(e: HTMLElement) => this.pageContainer = e || this.pageContainer}>
                    </div>
                </div>
            </div >
        );
    }
}




