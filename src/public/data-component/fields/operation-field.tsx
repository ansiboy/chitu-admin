import { PermissionService } from 'assert/services/index'
import { constants, loadItemModule as loadItemModule, ButtonInvokeArguments } from "../common";
import ReactDOM = require("react-dom");
import React = require("react");
import { customField } from "maishu-wuzhui-helper";
import { GridViewCell } from "maishu-wuzhui";
import { ButtonResourceData } from 'entities';
import { Application } from 'maishu-chitu-react';
import { MenuItem } from 'assert/masters/main-master-page';
import { ValueStore } from 'maishu-chitu';
import { translateToMenuItems } from 'assert/dataSources';


export function operationField<T extends Entity>(resourceId: string, app: Application, width?: string) {

    width = width || '120px'


    let menuItemStorage = new ValueStore<MenuItem>();
    let permissionService = app.currentPage.createService(PermissionService);
    permissionService.resource.list().then(resources => {
        let menuItems = translateToMenuItems(resources);
        let currentMenuItem = menuItems.filter(o => o.id == resourceId)[0];
        console.assert(currentMenuItem != null);
        menuItemStorage.value = currentMenuItem;
    })

    return customField({
        headerText: '操作',
        itemStyle: { textAlign: 'center', width } as CSSStyleDeclaration,
        headerStyle: { width } as CSSStyleDeclaration,
        createItemCell(dataItem: T) {
            let cell = new GridViewCell()
            renderCell(dataItem, cell)
            return cell
        },
    })

    async function renderCell(dataItem: T, cell: GridViewCell) {
        if (menuItemStorage.value) {
            renderOperationButtons(menuItemStorage.value, cell.element, dataItem, app)
        }
        else {
            menuItemStorage.add((menuItem) => {
                renderOperationButtons(menuItem, cell.element, dataItem, app)
            })
        }

    }

}

export function renderOperationButtons<T extends { id: string }>(menuItem: MenuItem, element: HTMLElement, dataItem: T, app: Application) {
    let children = menuItem.children || [];
    for (let i = 0; i < children.length; i++) {

        let data: ButtonResourceData = children[i].data || {} as any;
        if (data.position != "in-list") {
            continue;
        }

        let button = document.createElement('button');
        let iconClassName: string;

        button.className = data.class_name;
        button.title = data.title;
        iconClassName = data.icon;
        ReactDOM.render(<div>
            {iconClassName ? <i className={iconClassName} /> : null}
            {data.text ? <span>{data.text}</span> : null}
        </div>, button)

        element.appendChild(button);
        button.onclick = async function () {
            let path = children[i].page_path || "";
            let args: ButtonInvokeArguments<any> = {
                resource: children[i],
                dataItem,
            }
            if (path.endsWith(".js")) {
                let func = await loadItemModule(path);
                func(args);
            }
            else if (path.startsWith("#")) {
                path = path.substr(1)
                app.redirect(path, { id: dataItem.id, resourceId: menuItem.id });
            }
            else {
                app.redirect(path, { id: dataItem.id, resourceId: menuItem.id });
            }
        }
    }

}

