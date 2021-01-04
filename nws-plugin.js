const { fstat } = require("fs");
const nws = require("maishu-node-web-server");
const { JavaScriptProcessor } = require("maishu-nws-js");
const { pathConcat } = require("maishu-toolkit");
const path = require("path");
const fs = require("fs");

/** @type {nws.LoadPlugin} */
let loadPlugin = function (w) {
    let javaScriptProcessor = w.requestProcessors.find(JavaScriptProcessor);
    if (javaScriptProcessor) {
        setJSOptions(javaScriptProcessor);
    }
    else {
        w.requestProcessors.added.add((args) => setJSOptions(args.item));
    }

    let staticProcessor = w.requestProcessors.find(nws.StaticFileProcessor);
    if (staticProcessor) {
        setStaticOptions(staticProcessor);
    }
    else {
        w.requestProcessors.added.add((args) => setStaticOptions(args.item));
    }

    let staticDir = w.websiteDirectory.findDirectory("static");
    if (!staticDir) {
        w.websiteDirectory.setPath("static", path.join(__dirname, "static"));
        staticDir = w.websiteDirectory.findDirectory("static");
    }
    else {
        /** @type {nws.VirtualDirectory[]} */
        var stack = [new nws.VirtualDirectory(path.join(__dirname, "static"))];
        while (stack.length > 0) {
            let item = stack.pop();
            var files = item.files();
            for (let name in files) {
                let fileVirtualPath = pathConcat(item.virtualPath, name);
                if (staticDir.findFile(fileVirtualPath) == null) {
                    staticDir.setPath(fileVirtualPath, files[name]);
                }
            }
            let children = item.directories();
            for (let key in children) {
                stack.push(children[key]);
            }
        }
    }

    let node_modules = w.websiteDirectory.findDirectory("node_modules");
    if (node_modules)
        staticDir.setPath("node_modules", node_modules.physicalPath);
}

/**
 * 
 * @param {JavaScriptProcessor} javaScriptProcessor 
 */
function setJSOptions(javaScriptProcessor) {
    javaScriptProcessor.babelOptions = {
        "\\S+.js$": {
            "presets": [
                ["@babel/preset-env", {
                    "targets": { chrome: 58 }
                }],
            ],
            plugins: [
                ["@babel/plugin-transform-modules-amd", { noInterop: true }]
            ]
        },
        "\\S+.ts$": {
            "presets": [
                ["@babel/preset-env", {
                    "targets": { chrome: 58 }
                }]
            ],
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-transform-typescript", { isTSX: false }],
                ["@babel/plugin-transform-react-jsx", { "pragma": "React.createElement", "pragmaFrag": "React.Fragment" }],
                ["@babel/plugin-transform-modules-amd", { noInterop: true }],
            ]
        },
        "\\S+.tsx$": {
            "presets": [
                ["@babel/preset-env", {
                    "targets": { chrome: 58 }
                }]
            ],
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-transform-typescript", { isTSX: true }],
                ["@babel/plugin-transform-react-jsx", { "pragma": "React.createElement", "pragmaFrag": "React.Fragment" }],
                ["@babel/plugin-transform-modules-amd", { noInterop: true }],

            ]
        },
    }

    javaScriptProcessor.basePath = "static";
}


/** @param {nws.StaticFileProcessor staticProcessor */
function setStaticOptions(staticProcessor) {
    staticProcessor.contentTypes[".less"] = "text/plain";
}

module.exports = { default: loadPlugin };