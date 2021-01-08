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
function default_1(args) {
    args.mainMaster.setMenu({
        id: "temp", name: "Temp", path: "#temp", icon: "icon-dashboard",
        children: [
            { id: "home-index", name: "Home", path: "#home/index", parentId: "temp" }
        ]
    }, { id: "temp1", name: "Temp1", path: "#temp" });
    args.mainMaster.setToolbar(React.createElement("ul", { className: "toolbar" },
        React.createElement("li", { className: "light-blue pull-right", onClick: () => this.logout() },
            React.createElement("i", { className: "icon-off" }),
            React.createElement("span", { style: { paddingLeft: 4, cursor: "pointer" } }, "\u9000\u51FA")),
        React.createElement("li", { className: "light-blue pull-right", style: { marginRight: 10 } }, "18502146746 (\u8D85\u7EA7\u7BA1\u7406\u5458)")));
}
exports.default = default_1;
