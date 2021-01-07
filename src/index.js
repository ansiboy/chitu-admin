"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
const errors_1 = require("./errors");
const path = require("path");
const fs = require("fs");
const global_1 = require("./global");
const maishu_node_data_1 = require("maishu-node-data");
const maishu_nws_mvc_1 = require("maishu-nws-mvc");
var decoders_1 = require("./decoders");
exports.currentAppId = decoders_1.currentAppId;
exports.currentUserId = decoders_1.currentUserId;
var js_transform_1 = require("./js-transform");
exports.commonjsToAmd = js_transform_1.commonjsToAmd;
async function start(settings) {
    if (!settings.rootPhysicalPath)
        throw errors_1.errors.settingItemNull("rootPhysicalPath");
    let rootDirectory;
    let rootPhysicalPaths;
    if (typeof settings.rootPhysicalPath == "string")
        rootPhysicalPaths = [settings.rootPhysicalPath];
    else
        rootPhysicalPaths = settings.rootPhysicalPath;
    for (let i = 0; i < rootPhysicalPaths.length; i++) {
        if (!path.isAbsolute(rootPhysicalPaths[i]))
            throw errors_1.errors.notAbsolutePath(rootPhysicalPaths[i]);
        if (!fs.existsSync(rootPhysicalPaths[i]))
            throw errors_1.errors.pathNotExists(rootPhysicalPaths[i]);
    }
    rootDirectory = mergeVirtualDirecotries(__dirname, ...rootPhysicalPaths);
    let staticRootDirectory = rootDirectory.findDirectory(`/${global_1.STATIC}`);
    let controllerDirectory = rootDirectory.findDirectory(`/${global_1.CONTROLLERS}`);
    staticRootDirectory.setPath(`/${global_1.LIB}`, path.join(__dirname, "../lib"));
    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);
    let virtualPaths = settings.virtualPaths;
    for (let virtualPath in virtualPaths) {
        let physicalPath = virtualPaths[virtualPath];
        if (virtualPath[0] != "/")
            virtualPath = "/" + virtualPath;
        staticRootDirectory.setPath(virtualPath, physicalPath);
    }
    //处理数据库文件
    let childFiles = rootDirectory.files();
    let entitiesPhysicalPath = childFiles["entities.js"];
    if (settings.db != null && entitiesPhysicalPath != null) {
        let connectionManager = maishu_node_data_1.getConnectionManager();
        await maishu_node_data_1.createDatabaseIfNotExists(settings.db);
        if (!connectionManager.has(settings.db.database)) {
            let entities = [entitiesPhysicalPath];
            let dbOptions = Object.assign({
                type: "mysql", synchronize: true, logging: false,
                connectTimeout: 3000, entities, name: settings.db.database,
                username: settings.db.user, password: settings.db.password
            }, settings.db);
            let conn = await maishu_node_data_1.createConnection(dbOptions);
            let mod = require(entitiesPhysicalPath);
            if (typeof mod.default == "function") {
                mod.default(conn);
            }
        }
    }
    settings.commonjsToAmd = settings.commonjsToAmd || [];
    settings.commonjsToAmd.push(`\\S*/${global_1.STATIC}/\\S*.js`);
    settings.commonjsToAmd.push(`\\S*/maishu-\\S*/out/\\S*.js`);
    let serverContextData = {
        staticRoot: staticRootDirectory,
        rootDirectory: rootDirectory,
        station: settings.station,
        websiteConfig: settings.websiteConfig,
        commonjsToAmd: settings.commonjsToAmd,
    };
    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);
    let server = maishu_node_mvc_1.startServer({
        port: settings.port,
        bindIP: settings.bindIP,
        virtualPaths: settings.virtualPaths,
        serverContextData,
        websiteDirectory: rootDirectory
    });
    var staticProcessor = server.requestProcessors.find(maishu_node_mvc_1.StaticFileProcessor);
    staticProcessor.contentTypes[".less"] = "plain/text";
    // server.contentTransforms.push(new JavascriptTransform(settings.commonjsToAmd));
    let mvcProcessor = server.requestProcessors.find(maishu_nws_mvc_1.MVCRequestProcessor);
    mvcProcessor.controllerDirectories = ["controllers"];
    if (settings.station != null) {
        global_1.registerStation(serverContextData, settings);
    }
    return server;
}
exports.start = start;
function mergeVirtualDirecotries(...physicalPaths) {
    if (physicalPaths == null || physicalPaths.length == 0)
        throw errors_1.errors.argumentNull("physicalPaths");
    let root = new maishu_node_mvc_1.VirtualDirectory(physicalPaths[0]);
    if (physicalPaths.length == 1)
        return root;
    let dirStack = [...physicalPaths.filter((o, i) => i > 0).map(o => ({ physicalPath: o, virtualPath: "/" }))];
    while (dirStack.length > 0) {
        let item = dirStack.pop();
        if (item == null)
            continue;
        let names = fs.readdirSync(item.physicalPath);
        for (let i = 0; i < names.length; i++) {
            let physicalPath = maishu_node_mvc_1.pathConcat(item.physicalPath, names[i]);
            let virtualPath = maishu_node_mvc_1.pathConcat(item.virtualPath, names[i]);
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
exports.mergeVirtualDirecotries = mergeVirtualDirecotries;
