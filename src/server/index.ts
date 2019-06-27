import { startServer } from 'maishu-node-mvc'
import { settings } from './settings';
import { errors } from './errors';
import path = require('path')
import fs = require("fs");

interface Config {
    port: number,
    roleId: string,
    // modulesPath: string,
    controllerPath: string,
    gateway: string,
    clientRootDirectory: string,
}

var appDir = path.dirname(require.main.filename);
var node_modules_path = path.join(appDir, 'node_modules')

export function start(config: Config) {
    let virtualPaths = {
        'modules/auth': path.join(__dirname, '../public/modules/auth'),
        // out: path.join(__dirname, '../'),
        lib: path.join(__dirname, '../../lib'),
        node_modules: node_modules_path,
        // content: path.join(__dirname, '../../src/public/content'),
        // 'main.js': path.join(__dirname, '../../src/public/main.js'),
    }

    if (config.clientRootDirectory) {
        if (!path.isAbsolute(config.clientRootDirectory))
            throw errors.notAbsolutePath(config.clientRootDirectory);

        if (!fs.existsSync(config.clientRootDirectory))
            throw errors.directoryNotExists(config.clientRootDirectory);

        let stat = fs.statSync(config.clientRootDirectory);
        if (!stat.isDirectory())
            throw errors.pathIsNotDirectory(config.clientRootDirectory);

        // virtualPaths["client"] = config.clientRootDirectory;
        let r = fs.readdirSync(config.clientRootDirectory);
        for (let i = 0; i < r.length; i++) {
            let p = path.join(config.clientRootDirectory, r[i]);
            stat = fs.statSync(p);
            if (stat.isDirectory() || stat.isFile())
                virtualPaths[r[i]] = p;
        }
    }

    settings.roleId = config.roleId;
    settings.gateway = config.gateway;
    settings.clientPath = config.clientRootDirectory;

    startServer({
        port: config.port,
        rootPath: __dirname,
        staticRootDirectory: path.join(__dirname, '../../out/public'),
        controllerDirectory: config.controllerPath ? [path.join(__dirname, './controllers'), config.controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths
    });


}