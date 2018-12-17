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
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'out/bundle.js': ['out/index.js', 'out/modules/index']
                },
                options: {
                    transform: ['brfs'],
                }

            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify']);
}