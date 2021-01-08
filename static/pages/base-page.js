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
class BasePage extends React.Component {
    constructor(props) {
        super(props);
        this.backButtonVisiable = false;
        let render = this.render;
        this.render = () => {
            let toolbarLeft = this.renderToolbarLeft();
            let toolbarRight = this.renderToolbarRight();
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "tabbable" },
                    this.title ? React.createElement("h4", { className: "pull-left", style: { margin: "2px 0 0 0" } }, this.title) : null,
                    React.createElement("ul", { className: "nav nav-tabs" },
                        toolbarLeft.map((o, i) => React.createElement("li", { key: i, className: "pull-left" }, o)),
                        React.createElement("li", { className: "pull-right" },
                            React.createElement("button", { className: "btn btn-primary btn-sm", style: { display: this.backButtonVisiable ? null : "none" }, onClick: () => this.props.app.back() },
                                React.createElement("i", { className: "icon-reply" }),
                                React.createElement("span", null, "\u8FD4\u56DE"))),
                        toolbarRight.reverse().map((o, i) => React.createElement("li", { key: i, className: "pull-right" }, o)))),
                render ? render.apply(this) : null);
        };
    }
    renderToolbarLeft() {
        return [];
    }
    renderToolbarRight() {
        return [];
    }
}
exports.BasePage = BasePage;
