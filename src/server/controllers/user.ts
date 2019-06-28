import { controller, formData, action } from "maishu-node-mvc";
import { UserService, LoginInfo } from "maishu-services-sdk";

@controller("auth/user")
export class UserController {
    @action()
    async login(@formData { username, password }): Promise<LoginInfo> {
        let us = new UserService();
        let r = await us.login(username, password);
        return r;
    }

}