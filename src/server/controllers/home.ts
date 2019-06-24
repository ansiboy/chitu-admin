import { controller, action } from "maishu-node-mvc";

@controller()
export class HomeController {
    @action()
    index() {
        return 'Hello World'
    }
}