import { startServer, VirtualDirectory, createVirtualDirecotry } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { registerStation, STATIC, CONTROLLERS, LIB } from './global';
import { createDatabaseIfNotExists, getConnectionManager, createConnection, ConnectionOptions } from "maishu-node-data";
import { StaticFileRequestProcessor } from '../../node-mvc/node_modules/maishu-node-web-server/out';
import { createJavascriptFileProcessor } from './file-processors/javascript';
import { createLessFileProcessor } from './file-processors/less';
import { pathConcat } from 'maishu-node-web-server';


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

    rootDirectory = createVirtualDirecotry(__dirname, ...rootPhysicalPaths);//new VirtualDirectory(__dirname); //

    let staticRootDirectory = rootDirectory.findDirectory(`/${STATIC}`);
    let controllerDirectory = rootDirectory.findDirectory(`/${CONTROLLERS}`);
    staticRootDirectory.addPath(`/${LIB}`, path.join(__dirname, "../lib"));

    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);

    let virtualPaths = settings.virtualPaths;
    for (let virtualPath in virtualPaths) {
        let physicalPath = virtualPaths[virtualPath];
        // if (/\.[a-zA-Z]+$/.test(physicalPath)) {    // 如果名称是文件名 *.abc
        //     staticRootDirectory.addVirtualFile(key, physicalPath)
        // }
        // else {
        //     staticRootDirectory.addVirtualDirectory(key, physicalPath, "merge");
        // }
        if (virtualPath[0] != "/")
            virtualPath = "/" + virtualPath;

        staticRootDirectory.addPath(virtualPath, physicalPath)
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
    // await createDatabase(settings, rootDirectory);

    let server = startServer({
        port: settings.port,
        staticRootDirectory: staticRootDirectory,
        controllerDirectory,
        proxy: settings.proxy,
        bindIP: settings.bindIP,
        headers: settings.headers,
        serverContextData: serverContextData,

    });

    if (settings.station != null) {
        registerStation(serverContextData, settings);
    }

    let p = server.requestProcessors.filter(o => o instanceof StaticFileRequestProcessor)[0] as StaticFileRequestProcessor;
    if (p) {
        let jsProcessor = createJavascriptFileProcessor(staticRootDirectory, settings.commonjsToAmd);
        p.fileProcessors["js"] = jsProcessor;

        let lessProcessor = createLessFileProcessor(pathConcat(__dirname, "../src/static"));
        p.fileProcessors["less"] = lessProcessor;
    }

    return server;
}





