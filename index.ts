import { startServer, VirtualDirectory, StaticFileProcessor, pathConcat, MVCRequestProcessor } from 'maishu-node-mvc';
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, ServerContextData } from './settings';
import { registerStation, STATIC, CONTROLLERS, LIB } from './global';
import { getVirtualPaths } from "maishu-admin-scaffold";

export { Settings, ServerContextData } from "./settings";
export { WebsiteConfig, PermissionConfig, PermissionConfigItem, SimpleMenuItem, RequireConfig } from "./static/types";
export { StationInfo } from "./global";
export { currentAppId, currentUserId } from "./decoders";

export async function start(settings: Settings) {

    if (typeof (settings as any)["rootPhysicalPath"] == "string")
        settings.rootDirectory = new VirtualDirectory((settings as any)["rootPhysicalPath"]);

    if (!settings.rootDirectory)
        throw errors.settingItemNull<Settings>("rootDirectory");

    // let rootPhysicalPaths: string[];
    // if (typeof settings.rootPhysicalPath == "string")
    //     rootPhysicalPaths = [settings.rootPhysicalPath];
    // else
    //     rootPhysicalPaths = settings.rootPhysicalPath;

    // for (let i = 0; i < rootPhysicalPaths.length; i++) {
    //     if (!path.isAbsolute(rootPhysicalPaths[i]))
    //         throw errors.notAbsolutePath(rootPhysicalPaths[i]);

    //     if (!fs.existsSync(rootPhysicalPaths[i]))
    //         throw errors.pathNotExists(rootPhysicalPaths[i]);
    // }

    let rootDirectory: VirtualDirectory = settings.rootDirectory; //new VirtualDirectory(rootPhysicalPaths[0]);
    let controllerDirectory = rootDirectory.findDirectory(`/${CONTROLLERS}`);
    let staticRootDirectory = rootDirectory.findDirectory(`/${STATIC}`);

    if (staticRootDirectory != null)
        mergeVirtualDirecotries(staticRootDirectory, path.join(__dirname, "static"));
    else {
        rootDirectory.setPath("static", path.join(__dirname, "static"));
        staticRootDirectory = rootDirectory.findDirectory(`/${STATIC}`);
    }

    if (controllerDirectory) {
        mergeVirtualDirecotries(controllerDirectory, path.join(__dirname, "controllers"));
    }
    else {
        rootDirectory.setPath("controllers", path.join(__dirname, "controllers"));
        controllerDirectory = rootDirectory.findDirectory(`/${CONTROLLERS}`);
    }

    if (staticRootDirectory == null)
        throw errors.staticDirectoryNotExists();

    staticRootDirectory.setPath(`/${LIB}`, path.join(__dirname, "lib"));
    console.assert(staticRootDirectory != null);
    console.assert(controllerDirectory != null);

    let virtualPaths = settings.virtualPaths;
    for (let virtualPath in virtualPaths) {
        let physicalPath = virtualPaths[virtualPath];
        if (virtualPath[0] != "/")
            virtualPath = "/" + virtualPath;

        staticRootDirectory.setPath(virtualPath, physicalPath)
    }

    let scVirtualPaths = getVirtualPaths("static", path.join(__dirname, "static"));
    virtualPaths = Object.assign(scVirtualPaths, virtualPaths);

    let serverContextData: ServerContextData = {
        staticRoot: staticRootDirectory,
        rootDirectory: rootDirectory,
        station: settings.station,
        websiteConfig: settings.websiteConfig,
    };

    serverContextData = Object.assign(settings.serverContextData || {}, serverContextData);
    let server = startServer({
        port: settings.port,
        bindIP: settings.bindIP,
        virtualPaths: virtualPaths,
        serverContextData,
        websiteDirectory: rootDirectory,
        proxy: settings.proxy,
        headers: settings.headers,
    }, "mvc")

    var staticProcessor = server.requestProcessors.find(StaticFileProcessor);
    staticProcessor.contentTypes[".less"] = "plain/text";

    let mvcProcessor = server.requestProcessors.find(MVCRequestProcessor);
    mvcProcessor.controllerDirectories = ["controllers"];

    if (settings.station != null) {
        registerStation(serverContextData, settings);
    }

    return server;
}


export function mergeVirtualDirecotries(root: VirtualDirectory, ...physicalPaths: string[]) {
    if (physicalPaths == null || physicalPaths.length == 0)
        throw errors.argumentNull("physicalPaths");

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


