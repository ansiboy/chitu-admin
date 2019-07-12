import React = require("react");
import { PageProps } from "assert/components/index";
import { PermissionService } from "assert/services/index";

const NEW_MOBILE = "new_mobile";
const VERIFY_CODE = "verify_code";

interface State {
    mobile?: string
}

export default class ChangeMobilePage extends React.Component<PageProps, State> {
    private ps: PermissionService;

    constructor(props) {
        super(props);

        this.state = {};
        this.ps = this.props.createService(PermissionService);
    }

    componentDidMount() {
        this.ps.user.me().then(user => {
            this.setState({ mobile: user.mobile })
        })
    }

    render() {
        let { mobile } = this.state;
        return <div className="well">
            <div style={{ maxWidth: 400 }}>
                <div className="form-group clearfix input-control">
                    <label>手机号</label>
                    <span>
                        <label>{mobile || ""}</label>
                    </span>
                </div>
                <div className="form-group clearfix input-control">
                    <label>验证码</label>
                    <span>
                        <div className="input-group">
                            <input name={VERIFY_CODE} className="form-control"
                                placeholder="请输入验证码" />
                            <span className="input-group-btn">
                                <button name="sendVerifyCode" className="btn btn-default">
                                    发送验证码
                                </button>
                            </span>
                        </div>
                        <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
                    </span>
                </div>
                <div className="form-group clearfix input-control" >
                    <label>新手机</label>
                    <span>
                        <input name={NEW_MOBILE} className="form-control"
                            placeholder="请输入新手机号码" />
                    </span>
                </div>
            </div>
        </div>
    }
}

// export default async function (page: Page) {
//     let menuItems = await dataSources.resource.executeSelect({})
//         .then(r => translateToMenuItems(r.dataItems));

//     let validator: FormValidator;
//     new PageView({
//         element: page.element,
//         resourceId: page.data["resourceId"] as string,
//         menuItems,
//         render(element: HTMLElement) {
//             ReactDOM.render(<div className="well">
//                 <div style={{ maxWidth: 400 }}>
//                     <div className="form-group clearfix input-control">
//                         <label>验证码</label>
//                         <span>
//                             <div className="input-group">
//                                 <input name={VERIFY_CODE} className="form-control"
//                                     placeholder="请输入验证码" />
//                                 <span className="input-group-btn">
//                                     <button name="sendVerifyCode" className="btn btn-default">
//                                         发送验证码
//                                 </button>
//                                 </span>
//                             </div>
//                             <span className={`validationMessage ${VERIFY_CODE}`} style={{ display: "none" }}></span>
//                         </span>
//                     </div>
//                     <div className="form-group clearfix input-control" >
//                         <label>新手机</label>
//                         <span>
//                             <input name={NEW_MOBILE} className="form-control"
//                                 placeholder="请输入新手机号码" />
//                         </span>
//                     </div>
//                 </div>
//             </div>, element)

//             validator = new FormValidator(element,
//                 { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
//                 { name: NEW_MOBILE, rules: [rules.required("请输入新密码"), rules.mobile("请输入正确的手机号码")] }
//             )
//         },
//         context: {
//             save() {
//                 if (!validator.check())
//                     return Promise.reject();
//             }
//         }
//     })
// }