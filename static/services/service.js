"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_chitu_service_1 = require("maishu-chitu-service");
const config = __importStar(require("json!websiteConfig"));
const maishu_toolkit_1 = require("maishu-toolkit");
exports.urlParams = {};
if (location.search)
    exports.urlParams = parseUrlParams(location.search.substr(1));
let protocol = location.protocol;
/** 站点路径 */
function stationPath(path) {
    console.assert(requirejs != null);
    let contexts = requirejs.exec("contexts");
    let contextName;
    if (config.requirejs)
        contextName = config.requirejs.context;
    let context = contexts[contextName];
    if (context != null && context.config != null && context.config.baseUrl != null) {
        return maishu_toolkit_1.pathConcat(context.config.baseUrl, path);
    }
    return path;
}
exports.stationPath = stationPath;
class Service extends maishu_chitu_service_1.Service {
    ajax(url, options) {
        const _super = Object.create(null, {
            ajax: { get: () => super.ajax }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!url.startsWith("http")) {
                let host = location.host;
                let pathname = location.pathname;
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
            let r = yield _super.ajax.call(this, url, options);
            if (r != null && r["Type"] == "DataSourceSelectResult") {
                r["dataItems"] = r["DataItems"];
                r["totalRowCount"] = r["TotalRowCount"];
                r["maximumRows"] = r["MaximumRows"];
                r["startRowIndex"] = r["StartRowIndex"];
            }
            return r;
        });
    }
    localServiceUrl(path) {
        let hash = location.hash;
        if (hash != null && hash[0] == "/") {
            hash = hash.substr(1);
            let arr = hash.split("/");
            let r = maishu_toolkit_1.pathConcat(arr[0], path);
            return r;
        }
        return path;
    }
    get applicationId() {
        return exports.urlParams.appKey;
    }
}
exports.Service = Service;
function parseUrlParams(query) {
    if (!query)
        throw new Error(`Argument query is null or empty.`);
    if (query[0] == '?')
        query = query.substr(1);
    let match, pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    let urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}
class ServiceModule {
    constructor(service) {
        this.service = service;
    }
    getByJson(url, data) {
        return this.service.getByJson(url, data);
    }
    putByJson(url, data) {
        return this.service.putByJson(url, data);
    }
    postByJson(url, data) {
        return this.service.postByJson(url, data);
    }
    deleteByJson(url, data) {
        return this.service.deleteByJson(url, data);
    }
    get(url, data) {
        return this.service.get(url, data);
    }
    put(url, data) {
        return this.service.put(url, data);
    }
    post(url, data) {
        return this.service.post(url, data);
    }
    delete(url, data) {
        return this.service.delete(url, data);
    }
}
exports.ServiceModule = ServiceModule;
