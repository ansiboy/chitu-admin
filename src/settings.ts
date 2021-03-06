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
    commonjsToAmd?: Settings["commonjsToAmd"]
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
    db?: ConnectionConfig,
    websiteConfig?: WebsiteConfig,
    /**
     * 一组正则 js 文件名匹配的表达式，用于匹配 JS 是否有 commonjs 转换 amd
     */
    commonjsToAmd?: string[]
}

