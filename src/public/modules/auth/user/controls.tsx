import { ControlArguments, Buttons, InputField, createItemDialog, RadioField } from "data-component/index";
import { User, Role } from "entities";
import React = require("react");
import { errors } from "assert/errors";
import { dataSources } from "assert/dataSources";
import { rules } from "maishu-dilu";
import { element } from "prop-types";
import ReactDOM = require("react-dom");

let itemDialog = createItemDialog(dataSources.user, "用户", <>
    <div className="form-group clearfix">
        <InputField<User> dataField="mobile" label="手机号码*" placeholder="请输入手机号码"
            validateRules={[
                rules.required("请输入手机号码")
            ]} />
    </div>
    <div className="form-group clearfix">
        <InputField<User> dataField="user_name" label="用户名" placeholder="请输入用户名" />
    </div>
    <div className="form-group clearfix">
        <InputField<User> dataField="email" label="电子邮箱" placeholder="请输入电子邮箱" />
    </div>
    <div className="form-group clearfix">
        <InputField<User> dataField="password" label="密码*" placeholder="请输入登录密码"
            validateRules={[
                rules.required("请输入登录密码")
            ]} />
    </div>
    <div className="form-group clearfix">
        <RadioField<User, Role> dataSource={dataSources.role} nameField="name" valueField="id"
            label="角色" dataField="role_id" dataType="string"
            validateRules={[
                rules.required("请选择用户角色")
            ]}
        />
    </div>
</>)

export default function (args: ControlArguments<User>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case "search":
            control = document.createElement("div");
            ReactDOM.render(<React.Fragment>
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
            </React.Fragment>, control);
            break;
        case Buttons.codes.add:
            control = Buttons.createPageAddButton(async () => {
                itemDialog.show({} as any);
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;
}