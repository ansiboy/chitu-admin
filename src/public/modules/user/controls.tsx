import { ControlArguments, Buttons } from "data-component/index";
import { User } from "entities";
import React = require("react");
import { errors } from "assert/errors";
import { constants } from "assert/common";

export default function (args: ControlArguments<User>) {
    let control: React.ReactElement;
    switch (args.resource.data.code) {
        case "search":
            control = <React.Fragment>
                <button key={"search-button"} className="btn btn-primary pull-right" onClick={() => {
                    //this.search(this.searchTextInput.value)
                }}>
                    <i className="icon-search" />
                    <span>搜索</span>
                </button>

                <input key="search-text" type="text" placeholder="请输入用户账号" className="form-control pull-right"
                    style={{ width: 300 }}
                    // ref={e => this.searchTextInput = e || this.searchTextInput}
                    onKeyDown={e => {
                        // if (!e) return
                        // if (e.keyCode == 13) {
                        //     this.search(this.searchTextInput.value)
                        // }
                    }} />
            </React.Fragment>
            break;
        case constants.buttons.add:
            control = Buttons.createPageAddButton(() => {

            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;
}