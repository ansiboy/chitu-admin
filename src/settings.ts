import { createParameterDecorator, LogLevel, ServerContext } from "maishu-node-mvc";
import { ServerContext as BaseServerContext } from "maishu-node-mvc";
import { Settings as NodeMVCConfig } from 'maishu-node-mvc'
import { PermissionConfig, WebsiteConfig } from "./static/types";

// export interface ServerContext<T> extends BaseServerContext<T> {
//     settings: Settings & {
//         innerStaticRoot: string;
//         clientStaticRoot: string;
//     }
// }

export type ServerContextData = {
    innerStaticRoot: string;
    clientStaticRoot: string;
    rootDirectory: string,
    station: Settings["station"],
    requirejs?: WebsiteConfig["requirejs"],
}

export interface Settings<T = any> {
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
    serverContextData?: T,

    requirejs?: WebsiteConfig["requirejs"],
}

