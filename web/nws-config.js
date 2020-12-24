const path = require("path");
const nws = require("maishu-node-web-server");
/** @type {nws.Settings} */
let settings = {
    port: 4614,
    virtualPaths: {
        "node_modules": path.join(__dirname, "../demo/node_modules"),
        "static": __dirname,
        "static/node_modules": path.join(__dirname, "../demo/node_modules"),
        "static/lib": path.join(__dirname, "./lib"),
        "static/content": path.join(__dirname, "./content")
    },
    processors: {
        JavaScriptProcessor: {
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
                "\\S+.ts$": {
                    "presets": [
                        ["@babel/preset-env", {
                            "targets": { chrome: 58 }
                        }]
                    ],
                    plugins: [
                        "@babel/plugin-transform-typescript",
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
                        ["@babel/plugin-transform-typescript", { isTSX: true }],
                        ["@babel/plugin-transform-react-jsx", { "pragma": "React.createElement", "pragmaFrag": "React.Fragment" }],
                        ["@babel/plugin-transform-modules-amd", { noInterop: true }],
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