import { LogLevel, VirtualDirectory, Settings as MVCSettings } from "maishu-node-mvc";
import { Settings as NodeMVCConfig } from 'maishu-node-mvc'
import { PermissionConfig, WebsiteConfig } from "./static/types";
import { ConnectionConfig } from "mysql";

export type ServerContextData = {
    staticRoot: VirtualDirectory;
    rootDirectory: VirtualDirectory,
    // clientStaticRoot: string,
    station: Settings["station"],
    // requirejs?: WebsiteConfig["requirejs"],
    websiteConfig?: WebsiteConfig,
}

export interface Settings<T = any> extends MVCSettings {
    port: number,
    rootPhysicalPath: string | string[],
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
    db?: ConnectionConfig,
    websiteConfig?: WebsiteConfig,
}

