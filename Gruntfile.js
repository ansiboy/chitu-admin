const webpack_es6 = require('./webpack.config.js');

let webpack_es6_min = Object.assign({}, webpack_es6, {
    output: Object.assign({}, webpack_es6.output, { filename: "index.min.js" }),
    mode: 'production',
})

let webpack_es5 = Object.assign({}, webpack_es6, {
    entry: __dirname + "/out-es5/static/index.js",//已多次提及的唯一入口文件
    output: Object.assign({}, webpack_es6.output, { filename: "index.es5.js" }),
})

let webpack_es5_min = Object.assign({}, webpack_es5, {
    output: Object.assign({}, webpack_es6.output, { filename: "index.es5.min.js" }),
    mode: 'production',
})

// webpack_es5.entry = __dirname + "/out-es5/static/index.js" //已多次提及的唯一入口文件
// webpack_es5.output = Object.assign({}, webpack_es5.output)
// webpack_es5.output.filename = "index.es5.js"

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
                        src: ['**/*.html', '**/*.css', '**/*.less', 'asset/lib/**', "content/**"]
                    },
                ],
            }
        },
        shell: {
            src: {
                command: `tsc -p src`
            },
            client: {
                command: `tsc -p src/static`
            },
        },
        webpack: {
            es6: webpack_es6,
            es6_min: webpack_es6_min,
            es5: webpack_es5,
            es5_min: webpack_es5_min,
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
        }
    });

    grunt.registerTask('default', ['shell', 'copy', 'babel', "webpack"]);
    grunt.registerTask("static", ["shell:client", "webpack:es6"]);
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