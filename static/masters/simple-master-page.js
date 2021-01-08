"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const master_page_1 = require("./master-page");
const React = __importStar(require("react"));
const names_1 = require("./names");
class SimpleMasterPage extends master_page_1.MasterPage {
    constructor() {
        super(...arguments);
        this.name = names_1.masterPageNames.simple;
    }
    get element() {
        return this.pageContainer;
    }
    render() {
        return React.createElement("div", { ref: e => this.pageContainer = e || this.pageContainer });
    }
}
exports.SimpleMasterPage = SimpleMasterPage;
