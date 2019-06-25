import { startServer } from 'maishu-node-mvc'
import path = require('path')
import { settings } from './settings';

interface Config {
    port: number,
    roleId: string
}

export function start(config: Config) {
    startServer({
        port: config.port,
        rootPath: __dirname,
        staticRootDirectory: path.join(__dirname, '../../src/public'),
        controllerDirectory: path.join(__dirname, './controllers'),
        virtualPaths: {
            out: path.join(__dirname, '../'),
            lib: path.join(__dirname, '../../lib'),
            node_modules: path.join(__dirname, '../../node_modules'),
            content: path.join(__dirname, '../../src/public/content')
        }
    })

    settings.roleId = config.roleId
}