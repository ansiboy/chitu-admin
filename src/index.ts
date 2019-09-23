import { startServer, Config as NodeMVCConfig } from 'maishu-node-mvc'
// import { settings } from './settings';
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, MyServierContext } from './settings';
import { ServerContext } from 'maishu-node-mvc/dist/server-context';

interface Config {
    port: number,
    controllerPath?: string,
    staticRootDirectory: string,
    proxy?: NodeMVCConfig["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    headers?: NodeMVCConfig["headers"]
}



export function start(config: Config) {
    if (!config.staticRootDirectory)
        throw errors.settingItemNull("clientRootDirectory");

    if (!path.isAbsolute(config.staticRootDirectory))
        throw errors.notAbsolutePath(config.staticRootDirectory);

    if (!fs.existsSync(config.staticRootDirectory))
        throw errors.directoryNotExists(config.staticRootDirectory);

    let stat = fs.statSync(config.staticRootDirectory);
    if (!stat.isDirectory())
        throw errors.pathIsNotDirectory(config.staticRootDirectory);


    let innerStaticRootDirectory = path.join(__dirname, "static");
    let virtualPaths = createVirtulaPaths(innerStaticRootDirectory, config.staticRootDirectory);
    virtualPaths["assert"] = path.join(innerStaticRootDirectory, "assert");

    virtualPaths = Object.assign(config.virtualPaths || {}, virtualPaths);

    return startServer({
        port: config.port,
        staticRootDirectory: config.staticRootDirectory,
        controllerDirectory: config.controllerPath ? [path.join(__dirname, './controllers'), config.controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths,
        proxy: config.proxy,
        bindIP: config.bindIP,
        headers: config.headers,
        actionFilters: [
            (req, res, context: MyServierContext) => {
                let settings: Settings = {
                    clientStaticRoot: config.staticRootDirectory,
                    innerStaticRoot: innerStaticRootDirectory,
                }

                context.settings = settings;
                return null;
            }
        ]
    });
}

export { settings, Settings } from "./settings";

function createVirtulaPaths(rootAbsolutePath: string, clientRootAbsolutePath: string) {
    let virtualPaths: { [path: string]: string } = {}
    let virtualPahtStack: string[] = [""];
    while (virtualPahtStack.length > 0) {
        let virtualPath = virtualPahtStack.pop();
        let absolutePath = path.join(rootAbsolutePath, virtualPath);
        let stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) {
            let r = fs.readdirSync(absolutePath);
            let paths = r.map(o => `${virtualPath}/${o}`);
            virtualPahtStack.push(...paths);
        }
        else if (stat.isFile()) {
            let clientFilePath = path.join(clientRootAbsolutePath, virtualPath);
            if (!fs.existsSync(clientFilePath))
                virtualPaths[virtualPath] = absolutePath;
        }
    }

    return virtualPaths;
}