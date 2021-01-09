"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const maishu_node_mvc_1 = require("maishu-node-mvc");
const errors_1 = require("./errors");
const path = require("path");
const fs = require("fs");
const global_1 = require("./global");
var decoders_1 = require("./decoders");
exports.currentAppId = decoders_1.currentAppId;
exports.currentUserId = decoders_1.currentUserId;
var js_transform_1 = require("./js-transform");
exports.commonjsToAmd = js_transform_1.commonjsToAmd;
function start(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!settings.rootPhysicalPath)
            throw errors_1.errors.settingItemNull("rootPhysicalPath");
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
        let rootDirectory = new maishu_node_mvc_1.VirtualDirectory(rootPhysicalPaths[0]);
        let controllerDirectory = rootDirectory.findDirectory(`/${global_1.CONTROLLERS}`);
        let staticRootDirectory = rootDirectory.findDirectory(`/${global_1.STATIC}`);
        if (staticRootDirectory != null)
            mergeVirtualDirecotries(staticRootDirectory, path.join(__dirname, "static"));
        else {
            rootDirectory.setPath("static", path.join(__dirname, "static"));
            staticRootDirectory = rootDirectory.findDirectory(`/${global_1.STATIC}`);
        }
        if (controllerDirectory) {
            mergeVirtualDirecotries(controllerDirectory, path.join(__dirname, "controllers"));
        }
        else {
            rootDirectory.setPath("controllers", path.join(__dirname, "controllers"));
            controllerDirectory = rootDirectory.findDirectory(`/${global_1.CONTROLLERS}`);
        }
        console.assert(staticRootDirectory != null);
        staticRootDirectory.setPath(`/${global_1.LIB}`, path.join(__dirname, "lib"));
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
        // let childFiles = rootDirectory.files();
        // let entitiesPhysicalPath = childFiles["entities.js"];
        // if (settings.db != null && entitiesPhysicalPath != null) {
        //     let connectionManager = getConnectionManager();
        //     await createDatabaseIfNotExists(settings.db);
        //     if (!connectionManager.has(settings.db.database)) {
        //         let entities = [entitiesPhysicalPath];
        //         let dbOptions = Object.assign({
        //             type: "mysql", synchronize: true, logging: false,
        //             connectTimeout: 3000, entities, name: settings.db.database,
        //             username: settings.db.user, password: settings.db.password
        //         } as ConnectionOptions, settings.db);
        //         let conn = await createConnection(dbOptions);
        //         let mod = require(entitiesPhysicalPath);
        //         if (typeof mod.default == "function") {
        //             mod.default(conn);
        //         }
        //     }
        // }
        let serverContextData = {
            staticRoot: staticRootDirectory,
            rootDirectory: rootDirectory,
            station: settings.station,
            websiteConfig: settings.websiteConfig,
        };
        serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);
        let server = maishu_node_mvc_1.startServer({
            port: settings.port,
            bindIP: settings.bindIP,
            virtualPaths: settings.virtualPaths,
            serverContextData,
            websiteDirectory: rootDirectory,
            proxy: settings.proxy,
        });
        var staticProcessor = server.requestProcessors.find(maishu_node_mvc_1.StaticFileProcessor);
        staticProcessor.contentTypes[".less"] = "plain/text";
        let mvcProcessor = server.requestProcessors.find(maishu_node_mvc_1.MVCRequestProcessor);
        mvcProcessor.controllerDirectories = ["controllers"];
        if (settings.station != null) {
            global_1.registerStation(serverContextData, settings);
        }
        return server;
    });
}
exports.start = start;
function mergeVirtualDirecotries(root, ...physicalPaths) {
    if (physicalPaths == null || physicalPaths.length == 0)
        throw errors_1.errors.argumentNull("physicalPaths");
    // let root = new VirtualDirectory(physicalPaths[0]);
    if (physicalPaths == null || physicalPaths.length == 0)
        return root;
    let dirStack = [...physicalPaths.map(o => ({ physicalPath: o, virtualPath: "/" }))];
    while (dirStack.length > 0) {
        let item = dirStack.pop();
        if (item == null)
            continue;
        let names = fs.readdirSync(item.physicalPath);
        for (let i = 0; i < names.length; i++) {
            if (names[i] == "node_modules")
                continue;
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
