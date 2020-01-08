import { LogLevel, VirtualDirectory } from "maishu-node-mvc";
import { Settings as NodeMVCConfig } from 'maishu-node-mvc'
import { PermissionConfig, WebsiteConfig } from "./static/types";

export type ServerContextData = {
    staticRoot: VirtualDirectory;
    rootDirectory: VirtualDirectory,
    // clientStaticRoot: string,
    station: Settings["station"],
    requirejs?: WebsiteConfig["requirejs"],
}

export interface Settings<T = any> {
    port: number,
    rootDirectory: string | VirtualDirectory,
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

