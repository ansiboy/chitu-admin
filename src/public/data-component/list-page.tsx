import React = require("react");
import { DataSource, GridView, DataControlField } from "maishu-wuzhui";
import { createGridView } from "maishu-wuzhui-helper";
import { constants, loadItemModule } from "./common";
import { PermissionService } from 'assert/services/index'
import { Application, Page } from "maishu-chitu-react";

interface State {
    buttons?: JSX.Element[],
    title?: string,
}

export interface ListPageProps {
    app: Application;
    data: {
        resourceId: string,
    };
    createService: Page["createService"];
    columns: DataControlField<any>[],
    showHeader?: boolean,
    pageSize?: number,
    source: Page,
}

interface Props<T> extends ListPageProps {
    search?: JSX.Element,
    right?: JSX.Element,
    dataSource: DataSource<T>,
    transform?: (items: T[]) => T[];
}

export let ListPageContext = React.createContext<{ dataSource: DataSource<any> }>(null)

export class ListPage<T> extends React.Component<Props<T>, State> {
    dataSource: DataSource<T>
    gridView: GridView<T>
    private table: HTMLTableElement;
    private tableIsFixed = false;

    constructor(props: ListPage<T>['props']) {
        super(props)

        this.state = {};
        this.dataSource = props.dataSource;
        this.tableIsFixed = props.pageSize === null;
        if (props.data.resourceId) {
            let ps = this.props.createService<PermissionService>(PermissionService)
            ps.resource.list()
                .then(r => {
                    let resource = r.filter(o => o.id == props.data.resourceId)[0];
                    if (resource) {
                        this.setState({ title: resource.name });
                    }
                })
        }
    }

    async loadTopControls(): Promise<React.ReactElement[]> {
        let resource_id = this.props.data.resourceId;
        if (!resource_id) return null

        let ps = this.props.createService<PermissionService>(PermissionService)
        let resources = await ps.resource.list();
        let menuItem = resources.filter(o => o.id == resource_id)[0];
        console.assert(menuItem != null)
        let menuItemChildren = resources.filter(o => o.parent_id == menuItem.id);
        let controlResources = menuItemChildren.filter(o => o.data != null && o.data.position == "top");
        let controlFuns = await Promise.all(controlResources.map(o => loadItemModule(o.page_path)));

        let controls = controlFuns.map((func, i) => func({ resource: controlResources[i], dataItem: {} }));
        return controls;
    }

    async componentDidMount() {

        this.gridView = createGridView({
            element: this.table,
            dataSource: this.dataSource,
            columns: this.props.columns,
            pageSize: this.tableIsFixed ? null : this.props.pageSize || constants.pageSize,
            pagerSettings: {
                activeButtonClassName: 'active',
                buttonContainerWraper: 'ul',
                buttonWrapper: 'li',
                buttonContainerClassName: 'pagination',
                showTotal: true
            },
            sort: this.props.transform,
            showHeader: this.tableIsFixed ? false : true,
        })

        let buttons = await this.loadTopControls();
        buttons.reverse();
        this.setState({ buttons })
    }

    renderFixedSizeTable(columns: DataControlField<any>[]) {
        return <>
            <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                <thead>
                    <tr>
                        {columns.map((col, i) =>
                            <th key={i} style={{ width: col.itemStyle["width"] }}>{col.headerText}</th>
                        )}
                    </tr>
                </thead>
            </table>
            <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll', overflowX: "hidden" }}>
                <table ref={e => this.table = e || this.table} style={{ maxWidth: "unset", width: "calc(100% + 18px)" }}>

                </table>
            </div>
        </>
    }

    renderDefaultTable() {
        return <table ref={e => this.table = e || this.table}>

        </table>
    }

    render() {
        let { buttons, title } = this.state || {} as State
        let { search, right, columns } = this.props;
        columns.forEach(col => col.itemStyle = col.itemStyle || {});

        if (!right) {
            right = <li className="pull-left">
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
            </li>
        }
        return <ListPageContext.Provider value={{ dataSource: this.dataSource }}>
            <div className="tabbable">
                <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
                    {right}
                    <li className="pull-right" ref={e => { }}>
                        {buttons}
                    </li>
                    {search}
                </ul>
            </div>
            {this.tableIsFixed ? this.renderFixedSizeTable(columns) : this.renderDefaultTable()}
        </ListPageContext.Provider>
    }
}