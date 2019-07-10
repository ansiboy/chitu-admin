import React = require("react");
import { ListPage, ListPageProps, dateTimeField, sortNumberField, customDataField } from "data-component/index";
import { boundField } from "maishu-wuzhui-helper";
import { DataSourceSelectArguments } from "maishu-wuzhui";
import * as ui from 'maishu-ui-toolkit'
import { dataSources } from "assert/dataSources";
import { User } from "entities";
import { PageProps } from "maishu-chitu-react";

interface State {
    person?: any,
    activeIndex: number,
}
export default class UserListPage extends React.Component<PageProps, State> {
    dialogElement: HTMLElement;
    listPage: ListPage<User>;
    searchTextInput: HTMLInputElement;

    constructor(props) {
        super(props)
        this.state = { activeIndex: 0 }
    }

    async active(activeIndex: number) {
        let args: DataSourceSelectArguments = {}
        this.listPage.dataSource.select(args)
        this.setState({ activeIndex })
    }

    showAuthDialog(): void {
        ui.showDialog(this.dialogElement)
    }

    async search(value: string) {
        value = (value || '').trim()
        let args = this.listPage.gridView.selectArguments
        args.startRowIndex = 0
        args.filter = `mobile like '%${value}%'`
        await this.listPage.dataSource.select(args)
    }
    render() {
        let { person } = this.state
        return <>
            <ListPage<User> parent={this}
                ref={e => this.listPage = e || this.listPage}
                dataSource={dataSources.user}
                columns={[
                    sortNumberField(),
                    boundField({
                        headerText: '用户手机',
                        dataField: 'mobile',
                        headerStyle: { width: "180px" }
                    }),
                    boundField({
                        headerText: '用户名',
                        dataField: 'user_name'
                    }),
                    boundField({
                        headerText: '邮箱',
                        dataField: 'email'
                    }),
                    customDataField<User>({
                        headerText: "用户身份",
                        render: (o) => o.role ? o.role.name : ""
                    }),
                    dateTimeField({ dataField: 'lastest_login', headerText: '最后登录时间' }),
                    dateTimeField({ dataField: 'create_date_time', headerText: '创建时间', }),
                ]} />

        </>
    }
}