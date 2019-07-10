import { Rule } from "maishu-dilu";
import { parseUrl } from "maishu-chitu";
import { DataSource } from "maishu-wuzhui";
import { errors } from "assert/errors";
import { Resource } from "entities";

export let constants = {
    pageSize: 15,
    buttonTexts: {
        add: '添加',
        edit: '修改',
        delete: '删除',
        view: '查看'
    },
    buttonCodes: {
        add: 'add',
        edit: 'edit',
        delete: 'delete',
        view: 'view'
    },
    noImage: '暂无图片',
    base64SrcPrefix: 'data:image',
}

export let services = {
    imageService: null
}


export interface ValidateDataField {
    validateRules?: Rule[]
}

export interface NameValue {
    name: string,
    value: any,
}

export function getObjectType(url: string) {
    // let url = location.hash.substr(1);
    let obj = parseUrl(url)
    let arr = obj.pageName.split('/')
    return arr[0];
}

export function toDataSource<T>(source: Promise<T[]>): DataSource<T> {
    return new DataSource({
        select: async () => {
            let items = await source;
            return { dataItems: items, totalRowCount: items.length };
        }
    })
}


export interface ControlArguments<T> {
    resource: Resource;
    dataItem: T;
    listPage: React.Component
}

export function loadItemModule<T>(path: string): Promise<(args: ControlArguments<T>) => React.ReactElement> {
    if (path.endsWith(".js"))
        path = path.substr(0, path.length - 3)

    return new Promise((resolve, reject) => {
        requirejs([path],
            function (mod) {
                if (mod == null)
                    throw errors.moduleIsNull(path);

                let defaultExport = mod["default"];
                if (!defaultExport)
                    throw errors.moduleHasNoneDefaultExports(path);

                if (typeof defaultExport != 'function')
                    throw errors.moduleHasDefaultExportIsNotFunction(path);

                // defaultExport(args);
                resolve(defaultExport);
            },
            function (err) {
                let msg = `Load module ${path} fail.`
                let error = new Error(msg);
                error["innerError"] = err;
                reject(error);
                console.log(error);
            }
        )
    })
}