import React = require("react");
import ReactDOM = require("react-dom");
import { ListPage, ListPageProps, dateTimeField, sortNumberField, customDataField } from "../../data-component/index";
import { boundField, customField } from "maishu-wuzhui-helper";
import { GridViewDataCell, DataSourceSelectArguments } from "maishu-wuzhui";
import * as ui from 'maishu-ui-toolkit'
import { dataSources } from "assert/dataSources";
import { User } from "entities";

interface State {
    person?: any,
    activeIndex: number,
}
export default class UserListPage extends React.Component<ListPageProps, State> {
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
        let columns = [
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
            // boundField({ dataField: 'roleNames', headerText: '用户身份' }),
            customDataField<User>({
                headerText: "用户身份",
                render(dataItem) {
                    if (!dataItem.role)
                        return "";

                    return dataItem.role.name;
                }
            }),
            dateTimeField({ dataField: 'lastest_login', headerText: '最后登录时间' }),
            // customField({
            //     headerText: '个人认证',
            //     itemStyle: { textAlign: 'center', width: "100px" },
            //     createItemCell() {
            //         let cell = new GridViewDataCell({
            //             render(dataItem: User & Person, element) {
            //                 if (dataItem.id_card_no != null) {
            //                     if (dataItem.is_auth == null) {
            //                         ReactDOM.render(<button className="btn btn-primary btn-sx"
            //                             onClick={() => {
            //                                 self.setState({ person: dataItem }, () => {
            //                                     self.showAuthDialog()
            //                                 })

            //                             }}>待认证</button>, element)
            //                     }
            //                     else {
            //                         ReactDOM.render(<label className={dataItem.is_auth ? 'text-success' : 'text-danger'}>{dataItem.is_auth ? '已通过' : '不通过'}</label>, element)
            //                     }
            //                 }
            //             }
            //         })
            //         return cell
            //     }
            // }),
            dateTimeField({ dataField: 'create_date_time', headerText: '创建时间', }),
        ]

        let { person } = this.state
        return <>
            <ListPage<User> {...this.props as any} dataSource={dataSources.user} columns={columns} ref={e => this.listPage = e || this.listPage}
                search={<>
                    <li className="pull-right">
                        <button className="btn btn-primary" onClick={() => this.search(this.searchTextInput.value)}>
                            <i className="icon-search" />
                            <span>搜索</span>
                        </button>
                    </li>
                    <li className="pull-right">
                        <input type="text" placeholder="请输入用户账号" className="form-control"
                            style={{ width: 300 }}
                            ref={e => this.searchTextInput = e || this.searchTextInput}
                            onKeyDown={e => {
                                if (!e) return
                                if (e.keyCode == 13) {
                                    this.search(this.searchTextInput.value)
                                }
                            }} />
                    </li>
                </>}>
            </ListPage>

        </>
    }
}