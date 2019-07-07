import React = require("react");
import { ButtonInvokeArguments } from "data-component/common";
import { createItemDialog } from "data-component/index";
import { dataSources } from "assert/dataSources";
import { InputField } from "data-component/index";
import { rules } from "maishu-dilu";
import { Role } from "entities";

let itemDialog: ReturnType<typeof createItemDialog>;
export default function (args: ButtonInvokeArguments<Role>) {
    if (itemDialog == null) {
        itemDialog = createItemDialog(dataSources.role, "角色", <>
            <InputField dataField="name" label="名称*" placeholder="请输入角色名称"
                validateRules={[
                    rules.required("请输入角色名称")
                ]} />
            <InputField dataField="remark" label="备注" placeholder="请输入备注" />
        </>)
    }

    itemDialog.show(args.dataItem);
}

