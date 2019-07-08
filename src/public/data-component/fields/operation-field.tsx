import { PermissionService } from 'assert/services/index'
import { constants, loadItemModule as loadItemModule, ButtonInvokeArguments } from "../common";
import ReactDOM = require("react-dom");
import React = require("react");
import { customField } from "maishu-wuzhui-helper";
import { GridViewCell } from "maishu-wuzhui";
import { ListPageProps } from "data-component/list-page";
import { DataSources, dataSources } from "assert/dataSources";
import { Resource, ButtonResourceData } from 'entities';
import { Application } from 'maishu-chitu-react';
import { MenuItem } from 'assert/masters/main-master-page';


export function operationField<T extends Entity>(menuItem: MenuItem, app: Application, width?: string) {

    width = width || '120px'

    // let resourceId = props.data.resourceId
    // let app = props.app
    // let permissionService = app.currentPage.createService(PermissionService);

    // let getAllResources = (function () {
    //     let allResources: Resource[];
    //     return async function () {
    //         if (!allResources) {
    //             let r = await permissionService.resource.list()
    //             allResources = r;
    //         }
    //         return allResources
    //     }
    // })();

    // let allResources: Resource[];
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
        // if (allResources == null) {
        //     allResources = await getAllResources();
        // }
        let children = menuItem.children || []; //allResources.filter(o => o.parent_id == resourceId);
        let resources = children.filter(o => o.type == 'button')
        renderOperationButtons(menuItem, cell.element, dataItem, app)
    }

}

export function renderOperationButtons<T extends { id: string }>(menuItem: MenuItem, element: HTMLElement, dataItem: T, app: Application) {
    let children = menuItem.children;
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
        ReactDOM.render(<i className={iconClassName} > </i>, button)

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

