import { controller, action } from "maishu-node-mvc";

/**
 * Temp 控制器
 */
@controller("demo/temp")
export default class TempController {

    /** Index 页面 */
    @action()
    index() {
        return "Demo Index"
    }
}