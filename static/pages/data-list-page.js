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
const base_page_1 = require("./base-page");
const maishu_wuzhui_helper_1 = require("maishu-wuzhui-helper");
const React = __importStar(require("react"));
const item_dialog_1 = require("./item-dialog");
const ReactDOM = __importStar(require("react-dom"));
const input_control_1 = require("./inputs/input-control");
const maishu_ui_toolkit_1 = require("maishu-ui-toolkit");
/** 数据绑定列控件 */
class BoundFieldControl extends input_control_1.InputControl {
    constructor(props) {
        super(props);
        this.state = {};
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this.control != null)
            this.control.value = value;
    }
    render() {
        console.assert(this.state != null);
        return React.createElement("span", { ref: e => {
                if (this.control != null) {
                    return;
                }
                this.control = this.props.boundField.createControl();
                this.control.element.setAttribute("name", this.props.dataField);
                this.control.value = this._value;
                this.control.element.onchange = () => {
                    this._value = this.control.value;
                };
                e.appendChild(this.control.element);
            } });
    }
}
class DataListPage extends base_page_1.BasePage {
    constructor(props) {
        super(props);
        /** 操作列宽度 */
        this.CommandColumnWidth = 140;
        this.ScrollBarWidth = 18;
        //============================================
        // protected
        this.pageSize = 15;
        this.headerFixed = false;
        /** 是否显示命令字段 */
        this.showCommandColumn = true;
        window.addEventListener("resize", () => {
            let height = window.innerHeight - 160;
            let width = window.innerWidth - 80;
            let firstMenuPanel = document.getElementsByClassName("first")[0];
            let secondMenuPanel = document.getElementsByClassName("second")[0];
            if (firstMenuPanel) {
                width = width - firstMenuPanel.offsetWidth;
            }
            if (secondMenuPanel) {
                width = width - secondMenuPanel.offsetWidth;
            }
            let tableSize;
            if (this.state != null) {
                tableSize = this.state.tableSize;
            }
            if (tableSize == null || tableSize.height != height || tableSize.width != width) {
                this.setState({ tableSize: { width, height } });
            }
        });
    }
    calcTableSize() {
        let height = window.innerHeight - 160;
        let width = window.innerWidth - 40;
        let firstMenuPanel = document.getElementsByClassName("first")[0];
        let secondMenuPanel = document.getElementsByClassName("second")[0];
        if (firstMenuPanel) {
            width = width - firstMenuPanel.offsetWidth;
        }
        if (secondMenuPanel) {
            width = width - secondMenuPanel.offsetWidth;
        }
        return { width, height };
    }
    componentDidMount() {
        this.columns = this.columns || [];
        if (this.showCommandColumn) {
            let it = this;
            this.commandColumn = new maishu_wuzhui_helper_1.CustomField({
                headerText: "操作",
                headerStyle: { textAlign: "center", width: `${this.CommandColumnWidth}px` },
                itemStyle: { textAlign: "center", width: `${this.CommandColumnWidth}px` },
                createItemCell(dataItem, cellElement) {
                    let cell = new maishu_wuzhui_helper_1.GridViewCell(cellElement);
                    ReactDOM.render(React.createElement(React.Fragment, null,
                        it.leftCommands(dataItem),
                        it.editButton(dataItem),
                        it.deleteButton(dataItem),
                        it.rightCommands(dataItem)), cell.element);
                    return cell;
                }
            });
        }
        maishu_wuzhui_helper_1.createGridView({
            element: this.itemTable,
            dataSource: this.dataSource,
            columns: this.commandColumn ? [...this.columns, this.commandColumn] : this.columns,
            pageSize: this.pageSize,
            translate: this.translate,
            showHeader: this.headerFixed != true,
        });
    }
    renderEditor() {
        return React.createElement(React.Fragment, null, this.columns.filter(o => o instanceof maishu_wuzhui_helper_1.BoundField && o.readOnly != true).map((col, i) => React.createElement("div", { key: i, className: "form-group clearfix input-control" },
            React.createElement("label", null, col.headerText),
            React.createElement(BoundFieldControl, { boundField: col, dataField: col.dataField, validateRules: col.validateRules }))));
    }
    renderToolbarRight() {
        let editor = this.renderEditor();
        if (editor == null) {
            return [];
        }
        this.dialog = item_dialog_1.createItemDialog(this.dataSource, this.itemName, editor);
        let addButton = this.addButton();
        let searchInput = this.searchControl();
        return [searchInput, addButton,];
    }
    /** 获取页面添加按钮 */
    addButton() {
        let button = this.dataSource.canInsert ? React.createElement("button", { key: "btnAdd", className: "btn btn-primary btn-sm", onClick: () => this.dialog.show({}) },
            React.createElement("i", { className: "icon-plus" }),
            React.createElement("span", null, "\u6DFB\u52A0")) : null;
        return button;
    }
    /** 获取页面编辑按钮 */
    editButton(dataItem) {
        if (!this.dataSource.canUpdate)
            return null;
        let ps = this.dataSource;
        let options = ps.options || {};
        let itemCanUpdate = options.itemCanUpdate || (() => true);
        return React.createElement("button", { className: "btn btn-minier btn-info", onClick: () => this.executeEdit(dataItem), disabled: !itemCanUpdate(dataItem) },
            React.createElement("i", { className: "icon-pencil" }));
    }
    /** 获取页面删除按钮 */
    deleteButton(dataItem) {
        if (!this.dataSource.canDelete)
            return;
        let ps = this.dataSource;
        let options = ps.options || {};
        let itemCanDelete = options.itemCanDelete || (() => true);
        return React.createElement("button", { className: "btn btn-minier btn-danger", disabled: !itemCanDelete(dataItem), ref: e => {
                if (!e)
                    return;
                if (e.getAttribute("button-on-click")) {
                    return;
                }
                e.setAttribute("button-on-click", "true");
                maishu_ui_toolkit_1.buttonOnClick(e, () => this.executeDelete(dataItem));
            } },
            React.createElement("i", { className: "icon-trash" }));
    }
    /** 执行编辑操作 */
    executeEdit(dataItem) {
        this.dialog.show(dataItem);
    }
    /** 执行删除操作 */
    executeDelete(dataItem) {
        if (this.deleteConfirmText) {
            let message = this.deleteConfirmText(dataItem);
            return new Promise((resolve, reject) => {
                maishu_ui_toolkit_1.confirm({
                    title: "请确认", message,
                    confirm: () => __awaiter(this, void 0, void 0, function* () {
                        return this.dataSource.delete(dataItem)
                            .then(r => resolve(r))
                            .catch(err => reject(err));
                    }),
                    cancle: () => __awaiter(this, void 0, void 0, function* () {
                        resolve({});
                    })
                });
            });
        }
        return this.dataSource.delete(dataItem);
    }
    /** 获取页面搜索栏 */
    searchControl() {
        let dataSource = this.dataSource;
        let search = dataSource.options ? dataSource.options.search : null;
        let searchInput = search ? React.createElement(React.Fragment, null,
            React.createElement("input", { type: "text", className: "form-control pull-left input-sm", placeholder: search.placeholder || "", style: { width: 300 } }),
            React.createElement("button", { className: "btn btn-primary btn-sm" },
                React.createElement("i", { className: "icon-search" }),
                React.createElement("span", null, "\u641C\u7D22"))) : null;
        return searchInput;
    }
    rightCommands(dataItem) {
        return [];
    }
    leftCommands(dataItem) {
        return [];
    }
    render() {
        let tableSize = this.state ? this.state.tableSize : this.calcTableSize();
        if (this.headerFixed) {
            let columns = this.columns || [];
            return React.createElement(React.Fragment, null,
                React.createElement("div", { style: { height: `${tableSize.height}px`, width: `${tableSize.width}px`, overflowY: "scroll", overflowX: "hidden" } },
                    React.createElement("table", { className: "table table-striped table-bordered table-hover", style: { margin: 0 } },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                columns.map((col, i) => React.createElement("th", { key: i, ref: e => {
                                        if (!e)
                                            return;
                                        if (!col.itemStyle)
                                            return;
                                        e.style.width = col.itemStyle["width"];
                                        if (this.commandColumn == null && i == columns.length - 1) {
                                            e.style.width = `calc(${e.style.width} + ${this.ScrollBarWidth}px)`;
                                        }
                                    } }, col.headerText)),
                                this.commandColumn ? React.createElement("th", { style: { width: this.CommandColumnWidth + this.ScrollBarWidth } }, this.commandColumn.headerText) : null))),
                    React.createElement("table", { ref: e => this.itemTable = e || this.itemTable })));
        }
        return React.createElement("table", { ref: e => this.itemTable = e || this.itemTable });
    }
    boundField(params) {
        return maishu_wuzhui_helper_1.boundField(params);
    }
    dateTimeField(params) {
        return maishu_wuzhui_helper_1.dateTimeField(params);
    }
    checkboxListField(params) {
        return maishu_wuzhui_helper_1.checkboxListField(params);
    }
}
exports.DataListPage = DataListPage;
