import { InitArguments } from "../../out/public/index";
import React = require("react");

export default function (args: InitArguments) {
    args.mainMaster.setMenu(
        { name: "Temp", path: "#temp" }
    )
    args.mainMaster.setState({
        toolbar: <ul className="toolbar">
            <li className="light-blue pull-right" onClick={() => this.logout()}>
                <i className="icon-off"></i>
                <span style={{ paddingLeft: 4, cursor: "pointer" }}>退出</span>
            </li>
            <li className="light-blue pull-right" style={{ marginRight: 10 }}>
                {/* {username || ""}{roleName ? `  (${roleName})` : ""} */}
                18502146746 (超级管理员)
            </li>
        </ul>
    })
}