

let urlParams = (location.search || "").length > 1 ? pareeUrlQuery(location.search.substr(1)) : {};
let configUrl = "./websiteConfig";
fetch(configUrl).then(async response => {
    let r: import("./types").WebsiteConfig = await response.json();

    requirejs.config(r.requirejs);
    let req = requirejs.config(r.requirejs);
    req(["/asset/startup"], function (startupModule) {
        console.assert(startupModule != null && typeof startupModule["default"] == "function");
        startupModule["default"](req);
    })
});

let load: Function = requirejs.load;
requirejs.load = function (context, id, url: string) {
    if (url.endsWith(".js") == false) {
        url = url + ".js";
    }
    load.apply(this, [context, id, url]);
}

function pareeUrlQuery(query: string): { [key: string]: string } {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s: string) {
            return decodeURIComponent(s.replace(pl, " "));
        };

    let urlParams: { [key: string]: string } = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}



