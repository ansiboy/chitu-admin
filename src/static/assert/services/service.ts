import { Service as ChiTuSerivce, AjaxOptions, CookieValueStore } from 'maishu-chitu-service'

export let urlParams: { appKey?: string, token?: string } = {};
if (location.search)
    urlParams = parseUrlParams(location.search.substr(1));

let protocol = location.protocol;

export abstract class Service extends ChiTuSerivce {

    static token = new CookieValueStore<string>("token");

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

        console.log(url);

        options = options || {};
        options.headers = options.headers || {};


        if (this.applicationId)
            options.headers['application-id'] = this.applicationId;

        if (urlParams.token) {
            options.headers['token'] = urlParams.token;
        }
        else if (Service.token.value != null && Service.token.value != null) {
            options.headers['token'] = Service.token.value;
        }

        return super.ajax<T>(url, options);
    }

    localUrl(contextName: string, path: string) {
        console.assert(requirejs != null);
        let contexts = requirejs.exec("contexts");
        let context: RequireContext = contexts[contextName];
        if (context != null && context.config != null && context.config.baseUrl != null) {
            return `${context.config.baseUrl}${path}`;
        }
        return `${path}`;
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
