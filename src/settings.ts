// import { LogLevel, VirtualDirectory, Settings as MVCSettings } from "maishu-node-mvc";
// import { Settings as NodeMVCConfig } from 'maishu-node-mvc'
import { PermissionConfig, WebsiteConfig } from "./static/types";
import { VirtualDirectory, ProxyProcessor, LogLevel, Settings as MVCSettings } from "maishu-node-mvc";


export type ServerContextData = {
    staticRoot: VirtualDirectory;
    rootDirectory: VirtualDirectory,
    // clientStaticRoot: string,
    station: Settings["station"],
    // requirejs?: WebsiteConfig["requirejs"],
    websiteConfig?: WebsiteConfig,
}

export interface Settings<T = any> {
    port: number,
    // rootPhysicalPath: string | string[],
    rootDirectory: VirtualDirectory,
    // sourceDirectory?: string,
    proxy?: ProxyProcessor["options"]["proxyTargets"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    // actionFilters?: NodeMVCConfig["requestFilters"],
    logLevel?: LogLevel,
    station?: {
        // 网关地址
        gateway: string,
        // 站点的路径
        path: string,
        permissions?: PermissionConfig
    },
    serverContextData?: T,
    // db?: ConnectionConfig,
    websiteConfig?: WebsiteConfig,
    headers?: MVCSettings["headers"]
}

