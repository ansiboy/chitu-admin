import { ButtonInvokeArguments } from "data-component/common";
import { Role } from "maishu-services-sdk";
import { dataSources } from "assert/dataSources";
import * as ui from "maishu-ui-toolkit";

export default function (args: ButtonInvokeArguments<Role>) {
    console.assert(args.dataItem != null);

    ui.confirm({
        title: "提示", message: `确定删除角色'${args.dataItem.name}'吗?`,
        confirm: () => {
            return dataSources.role.delete(args.dataItem);
        }
    })

}