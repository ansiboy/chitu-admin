import { startServer, VirtualDirectory, getLogger } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { registerStation, PROJECT_NAME } from './global';
import { DataHelper, createDatabaseIfNotExists, getConnectionManager, createConnection, ConnectionOptions } from "maishu-node-data";
import { ConnectionConfig } from "mysql";


export { Settings, ServerContextData } from "./settings";
export { WebsiteConfig, PermissionConfig, PermissionConfigItem, SimpleMenuItem, RequireConfig } from "./static/types";
export { StationInfo } from "./global";

export async function start(settings: Settings) {

    if (!settings.rootPhysicalPath)
        throw errors.settingItemNull<Settings>("rootPhysicalPath");

    let rootDirectory: VirtualDirectory;
    if (!path.isAbsolute(settings.rootPhysicalPath))
        throw errors.notAbsolutePath(settings.rootPhysicalPath);

    if (!fs.existsSync(settings.rootPhysicalPath))
        throw errors.pathNotExists(settings.rootPhysicalPath);

    rootDirectory = new VirtualDirectory(__dirname, settings.rootPhysicalPath);

    let staticRootDirectory = rootDirectory.getDirectory("static");
    let controllerDirectory = rootDirectory.getDirectory("controllers");
    staticRootDirectory.addVirtualDirectory("lib", path.join(__dirname, "../lib"), "merge");

    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);

    let virtualPaths = {};

    virtualPaths = Object.assign(settings.virtualPaths || {}, virtualPaths);

    for (let key in virtualPaths) {
        let physicalPath = virtualPaths[key];
        if (/\.[a-zA-Z]+$/.test(physicalPath)) {    // 如果名称是文件名 *.abc
            staticRootDirectory.addVirtualFile(key, physicalPath)
        }
        else {
            staticRootDirectory.addVirtualDirectory(key, physicalPath, "merge");
        }
    }

    //处理数据库文件
    let childFiles = rootDirectory.getChildFiles();
    if (settings.db != null && childFiles["entities.js"] != null) {
        let connectionManager = getConnectionManager();
debugger
        await createDatabaseIfNotExists(settings.db);
        if (!connectionManager.has(settings.db.database)) {
            let entities = [childFiles["entities.js"]];
            let dbOptions: ConnectionOptions = {
                type: "mysql",
                host: settings.db.host,
                port: settings.db.port,
                username: settings.db.user,
                password: settings.db.password,
                database: settings.db.database,
                synchronize: true,
                logging: false,
                connectTimeout: 3000,
                entities,
                name: settings.db.database
            };
            await createConnection(dbOptions);
        }
    }


    let serverContextData: ServerContextData = {
        staticRoot: staticRootDirectory,
        rootDirectory: rootDirectory,
        station: settings.station,
        requirejs: settings.requirejs,
    };

    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);
    // await createDatabase(settings, rootDirectory);

    startServer({
        port: settings.port,
        staticDirectory: staticRootDirectory,
        controllerDirectory,
        proxy: settings.proxy,
        bindIP: settings.bindIP,
        headers: settings.headers,
        serverContextData: serverContextData
    });

    if (settings.station != null) {
        registerStation(serverContextData, settings);
    }

    return { rootDirectory }
}

async function createDataConnection(connConfig: ConnectionConfig, entitiesPath: string) {
    let connectionManager = getConnectionManager();
    if (connectionManager.has(connConfig.database) == false) {
        let entities: string[] = [entitiesPath];
        let dbOptions: ConnectionOptions = {
            type: "mysql",
            host: connConfig.host,
            port: connConfig.port,
            username: connConfig.user,
            password: connConfig.password,
            database: connConfig.database,
            synchronize: true,
            logging: false,
            connectTimeout: 3000,
            entities,
            name: connConfig.database
        }

        await createConnection(dbOptions);
    }

}




