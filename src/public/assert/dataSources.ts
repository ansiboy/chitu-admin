import { DataSource, DataSourceSelectArguments, DataSourceSelectResult, DataSourceArguments } from "maishu-wuzhui";
import { PermissionService } from "./services/index";
import { app } from "./application";
import { AppService } from "./service";
import { MenuItem } from "./masters/main-master-page";
import { User, Role, Path, Resource } from "entities";

let permissionService: PermissionService = app.createService<PermissionService>(PermissionService);
let appService = app.createService(AppService);

export class MyDataSource<T> extends DataSource<T> {
    getItem: (id: string) => Promise<T>;

    constructor(params: DataSourceArguments<T> & { item?: (id: string) => Promise<T> }) {
        super(params)

        if (params.item == null) {
            params.item = async (id: string) => {
                let filter = `id = '${id}'`
                let args = new DataSourceSelectArguments()
                args.filter = filter
                let r = await this.executeSelect(args) as DataSourceSelectResult<T>
                return r.dataItems[0]
            }
        }

        this.getItem = params.item
    }
}


function createRoleDataSource() {
    let roleDataSource = new MyDataSource<Role>({
        primaryKeys: ['id'],
        async select() {
            let roles = await permissionService.role.list();
            return { dataItems: roles, totalRowCount: roles.length };
        },
        async item(id) {
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
        },
        async update(item) {
            let r = await permissionService.role.update(item);
            return r;
        }
    })

    return roleDataSource;
}

export function createMenuDataSource() {
    let menuDataSource = new MyDataSource<MenuItem>({
        primaryKeys: ['id'],
        async select() {
            let resources = await permissionService.resource.list();
            resources = resources.filter(o => o.type == "menu");
            let arr = translateToMenuItems(resources);
            return { dataItems: arr, totalRowCount: arr.length };
        },
        async item(id: string) {
            let items = await appService.menuList();
            let stack: MenuItem[] = [...items];

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

export function translateToMenuItems(resources: Resource[]): MenuItem[] {
    let arr = new Array<MenuItem>();
    let stack: MenuItem[] = [...resources.filter(o => o.parent_id == null).reverse() as MenuItem[]];
    while (stack.length > 0) {
        let item = stack.pop();
        item.children = resources.filter(o => o.parent_id == item.id) as MenuItem[];
        if (item.parent_id) {
            item.parent = resources.filter(o => o.id == item.parent_id)[0] as MenuItem;
        }

        stack.push(...item.children.reverse());

        arr.push(item);
    }

    let ids = arr.map(o => o.id);
    for (let i = 0; i < ids.length; i++) {
        let item = arr.filter(o => o.id == ids[i])[0];
        console.assert(item != null);

        if (item.children.length > 1) {
            item.children.sort((a, b) => a.sort_number < b.sort_number ? -1 : 1);
        }
    }

    return arr;
}

export function createUserDataSource() {
    let userDataSource = new MyDataSource<User>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.user.list(args);
            r.dataItems.forEach(o => {
                o.data = o.data || {};
                // let userRoles = o["roles"] as Role[];
                // o["roleNames"] = userRoles.map(o => o.name).join(",");
                // o["roleIds"] = userRoles.map(o => o.id).join(",");
            });

            return r;
        },
        update: async (item) => {
            let r = await permissionService.user.update(item);
            return r;
        },
        insert: async (item) => {
            let roleIds: string[];
            let r = await permissionService.user.add(item, roleIds);
            // if (r.roles) {
            //     r["roleNames"] = r.roles.map(o => o.name).join(",");
            // }
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

function createPathDataSource() {
    let dataSource = new MyDataSource<Path>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.path.list();
            return { dataItems: r, totalRowCount: r.length };
        }
    })

    return dataSource;
}

function createResourceDataSource() {
    let dataSource = new MyDataSource<Resource>({
        primaryKeys: ["id"],
        select: async (args) => {
            let r = await permissionService.resource.list();
            return { dataItems: r, totalRowCount: r.length };
        },
        item: async (id) => {
            let r = await permissionService.resource.item(id);
            debugger
            return r;
        },
        update: async (item) => {
            item = Object.assign({}, item);
            let menuItem = item as MenuItem;
            delete menuItem.children;
            delete menuItem.parent;
            
            let r = await permissionService.resource.update(item);
            return r;
        },
        insert: async (item) => {
            let r = await permissionService.resource.add(item);
            return r;
        },
        delete: async (item) => {
            let r = await permissionService.resource.remove(item.id);
            return r;
        }
    })

    return dataSource;
}

export class DataSources {
    role = createRoleDataSource();
    menu = createMenuDataSource();
    user = createUserDataSource();
    token = createTokenDataSource();
    path = createPathDataSource();
    resource = createResourceDataSource();
}

export let dataSources = new DataSources();

