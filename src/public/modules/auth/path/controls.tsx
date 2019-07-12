import { Path, Role, Resource } from "entities";
import { ControlArguments } from "data-component/index";
import { createItemDialog, InputField, Buttons } from "data-component/index";
import { dataSources } from "assert/dataSources";
import React = require("react");
import { rules } from "maishu-dilu";
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
</>);

export default function (args: ControlArguments<Path>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case Buttons.codes.add:
            control = Buttons.createPageAddButton(async () => {
                itemDialog.show(args.dataItem);
            })
            break;
        case Buttons.codes.edit:
            control = Buttons.createListEditButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case Buttons.codes.remove:
            control = Buttons.createListDeleteButton(() => {
                ui.confirm({
                    title: "提示", message: `确定删除路径'${args.dataItem.value}'吗?`,
                    confirm: () => {
                        return dataSources.path.delete(args.dataItem);
                    }
                })
            })
            break;
        case Buttons.codes.view:
            control = Buttons.createListViewButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.name);
    }

    return control;
}