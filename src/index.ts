import { startServer, Config as NodeMVCConfig } from 'maishu-node-mvc'
import { errors } from './errors';
import path = require('path')
import fs = require("fs");
import { Settings, MyServerContext } from './settings';
import { CliApplication } from "typedoc";

export { settings, Settings } from "./settings";

export interface Config {
    port: number,
    rootDirectory: string,
    sourceDirectory?: string,
    proxy?: NodeMVCConfig["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    headers?: NodeMVCConfig["headers"],
    actionFilters?: NodeMVCConfig["actionFilters"]
}

export function start(config: Config) {

    if (!config.rootDirectory)
        throw errors.settingItemNull<Config>("rootDirectory");

    if (!path.isAbsolute(config.rootDirectory))
        throw errors.notAbsolutePath(config.rootDirectory);

    if (!fs.existsSync(config.rootDirectory))
        throw errors.pathNotExists(config.rootDirectory);

    let staticRootDirectory = path.join(config.rootDirectory, "static")
    if (!fs.existsSync(staticRootDirectory))
        throw errors.pathNotExists(staticRootDirectory);

    let controllerPath: string;
    if (fs.existsSync(path.join(config.rootDirectory, "controllers")))
        controllerPath = path.join(config.rootDirectory, "controllers");

    let innerStaticRootDirectory = path.join(__dirname, "static");
    let virtualPaths = createVirtulaPaths(innerStaticRootDirectory, staticRootDirectory);
    virtualPaths["assert"] = path.join(innerStaticRootDirectory, "assert");

    //======================================================================================
    // 生成文档
    if (config.sourceDirectory) {
        if (!path.isAbsolute(config.sourceDirectory))
            throw errors.notAbsolutePath(config.sourceDirectory);

        let tsconfigPath = path.join(config.sourceDirectory, "tsconfig.json");
        if (fs.existsSync(tsconfigPath)) {
            // let docsPath = path.join(sourceDirectory, outDir, "docs");
            let docsPath = generateDocuments(config.sourceDirectory, tsconfigPath);
            virtualPaths["docs"] = docsPath;
        }

        // let staticSourcePath = path.join(config.sourceDirectory, "static");
        // let staticTsconfigPath = path.join(staticSourcePath, "tsconfig.json");
        // if (fs.existsSync(staticTsconfigPath)) {
        //     let docsPath = generateDocuments(staticSourcePath, staticTsconfigPath);
        //     console.log(`static document path is ${docsPath}`);
        //     virtualPaths["docs/static"] = docsPath;
        // }
    }
    //======================================================================================


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
            (req, res, context: MyServerContext) => {
                let settings: Settings = {
                    clientStaticRoot: staticRootDirectory,
                    innerStaticRoot: innerStaticRootDirectory,
                    root: config.rootDirectory,
                }

                context.settings = settings;
                return null;
            },
            ...(config.actionFilters || [])
        ]
    });
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
    // virtualPaths["docs"] = docsPath;
    return docsPath;
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