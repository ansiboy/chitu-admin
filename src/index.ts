import { startServer, VirtualDirectory, getLogger } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { registerStation, PROJECT_NAME } from './global';
import { DataHelper, createDatabaseIfNotExists, getConnectionManager, createConnection, ConnectionOptions } from "maishu-data";
import { ConnectionConfig } from "mysql";


export { Settings, ServerContextData } from "./settings";
export { WebsiteConfig, PermissionConfig, PermissionConfigItem, SimpleMenuItem, RequireConfig } from "./static/types";
export { StationInfo } from "./global";

export async function start(settings: Settings) {

    if (!settings.rootDirectory)
        throw errors.settingItemNull<Settings>("rootDirectory");

    let rootDirectory: VirtualDirectory;
    if (!path.isAbsolute(settings.rootDirectory))
        throw errors.notAbsolutePath(settings.rootDirectory);

    if (!fs.existsSync(settings.rootDirectory))
        throw errors.pathNotExists(settings.rootDirectory);

    rootDirectory = new VirtualDirectory(__dirname, settings.rootDirectory);

    let staticRootDirectory = rootDirectory.getDirectory("static");
    let controllerDirectory = rootDirectory.getDirectory("controllers");

    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);

    let virtualPaths = {};
    virtualPaths["asset"] = path.join(__dirname, "static/asset");
    virtualPaths["json.js"] = path.join(__dirname, "static/asset/lib/requirejs-plugins/src/json.js");

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
    if (childFiles["data-context.js"]) {
        let mod = require(childFiles["data-context.js"]);
        console.assert(mod.default != null);
        if (childFiles["entities.js"]) {
            DataHelper.createDataContext(mod.default, settings.db, childFiles["entities.js"]);
        }
        else {
            DataHelper.createDataContext(mod.default, settings.db);
        }
    }


    let serverContextData: ServerContextData = {
        staticRoot: staticRootDirectory,
        rootDirectory: rootDirectory,
        station: settings.station,
        requirejs: settings.requirejs,
    };

    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);
    await createDatabase(settings, rootDirectory);

    startServer({
        port: settings.port,
        staticRootDirectory,
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

async function createDatabase(settings: Settings, rootDirectory: VirtualDirectory) {

    if (!settings.db) {
        return;
    }

    let contextFileName = "data-context.js";
    let entitiesFileName = "entities.js";
    let files = rootDirectory.getChildFiles();
    let logger = getLogger(PROJECT_NAME, settings.logLevel);
    if (files[contextFileName] == null) {
        logger.info(`File ${contextFileName} is not exists.`)
        return;
    }

    if (files[entitiesFileName] == null) {
        logger.info(`File ${entitiesFileName} is not exists.`);
        return;
    }

    let entitiesModule = require(files[entitiesFileName]);
    await createDatabaseIfNotExists(settings.db);
    await createDataConnection(settings.db, files[entitiesFileName]);

    if (entitiesModule["init"]) {
        entitiesModule["init"](settings.db)
    }
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




