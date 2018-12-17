

import React = require('react');
import * as chitu from 'maishu-chitu'

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
    // hideStoreButton: boolean,
    menuShown: boolean,
    menus: Menu[],
}

interface Props {
}

export class MasterPage extends React.Component<Props, State> {
    pageContainer: HTMLElement;
    private app: chitu.Application;

    constructor(props) {
        super(props);


        this.state = {
            currentMenu: null, username: '',
            hideExistsButton: false, menuShown: true, menus: []
        }
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
        let pageName = node.path;
        if (pageName == null && node.children.length > 0) {
            node = node.children[0];
            pageName = node.name;
        }

        if (pageName == null && node.children.length > 0) {
            node = node.children[0];
            pageName = node.name;
        }

        if (pageName) {
            this.app.redirect(pageName)
        }

        this.setState({ currentMenu: node })
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


        let { hideExistsButton, menuShown } = this.state;

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
                        <ul className="nav navbar-nav pull-right" >
                            {!hideExistsButton ?
                                <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                                    onClick={() => { }}>
                                    <i className="icon-off"></i>
                                    <span style={{ paddingLeft: 4 }}>退出</span>
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