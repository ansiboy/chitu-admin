import { Service as ChiTuSerivce, AjaxOptions } from 'maishu-chitu-service'
import config = require("json!websiteConfig");

export let urlParams: { appKey?: string, token?: string } = {};
if (location.search)
    urlParams = parseUrlParams(location.search.substr(1));

let protocol = location.protocol;

/** 站点路径 */
export function stationPath(path: string) {
    console.assert(requirejs != null);
    let contexts = requirejs.exec("contexts");
    let contextName: string;
    if (config.requirejs)
        contextName = config.requirejs.context;

    let context: RequireContext = contexts[contextName];
    if (context != null && context.config != null && context.config.baseUrl != null) {
        return `${context.config.baseUrl}${path}`;
    }
    return `${path}`;
}

export abstract class Service extends ChiTuSerivce {

    async ajax<T>(url: string, options: AjaxOptions) {

        if (!url.startsWith("http")) {
            let host = location.host;
            let pathname = location.pathname

            if (!pathname.endsWith("/")) {
                let arr = pathname.split("/");
                arr[arr.length - 1] = "";
                pathname = arr.join("/");
            }

            if (url.startsWith("/")) {
                url = `${protocol}//${host}${url}`;
            }
            else {
                url = `${protocol}//${host}${pathname}${url}`;
            }
        }

        options = options || {};
        options.headers = options.headers || {};


        if (this.applicationId)
            options.headers['application-id'] = this.applicationId;

        let r = await super.ajax<T>(url, options);
        if (r != null && r["Type"] == "DataSourceSelectResult") {
            r["dataItems"] = r["DataItems"];
            r["totalRowCount"] = r["TotalRowCount"];
            r["maximumRows"] = r["MaximumRows"];
            r["startRowIndex"] = r["StartRowIndex"];
        }
        return r;
    }

    localUrl(path: string) {
        return stationPath(path);
    }

    get applicationId() {
        return urlParams.appKey;
    }
}

function parseUrlParams(query: string) {
    if (!query) throw new Error(`Argument query is null or empty.`);
    if (query[0] == '?')
        query = query.substr(1);

    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    let urlParams: any = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}

export abstract class ServiceModule<T extends Service> {
    protected service: T;
    constructor(service: T) {
        this.service = service;
    }

    getByJson<T>(url: string, data?: any): Promise<T> {
        return this.service.getByJson(url, data);
    }
    putByJson<T>(url: string, data?: any): Promise<T> {
        return this.service.putByJson(url, data);
    }
    postByJson<T>(url: string, data?: any): Promise<T> {
        return this.service.postByJson(url, data);
    }
    deleteByJson<T>(url: string, data: any): Promise<T> {
        return this.service.deleteByJson(url, data);
    }
    get<T>(url: string, data?: any): Promise<T> {
        return this.service.get(url, data);
    }
    put<T>(url: string, data?: any): Promise<T> {
        return this.service.put(url, data);
    }
    post<T>(url: string, data?: any): Promise<T> {
        return this.service.post(url, data);
    }
    delete<T>(url: string, data: any): Promise<T> {
        return this.service.delete(url, data);
    }
}