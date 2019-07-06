import React = require("react");
import { InputField, createItemDialog, RadioField } from "data-component/index";
import { User, Role } from "maishu-services-sdk";
import { rules } from "maishu-dilu";
import { dataSources } from "assert/dataSources";
import { ButtonInvokeArguments } from "data-component/common";

let itemDialog: ReturnType<typeof createItemDialog>;
export default function (args: ButtonInvokeArguments<User>) {
    if (itemDialog == null) {
        itemDialog = createItemDialog(dataSources.user, "用户", <>
            <InputField<User> dataField="mobile" label="手机号码*" placeholder="请输入手机号码"
                validateRules={[
                    rules.required("请输入手机号码")
                ]} />
            <InputField<User> dataField="user_name" label="用户名" placeholder="请输入用户名" />
            <InputField<User> dataField="email" label="电子邮箱" placeholder="请输入电子邮箱" />
            <InputField<User> dataField="password" label="密码*" placeholder="请输入登录密码"
                validateRules={[
                    rules.required("请输入登录密码")
                ]} />
            <RadioField<Role> dataSource={dataSources.role} nameField="name" valueField="id"
                label="角色" dataField="roleIds" dataType="string"
                validateRules={[
                    rules.required("请选择用户角色")
                ]}
            />
        </>)
    }

    itemDialog.show(args.dataItem);
}

