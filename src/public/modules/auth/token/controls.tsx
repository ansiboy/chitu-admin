import React = require("react");
import { ControlArguments, Buttons } from "data-component/index";
import { Role } from "entities";
import { errors } from "assert/errors";

// let itemDialog = createItemDialog(dataSources.token, "令牌", <>
//     <div className="form-group clearfix">
//         <InputField<Token> dataField="" label="名称*" placeholder="请输入角色名称"
//             validateRules={[
//                 rules.required("请输入角色名称")
//             ]} />
//     </div>
//     <div className="form-group clearfix">
//         <InputField dataField="remark" label="备注" placeholder="请输入备注" />
//     </div>
// </>);


export default function (args: ControlArguments<Role>) {
    let control: HTMLElement;
    switch (args.resource.data.code) {
        case Buttons.codes.add:
            control = Buttons.createPageAddButton(async () => {
                // itemDialog.show(args.dataItem);
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;

}