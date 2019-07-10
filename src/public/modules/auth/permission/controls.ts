import { ControlArguments, Buttons } from "data-component/index";
import { Resource } from "entities";
import { errors } from "assert/errors";
import PermissionPage from "./list";

export default function (args: ControlArguments<Resource>) {
    let control: React.ReactElement;
    switch (args.resource.data.code) {
        case Buttons.codes.save:
            control = Buttons.createPageTopRightButton("保存", "icon-save",
                () => (args.page as PermissionPage).save(),
                { toast: "保存成功" }
            )
            break;
        default:
            throw errors.unknonwResourceName(args.resource.data.code);
    }

    return control;

    // console.assert(itemDialog.resourceId == args.resource.id);
    // itemDialog.show(args.dataItem);
}