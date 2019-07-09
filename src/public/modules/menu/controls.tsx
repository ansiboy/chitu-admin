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

let menuItemDialog = createItemDialog(dataSources.resource, "菜单",
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

let controlResourceDialog = createItemDialog(dataSources.resource, "菜单",
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

function showDialog(dataItem: Resource) {
    if (dataItem.type == "menu")
        menuItemDialog.show(dataItem);
    else if (dataItem.type == "button")
        controlResourceDialog.show(dataItem);
}


export default function (args: ButtonInvokeArguments<Resource>) {
    let control: React.ReactElement;
    switch (args.resource.data.code) {
        case constants.buttons.add:
            control = <button key={Math.random()} className="btn btn-primary pull-right"
                onClick={() => showDialog(args.dataItem)} >
                <i className="icon-plus" />
                <span>添加菜单</span>
            </button>
            break;
        case constants.buttons.edit:
            control = Buttons.createListEditButton(() => {
                showDialog(args.dataItem);
            })
            break;
        case constants.buttons.remove:
            control = Buttons.createListDeleteButton(() => {
                ui.confirm({
                    title: "提示", message: `确定删除菜单'${args.dataItem.name}'吗?`,
                    confirm: () => {
                        return dataSources.resource.delete(args.dataItem);
                    }
                })
            })
            break;
        case constants.buttons.view:
            control = Buttons.createListViewButton(() => {
                menuItemDialog.show(args.dataItem);
            })
            break;
        case "add_control":
        case "添加控件":
            control = <button key={Math.random()} className="btn btn-primary pull-right" >
                <i className="icon-plus" />
                <span>添加控件</span>
            </button>
            break;
        default:
            throw errors.unknonwResourceName(args.resource.name);
    }

    return control;

}