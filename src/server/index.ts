import { startServer, Config } from 'maishu-node-mvc'
import path = require('path')

export function start({ port }: { port: number }) {
    let { staticServer } = startServer({
        port,
        rootPath: __dirname,
        staticRootDirectory: path.join(__dirname, '../public'),
        controllerDirectory: path.join(__dirname, './controllers'),
        virtualPaths: {
            out: 'out'
        }
    })

}