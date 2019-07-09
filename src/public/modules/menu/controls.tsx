import React = require("react");
import { ButtonInvokeArguments } from "data-component/common";
import { createItemDialog, DropdownField } from "data-component/index";
import { dataSources } from "assert/dataSources";
import { InputField } from "data-component/index";
import { rules } from "maishu-dilu";
import { Resource } from "entities";
import { Buttons } from "assert/buttons";
import { constants } from "assert/common";
import { errors } from "assert/errors";
import * as ui from "maishu-ui-toolkit";

let itemDialog = createItemDialog(dataSources.resource, "菜单",
    <>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="name" label="名称*" placeholder="请输入名称"
                validateRules={[
                    rules.required("请输入名称")
                ]} />
        </div>
        <div className="form-group clearfix">
            <DropdownField<Resource, Resource> label={"所属菜单"} dataField="parent_id"
                dataSource={dataSources.resource} nameField="name" valueField="id"
                placeholder="请选择所属菜单" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="page_path" label="路径" placeholder="请输入路径" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="sort_number" label="序号" placeholder="用于排序" />
        </div>
        <div className="form-group clearfix">
            <InputField<Resource> dataField="remark" label="备注" placeholder="请输入备注" />
        </div>
    </>,
    async (dataItem) => {
        dataItem.type = "menu";
    }
)


export default function (args: ButtonInvokeArguments<Resource>) {
    let control: React.ReactElement;
    switch (args.resource.name) {
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
        case constants.buttons.delete:
            control = Buttons.createListDeleteButton(() => {
                ui.confirm({
                    title: "提示", message: `确定删除角色'${args.dataItem.name}'吗?`,
                    confirm: () => {
                        return dataSources.resource.delete(args.dataItem);
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

}