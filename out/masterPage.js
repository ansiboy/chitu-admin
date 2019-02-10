"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const chitu_react = require("maishu-chitu-react");
const fs = require("fs");
const ReactDOM = require("react-dom");
class MasterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menus: [] };
    }
    showPageByNode(node) {
        if (!node.path && (node.children || []).length > 0) {
            this.showPageByNode(node.children[0]);
            return;
        }
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
            this.app.redirect(pageName);
        }
    }
    findMenuItemByResourceId(menuItems, resourceId) {
        let stack = new Array();
        stack.push(...menuItems);
        while (stack.length > 0) {
            let item = stack.pop();
            // if (item.path) {
            //     let obj = this.app.parseUrl(item.path)
            // if (obj.pageName == pageName)
            //     return item
            // }
            if (item.id == resourceId)
                return item;
            let children = item.children || [];
            stack.push(...children);
        }
        return null;
    }
    findMenuItemByPageName(menuItems, pageName) {
        let stack = new Array();
        stack.push(...menuItems);
        while (stack.length > 0) {
            let item = stack.pop();
            if (item.path) {
                let obj = this.app.parseUrl(item.path);
                if (obj.pageName == pageName)
                    return item;
            }
            let children = item.children || [];
            stack.push(...children);
        }
        return null;
    }
    /** 设置工具栏 */
    setToolbar(toolbar) {
        this.setState({ toolbar });
    }
    /** 设置菜单 */
    setMenus(menus) {
        menus = menus || [];
        let currentPageName = this.app.currentPage ? this.app.currentPage.name : null;
        let resourceId = this.app.currentPage ? this.app.currentPage.data.resourceId || this.app.currentPage.data.resource_id : null;
        this.setState({ menus, currentPageName, resourceId });
    }
    setHideMenuPages(pageNames) {
        this.setState({ hideMenuPages: pageNames || [] });
    }
    get application() {
        return this.app;
    }
    componentDidMount() {
        this.app = new Application(this);
        this.app.pageCreated.add((sender, page) => {
            page.shown.add(() => {
                this.setState({ currentPageName: page.name });
                this.setState({ resourceId: page.data.resourceId || page.data.resource_id });
            });
        });
    }
    render() {
        let menuData = this.state.menus;
        let currentPageName = this.state.currentPageName;
        let firstLevelNodes = menuData.filter(o => o.visible == null || o.visible == true);
        let currentNode;
        if (this.state.resourceId) {
            currentNode = this.findMenuItemByResourceId(firstLevelNodes, this.state.resourceId);
        }
        else if (currentPageName) {
            currentNode = this.findMenuItemByPageName(firstLevelNodes, currentPageName);
        }
        let firstLevelNode;
        let secondLevelNode;
        if (currentNode != null) {
            if (currentNode.parent == null) {
                firstLevelNode = currentNode;
            }
            else if (currentNode.parent.parent == null) { //二级菜单
                firstLevelNode = currentNode.parent;
                secondLevelNode = currentNode;
            }
            else if (currentNode.parent.parent.parent == null) { //三级菜单
                firstLevelNode = currentNode.parent.parent;
                secondLevelNode = currentNode.parent;
            }
        }
        let nodeClassName = '';
        let hideMenuPages = this.state.hideMenuPages || [];
        if (hideMenuPages.indexOf(currentPageName) >= 0) {
            nodeClassName = 'hideFirst';
        }
        else if (firstLevelNode == null || (firstLevelNode.children || []).filter(o => o.visible != false).length == 0) {
            nodeClassName = 'hideSecond';
        }
        return (React.createElement("div", { className: nodeClassName },
            React.createElement("div", { className: "first" },
                React.createElement("ul", { className: "list-group", style: { margin: 0 } }, firstLevelNodes.map((o, i) => React.createElement("li", { key: i, className: o == firstLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.visible == false ? "none" : null }, onClick: () => this.showPageByNode(o) },
                    React.createElement("i", { className: o.icon, style: { fontSize: 16 } }),
                    React.createElement("span", { style: { paddingLeft: 8, fontSize: 14 } }, o.name))))),
            React.createElement("div", { className: "second" },
                React.createElement("ul", { className: "list-group", style: { margin: 0 } }, (firstLevelNode ? (firstLevelNode.children || []) : []).filter(o => o.visible != false).map((o, i) => React.createElement("li", { key: i, className: o == secondLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.visible == false ? "none" : null }, onClick: () => this.showPageByNode(o) },
                    React.createElement("span", { style: { paddingLeft: 8, fontSize: 14 } }, o.name))))),
            React.createElement("div", { className: "main" },
                React.createElement("nav", { className: "navbar navbar-default", style: { padding: "10px 10px 10px 10px" } }, this.state.toolbar),
                React.createElement("div", { style: { padding: 20 }, ref: (e) => this.pageContainer = e || this.pageContainer }))));
    }
}
exports.MasterPage = MasterPage;
class Application extends chitu_react.Application {
    constructor(masterPage) {
        super({ container: masterPage.pageContainer });
        this._masterPage = masterPage;
    }
    get masterPage() {
        return this._masterPage;
    }
    get config() {
        window['maishu-chitu-admin-config'] = window['maishu-chitu-admin-config'] || {};
        return window['maishu-chitu-admin-config'];
    }
    defaultPageNodeParser() {
        let nodes = {};
        let p = {
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
        };
        return p;
    }
    /** 加载样式文件 */
    loadStyle() {
        let str = fs.readFileSync("content/admin_style_default.less").toString();
        if (this.config.firstPanelWidth) {
            str = str + `\r\n@firstPanelWidth: ${this.config.firstPanelWidth};`;
        }
        if (this.config.secondPanelWidth) {
            str = str + `\r\n@secondPanelWidth: ${this.config.secondPanelWidth};`;
        }
        let less = window['less'];
        less.render(str, function (e, result) {
            if (e) {
                console.error(e);
                return;
            }
            let style = document.createElement('style');
            document.head.appendChild(style);
            style.innerText = result.css;
        });
    }
    createMasterPage() {
    }
    run() {
        super.run();
        this.loadStyle();
    }
}
exports.Application = Application;
function loadjs(path) {
    return new Promise((reslove, reject) => {
        requirejs([path], function (result) {
            reslove(result);
        }, function (err) {
            reject(err);
        });
    });
}
let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
let masterPage = ReactDOM.render(React.createElement(MasterPage, null), element);
exports.app = masterPage.application;
