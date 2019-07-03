import React = require("react");
import { ListPage, ListPageProps, dateTimeField } from "data-component/index";
import { dataSources } from "assert/dataSources";
import { boundField } from "maishu-wuzhui-helper";
import { Token } from "maishu-services-sdk";

export default class TokenListPage extends React.Component<ListPageProps> {
    render() {
        return <ListPage {...this.props} dataSource={dataSources.token} columns={[
            boundField<Token>({ dataField: "id", headerText: "编号", headerStyle: { width: "300px" } }),
            boundField<Token>({ dataField: "content", headerText: "内容" }),
            dateTimeField<Token>({ dataField: "createDateTime", headerText: "创建时间" })
        ]}>
        </ListPage>
    }
}