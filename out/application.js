"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const masterPage_1 = require("./masterPage");
const chitu_react = require("maishu-chitu-react");
const fs = require("fs");
const config_1 = require("./config");
const user_1 = require("./services/user");
let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
let masterPage = ReactDOM.render(React.createElement(masterPage_1.MasterPage, null), element);
class Application extends chitu_react.Application {
    constructor() {
        super({ container: masterPage.pageContainer });
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
        if (config_1.config.firstPanelWidth) {
            str = str + `\r\n@firstPanelWidth: ${config_1.config.firstPanelWidth};`;
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
    loadMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            let userService = this.currentPage.createService(user_1.UserService);
            let resources = yield userService.resources();
            let menus = resources.filter(o => o.parent_id == null)
                .map(o => ({
                name: o.name,
                path: o.path,
                children: []
            }));
            masterPage.setState({ menus });
        });
    }
    createMasterPage() {
    }
    run() {
        super.run();
        this.loadStyle();
        this.loadMenus();
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
