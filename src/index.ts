import { startServer, Config as NodeMVCConfig } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, MyServierContext } from './settings';

export { WebSiteConfig } from "./config";
export { settings, Settings } from "./settings";


interface Config {
    port: number,
    rootDirectory: string,
    proxy?: NodeMVCConfig["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    headers?: NodeMVCConfig["headers"]
}

export function start(config: Config) {

    if (!config.rootDirectory)
        throw errors.settingItemNull<Config>("rootDirectory");

    // if (!config.staticRootDirectory)
    //     throw errors.settingItemNull("clientRootDirectory");

    if (!path.isAbsolute(config.rootDirectory))
        throw errors.notAbsolutePath(config.rootDirectory);

    if (!fs.existsSync(config.rootDirectory))
        throw errors.directoryNotExists(config.rootDirectory);

    // let stat = fs.statSync(config.staticRootDirectory);
    // if (!stat.isDirectory())
    //     throw errors.pathIsNotDirectory(config.staticRootDirectory);

    let staticRootDirectory = path.join(config.rootDirectory, "static")
    if (!fs.existsSync(staticRootDirectory))
        throw errors.directoryNotExists(staticRootDirectory);

    let controllerPath: string;
    if (fs.existsSync(path.join(config.rootDirectory, "controllers")))
        controllerPath = path.join(config.rootDirectory, "controllers");

    let innerStaticRootDirectory = path.join(__dirname, "static");
    let virtualPaths = createVirtulaPaths(innerStaticRootDirectory, staticRootDirectory);
    virtualPaths["assert"] = path.join(innerStaticRootDirectory, "assert");

    virtualPaths = Object.assign(config.virtualPaths || {}, virtualPaths);

    return startServer({
        port: config.port,
        staticRootDirectory: staticRootDirectory,
        controllerDirectory: controllerPath ? [path.join(__dirname, './controllers'), controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths,
        proxy: config.proxy,
        bindIP: config.bindIP,
        headers: config.headers,
        actionFilters: [
            (req, res, context: MyServierContext) => {
                let settings: Settings = {
                    clientStaticRoot: staticRootDirectory,
                    innerStaticRoot: innerStaticRootDirectory,
                    root: config.rootDirectory,
                }

                context.settings = settings;
                return null;
            }
        ]
    });
}


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