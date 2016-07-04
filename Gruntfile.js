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
module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            app: {
                src: [src_root + '/**/*.ts'],
                dest: dest_root,
                options: ts_options
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: src_root, src: ['**/*.html'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['js/**/*.js'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['css/**/*.css'], dest: dest_root },
                    { expand: true, cwd: src_root, src: ['font/**/*.*'], dest: dest_root }
                ]
            }
        },
        less: {
            app: {
                files: [{
                    expand: true,
                    cwd: src_root + '/css/app',
                    src: ['**/*.less'],
                    dest: dest_root + '/css/app',
                    ext: '.css'
                }]
            },
            // bootstrap: {
            //     files: [{
            //         src: [src_root + '/css/bootstrap-3.3.5/bootstrap.less'],
            //         dest: dest_root + '/css/bootstrap.css'
            //     }]
            // },
            // chitu: {
            //     files: [{
            //         src: [src_root + '/css/chitu.less'],
            //         dest: dest_root + '/css/chitu.css'
            //     }]
            // }
        }
    });
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['ts', 'copy', 'less']);
}