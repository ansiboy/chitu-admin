

import React = require('react');
import * as chitu from 'maishu-chitu'
import { UserService } from './services/user';

export type Menu = {
    id?: string,
    name: string,
    path?: string,
    icon?: string,
    parent?: Menu,
    children: Menu[],
    visible: boolean,
};

interface State {
    currentMenu: Menu,
    username: string,
    hideExistsButton: boolean,
    hideStoreButton: boolean,
    menuShown: boolean,
    menus: Menu[],
}

interface Props {
    // app: Application
}

export class MasterPage extends React.Component<Props, State> {
    pageContainer: HTMLElement;
    private app: chitu.Application;

    constructor(props) {
        super(props);


        this.state = {
            currentMenu: null, username: '',
            hideExistsButton: false, hideStoreButton: false, menuShown: true, menus: []
        }

        // this.loadMenus()

    }

    init(app: chitu.Application) {
        this.app = app;
        this.loadMenus()
    }

    get showExistsButton() {
        return !this.state.hideExistsButton;
    }
    set showExistsButton(value) {
        this.setState({ hideExistsButton: !value })
    }

    updateMenu(page: chitu.Page) {
        let url = page.name.replace(/\./, '/');
        let currentNode = this.findNodeByName(url);

        this.setState({ currentMenu: currentNode })
    }

    findNodeByName(name: string): Menu {
        let stack = new Array<Menu>();
        let menuData = this.state.menus;
        for (let i = 0; i < menuData.length; i++) {
            stack.push(menuData[i]);
        }
        while (stack.length > 0) {
            let node = stack.pop();
            if (node.name == name) {
                return node;
            }
            let children = node.children || [];
            for (let j = 0; j < children.length; j++) {
                stack.push(children[j]);
            }
        }
        return null;
    }
    showPageByNode(node: Menu) {
        let url = node.name;
        if (url == null && node.children.length > 0) {
            node = node.children[0];
            url = node.name;
        }

        if (url == null && node.children.length > 0) {
            node = node.children[0];
            url = node.name;
        }

        if (url) {
        }

        // this.state.currentNode = node;
        // this.setState(this.state);
    }
    async loadMenus() {

        let userService = this.app.currentPage.createService(UserService)
        let resources = await userService.resources()

        let menus = resources.filter(o => o.parent_id == null)
            .map(o => ({
                name: o.name,
                children: []
            } as Menu))

        this.setState({ menus })


        // setTimeout(() => {
        //     let menus: Menu[] = [
        //         { name: "经销商", children: [], visible: true },
        //         { name: "经销商", children: [], visible: true },
        //     ]
        //     this.setState({ menus })
        // }, 500)
    }
    render() {
        let currentNode = this.state.currentMenu;
        let menuData = this.state.menus

        let firstLevelNode: Menu;
        let secondLevelNode: Menu;
        let thirdLevelNode: Menu;

        let firstLevelNodes = menuData.filter(o => o.visible == null || o.visible == true);
        let secondLevelNodes: Array<Menu> = [];
        let thirdLevelNodes: Array<Menu> = [];
        if (currentNode != null) {
            if (currentNode.parent == null) {
                firstLevelNode = currentNode;
                secondLevelNode = currentNode;
            }
            else if (currentNode.parent.parent == null) {
                firstLevelNode = currentNode.parent;
                secondLevelNode = currentNode;
            }
            else if (currentNode.parent.parent.parent == null) {
                thirdLevelNode = currentNode;
                secondLevelNode = thirdLevelNode.parent;
                firstLevelNode = secondLevelNode.parent;
            }
            else if (currentNode.parent.parent.parent.parent == null) {
                thirdLevelNode = currentNode.parent;
                secondLevelNode = thirdLevelNode.parent;
                firstLevelNode = secondLevelNode.parent;
            }
            else {
                throw new Error('not implement')
            }
        }

        if (firstLevelNode != null) {
            secondLevelNodes = firstLevelNode.children || [].filter(o => o.Visible == null || o.Visible == true);
            thirdLevelNodes = (secondLevelNode.children || []).filter(o => o.visible == null || o.visible == true);
        }

        if (thirdLevelNodes.length == 0) {
            thirdLevelNodes.push(secondLevelNode);
            thirdLevelNode = secondLevelNode;
        }

        let nodeClassName = '';
        if (firstLevelNode != null && firstLevelNode.name == 'Others') {
            nodeClassName = 'hideFirst';
        }
        else if (secondLevelNodes.length == 0) {
            nodeClassName = 'hideSecond';
        }


        let { hideExistsButton, hideStoreButton, menuShown } = this.state;

        return (
            <div className={nodeClassName}>
                <div className="first">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {firstLevelNodes.map((o, i) =>
                            <li key={i} className={o == firstLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.visible == false ? "none" : null }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon} style={{ fontSize: 16 }}></i>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="second">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {secondLevelNodes.map((o, i) =>
                            <li key={i} className={o == secondLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.visible == false ? "none" : null }}
                                onClick={() => this.showPageByNode(o)}>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.name}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={secondLevelNodes.length == 0 ? "main hideSecond" : 'main'} >
                    <nav className="navbar navbar-default" style={{ padding: "10px 10px 10px 10px" }}>
                        <div className="pull-left">
                            <ul key={40} className="dropdown-menu" aria-labelledby="dropdownMenu1"
                                style={{ display: menuShown ? 'block' : null }}>
                                {}
                            </ul>
                        </div>
                        <ul className="nav navbar-nav pull-right" >
                            {!hideExistsButton ?
                                <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                                    onClick={() => { }}>
                                    <i className="icon-off"></i>
                                    <span style={{ paddingLeft: 4 }}>退出</span>
                                </li> : null
                            }
                            {!hideStoreButton ?
                                <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                                    onClick={() => { }}>
                                    <i className="icon-building"></i>
                                    <span style={{ paddingLeft: 4, paddingRight: 10 }}>店铺管理</span>
                                </li> : null
                            }
                        </ul>
                    </nav>
                    <div style={{ padding: 20 }}
                        ref={(e: HTMLElement) => this.pageContainer = e || this.pageContainer}>
                    </div>
                </div>
            </div >
        );
    }
}