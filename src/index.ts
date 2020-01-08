import { startServer, VirtualDirectory } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { registerStation } from './global';

export { Settings, ServerContextData } from "./settings";
export { WebsiteConfig, PermissionConfig, PermissionConfigItem, SimpleMenuItem, RequireConfig } from "./static/types";
export { StationInfo } from "./global";

export function start(settings: Settings) {

    if (!settings.rootDirectory)
        throw errors.settingItemNull<Settings>("rootDirectory");

    let rootDirectory: VirtualDirectory;
    if (typeof settings.rootDirectory == "string") {
        if (!path.isAbsolute(settings.rootDirectory))
            throw errors.notAbsolutePath(settings.rootDirectory);

        if (!fs.existsSync(settings.rootDirectory))
            throw errors.pathNotExists(settings.rootDirectory);

        rootDirectory = new VirtualDirectory(__dirname, settings.rootDirectory);
    }
    else {
        rootDirectory = settings.rootDirectory;
    }

    let staticRootDirectory = rootDirectory.getDirectory("static");
    let controllerDirectory = rootDirectory.getDirectory("controllers");
    controllerDirectory.addVirtualFile("admin-home-controller", path.join(__dirname, "controller.js"))


    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);


    // let staticRootDirectory = path.join(settings.rootDirectory, "static")
    // if (!fs.existsSync(staticRootDirectory))
    //     throw errors.pathNotExists(staticRootDirectory);


    // let controllerPath: string;
    // if (fs.existsSync(path.join(settings.rootDirectory, "controllers")))
    //     controllerPath = path.join(settings.rootDirectory, "controllers");

    // let staticPath: string;
    // if (fs.existsSync(path.join(settings.rootDirectory, "static"))) {
    //     staticPath = path.join(settings.rootDirectory, "static");
    // }

    // let innerStaticRootDirectory = path.join(__dirname, "static");
    let virtualPaths = {};
    virtualPaths["asset"] = path.join(__dirname, "static/asset");
    virtualPaths["json.js"] = path.join(__dirname, "static/asset/lib/requirejs-plugins/src/json.js");
    //======================================================================================
    // 生成文档
    // if (settings.sourceDirectory) {
    //     if (!path.isAbsolute(settings.sourceDirectory))
    //         throw errors.notAbsolutePath(settings.sourceDirectory);

    //     let tsconfigPath = path.join(settings.sourceDirectory, "tsconfig.json");
    //     if (fs.existsSync(tsconfigPath)) {
    //         let docsPath = generateDocuments(settings.sourceDirectory, tsconfigPath);
    //         virtualPaths["docs"] = docsPath;
    //     }
    // }
    //======================================================================================

    virtualPaths = Object.assign(settings.virtualPaths || {}, virtualPaths);

    for (let key in virtualPaths) {
        let physicalPath = virtualPaths[key];
        if (/\.[a-zA-Z]+$/.test(physicalPath)) {
            staticRootDirectory.addVirtualFile(key, physicalPath)
        }
        else {
            staticRootDirectory.addVirtualDirectory(key, physicalPath, "merge");
        }
    }

    let serverContextData: ServerContextData = {
        staticRoot: staticRootDirectory,
        rootDirectory: rootDirectory,
        // clientStaticRoot: path.join(settings.rootDirectory, "static"),
        station: settings.station,
        requirejs: settings.requirejs,
    };

    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);

    startServer({
        port: settings.port,
        staticRootDirectory: staticRootDirectory,
        controllerDirectory: controllerDirectory,
        // virtualPaths,
        proxy: settings.proxy,
        bindIP: settings.bindIP,
        headers: settings.headers,
        serverContextData: serverContextData
    });

    if (settings.station != null) {
        registerStation(serverContextData, settings);
    }
}




