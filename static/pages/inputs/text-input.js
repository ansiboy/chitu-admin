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
const input_control_1 = require("./input-control");
const maishu_dilu_1 = require("maishu-dilu");
class TextInput extends input_control_1.InputControl {
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.dataType == "number") {
            this.props.validateRules.push(maishu_dilu_1.rules.numeric("请输入数字"));
        }
    }
    get value() {
        return this.state.value;
    }
    set value(value) {
        this.setState({ value });
    }
    render() {
        let { dataField, placeholder, dataType } = this.props;
        let { value } = this.state;
        return React.createElement("input", { name: name || dataField, className: "form-control", placeholder: placeholder, type: this.props.type, value: value || "", ref: e => this.input = e || this.input, onChange: e => {
                if (dataType == "number") {
                    if (!maishu_dilu_1.rules.numeric().validate(e.target.value))
                        return;
                    var integerRegex = /^\d+$/;
                    let value = integerRegex.test(e.target.value) ? parseInt(e.target.value) : parseFloat(e.target.value);
                    this.setState({ value });
                }
                this.setState({ value: e.target.value });
            } });
    }
}
exports.TextInput = TextInput;
