import { Buttons, ControlArguments } from "data-component/index";
import { errors } from "./errors";
import { loadControlModule } from "data-component/common";
import { buttonOnClick } from "maishu-ui-toolkit";

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
    if (buttonInfo.text) {
        html = html + `<span>${buttonInfo.text}</span>`;
    }

    button.innerHTML = html;
    // button.onclick = () => {

    // }

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
    })

    return button;

    // let control: HTMLElement;
    // switch (args.resource.data.code) {
    //     case Buttons.codes.add:
    //         control = Buttons.createPageAddButton(async () => {
    //             if (!args.resource.data.button)
    //                 throw errors.resourceDataFieldMissing(args.resource, "button");

    //             let func = await loadControlModule(args.resource.data.button.execute_path);
    //             func(args);
    //         });
    //         break;
    //     case Buttons.codes.edit:
    //         control = Buttons.createListEditButton(async () => {
    //             if (!args.resource.data.button)
    //                 throw errors.resourceDataFieldMissing(args.resource, "button");

    //             let func = await loadControlModule(args.resource.data.button.execute_path);
    //             func(args);
    //         })
    //         break;
    //     case Buttons.codes.remove:
    //         control = Buttons.createListEditButton(async () => {
    //             if (!args.resource.data.button)
    //                 throw errors.resourceDataFieldMissing(args.resource, "button");

    //             let func = await loadControlModule(args.resource.data.button.execute_path);
    //             func(args);
    //         })
    //         break;
    //     default:
    //         throw errors.unknonwResourceName(args.resource.data.code);
    // }

    // return control;
}