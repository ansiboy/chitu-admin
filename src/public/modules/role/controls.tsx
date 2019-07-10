import React = require("react");
import { createItemDialog, ControlArguments, Buttons } from "data-component/index";
import { dataSources } from "assert/dataSources";
import { InputField } from "data-component/index";
import { rules } from "maishu-dilu";
import { Role } from "entities";
import { constants } from "assert/common";
import { errors } from "assert/errors";
import { app } from "assert/application";
import * as ui from "maishu-ui-toolkit";

let itemDialog = createItemDialog(dataSources.role, "角色", <>
    <div className="form-group clearfix">
        <InputField dataField="name" label="名称*" placeholder="请输入角色名称"
            validateRules={[
                rules.required("请输入角色名称")
            ]} />
    </div>
    <div className="form-group clearfix">
        <InputField dataField="remark" label="备注" placeholder="请输入备注" />
    </div>
</>);


export default function (args: ControlArguments<Role>) {
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
                    title: "提示", message: `确定删除角色'${args.dataItem.name}'吗?`,
                    confirm: () => {
                        return dataSources.role.delete(args.dataItem);
                    }
                })
            })
            break;
        case constants.buttons.view:
            control = Buttons.createListViewButton(() => {
                itemDialog.show(args.dataItem);
            })
            break;
        case "role_permission":
            control = <button key={Math.random()} className="btn btn-minier btn-default"
                onClick={e => {
                    app.redirect("role/permission", { resourceId: args.resource.id })
                }}>
                <span>权限设置</span>
            </button>
            break;
        default:
            throw errors.unknonwResourceName(args.resource.name);
    }

    return control;

}