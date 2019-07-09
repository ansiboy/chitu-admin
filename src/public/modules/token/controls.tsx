import React = require("react");
import { ButtonInvokeArguments } from "data-component/common";
import { createItemDialog } from "data-component/index";
import { dataSources } from "assert/dataSources";
import { InputField } from "data-component/index";
import { rules } from "maishu-dilu";
import { Role, Token } from "entities";
import { Buttons } from "assert/buttons";
import { constants } from "assert/common";
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


export default function (args: ButtonInvokeArguments<Role>) {
    let control: React.ReactElement;
    switch (args.resource.data.code) {
        case constants.buttons.add:
            control = Buttons.createPageAddButton(() => {
                // itemDialog.show(args.dataItem);
            })
            break;
        default:
            throw errors.unknonwResourceName(args.resource.name);
    }

    return control;

}