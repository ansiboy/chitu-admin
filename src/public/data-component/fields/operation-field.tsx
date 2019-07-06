import { PermissionService } from "maishu-services-sdk";
import { constants, loadItemModule as loadItemModule } from "../common";
import ReactDOM = require("react-dom");
import React = require("react");
import { customField } from "maishu-wuzhui-helper";
import * as ui from 'maishu-ui-toolkit'
import { GridViewCell, DataSource } from "maishu-wuzhui";
import { ListPageProps } from "data-component/list-page";
import { Resource } from "maishu-services-sdk";
import { DataSources, dataSources } from "assert/dataSources";
import { errors } from "assert/errors";


export function operationField<T extends Entity>(props: ListPageProps, objectType: keyof DataSources, width?: string, callback?: (dataItem: T, resource: Resource) => void) {

    width = width || '120px'

    let dataSource: DataSource<any> = dataSources[objectType];
    let resourceId = props.data.resourceId
    let app = props.app
    let permissionService = app.currentPage.createService(PermissionService);

    let getAllResources = (function () {
        let allResources: Resource[];
        return async function () {
            if (!allResources) {
                let r = await permissionService.resource.list()
                allResources = r.dataItems;
            }
            return allResources
        }
    })();

    let allResources: Resource[];
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
        if (allResources == null) {
            allResources = await getAllResources();
        }
        let children = allResources.filter(o => o.parent_id == resourceId);
        let resources = children.filter(o => o.type == 'button')
        for (let i = 0; i < resources.length; i++) {
            let button = document.createElement('button');
            let iconClassName: string;
            let code = (resources[i].data || {}).code;
            switch (code) {
                case constants.buttonCodes.add:
                    continue
                case constants.buttonCodes.view:
                    button.className = 'btn btn-minier btn-success'
                    button.title = '点击查看'
                    iconClassName = 'icon-eye-open'
                    ReactDOM.render(<i className={iconClassName} > </i>, button)
                    break;
                case constants.buttonCodes.edit:
                    button.className = 'btn btn-minier btn-info';
                    button.title = '点击编辑';
                    iconClassName = 'icon-pencil';

                    ReactDOM.render(<i className={iconClassName} > </i>, button)
                    break;
                case constants.buttonCodes.delete:
                    button.className = 'btn btn-minier btn-danger'
                    button.title = '点击删除'
                    // button.onclick = ui.buttonOnClick(button,
                    //     () => {
                    //         return dataSource.delete(dataItem)
                    //     },
                    //     {
                    //         confirm() {
                    //             let name = dataItem['name'] || dataItem['mobile']
                    //             let msg = name ? `确定删除'${name}' 吗` : `确定删除吗`
                    //             return msg
                    //         }
                    //     }
                    // )
                    iconClassName = 'icon-trash'
                    ReactDOM.render(<i className={iconClassName} > </i>, button);
                    break;
                default:
                    button.className = 'btn btn-minier btn-default'
                    button.innerHTML = resources[i].name
                    break;
            }

            cell.element.appendChild(button);
            button.onclick = async function () {
                let path = resources[i].path || "";
                let args = {
                    resource: resources[i],
                    dataItem,
                }
                if (path.endsWith(".js")) {
                    let func = await loadItemModule(path);
                    func(args);
                }
                else {
                    app.redirect(path, { id: dataItem.id, resourceId: resourceId });
                }
            }
        }

    }

}

