import { controller, action, routeData } from "maishu-node-mvc";

/**
 * Temp 控制器
 */
@controller("demo/temp")
export default class TempController {
    /** 
     * Index 页面 
     * @param d 路由数据
     * @param d.mobile 手机号码
     * @param d.password 密码
     * @param d.smsId 短信编号
     * @param d.verifyCode 手机接收到的验证码
     */
    @action()
    index(@routeData d: { mobile: string, password: string, smsId: string, verifyCode: string }) {
        return "Demo Index"
    }
}