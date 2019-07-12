import { operationField, customDataField } from "data-component/index";
import React = require("react");
import { dataSources, MyDataSource, translateToMenuItems } from "assert/dataSources";
import { Path, Resource } from "entities";
import { PermissionService } from "assert/services/index";
import { MenuItem } from "assert/masters/main-master-page";
import { createGridView, customField } from "maishu-wuzhui-helper";
import { GridViewDataCell } from "maishu-wuzhui";
import ReactDOM = require("react-dom");
import { ValueStore } from "maishu-chitu";
import { PageProps } from "assert/components/index";

let nameFieldWidth = 280
let operationFieldWidth = 200


interface State {

}



export default class PathListPage extends React.Component<PageProps, State>{
    private ps: PermissionService;
    gridView: import("d:/projects/chitu-admin/node_modules/maishu-wuzhui/out/GridView").GridView<Resource>;
    dataTable: HTMLTableElement;
    allPaths: any;
    private pathsStorage = new ValueStore<Path[]>();

    constructor(props) {
        super(props);
        this.state = {};

        this.ps = this.props.createService(PermissionService);
        this.ps.path.list().then(paths => {
            this.pathsStorage.value = paths;
        })
    }

    async componentDidMount() {
        let [] = await Promise.all([this.ps.resource.list()]);
        this.gridView = createGridView({
            dataSource: dataSources.resource,
            element: this.dataTable,
            showHeader: false,
            showFooter: false,
            pageSize: null,
            columns: [
                // boundField<MenuItem>({ dataField: 'sort_number', itemStyle: { width: `${sortFieldWidth}px` } }),
                customField<MenuItem>({
                    headerText: '功能模块',
                    itemStyle: { width: `${nameFieldWidth}px` },
                    createItemCell: () => {
                        let cell = new GridViewDataCell<MenuItem>({
                            render: (item: MenuItem, element) => {
                                element.style.paddingLeft = `${this.parentDeep(item) * 20 + 20}px`
                                element.innerHTML = item.name;
                            }
                        })

                        return cell
                    }
                }),
                customDataField<MenuItem>({
                    headerText: "路径",
                    render: (dataItem, element) => {
                        let renderPaths = (paths: Path[]) => {
                            paths = paths.filter(o => o.resource_id == dataItem.id);
                            ReactDOM.render(<table className="table" style={{ marginBottom: 0, backgroundColor: "unset" }}>
                                <tbody>
                                    {paths.map(o =>
                                        <tr key={o.id} style={{ paddingBottom: 6 }}>
                                            <td style={{ borderTop: 0 }}>{o.value}</td></tr>
                                    )}
                                </tbody>
                            </table>, element)
                        }

                        if (this.pathsStorage.value) {
                            renderPaths(this.pathsStorage.value)
                        }

                        this.pathsStorage.add((value) => {
                            renderPaths(value)
                        })
                        // this.getPaths().then(paths => {

                        // })
                    }
                }),
                operationField<MenuItem>(this.props.data.resourceId, this.ps, this, `${operationFieldWidth - 18}px`)
                // operationField<MenuItem>(this.props.data.resourceId, `${operationFieldWidth - 18}px`)
            ],
            sort: (dataItems) => {
                dataItems = translateToMenuItems(dataItems);
                return dataItems;
            }

        })
    }

    displayName(menuItem: MenuItem) {
        let names: string[] = [];
        let parent = menuItem;
        while (parent) {
            names.unshift(parent.name);
            parent = parent.parent;
        }

        let name = names.join(" - ");
        return name;
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

    // async getPaths(): Promise<Path[]> {
    //     if (!this.allPaths) {
    //         this.allPaths = await this.ps.path.list();
    //     }
    //     return this.allPaths;
    // }



    render() {
        let { } = this.state;
        return <>
            <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                <thead>
                    <tr>
                        <th style={{ width: nameFieldWidth }}>功能模块</th>
                        <th style={{}}>允许访问 API</th>
                        <th style={{ width: operationFieldWidth }}>操作</th>
                    </tr>
                </thead>
            </table>
            <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll' }}>
                <table className="table table-striped table-bordered table-hover" ref={e => this.dataTable = e || this.dataTable}>

                </table>
            </div>


        </>

    }
}