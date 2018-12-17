var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "react", "services/user"], function (require, exports, React, user_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MasterPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                currentMenu: null, username: '',
                hideExistsButton: false, hideStoreButton: false, menuShown: true, menus: []
            };
            // this.loadMenus()
        }
        init(app) {
            this.app = app;
            this.loadMenus();
        }
        get showExistsButton() {
            return !this.state.hideExistsButton;
        }
        set showExistsButton(value) {
            this.setState({ hideExistsButton: !value });
        }
        updateMenu(page) {
            let url = page.name.replace(/\./, '/');
            let currentNode = this.findNodeByName(url);
            this.setState({ currentMenu: currentNode });
        }
        findNodeByName(name) {
            let stack = new Array();
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
        showPageByNode(node) {
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
        loadMenus() {
            return __awaiter(this, void 0, void 0, function* () {
                let userService = this.app.currentPage.createService(user_1.UserService);
                let resources = yield userService.resources();
                let menus = resources.filter(o => o.parent_id == null)
                    .map(o => ({
                    name: o.name,
                    children: []
                }));
                this.setState({ menus });
                // setTimeout(() => {
                //     let menus: Menu[] = [
                //         { name: "经销商", children: [], visible: true },
                //         { name: "经销商", children: [], visible: true },
                //     ]
                //     this.setState({ menus })
                // }, 500)
            });
        }
        render() {
            let currentNode = this.state.currentMenu;
            let menuData = this.state.menus;
            let firstLevelNode;
            let secondLevelNode;
            let thirdLevelNode;
            let firstLevelNodes = menuData.filter(o => o.visible == null || o.visible == true);
            let secondLevelNodes = [];
            let thirdLevelNodes = [];
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
                    throw new Error('not implement');
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
            return (React.createElement("div", { className: nodeClassName },
                React.createElement("div", { className: "first" },
                    React.createElement("ul", { className: "list-group", style: { margin: 0 } }, firstLevelNodes.map((o, i) => React.createElement("li", { key: i, className: o == firstLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.visible == false ? "none" : null }, onClick: () => this.showPageByNode(o) },
                        React.createElement("i", { className: o.icon, style: { fontSize: 16 } }),
                        React.createElement("span", { style: { paddingLeft: 8, fontSize: 14 } }, o.name))))),
                React.createElement("div", { className: "second" },
                    React.createElement("ul", { className: "list-group", style: { margin: 0 } }, secondLevelNodes.map((o, i) => React.createElement("li", { key: i, className: o == secondLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.visible == false ? "none" : null }, onClick: () => this.showPageByNode(o) },
                        React.createElement("span", { style: { paddingLeft: 8, fontSize: 14 } }, o.name))))),
                React.createElement("div", { className: secondLevelNodes.length == 0 ? "main hideSecond" : 'main' },
                    React.createElement("nav", { className: "navbar navbar-default", style: { padding: "10px 10px 10px 10px" } },
                        React.createElement("div", { className: "pull-left" },
                            React.createElement("ul", { key: 40, className: "dropdown-menu", "aria-labelledby": "dropdownMenu1", style: { display: menuShown ? 'block' : null } })),
                        React.createElement("ul", { className: "nav navbar-nav pull-right" },
                            !hideExistsButton ?
                                React.createElement("li", { className: "light-blue pull-right", style: { color: 'white', paddingTop: 4, cursor: 'pointer' }, onClick: () => { } },
                                    React.createElement("i", { className: "icon-off" }),
                                    React.createElement("span", { style: { paddingLeft: 4 } }, "\u9000\u51FA")) : null,
                            !hideStoreButton ?
                                React.createElement("li", { className: "light-blue pull-right", style: { color: 'white', paddingTop: 4, cursor: 'pointer' }, onClick: () => { } },
                                    React.createElement("i", { className: "icon-building" }),
                                    React.createElement("span", { style: { paddingLeft: 4, paddingRight: 10 } }, "\u5E97\u94FA\u7BA1\u7406")) : null)),
                    React.createElement("div", { style: { padding: 20 }, ref: (e) => this.pageContainer = e || this.pageContainer }))));
        }
    }
    exports.MasterPage = MasterPage;
});
