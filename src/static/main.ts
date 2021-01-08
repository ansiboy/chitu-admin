let configUrl = "./websiteConfig";
fetch(configUrl).then(async response => {
    let r: import("./types").WebsiteConfig = await response.json();

    requirejs.config(r.requirejs);
    let req = requirejs.config(r.requirejs);
    req(["startup"], function (startupModule) {
        console.assert(startupModule != null && typeof startupModule["default"] == "function");
        startupModule["default"](req);
    })

    if (r.requirejs.context) {
        delete r.requirejs.context;
        requirejs.config(r.requirejs);
    }
});


