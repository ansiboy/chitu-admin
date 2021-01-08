"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const master_page_1 = require("./master-page");
const names_1 = require("./names");
const maishu_chitu_1 = require("maishu-chitu");
const maishu_toolkit_1 = require("maishu-toolkit");
class MainMasterPage extends master_page_1.MasterPage {
    constructor(props) {
        super(props);
        this.name = names_1.masterPageNames.main;
        this.menuResources = new maishu_chitu_1.ValueStore([]);
        this.state = { menuItems: [], username: "" };
        this.app = props.app;
        this.menuResources.add((value) => {
            let menuItems = translateToMenuItems(value).filter(o => o.parent == null);
            this.setState({ menuItems: menuItems });
        });
    }
    get element() {
        return document.getElementById("main-master");
    }
    showPageByNode(node) {
        let children = node.children || [];
        if (!node.page_path && (node.children || []).length > 0) {
            this.showPageByNode(children[0]);
            return;
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
            // this.app.redirect(pagePath, { resourceId: node.id });
            location.hash = pagePath;
            return;
        }
        if (pagePath.startsWith("http")) {
            location.href = pagePath;
            return;
        }
        this.app.redirect("outer-page", { target: pagePath, resourceId: node.id });
    }
    findMenuItemByResourceId(menuItems, resourceId) {
        let stack = new Array();
        stack.push(...menuItems);
        while (stack.length > 0) {
            let item = stack.shift();
            if (item == null)
                return;
            if (item.id == resourceId)
                return item;
            let children = item.children || [];
            stack.push(...children);
        }
        return null;
    }
    findMenuItemByPageUrl(menuItems, pageUrl) {
        let stack = new Array();
        stack.push(...menuItems);
        while (stack.length > 0) {
            let item = stack.shift();
            if (item == null)
                throw new Error("item is null");
            if (item.page_path == `#${pageUrl}`) {
                // let obj = this.app.parseUrl(item.page_path) || { pageName: '' }
                // if (obj.pageName == pageName)
                return item;
            }
            let children = item.children || [];
            stack.push(...children);
        }
        return null;
    }
    translateToResource(o) {
        let path = o.path; //typeof o.path == "function" ? o.path() : o.path;
        return {
            id: o.id,
            name: o.name, page_path: path, type: o.hidden ? "module" : "menu",
            icon: o.icon, parent_id: o.parentId, sort_number: o.sortNumber
        };
    }
    setMenu(...menuItems) {
        let resources = [];
        menuItems.sort((a, b) => a.sortNumber < b.sortNumber ? -1 : 1);
        let stack = new Array();
        stack.push(...menuItems);
        while (stack.length > 0) {
            let item = stack.shift();
            let resource = this.translateToResource(item);
            resources.push(resource);
            item.children = item.children || [];
            item.children.forEach(c => c.parentId = resource.id);
            stack.push(...(item.children || []));
        }
        this.menuResources.value = resources;
    }
    setToolbar(value) {
        this.setState({ toolbar: value });
    }
    get menuItems() {
        return this.state.menuItems || [];
    }
    componentDidMount() {
        this.app.pageCreated.add((sender, page) => {
            page.shown.add(() => {
                this.setState({ currentPageUrl: page.url });
                this.setState({ resourceId: (page.data.resourceId || page.data.resource_id) });
            });
        });
    }
    render() {
        let { menuItems: menuData } = this.state;
        let currentPageUrl = this.state.currentPageUrl || '';
        let firstLevelNodes = menuData.filter(o => o.type == "menu");
        let currentNode;
        if (this.state.resourceId) {
            currentNode = this.findMenuItemByResourceId(firstLevelNodes, this.state.resourceId);
        }
        else if (currentPageUrl) {
            currentNode = this.findMenuItemByPageUrl(firstLevelNodes, currentPageUrl);
            let q = currentPageUrl.indexOf("?");
            if (currentNode == null && q > 0) {
                let shortUrl = currentPageUrl.substr(0, q);
                currentNode = this.findMenuItemByPageUrl(firstLevelNodes, shortUrl);
            }
        }
        let firstLevelNode = null;
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
        let hideFirst = false;
        let hideSecond = false;
        let nodeClassName = '';
        let hideMenuPages = this.state.hideMenuPages || [];
        if (hideMenuPages.indexOf(currentPageUrl) >= 0) {
            nodeClassName = 'hideFirst';
            hideFirst = true;
            hideSecond = true;
        }
        else if (firstLevelNode == null || (firstLevelNode.children || []).filter(o => o.type == "menu").length == 0) {
            nodeClassName = 'hideSecond';
            hideSecond = true;
        }
        // return <div className={`${nodeClassName}`} ref={e => this.element = e || this.element}>
        // </div >
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: "first", style: { display: hideFirst ? "none" : "" } },
                React.createElement("ul", { className: "list-group" }, firstLevelNodes.map((o, i) => React.createElement("li", { key: i, className: o == firstLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.type != "menu" ? "none" : '' }, onClick: () => this.showPageByNode(o) },
                    React.createElement("i", { className: o.icon }),
                    React.createElement("span", { "menu-id": o.id, "sort-number": o.sort_number }, o.name))))),
            React.createElement("div", { className: "second", style: { display: hideSecond ? "none" : "" } },
                React.createElement("ul", { className: "list-group" }, (firstLevelNode ? (firstLevelNode.children || []) : []).filter(o => o.type == "menu").map((o, i) => React.createElement("li", { key: i, className: o == secondLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.type != "menu" ? "none" : '' }, "page-url": o.page_path, onClick: () => this.showPageByNode(o) },
                    React.createElement("i", { className: o.icon }),
                    React.createElement("span", { "menu-id": o.id, "sort-number": o.sort_number }, o.name))))),
            React.createElement("div", { className: "main" },
                React.createElement("nav", { className: "navbar navbar-default" }, this.state.toolbar),
                React.createElement("div", { className: `page-container page-placeholder`, ref: (e) => this.pageContainer = e || this.pageContainer })));
    }
}
exports.MainMasterPage = MainMasterPage;
function translateToMenuItems(resources) {
    resources.forEach(o => {
        o.id = o.id || maishu_toolkit_1.guid();
    });
    let arr = new Array();
    let stack = [...resources.filter(o => o.parent_id == null)];
    while (stack.length > 0) {
        let item = stack.shift();
        item.children = resources.filter(o => o.parent_id == item.id);
        if (item.parent_id) {
            item.parent = resources.filter(o => o.id == item.parent_id)[0];
        }
        stack.push(...item.children);
        arr.push(item);
    }
    let ids = arr.map(o => o.id);
    for (let i = 0; i < ids.length; i++) {
        let item = arr.filter(o => o.id == ids[i])[0];
        console.assert(item != null);
        if (item.children.length > 1) {
            item.children.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
        }
    }
    return arr;
}
