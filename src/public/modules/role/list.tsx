import React = require("react");
import { ListPage, ListPageProps, dateTimeField, operationField } from "data-component/index";
import { boundField } from "maishu-wuzhui-helper";
import { dataSources } from "assert/dataSources";

export default class RoleListPage extends React.Component<ListPageProps> {

    constructor(props) {
        super(props);

    }
    render() {
        return <ListPage {...this.props} dataSource={dataSources.role}
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