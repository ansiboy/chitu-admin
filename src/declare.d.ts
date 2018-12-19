declare module chitu_admin {
    export type Menu = {
        id?: string,
        name: string,
        path?: string,
        icon?: string,
        parent?: Menu,
        children: Menu[],
        visible: boolean,
    };

    export interface MasterPage {
        /** 设置菜单 */
        setMenus(menus: Menu[])
        /** 设置工具栏 */
        setToolbar(toolbar: JSX.Element)
    }
    export interface Application extends chitu.Application {
        masterPage: MasterPage
    }
    export let app: chitu_admin.Application
}

declare module "maishu-chitu-admin" {
    export =chitu_admin;
}
