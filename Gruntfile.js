function modifyVersion() {
    const package = require("./package.json");

    let version = package.version || "1.0.0";
    let arr = version.split(".");
    arr[arr.length - 1] = (Number.parseInt(arr[arr.length - 1]) + 1).toString();
    version = arr.join(".");
    package.version = version;

    const fs = require('fs');
    let data = JSON.stringify(package, null, 4);
    fs.writeFileSync("package.json", data, "utf8");
};
modifyVersion();

const webpack_es6 = require('./webpack.config.js');

let webpack_es6_min = Object.assign({}, webpack_es6, {
    output: Object.assign({}, webpack_es6.output, { filename: "static.min.js" }),
    mode: 'production',
})

let webpack_es5 = Object.assign({}, webpack_es6, {
    entry: __dirname + "/out-es5/static/index.js",//已多次提及的唯一入口文件
    output: Object.assign({}, webpack_es6.output, { filename: "static.es5.js" }),
})

let webpack_es5_min = Object.assign({}, webpack_es5, {
    output: Object.assign({}, webpack_es6.output, { filename: "static.es5.min.js" }),
    mode: 'production',
})

let externals = ["json!websiteConfig",
    "text!admin_style_default",
    'react', 'react-dom', 'less', 'lessjs',
    'maishu-chitu', 'maishu-chitu-react', 'maishu-dilu',
    'maishu-services-sdk', 'maishu-toolkit', 'maishu-ui-toolkit',
    'maishu-wuzhui', 'maishu-wuzhui-helper',
]
let webpack_startup = Object.assign({}, webpack_es5, {
    entry: __dirname + "/out/static/startup.js",
    output: Object.assign({}, webpack_es6.output, { filename: "startup.js" }),
    externals
})

let webpack_startup_min = Object.assign({}, webpack_es5, {
    entry: __dirname + "/out/static/startup.js",
    output: Object.assign({}, webpack_es6.output, { filename: "startup.min.js" }),
    mode: 'production', externals
})

function modifyVersion() {
    const package = require("./package.json");

    let version = package.version || "1.0.0";
    let arr = version.split(".");
    arr[arr.length - 1] = (Number.parseInt(arr[arr.length - 1]) + 1).toString();
    version = arr.join(".");
    package.version = version;

    const fs = require('fs');
    let data = JSON.stringify(package, null, 4);
    fs.writeFileSync("package.json", data, "utf8");
};
modifyVersion();


module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            out: {
                files: [
                    // includes files within path
                    // { expand: true, cwd: 'src', src: ['content/*'], dest: 'out' },
                    // { expand: true, cwd: 'src', src: ['content/*'], dest: 'out-es5' },
                    {
                        expand: true,
                        cwd: 'src/static',
                        dest: 'out/static',
                        src: ['**/*.html', '**/*.css', '**/*.less',]
                    },
                ],
            }
        },
        shell: {
            src: {
                command: `tsc -p src`
            }
        },
        webpack: {
            es6: webpack_es6,
            es6_min: webpack_es6_min,
            es5: webpack_es5,
            es5_min: webpack_es5_min,
            startup: webpack_startup,
            startup_min: webpack_startup_min,
        },
        babel: {
            options: {
                sourceMap: false,
                presets: [
                    ['@babel/preset-env', {
                        targets: {
                            "chrome": "58",
                            "ie": "11"
                        }
                    }]
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'out/static',
                    src: ['**/*.js'],
                    dest: 'out-es5/static'
                }]
            }
        },
        requirejs: {
            static: {
                options: {
                    include: ["out/static/index"],
                    out: "out/static/index.build.js",
                    paths: Object.assign(requirejsDefaultPaths, {
                        "websiteConfig": "empty:"
                    }),
                    optimize: "none"
                }
            },
        },
        open: {
            browser: {
                path: `http://127.0.0.1:4612/#login`,
                app: 'Google Chrome'
            }
        }
    });

    grunt.registerTask('default', ['shell', 'copy', 'babel', "webpack"]);
    grunt.registerTask("static", ["shell:client", "webpack:es6"]);
    grunt.registerTask("start", ["open"])
}

var requirejsDefaultPaths = {
    "requirejs": "node_modules/requirejs/require",
    "json": "node_modules/maishu-requirejs-plugins/src/json",
    "less": "node_modules/less/dist/less",
    "lessjs": "node_modules/less/dist/less",
    "text": "node_modules/maishu-requirejs-plugins/lib/text",
    "react": "empty:",//"node_modules/react/umd/react.production.min",
    "react-dom": "empty:",// "node_modules/react-dom/umd/react-dom.production.min",

    "js-md5": "node_modules/js-md5/src/md5",

    "maishu-chitu": "node_modules/maishu-chitu/dist/index.es5",
    "maishu-chitu-react": "node_modules/maishu-chitu-react/dist/index.es5",
    "maishu-chitu-service": "node_modules/maishu-chitu-service/dist/index.es5",
    "maishu-dilu": "node_modules/maishu-dilu/dist/index.es5",
    "maishu-ui-toolkit": "node_modules/maishu-ui-toolkit/dist/index.es5",
    "maishu-wuzhui": "node_modules/maishu-wuzhui/dist/index.es5",
    "maishu-wuzhui-helper": "node_modules/maishu-wuzhui-helper/dist/index.es5",

}