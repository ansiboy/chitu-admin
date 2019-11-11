import { createParameterDecorator, LogLevel } from "maishu-node-mvc";
import { ServerContext } from "maishu-node-mvc";
import { startServer, Settings as NodeMVCConfig } from 'maishu-node-mvc'
import { PermissionConfig } from "./static/types";

export interface MyServerContext extends ServerContext {
    settings: Settings & {
        innerStaticRoot: string;
        clientStaticRoot: string;
    }
}

export interface Settings {
    port: number,
    rootDirectory: string,
    sourceDirectory?: string,
    proxy?: NodeMVCConfig["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    headers?: NodeMVCConfig["headers"],
    actionFilters?: NodeMVCConfig["actionFilters"],
    logLevel?: LogLevel,
    station?: {
        // 网关地址
        gateway: string,
        // 站点的路径
        path: string,
        permissions?: PermissionConfig
    }
    // gateway: string,
}

export let settings = createParameterDecorator(async (req, res, context: MyServerContext) => {
    return context.settings;
})

