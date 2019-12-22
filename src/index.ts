import { startServer, getLogger } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { CliApplication } from "typedoc";
import { g, registerStation } from './global';

export { Settings, ServerContextData } from "./settings";
export { WebsiteConfig, PermissionConfig, PermissionConfigItem, SimpleMenuItem, RequireConfig } from "./static/types";
export { StationInfo } from "./global";

export function start(settings: Settings) {

    if (!settings.rootDirectory)
        throw errors.settingItemNull<Settings>("rootDirectory");

    if (!path.isAbsolute(settings.rootDirectory))
        throw errors.notAbsolutePath(settings.rootDirectory);

    if (!fs.existsSync(settings.rootDirectory))
        throw errors.pathNotExists(settings.rootDirectory);

    let staticRootDirectory = path.join(settings.rootDirectory, "static")
    if (!fs.existsSync(staticRootDirectory))
        throw errors.pathNotExists(staticRootDirectory);

    g.settings = settings;

    let controllerPath: string;
    if (fs.existsSync(path.join(settings.rootDirectory, "controllers")))
        controllerPath = path.join(settings.rootDirectory, "controllers");

    let innerStaticRootDirectory = path.join(__dirname, "static");
    let virtualPaths = {};// createVirtulaPaths(innerStaticRootDirectory, staticRootDirectory);
    virtualPaths["asset"] = path.join(innerStaticRootDirectory, "asset");
    virtualPaths["json.js"] = path.join(innerStaticRootDirectory, "asset/lib/requirejs-plugins/src/json.js");
    //======================================================================================
    // 生成文档
    if (settings.sourceDirectory) {
        if (!path.isAbsolute(settings.sourceDirectory))
            throw errors.notAbsolutePath(settings.sourceDirectory);

        let tsconfigPath = path.join(settings.sourceDirectory, "tsconfig.json");
        if (fs.existsSync(tsconfigPath)) {
            let docsPath = generateDocuments(settings.sourceDirectory, tsconfigPath);
            virtualPaths["docs"] = docsPath;
        }
    }
    //======================================================================================

    virtualPaths = Object.assign(settings.virtualPaths || {}, virtualPaths);

    let serverContextData: ServerContextData = {
        innerStaticRoot: innerStaticRootDirectory,
        clientStaticRoot: staticRootDirectory,
        rootDirectory: settings.rootDirectory,
        station: settings.station,
        requirejs: settings.requirejs,
    };

    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);

    // let setServerContext = false;
    startServer({
        port: settings.port,
        staticRootDirectory: staticRootDirectory,
        controllerDirectory: controllerPath ? [path.join(__dirname, './controllers'), controllerPath] : [path.join(__dirname, './controllers')],
        virtualPaths,
        proxy: settings.proxy,
        bindIP: settings.bindIP,
        headers: settings.headers,
        serverContextData: serverContextData
    });

    if (settings.station != null) {
        registerStation(serverContextData, settings);
    }
}

function generateDocuments(sourceDirectory: string, tsconfigPath: string) {
    let tsconfig = require(tsconfigPath) as { compilerOptions: { outDir: string } };
    console.assert(tsconfig != null);
    console.assert(tsconfig.compilerOptions != null);
    let outDir = tsconfig.compilerOptions.outDir || "./";
    console.assert(path.isAbsolute(outDir) == false);

    let docsPath = path.join(sourceDirectory, outDir, "docs");
    let jsonPath = path.join(docsPath, "api.json");
    new CliApplication({
        "out": docsPath,
        "json": jsonPath,
        "excludePrivate": true,
        "excludeProtected": true,
        "tsconfig": tsconfigPath
    });
    return docsPath;
}

/**
 * 
 * @param rootAbsolutePath 项目根目录
 * @param clientRootAbsolutePath 静态文件根目录
 */
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
