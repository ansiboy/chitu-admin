import { startServer } from 'maishu-node-mvc'
import path = require('path')
import { settings } from './settings';

interface Config {
    port: number,
    roleId: string,
    modulesPath: string,
    controllerPath: string
}

export function start(config: Config) {
    let virtualPaths = {
        'modules/auth': path.join(__dirname, '../public/modules/auth'),
        // out: path.join(__dirname, '../'),
        lib: path.join(__dirname, '../../lib'),
        node_modules: path.join(__dirname, '../../node_modules'),
        content: path.join(__dirname, '../../src/public/content'),
        'main.js': path.join(__dirname, '../../src/public/main.js')
    }

    if (config.modulesPath) {
        virtualPaths['modules'] = config.modulesPath
    }

    startServer({
        port: config.port,
        rootPath: __dirname,
        staticRootDirectory: path.join(__dirname, '../../out/public'),
        controllerDirectory: config.controllerPath ? [path.join(__dirname, './controllers'), config.controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths
    })

    settings.roleId = config.roleId
}