import { PermissionService } from 'assert/services/index'
import { loadItemModule as loadItemModule } from "../common";
import ReactDOM = require("react-dom");
import React = require("react");
import { customField } from "maishu-wuzhui-helper";
import { GridViewCell, DataControlField } from "maishu-wuzhui";
import { MenuItem } from 'assert/masters/main-master-page';
import { ValueStore } from 'maishu-chitu';
import { translateToMenuItems } from 'assert/dataSources';
import { PageProps } from 'maishu-chitu-react';


export function operationField<T extends Entity>
    (listPage: React.Component<PageProps>, width?: string) {

    // return function <P extends ListPageProps>(listPage: React.Component<P>): DataControlField<T> {
    width = width || '120px'
    let resourceId = listPage.props.data.resourceId;
    let menuItemStorage = new ValueStore<MenuItem>();
    let permissionService = listPage.props.createService(PermissionService);
    permissionService.resource.list().then(resources => {
        let menuItems = translateToMenuItems(resources);
        let currentMenuItem = menuItems.filter(o => o.id == resourceId)[0];
        console.assert(currentMenuItem != null);
        menuItemStorage.value = currentMenuItem;
    })

    return customField<T>({
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
            renderOperationButtons(menuItemStorage.value, cell.element, dataItem, listPage)
        }
        else {
            menuItemStorage.add((menuItem) => {
                renderOperationButtons(menuItem, cell.element, dataItem, listPage)
            })
        }

    }

    // }
}

export async function renderOperationButtons<T extends { id: string }, P extends PageProps>
    (menuItem: MenuItem, element: HTMLElement, dataItem: T, listPage: React.Component<P>) {
    let children = menuItem.children || [];
    children.forEach(o => o.data = o.data || {} as any);
    children = children.filter(o => o.data.position == "in-list");
    let funcs = await Promise.all(children.map(o => loadItemModule(o.page_path)))
    let controlElements = children.map((o, i) => funcs[i]({ resource: o, dataItem, page: listPage }));

    ReactDOM.render(<React.Fragment>
        {controlElements.map((o, i) =>
            <React.Fragment key={i}>{o}</React.Fragment>
        )}
    </React.Fragment>, element)
}

