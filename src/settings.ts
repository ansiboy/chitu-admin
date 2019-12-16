import { createParameterDecorator, LogLevel } from "maishu-node-mvc";
import { ServerContext as BaseServerContext } from "maishu-node-mvc";
import { Settings as NodeMVCConfig } from 'maishu-node-mvc'
import { PermissionConfig } from "./static/types";

export interface ServerContext<T> extends BaseServerContext {
    settings: Settings & {
        innerStaticRoot: string;
        clientStaticRoot: string;
    },
    data: T
}

export interface Settings {
    port: number,
    rootDirectory: string,
    sourceDirectory?: string,
    proxy?: NodeMVCConfig["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    headers?: NodeMVCConfig["headers"],
    actionFilters?: NodeMVCConfig["requestFilters"],
    logLevel?: LogLevel,
    station?: {
        // 网关地址
        gateway: string,
        // 站点的路径
        path: string,
        permissions?: PermissionConfig
    },
    serverContextData?: { [key: string]: any }
    // gateway: string,
}

export let settings = createParameterDecorator(async (req, res, context: ServerContext<any>) => {
    return context.settings;
})

