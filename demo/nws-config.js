const path = require("path");
const nws = require("maishu-node-web-server");

/** @type {nws.Settings} */
let settings = {
    port: 4612,
    virtualPaths: {
        "static": path.join(__dirname, "../out/static"),
        "static/node_modules": path.join(__dirname, "node_modules"),
        "static/lib": path.join(__dirname, "../lib"),
        "static/content": path.join(__dirname, "../src/static/content")
    },
    processors: {
        JavaScript: {
            babelOptions: {
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
            },
            basePath: "static"
        },
        StaticFile: {
            contentTypes: { ".less": "text/plain" }
        }

    }
}

module.exports = settings;