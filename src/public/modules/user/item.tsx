import React = require("react");
import { ItemPage, ItemPageProps, InputField, RadioField } from "data-component/index";
import { User, Role } from "maishu-services-sdk";
import { rules } from "maishu-dilu";
import { dataSources } from "assert/dataSources";

export default class UserItemPage extends React.Component<ItemPageProps<User>> {
    render() {
        return <ItemPage {...this.props} >
            <InputField dataField={"mobile"} label="手机号码" placeholder="请输入手机号码"
                validateRules={[
                    rules.required("请输入手机号码")
                ]} />
            <InputField dataField="password" label="密码" placeholder="请输入用户登录密码"
                validateRules={[

                ]} />
            <RadioField<Role> dataSource={dataSources.role} nameField="name" valueField="id"
                label="角色" dataField="role" dataType="string"
            />
        </ItemPage>
    }
}