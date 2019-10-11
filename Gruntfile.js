const webpackES6Config = require('./webpack.config.js');
let webpackES5Config = Object.assign({}, webpackES6Config)
webpackES5Config.entry = __dirname + "/out-es5/static/index.js" //已多次提及的唯一入口文件
webpackES5Config.output = Object.assign({}, webpackES5Config.output)
webpackES5Config.output.filename = "index.es5.js"

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
                        src: ['**/*.html', '**/*.css', '**/*.less', 'assert/lib/**', "content/**"]
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
            es6: webpackES6Config,
            es5: webpackES5Config,
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

    });

    grunt.registerTask('default', ['shell', 'copy', 'babel']);
}