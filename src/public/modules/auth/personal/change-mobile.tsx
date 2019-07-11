import { Page } from "maishu-chitu";
import { PageView } from "data-component/page-view";
import { dataSources, translateToMenuItems } from "assert/dataSources";
import ReactDOM = require("react-dom");
import React = require("react");
import { FormValidator, rules } from "maishu-dilu";

const NEW_MOBILE = "new_mobile";
const VERIFY_CODE = "verify_code";

export default async function (page: Page) {
    let menuItems = await dataSources.resource.executeSelect({})
        .then(r => translateToMenuItems(r.dataItems));

    let validator: FormValidator;
    new PageView({
        element: page.element,
        resourceId: page.data["resourceId"] as string,
        menuItems,
        render(element: HTMLElement) {
            ReactDOM.render(<div className="well">
                <div style={{ maxWidth: 400 }}>
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
            </div>, element)

            validator = new FormValidator(element,
                { name: VERIFY_CODE, rules: [rules.required("请输入验证码")] },
                { name: NEW_MOBILE, rules: [rules.required("请输入新密码"), rules.mobile("请输入正确的手机号码")] }
            )
        },
        context: {
            save() {
                if (!validator.check())
                    return Promise.reject();
            }
        }
    })
}