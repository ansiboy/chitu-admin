"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_websiteConfig_1 = __importDefault(require("json!websiteConfig"));
const maishu_ui_toolkit_1 = require("maishu-ui-toolkit");
const maishu_toolkit_1 = require("maishu-toolkit");
const errors_1 = require("./errors");
let contextName = json_websiteConfig_1.default.requirejs != null ? json_websiteConfig_1.default.requirejs.context : null;
/** 对 requirejs 进行封装，方便使用 */
class Requirejs {
    static loadjs(modules) {
        return new Promise((resolove, reject) => {
            // 直接使用 requirejs.config webpack 打包会去掉 requirejs，原因不明
            let req = window["requirejs"].config({ context: contextName });
            req(modules, function (...args) {
                resolove(args);
            }, function (err) {
                console.log(err);
                reject(err);
            });
        });
    }
    static loadLess(stationPath) {
        maishu_ui_toolkit_1.Less.renderByRequireJS(stationPath, { contextName: contextName });
    }
    static websitePath(stationPath) {
        if (!stationPath)
            throw errors_1.errors.argumentNull("stationPath");
        if (typeof stationPath != "string")
            throw errors_1.errors.argumentTypeIncorrect("stationPath", "string");
        let contexts = requirejs.exec("contexts");
        let context = contexts[contextName];
        if (context != null && context.config != null && context.config.baseUrl != null) {
            return maishu_toolkit_1.pathConcat(context.config.baseUrl, stationPath);
        }
        return stationPath;
    }
}
exports.Requirejs = Requirejs;
