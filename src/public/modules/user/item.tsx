import React = require("react");
import { InputField, createItemDialog, RadioField } from "data-component/index";
import { rules } from "maishu-dilu";
import { dataSources } from "assert/dataSources";
import { ButtonInvokeArguments } from "data-component/common";
import { User, Role } from "entities";

let itemDialog: ReturnType<typeof createItemDialog>;
export default function (args: ButtonInvokeArguments<User>) {
    if (itemDialog == null) {
        itemDialog = createItemDialog(dataSources.user, "用户", <>
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
    }

    itemDialog.show(args.dataItem);
}

