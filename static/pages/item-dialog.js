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
const React = __importStar(require("react"));
const maishu_ui_toolkit_1 = require("maishu-ui-toolkit");
const ReactDOM = __importStar(require("react-dom"));
const maishu_dilu_1 = require("maishu-dilu");
const input_control_1 = require("./inputs/input-control");
function createItemDialog(dataSource, name, child, beforeSave) {
    class ItemDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.beforeSaves = [];
            this.inputControls = [];
            child = this.cloneElement(child);
        }
        /**
         * 克隆元素，并找出 InputControl
         * @param element 要克隆的元素
         */
        cloneElement(element) {
            if (element == null)
                return null;
            if (typeof element == "string")
                return element;
            if (Array.isArray(element)) {
                return element.map(o => this.cloneElement(o));
            }
            let elementType = element["type"];
            console.assert(elementType);
            let props;
            let it = this;
            if (typeof elementType == "function") {
                if (elementType.constructor == input_control_1.InputControl.constructor) {
                    let ref = element.props.ref;
                    props = Object.assign({}, element.props, {
                        ref(e) {
                            if (!e)
                                return;
                            it.inputControls.push(e);
                            if (ref)
                                ref.apply(this);
                        }
                    });
                }
            }
            props = props || element.props;
            let newChildren = this.cloneElement(element.props.children);
            let newElement;
            if (Array.isArray(newChildren)) {
                newElement = React.createElement(elementType, props, ...newChildren);
            }
            else {
                newElement = React.createElement(elementType, props, newChildren);
            }
            return newElement;
        }
        onSaveButtonClick() {
            return __awaiter(this, void 0, void 0, function* () {
                this.validator.clearErrors();
                if (!this.validator.check()) {
                    return Promise.reject('validate fail');
                }
                yield this.save();
                maishu_ui_toolkit_1.hideDialog(this.dialogElement);
            });
        }
        setDataItem(dataItem) {
            this.dataItem = dataItem;
            let primaryValues = (dataSource.primaryKeys || []).map(key => dataItem[key]).filter(o => o);
            let title = primaryValues.length > 0 ? `修改${name}` : `添加${name}`;
            this.inputControls.forEach(c => {
                let value = dataItem[c.props.dataField];
                c.value = value;
            });
            this.setState({ title });
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                let dataItem = this.dataItem;
                this.inputControls.forEach(c => {
                    dataItem[c.props.dataField] = c.value;
                });
                if (beforeSave) {
                    yield beforeSave(dataItem);
                }
                if (this.beforeSaves.length > 0) {
                    yield Promise.all(this.beforeSaves.map(m => m(dataItem)));
                }
                let primaryValues = dataSource.primaryKeys.map(o => dataItem[o]).filter(v => v != null);
                if (primaryValues.length > 0) {
                    yield dataSource.update(dataItem);
                }
                else {
                    yield dataSource.insert(dataItem);
                }
            });
        }
        componentDidMount() {
            let ctrls = this.inputControls;
            let validateFields = ctrls.filter(o => o.props.validateRules).map(o => ({ name: o.props.dataField, rules: o.props.validateRules }));
            this.validator = new maishu_dilu_1.FormValidator(this.fieldsConatiner, ...validateFields);
        }
        render() {
            let { title } = this.state;
            return React.createElement("div", { className: "modal-dialog" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7")),
                        React.createElement("h4", { className: "modal-title" }, title)),
                    React.createElement("div", { className: "modal-body well", style: { paddingLeft: 20, paddingRight: 20 }, ref: e => this.fieldsConatiner = e || this.fieldsConatiner }, child),
                    React.createElement("div", { className: "modal-footer" },
                        React.createElement("button", { className: "btn btn-default", onClick: () => { maishu_ui_toolkit_1.hideDialog(this.dialogElement); } },
                            React.createElement("i", { className: "icon-reply" }),
                            React.createElement("span", null, "\u53D6\u6D88")),
                        React.createElement("button", { className: "btn btn-primary", onClick: () => this.onSaveButtonClick() },
                            React.createElement("i", { className: "icon-save" }),
                            React.createElement("span", null, "\u786E\u5B9A")))));
        }
        static show(dataItem) {
            dataItem = dataItem || {};
            if (!ItemDialog.instance) {
                let dialogElement = document.createElement("div");
                dialogElement.className = "modal fade-in";
                document.body.appendChild(dialogElement);
                ItemDialog.instance = ReactDOM.render(React.createElement(ItemDialog, null), dialogElement);
                ItemDialog.instance.dialogElement = dialogElement;
            }
            if (ItemDialog.instance.validator)
                ItemDialog.instance.validator.clearErrors();
            ItemDialog.instance.setDataItem(dataItem);
            maishu_ui_toolkit_1.showDialog(ItemDialog.instance.dialogElement);
        }
    }
    return ItemDialog;
}
exports.createItemDialog = createItemDialog;
