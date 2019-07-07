import { ListPageProps, ListPage, dateTimeField, operationField } from "data-component/index";
import React = require("react");
import { boundField } from "maishu-wuzhui-helper";
import { dataSources, MyDataSource } from "assert/dataSources";
import { Path } from "entities";

export default class PathListPage extends React.Component<ListPageProps>{
    private dataSource: MyDataSource<Path>;

    constructor(props) {
        super(props);
        this.dataSource = dataSources.path(this.props.data.resourceId);
    }

    render() {
        return <ListPage {...this.props} dataSource={this.dataSource}
            columns={[
                boundField({ dataField: 'id', headerText: '编号', headerStyle: { width: '300px' }, itemStyle: { textAlign: 'center' } }),
                boundField({ dataField: 'name', headerText: '名称' }),
                dateTimeField({ dataField: 'create_date_time', headerText: '创建时间' }),
                operationField(this.props, 'role', '160px')
            ]}
        >

        </ListPage>
    }
}