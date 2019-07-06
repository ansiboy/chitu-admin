import React = require("react");
import { ButtonInvokeArguments } from "data-component/common";
import { Role } from "maishu-services-sdk";
import ReactDOM = require("react-dom");
import { showDialog, hideDialog } from "maishu-ui-toolkit";
import { createItemDialog } from "data-component/index";
import { dataSources } from "assert/dataSources";
import { InputField } from "data-component/index";
import { rules } from "maishu-dilu";

export default function (args: ButtonInvokeArguments<Role>) {
    let itemDialog = createItemDialog(dataSources.role, <>
        <InputField dataField="name" label="名称*" placeholder="请输入角色名称"
            validateRules={[
                rules.required("请输入角色名称")
            ]} />
        <InputField dataField="remark" label="备注" placeholder="请输入备注" />
    </>)

    itemDialog.show(args.dataItem);
}

