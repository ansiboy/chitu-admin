import { PermissionService } from 'assert/services/index'
import { loadItemModule as loadItemModule } from "../common";
import ReactDOM = require("react-dom");
import React = require("react");
import { customField } from "maishu-wuzhui-helper";
import { GridViewCell } from "maishu-wuzhui";
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

export async function renderOperationButtons<T extends { id: string }>(menuItem: MenuItem, element: HTMLElement, dataItem: T, app: Application) {
    let children = menuItem.children || [];
    children.forEach(o => o.data = o.data || {} as any);
    children = children.filter(o => o.data.position == "in-list");
    let funcs = await Promise.all(children.map(o => loadItemModule(o.page_path)))
    let controlElements = children.map((o, i) => funcs[i]({ resource: o, dataItem }));

    ReactDOM.render(<React.Fragment>
        {controlElements}
    </React.Fragment>, element)
}

