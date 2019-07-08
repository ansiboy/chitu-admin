import React = require("react");
import { boundField, customField, createGridView } from 'maishu-wuzhui-helper'
import { operationField, valueTextField, dateTimeField, ListPageProps, toDateTimeString, renderOperationButtons } from "../../data-component/index";
import { GridViewDataCell, DataSource, GridView } from "maishu-wuzhui";
import ReactDOM = require("react-dom");
import { PermissionService } from "assert/services/index";
import { dataSources, translateToMenuItems } from "assert/dataSources";
import { Resource } from "entities";
import { MenuItem } from "assert/masters/main-master-page";

interface State {
    resources: MenuItem[],
}

let sortFieldWidth = 80
let nameFieldWidth = 280
let operationFieldWidth = 200
let createDateTimeFieldWidth = 160
let typeFieldWidth = 140
let remarkWidth = 240

export default class ResourceListPage extends React.Component<ListPageProps, State> {
    dataTable: HTMLTableElement;
    gridView: GridView<Resource>;
    permissionService: PermissionService;

    constructor(props) {
        super(props)
        this.state = { resources: [] };
        this.permissionService = this.props.createService(PermissionService);
    }
    async componentDidMount() {

        let [resources] = await Promise.all([this.permissionService.resource.list()]);
        let menuItems = translateToMenuItems(resources);
        let currentMenuItem = menuItems.filter(o => o.id == this.props.data.resourceId)[0];

        this.gridView = createGridView({
            dataSource: dataSources.resource,
            element: this.dataTable,
            showHeader: false,
            showFooter: false,
            pageSize: null,
            columns: [
                boundField<MenuItem>({ dataField: 'sort_number', itemStyle: { width: `${sortFieldWidth}px` } }),
                customField<MenuItem>({
                    headerText: '菜单名称',
                    itemStyle: { width: `${nameFieldWidth}px` },
                    createItemCell: () => {
                        let cell = new GridViewDataCell<MenuItem>({
                            render: (item: MenuItem, element) => {
                                element.style.paddingLeft = `${this.parentDeep(item) * 20 + 10}px`
                                element.innerHTML = item.name;
                            }
                        })

                        return cell
                    }
                }),
                boundField<MenuItem>({ dataField: "page_path", headerText: "路径" }),
                dateTimeField<MenuItem>({ dataField: 'create_date_time', headerText: '创建时间', }),
                operationField<MenuItem>(currentMenuItem, this.props.app, `${operationFieldWidth}px`)
            ],
            sort: (dataItems) => {
                dataItems = dataItems.filter(o => o.type == "menu");
                dataItems = translateToMenuItems(dataItems)
                return dataItems;
            }

        })
    }

    parentDeep(menuItem: MenuItem) {
        let deep = 0;
        let parent = menuItem.parent;
        while (parent) {
            deep = deep + 1;
            parent = parent.parent;
        }

        return deep;
    }

    render() {
        let { resources } = this.state
        let currentResource = resources.filter(o => o.id == this.props.data.resourceId)[0];
        // if (currentResource) {
        //     currentResource.children.sort((a, b) => a.sort_number > b.sort_number ? 1 : -1);
        // }
        return <>
            <div className="tabbable">
                <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
                    <li className="pull-left">
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>菜单管理</div>
                    </li>
                    <li className="pull-right">
                        <button className="btn btn-primary pull-right"
                            onClick={() => {
                                this.props.app.forward('menu/item', this.props.data)
                            }}>
                            <i className="icon-plus" />
                            <span>添加</span>
                        </button>
                    </li>
                </ul>
            </div>
            <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                <thead>
                    <tr>
                        <th style={{ width: sortFieldWidth }}>序号</th>
                        <th style={{ width: nameFieldWidth }}>菜单名称</th>
                        <th style={{}}>路径</th>
                        <th style={{ width: remarkWidth }}>备注</th>
                        <th style={{ width: typeFieldWidth }}>类型</th>
                        <th style={{ width: createDateTimeFieldWidth }}>创建时间</th>
                        <th style={{ width: operationFieldWidth + 18 }}>操作</th>
                    </tr>
                </thead>
            </table>
            <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll' }}>
                <table className="table table-striped table-bordered table-hover"
                    ref={e => this.dataTable = e || this.dataTable}>
                    {/* <tbody>
                        {resources.map(resource =>
                            <tr key={resource.id}>
                                <td style={{ width: sortFieldWidth }}>{resource.sort_number}</td>
                                <td style={{ width: nameFieldWidth, paddingLeft: `${this.parentDeep(resource) * 20 + 10}px` }}>{resource.name}</td>
                                <td >{resource.page_path}</td>
                                <td style={{ width: remarkWidth }} >{resource.remark}</td>
                                <td style={{ width: typeFieldWidth, textAlign: "center" }}>{resource.type == 'menu' ? '菜单' : resource.type == 'button' ? '按钮' : ''}</td>
                                <td style={{ width: createDateTimeFieldWidth }}>{toDateTimeString(resource.create_date_time)}</td>
                                <td style={{ width: operationFieldWidth, textAlign: "center" }}
                                    ref={e => {
                                        if (!e) return;

                                        renderOperationButtons(this.props.data.resourceId, currentResource.children, e, currentResource, this.props.app);

                                    }}>
                                </td>
                            </tr>
                        )}
                    </tbody> */}
                </table>
            </div>
        </>
    }
}