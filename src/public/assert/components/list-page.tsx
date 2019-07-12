import React = require("react");
import { DataSource, DataControlField } from "maishu-wuzhui";
import { PermissionService } from 'assert/services/index'
import { translateToMenuItems } from "assert/dataSources";
import { ListView } from "../controls/list-view";
import { PageProps } from "assert/components/index";
import { constants } from "./constants";

interface State {
    buttons?: JSX.Element[],
    title?: string,
}

export interface ListPageProps<T> extends PageProps {
    right?: JSX.Element,
    context?: object,
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
                context: this.props.context,
                transform: this.props.transform,
                pageSize: this.props.pageSize === undefined ? constants.pageSize : this.props.pageSize,
            })

        }} />
    }
}

