var dest_root = 'www';
var src_root = 'src';
var ts_options = {
    module: 'amd',
    target: 'es5',
    removeComments: true,
    references: [
        src_root + "/js/typings/*.d.ts"
    ],
    sourceMap: false,
};
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    let pkg = grunt.file.readJSON('package.json');

    let license = `
/*!
 * CHITU-ADMIN v${pkg.version}
 * https://github.com/ansiboy/chitu-admin
 *
 * Copyright (c) 2016-2018, shu mai <ansiboy@163.com>
 * Licensed under the MIT License.
 *
 */`;

    let build_dir = 'out';
    let release_dir = 'dist';
    let lib_name = 'chitu_admin'
    let lib_js_banner = license;

    grunt.initConfig({
        babel: {
            source: {
                options: {
                    sourceMap: false,
                    presets: ["es2015"],
                },
                files: [{
                    src: [`${release_dir}/${lib_name}.js`],
                    dest: `${release_dir}/${lib_name}.es5.js`
                }]
            }
        },
        browserify: {
            dist: {
                files: (function () {
                    let obj = {};
                    let filePath = `${build_dir}/${lib_name}.js`;
                    obj[filePath] = [`${build_dir}/index.js`];

                    return obj
                })(),
                options: {
                    transform: ['brfs'],
                    browserifyOptions: {
                        standalone: 'chitu_admin',
                    },
                    external: ['react', 'react-dom', 'maishu-chitu', 'maishu-chitu-react']
                }
            }
        },
        concat: {
            lib_es6: {
                options: {
                    banner: lib_js_banner,
                },
                src: [`${build_dir}/${lib_name}.js`],
                dest: `${release_dir}/${lib_name}.js`
            },
            declare: {
                options: {
                    banner:`/// <reference path="../../../node_modules/maishu-chitu/dist/chitu.d.ts"/>`
                },
                src: ['src/declare.d.ts'],
                dest: `${release_dir}/${lib_name}.d.ts`
            },
        },
        shell: {
            src: {
                command: `tsc -p src`
            }
        },
        uglify: {
            out: {
                options: {
                    mangle: false
                },
                files: [{
                    src: `${release_dir}/${lib_name}.es5.js`,
                    dest: `${release_dir}/${lib_name}.min.js`
                }]
            }
        },
    });

    grunt.registerTask('default', ['shell', 'browserify', 'concat', 'babel', 'uglify']);
}