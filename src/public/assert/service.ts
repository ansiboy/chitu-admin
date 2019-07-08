import { Service, AjaxOptions, ValueStore } from 'maishu-chitu-service';
import { MenuItem } from './masters/main-master-page';
import { PermissionService } from './services/index';
import { errors } from './errors';

export interface LoginInfo {
    token: string;
    userId: string;
    username?: string;
}
export class AppService extends Service {

    // static loginInfo = new ValueStore<LoginInfo | null>(AppService.getStorageLoginInfo())
    // private static readonly LoginInfoStorageName = 'app-login-info'
    private ps: PermissionService;

    constructor() {
        super();

        this.ps = this.createService(PermissionService);
    }

    // ajax<T>(url: string, options?: AjaxOptions): Promise<T | null> {
    //     options = options || {};
    //     options.headers = options.headers || {};

    //     console.assert(AppService.loginInfo != null);
    //     if (AppService.loginInfo.value)
    //         options.headers["token"] = AppService.loginInfo.value.token;

    //     return super.ajax<T>(url, options);
    // }

    // protected static setStorageLoginInfo(value: LoginInfo | null) {
    //     if (value == null) {
    //         this.removeCookie(AppService.LoginInfoStorageName)
    //         return
    //     }

    //     this.setCookie(AppService.LoginInfoStorageName, JSON.stringify(value), 1000)
    // }

    // private static getStorageLoginInfo(): LoginInfo | null {
    //     let loginInfoSerialString = this.getCookie(AppService.LoginInfoStorageName)
    //     if (!loginInfoSerialString)
    //         return null

    //     try {
    //         let loginInfo = JSON.parse(loginInfoSerialString)
    //         return loginInfo
    //     }
    //     catch (e) {
    //         console.error(e)
    //         console.log(loginInfoSerialString)
    //         return null
    //     }
    // }

    // private static removeCookie(name: string) {
    //     // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    //     this.setCookie(name, '')
    // }

    // private static setCookie(name: string, value: string, days?: number) {
    //     var expires = "";
    //     if (days) {
    //         var date = new Date();
    //         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    //         expires = "; expires=" + date.toUTCString();
    //     }
    //     document.cookie = name + "=" + (value || "") + expires + "; path=/";
    // }

    // private static getCookie(name: string) {
    //     if (typeof document == 'undefined')
    //         return null;

    //     var nameEQ = name + "=";
    //     var ca = document.cookie.split(';');
    //     for (var i = 0; i < ca.length; i++) {
    //         var c = ca[i];
    //         while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    //         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    //     }
    //     return null;
    // }



    async menuList() {
        let resources = await this.ps.resource.list();
        let items = resources as MenuItem[];
        // .map(o => ({ id: o.id, name: o.name, path: o.path, parentId: o.parent_id, sortNumber: o.sort_number } as MenuItem)); //this.get<MenuItem[]>('auth/menu/list', { userId });

        let top = items.filter(o => o.parent_id == null);
        let stack = [...top]
        while (stack.length > 0) {
            let item = stack.pop();
            if (item.parent_id) {
                item.parent = items.filter(o => o.id == item.parent_id)[0];
                console.assert(item.parent != null);
            }

            item.children = items.filter(o => o.parent_id == item.id).sort((a, b) => a.sort_number > b.sort_number ? 1 : -1);
            item.children.forEach(o => stack.push(o));
        }

        return top;
    }
    // async login(username: string, password: string) {
    //     let r = await this.post<LoginInfo>("auth/user/login", { username, password });
    //     if (r == null)
    //         throw errors.unexpectedNullResult()

    //     r.username = username;
    //     AppService.loginInfo.value = r;
    //     AppService.setStorageLoginInfo(r);

    // }
}