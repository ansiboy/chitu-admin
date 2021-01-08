"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
class PageDataSource extends maishu_wuzhui_helper_1.DataSource {
    constructor(args) {
        super(args);
        this.options = args;
    }
}
exports.PageDataSource = PageDataSource;
