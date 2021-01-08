"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReactDOM = __importStar(require("react-dom"));
const simple_master_page_1 = require("./masters/simple-master-page");
const main_master_page_1 = require("./masters/main-master-page");
const React = __importStar(require("react"));
const my_service_1 = require("./services/my-service");
const chitu_react = __importStar(require("maishu-chitu-react"));
const ui = __importStar(require("maishu-ui-toolkit"));
require("./admin_style_default.less");
let app = null;
function startup(requirejs) {
    return __awaiter(this, void 0, void 0, function* () {
        console.assert(requirejs != null);
        function createMasterPages(app) {
            return __awaiter(this, void 0, void 0, function* () {
                let mainProps = { app };
                let simplePorps = { app };
                let r = yield Promise.all([
                    renderElement(simple_master_page_1.SimpleMasterPage, simplePorps, document.getElementById('simple-master')),
                    renderElement(main_master_page_1.MainMasterPage, mainProps, document.getElementById('main-master')),
                ]);
                return {
                    simple: r[0],
                    default: r[1]
                };
            });
        }
        app = new Application(requirejs, document.getElementById('simple-master'), document.getElementById('main-master'), document.getElementById('blank-master'));
        let service = app.createService(my_service_1.MyService);
        let config = yield service.config();
        console.assert(config.menuItems != null);
        let masterPages = yield createMasterPages(app);
        masterPages.default.setMenu(...config.menuItems);
        requirejs(["clientjs_init.js"], function (initModule) {
            console.assert(masterPages.default != null);
            if (initModule && typeof initModule.default == 'function') {
                let args = {
                    app, mainMaster: masterPages.default, requirejs
                };
                let result = initModule.default(args);
                if (result != null && result.then != null) {
                    result.then(() => {
                        app.run();
                    });
                    return;
                }
            }
            app.run();
        });
    });
}
exports.default = startup;
function renderElement(componentClass, props, container) {
    return new Promise((resolve) => {
        props.ref = function (e) {
            if (!e)
                return;
            resolve(e);
        };
        let element = React.createElement(componentClass, props);
        ReactDOM.render(element, container);
    });
}
class Application extends chitu_react.Application {
    constructor(requirejs, simpleContainer, mainContainer, blankContainer) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer,
                blank: blankContainer,
            }
        });
        this.error.add((sender, error) => errorHandle(error, this));
        this.pageCreated.add((sender, page) => this.onPageCreated(page));
    }
    onPageCreated(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let pageClassName = page.name.split("/").filter(o => o != "").join("-");
            page.element.className = `admin-page ${pageClassName}`;
        });
    }
}
exports.Application = Application;
let errorMessages = {
    "726": "没有权限访问"
};
function errorHandle(error, app) {
    error.message = errorMessages[error.name] || error.message;
    if (error.name == "718" && app != null) {
        // app.redirect("login");
        location.hash = "#login";
        return;
    }
    ui.alert({
        title: "错误",
        message: error.message
    });
}
exports.errorHandle = errorHandle;
