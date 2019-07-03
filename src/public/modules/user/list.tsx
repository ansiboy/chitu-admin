import React = require("react");
import ReactDOM = require("react-dom");
import { ListPage, ListPageProps, dateTimeField, sortNumberField, customDataField } from "../../data-component/index";
import { boundField, customField } from "maishu-wuzhui-helper";
import { GridViewDataCell, DataSourceSelectArguments } from "maishu-wuzhui";
import * as ui from 'maishu-ui-toolkit'
import { User, ImageService } from "maishu-services-sdk";
import { dataSources } from "assert/dataSources";

interface State {
    person?: any,
    activeIndex: number,
}
export default class UserListPage extends React.Component<ListPageProps, State> {
    dialogElement: HTMLElement;
    listPage: ListPage;
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

    // async authPass(person: Person, isPass: boolean) {
    //     let s = this.props.createService(AdminService)
    //     await this.listPage.dataSource.update({ id: person.id, is_auth: isPass } as Person)
    //     ui.hideDialog(this.dialogElement)
    // }

    async search(value: string) {
        value = (value || '').trim()
        let args = this.listPage.gridView.selectArguments
        args.startRowIndex = 0
        args.filter = `mobile like '%${value}%'`
        await this.listPage.dataSource.select(args)
    }
    render() {
        let { activeIndex } = this.state
        let self = this
        let columns = [
            sortNumberField(),
            boundField({ dataField: 'mobile', headerText: '用户账号', headerStyle: { width: '120px' }, sortExpression: 'mobile' }),
            // customField({
            //     headerText: '用户头像',
            //     itemStyle: { textAlign: 'center', width: '80px' },
            //     createItemCell() {
            //         let cell = new GridViewDataCell({
            //             render(dataItem: User, element) {
            //                 // if (dataItem.data != null && dataItem.data.head_image != null) {
            //                 // let s = self.props.createService(ImageService)
            //                 // if (!dataItem.data.head_image) {
            //                 //     dataItem.data.head_image = dataItem.data.gender == '女' ?
            //                 //         constants.femaleImageId : constants.maleImageId
            //                 // }

            //                 // let imageSource = s.imageUrl(dataItem.data.head_image)
            //                 // ReactDOM.render(<img src={imageSource} style={{ maxWidth: 32, maxHeight: 32 }} className="img-responsive" />, element)
            //                 // }
            //             }
            //         })
            //         return cell
            //     }
            // }),
            boundField({
                headerText: '用户手机',
                dataField: 'mobile'
            }),
            customField({
                headerText: '用户昵称',
                createItemCell() {
                    let cell = new GridViewDataCell({
                        render(dataItem: User, element) {
                            element.innerHTML = `${dataItem.data.nick_name || ''}`
                        }
                    })
                    return cell
                }
            }),
            customDataField<User>({ headerText: '性别', render: (dataItem) => dataItem.data.gender || '男' }),
            boundField({ dataField: 'roleNames', headerText: '用户身份' }),
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
        let s = this.props.createService(ImageService)
        return <>
            <ListPage {...this.props as any} dataSource={dataSources.user} columns={columns} ref={e => this.listPage = e || this.listPage}
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