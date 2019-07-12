import { ControlArguments } from "assert/index";
import { errors } from "./errors";
import { buttonOnClick } from "maishu-ui-toolkit";
import { app } from "assert/application";

export default function (args: ControlArguments<any>): HTMLButtonElement {
    //TODO: 检查参数

    let buttonInfo = args.resource.data.button;
    if (buttonInfo == null)
        throw errors.resourceDataFieldMissing(args.resource, "button");

    let button = document.createElement("button");
    button.className = buttonInfo.className;

    let html = "";
    if (args.resource.icon) {
        html = html + `<i class="${args.resource.icon}"></i>`;
    }
    if (buttonInfo.showButtonText) {
        html = html + `<span>${args.resource.name}</span>`;
    }

    button.innerHTML = html;

    buttonOnClick(button, async () => {
        let execute_path = buttonInfo.execute_path;
        if (!execute_path)
            throw errors.buttonExecutePahtIsEmpty(args.resource);

        if (execute_path.startsWith("func:")) {
            let methodName = execute_path.substring("func:".length);
            if (!methodName)
                throw errors.executePathIncorrect(execute_path);

            console.assert(args.context != null);
            if (!args.context[methodName])
                throw errors.contextMemberIsNotExist(methodName);

            if (typeof args.context[methodName] != "function")
                throw errors.contextMemberIsNotFunction(methodName);

            await args.context[methodName](args.dataItem);
        }
        else if (execute_path.startsWith("#")) {
            let data = { resourceId: args.resource.id };
            if (args.dataItem.id)
                data["dataItemId"] = args.dataItem.id;

            app.redirect(execute_path.substring(1), data);
        }

    }, { toast: buttonInfo.toast })

    return button;

   
}