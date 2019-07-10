import React = require("react");
import { DataSource, DataControlField } from "maishu-wuzhui";
import { PermissionService } from 'assert/services/index'
import { translateToMenuItems } from "assert/dataSources";
import { ListView } from "./list-view";
import { PageProps } from "assert/components/index";
import { constants } from "./common";

interface State {
    buttons?: JSX.Element[],
    title?: string,
}

export interface ListPageProps<T> extends PageProps {
    right?: JSX.Element,
    parent?: object,
    dataSource: DataSource<T>,
    transform?: (items: T[]) => T[];
    columns: DataControlField<T>[],
    showHeader?: boolean,
    pageSize?: number,
}

export let ListPageContext = React.createContext<{ dataSource: DataSource<any> }>(null)

export class ListPage<T> extends React.Component<ListPageProps<T>, State> {
    ps: PermissionService;
    listView: ListView<T>;
    constructor(props: ListPage<T>['props']) {
        super(props);

        this.ps = this.props.createService(PermissionService);
    }

    get dataSource() {
        return this.props.dataSource;
    }

    get gridView() {
        return this.listView.gridView;
    }

    render() {
        return <div ref={async e => {
            if (!e) return;

            let resources = await this.ps.resource.list();
            let menuItems = translateToMenuItems(resources);
            this.listView = new ListView<T>({
                element: e,
                dataSource: this.props.dataSource,
                columns: this.props.columns,
                menuItems,
                resourceId: this.props.data.resourceId,
                context: this.props.parent,
                transform: this.props.transform,
                pageSize: this.props.pageSize === undefined ? constants.pageSize : this.props.pageSize,
            })

        }} />
    }
}

// export class ListPage<T> extends React.Component<ListPageProps<T>, State> {
//     dataSource: DataSource<T>
//     gridView: GridView<T>
//     private table: HTMLTableElement;
//     private tableIsFixed = false;
//     private columns: DataControlField<T>[];
//     private ps: PermissionService;
//     private allMenuItems: MenuItem[];
//     private backButton: HTMLElement;

//     constructor(props: ListPage<T>['props']) {
//         super(props)

//         this.state = {};
//         this.dataSource = props.dataSource;
//         this.tableIsFixed = props.pageSize === null;
//         this.columns = this.props.columns.map(col => typeof col == "function" ? col(this) : col);

//         let parent = this.props.parent;
//         this.ps = parent.props.createService<PermissionService>(PermissionService)

//         if (parent.props.data.resourceId) {
//             // ps.resource.list().then(r => {
//             //     let resource = r.filter(o => o.id == parent.props.data.resourceId)[0];
//             //     if (resource) {
//             //         this.setState({ title: resource.name });
//             //     }
//             // })
//         }
//     }

//     async getAllMenuItems(): Promise<MenuItem[]> {
//         if (this.allMenuItems) {
//             return this.allMenuItems;
//         }
//         let resources = await this.ps.resource.list();
//         this.allMenuItems = translateToMenuItems(resources);
//         return this.allMenuItems;
//     }

//     async loadTopControls(): Promise<React.ReactElement[]> {
//         let parent = this.props.parent;
//         let resource_id = parent.props.data.resourceId;
//         if (!resource_id) return null

//         let ps = parent.props.createService<PermissionService>(PermissionService)
//         let resources = await ps.resource.list();
//         let menuItem = resources.filter(o => o.id == resource_id)[0];
//         console.assert(menuItem != null)
//         let menuItemChildren = resources.filter(o => o.parent_id == menuItem.id);
//         let controlResources = menuItemChildren.filter(o => o.data != null && o.data.position == "top");
//         let controlFuns = await Promise.all(controlResources.map(o => loadItemModule(o.page_path)));

//         let controls = controlFuns.map((func, i) => func({ resource: controlResources[i], dataItem: {}, context: parent }));
//         return controls;
//     }

//     async componentDidMount() {

//         let parent = this.props.parent;
//         if (parent.props.data.resourceId) {
//             let menuItems = await this.getAllMenuItems();
//             let resource = menuItems.filter(o => o.id == parent.props.data.resourceId)[0];
//             if (resource != null) {
//                 this.setState({ title: resource.name });
//                 let parentDeep = this.parentDeep(resource);
//                 if (parentDeep > 1) {
//                     this.backButton.style.removeProperty("display");
//                 }
//             }

//         }

//         this.gridView = createGridView({
//             element: this.table,
//             dataSource: this.dataSource,
//             columns: this.columns,
//             pageSize: this.tableIsFixed ? null : this.props.pageSize || constants.pageSize,
//             pagerSettings: {
//                 activeButtonClassName: 'active',
//                 buttonContainerWraper: 'ul',
//                 buttonWrapper: 'li',
//                 buttonContainerClassName: 'pagination',
//                 showTotal: true
//             },
//             sort: this.props.transform,
//             showHeader: this.tableIsFixed ? false : true,
//         })

//         let buttons = await this.loadTopControls();
//         buttons.reverse();
//         this.setState({ buttons })
//     }

//     parentDeep(menuItem: MenuItem) {
//         let deep = 0;
//         let parent = menuItem.parent;
//         while (parent) {
//             deep = deep + 1;
//             parent = parent.parent;
//         }

//         return deep;
//     }

//     renderFixedSizeTable(columns: DataControlField<any>[]) {
//         return <>
//             <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
//                 <thead>
//                     <tr>
//                         {columns.map((col, i) =>
//                             <th key={i} style={{ width: col.itemStyle["width"] }}>{col.headerText}</th>
//                         )}
//                     </tr>
//                 </thead>
//             </table>
//             <div style={{ height: 'calc(100% - 160px)', width: 'calc(100% - 290px)', position: 'absolute', overflowY: 'scroll', overflowX: "hidden" }}>
//                 <table ref={e => this.table = e || this.table} style={{ maxWidth: "unset", width: "calc(100% + 18px)" }}>

//                 </table>
//             </div>
//         </>
//     }

//     renderDefaultTable() {
//         return <table ref={e => this.table = e || this.table}>

//         </table>
//     }

//     render() {
//         let { buttons, title } = this.state || {} as State
//         let { right } = this.props;
//         this.columns.forEach(col => col.itemStyle = col.itemStyle || {});
//         buttons = buttons || [];
//         if (!right) {
//             right = <li className="pull-left">
//                 <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
//             </li>
//         }
//         return <ListPageContext.Provider value={{ dataSource: this.dataSource }}>
//             <div className="tabbable">
//                 <ul className="nav nav-tabs" style={{ minHeight: 34 }}>
//                     {right}
//                     <li className="pull-right" style={{ display: "none" }} ref={e => this.backButton = this.backButton || e}>
//                         <button className="btn btn-primary pull-right" onClick={() => this.props.parent.props.app.back()}>
//                             <i className="icon-reply" />
//                             <span>返回</span>
//                         </button>
//                     </li>
//                     {buttons.map((o, i) =>
//                         <li key={i} className="pull-right">
//                             {o}
//                         </li>
//                     )}
//                 </ul>
//             </div>
//             {this.tableIsFixed ? this.renderFixedSizeTable(this.columns) : this.renderDefaultTable()}
//         </ListPageContext.Provider>
//     }
// }