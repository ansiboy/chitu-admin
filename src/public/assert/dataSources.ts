import { DataSource, DataSourceSelectArguments, DataSourceSelectResult, DataSourceArguments } from "maishu-wuzhui";
import { Role, PermissionService, User, Resource } from "maishu-services-sdk";
import { app } from "./application";
import { AppService } from "./service";
import { MenuItem } from "./masters/main-master-page";

let permissionService: PermissionService = app.createService<PermissionService>(PermissionService);
let appService = app.createService(AppService);

export class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;

    constructor(params: DataSourceArguments<T> & { getItem?: (id: string) => Promise<T> }) {
        super(params)

        if (params.getItem == null) {
            params.getItem = async (id: string) => {
                let filter = `id = '${id}'`
                let args = new DataSourceSelectArguments()
                args.filter = filter
                let r = await this.executeSelect(args) as DataSourceSelectResult<T>
                return r.dataItems[0]
            }
        }

        this.getItem = params.getItem
    }
}


function createRoleDataSource() {
    let roleDataSource = new MyDataSource<Role>({
        primaryKeys: ['id'],
        async select() {
            let roles = await permissionService.role.list();
            return { dataItems: roles, totalRowCount: roles.length };
        },
        async getItem(id) {
            let role = await permissionService.role.item(id);
            return role
        },
        async insert(item) {
            let r = await permissionService.role.add(item);
            return r;
        },
        async delete(item) {
            let r = await permissionService.role.remove(item.id);
            return r;
        }
    })

    return roleDataSource;
}

export function createMenuDataSource() {
    let menuDataSource = new MyDataSource<MenuItem>({
        primaryKeys: ['id'],
        async select() {
            let r = await appService.menuList();
            let arr = new Array<MenuItem>();
            for (let i = 0; i < r.length; i++) {
                arr.push(r[i]);
                r[i].children.forEach(child => arr.push(child));
            }

            return { dataItems: arr, totalRowCount: arr.length };
        },
        async getItem(id: string) {
            let items = await menuDataSource.executeSelect({})
            let stack: MenuItem[] = [...items.dataItems];

            let arr: MenuItem[] = [];
            while (stack.length > 0) {
                let item = stack.pop();
                delete item.parent;
                arr.push(item);
                stack.push(...item.children);
            }

            return arr.filter(o => o.id == id)[0];
        },
        delete(item) {
            return permissionService.resource.remove(item.id);
        },
        async insert(item) {
            // let obj: typeof item = JSON.parse(JSON.stringify(item))
            // delete obj.children
            // delete obj.originalChildren
            // delete obj.visible

            // let r = await permissionService.resource.add(obj)
            // console.assert(r.id != null)
            // Object.assign(item, r)

            // item.children.forEach(child => {
            //     child.parent_id = item.id
            //     permissionService.addResource(child)
            // })

            // return r
        },
        async update(item) {
            // item.children = item.children || []
            // item.originalChildren = item.originalChildren || []
            // // 查找要删除的
            // for (let i = 0; i < item.originalChildren.length; i++) {
            //     let child = item.children.filter(o => o.id == item.originalChildren[i].id)[0]
            //     if (child == null) {
            //         permissionService.deleteResource(item.originalChildren[i].id)
            //     }
            // }

            // // 查找要添加的
            // for (let i = 0; i < item.children.length; i++) {
            //     let child = item.originalChildren.filter(o => o.id == item.children[i].id)[0]
            //     if (child == null) {
            //         console.assert(item.children[i].parent_id == item.id)
            //         let obj = Object.assign({}, item.children[i])
            //         delete obj.children
            //         delete obj.originalChildren
            //         delete obj.visible
            //         permissionService.resource.add(obj)
            //     }
            // }
            // item.parent_id = !item.parent_id ? null : item.parent_id
            // let obj: typeof item = JSON.parse(JSON.stringify(item))
            // delete obj.children
            // delete obj.originalChildren
            // await permissionService.resource.update(obj)
            // item.children = Object.assign([], item.originalChildren)
        }
    })
    return menuDataSource;
}

export function createUserDataSource() {
    let userDataSource = new MyDataSource<User>({
        select: async (args) => {
            let r = await permissionService.user.list(args);
            r.dataItems.forEach(o => o.data = o.data || {});
            return r;
        },
        update: async (item) => {
            let r = await permissionService.user.update(item);
            return r;
        }
    })

    return userDataSource;
}

function createTokenDataSource() {
    let tokenDataSource = new MyDataSource<any>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.token.list(args);
            return r;
        },
        insert: async (item) => {
            let r = await permissionService.token.add(item);
            return r;
        }
    })

    return tokenDataSource;
}

export class DataSources {
    role = createRoleDataSource();
    menu = createMenuDataSource();
    user = createUserDataSource();
    token = createTokenDataSource();
}

export let dataSources = new DataSources();

