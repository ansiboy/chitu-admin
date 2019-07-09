import { Path, Role, Resource } from "entities";
import { ButtonInvokeArguments } from "data-component/common";
import { createItemDialog, InputField, RadioField } from "data-component/index";
import { dataSources } from "assert/dataSources";
import React = require("react");
import { rules } from "maishu-dilu";
import { constants } from "assert/common";
import { Buttons } from "assert/buttons";
import { errors } from "assert/errors";
import * as ui from "maishu-ui-toolkit";

let itemDialog = createItemDialog(dataSources.path, "路径", <>
    <div className="form-group clearfix">
        <InputField<Resource> dataField="name" label="路径*" placeholder="请输入路径"
            validateRules={[
                rules.required("请输入路径")
            ]} />
    </div>
    <div className="form-group clearfix">
        <InputField<Resource> dataField="remark" label="备注" placeholder="请输入备注" />
    </div>
    {/* <RadioField<Path, Role> dataSource={dataSources.role(args.resource.id)} dataField={"role_ids"} valueField={"id"} nameField={"name"} dataType="string" label="角色" /> */}
</>);

export default function (args: ButtonInvokeArguments<Path>) {
    let control: React.ReactElement;
    switch (args.resource.data.code) {
        case constants.buttons.add:
            control = Buttons.createPageAddButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case constants.buttons.edit:
            control = Buttons.createListEditButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case constants.buttons.remove:
            control = Buttons.createListDeleteButton(() => {
                ui.confirm({
                    title: "提示", message: `确定删除路径'${args.dataItem.value}'吗?`,
                    confirm: () => {
                        return dataSources.path.delete(args.dataItem);
                    }
                })
            })
            break;
        case constants.buttons.view:
            control = Buttons.createListViewButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.name);
    }

    return control;

    // console.assert(itemDialog.resourceId == args.resource.id);
    // itemDialog.show(args.dataItem);
}