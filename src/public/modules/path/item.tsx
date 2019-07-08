import { Path, Role } from "entities";
import { ButtonInvokeArguments } from "data-component/common";
import { createItemDialog, InputField, RadioField } from "data-component/index";
import { dataSources } from "assert/dataSources";
import React = require("react");
import { rules } from "maishu-dilu";

let itemDialog: ReturnType<typeof createItemDialog> & { resourceId?: string };
export default function (args: ButtonInvokeArguments<Path>) {
    if (itemDialog == null) {
        itemDialog = createItemDialog(dataSources.path(args.resource.id), "路径", <>
            <InputField<Path> dataField="value" label="路径*" placeholder="请输入路径"
                validateRules={[
                    rules.required("请输入路径")
                ]} />
            <InputField<Path> dataField="remark" label="备注" placeholder="请输入备注" />
            {/* <RadioField<Path, Role> dataSource={dataSources.role(args.resource.id)} dataField={"role_ids"} valueField={"id"} nameField={"name"} dataType="string" label="角色" /> */}
        </>)
        itemDialog.resourceId = args.resource.id;
    }

    console.assert(itemDialog.resourceId == args.resource.id);
    itemDialog.show(args.dataItem);
}