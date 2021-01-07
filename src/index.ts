import { startServer, VirtualDirectory, StaticFileProcessor, pathConcat } from 'maishu-node-mvc';
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { registerStation, STATIC, CONTROLLERS, LIB } from './global';
import { createDatabaseIfNotExists, getConnectionManager, createConnection, ConnectionOptions } from "maishu-node-data";
import { JavascriptTransform } from './file-processors/javascript';
import { MVCRequestProcessor } from "maishu-nws-mvc";

export { Settings, ServerContextData } from "./settings";
export { WebsiteConfig, PermissionConfig, PermissionConfigItem, SimpleMenuItem, RequireConfig } from "./static/types";
export { StationInfo } from "./global";
export { currentAppId, currentUserId } from "./decoders";
export { commonjsToAmd } from "./js-transform";


export async function start(settings: Settings) {

    if (!settings.rootPhysicalPath)
        throw errors.settingItemNull<Settings>("rootPhysicalPath");

    let rootDirectory: VirtualDirectory;
    let rootPhysicalPaths: string[];
    if (typeof settings.rootPhysicalPath == "string")
        rootPhysicalPaths = [settings.rootPhysicalPath];
    else
        rootPhysicalPaths = settings.rootPhysicalPath;

    for (let i = 0; i < rootPhysicalPaths.length; i++) {
        if (!path.isAbsolute(rootPhysicalPaths[i]))
            throw errors.notAbsolutePath(rootPhysicalPaths[i]);

        if (!fs.existsSync(rootPhysicalPaths[i]))
            throw errors.pathNotExists(rootPhysicalPaths[i]);
    }

    rootDirectory = mergeVirtualDirecotries(__dirname, ...rootPhysicalPaths);

    let staticRootDirectory = rootDirectory.findDirectory(`/${STATIC}`);
    let controllerDirectory = rootDirectory.findDirectory(`/${CONTROLLERS}`);
    staticRootDirectory.setPath(`/${LIB}`, path.join(__dirname, "../lib"));
    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);

    let virtualPaths = settings.virtualPaths;
    for (let virtualPath in virtualPaths) {
        let physicalPath = virtualPaths[virtualPath];
        if (virtualPath[0] != "/")
            virtualPath = "/" + virtualPath;

        staticRootDirectory.setPath(virtualPath, physicalPath)
    }

    //处理数据库文件
    let childFiles = rootDirectory.files();
    let entitiesPhysicalPath = childFiles["entities.js"];
    if (settings.db != null && entitiesPhysicalPath != null) {
        let connectionManager = getConnectionManager();

        await createDatabaseIfNotExists(settings.db);
        if (!connectionManager.has(settings.db.database)) {
            let entities = [entitiesPhysicalPath];
            let dbOptions = Object.assign({
                type: "mysql", synchronize: true, logging: false,
                connectTimeout: 3000, entities, name: settings.db.database,
                username: settings.db.user, password: settings.db.password
            } as ConnectionOptions, settings.db);
            let conn = await createConnection(dbOptions);
            let mod = require(entitiesPhysicalPath);
            if (typeof mod.default == "function") {
                mod.default(conn);
            }

        }
    }

    settings.commonjsToAmd = settings.commonjsToAmd || [];
    settings.commonjsToAmd.push(`\\S*/${STATIC}/\\S*.js`);
    settings.commonjsToAmd.push(`\\S*/maishu-\\S*/out/\\S*.js`);

    let serverContextData: ServerContextData = {
        staticRoot: staticRootDirectory,
        rootDirectory: rootDirectory,
        station: settings.station,
        websiteConfig: settings.websiteConfig,
        commonjsToAmd: settings.commonjsToAmd,

    };

    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);
    let server = startServer({
        port: settings.port,
        bindIP: settings.bindIP,
        virtualPaths: settings.virtualPaths,
        serverContextData,
        websiteDirectory: rootDirectory
    })

    var staticProcessor = server.requestProcessors.find(StaticFileProcessor);
    staticProcessor.contentTypes[".less"] = "plain/text";
    
    // server.contentTransforms.push(new JavascriptTransform(settings.commonjsToAmd));
    let mvcProcessor = server.requestProcessors.find(MVCRequestProcessor);
    mvcProcessor.controllerDirectories = ["controllers"];

    if (settings.station != null) {
        registerStation(serverContextData, settings);
    }

    return server;
}


export function mergeVirtualDirecotries(...physicalPaths: string[]) {
    if (physicalPaths == null || physicalPaths.length == 0)
        throw errors.argumentNull("physicalPaths");

    let root = new VirtualDirectory(physicalPaths[0]);
    if (physicalPaths.length == 1)
        return root;

    let dirStack = [...physicalPaths.filter((o, i) => i > 0).map(o => ({ physicalPath: o, virtualPath: "/" }))];
    while (dirStack.length > 0) {
        let item = dirStack.pop();
        if (item == null)
            continue;

        let names = fs.readdirSync(item.physicalPath);
        for (let i = 0; i < names.length; i++) {
            let physicalPath = pathConcat(item.physicalPath, names[i]);
            let virtualPath = pathConcat(item.virtualPath, names[i]);



            if (fs.statSync(physicalPath).isFile()) {
                root.setPath(virtualPath, physicalPath);
            }
            else if (fs.statSync(physicalPath).isDirectory()) {
                dirStack.push({ physicalPath, virtualPath });
            }

            // if (fs.statSync(physicalPath).isDirectory()) {
            //     var dir = root.findDirectory(virtualPath);
            //     if (!dir) {
            //         root.setPath(virtualPath, physicalPath);
            //     }

            //     dirStack.push({ physicalPath, virtualPath });
            // }
            // else {
            //     root.setPath(virtualPath, physicalPath);
            // }
        }
    }

    return root;

}


