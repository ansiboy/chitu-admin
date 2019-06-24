const { start } = require('./out/server/index')
const path = require('path')
start({
    port: 4210,
    rootPath: __dirname,
    controllerDirectory: path.join(__dirname, 'out/server/controllers'),
    staticRootDirectory: path.join(__dirname, 'src/public'),
    virtualPaths: {
        node_modules: path.join(__dirname, 'node_modules'),
        out: path.join(__dirname, 'out'),
        lib: path.join(__dirname, 'lib')
    }
})