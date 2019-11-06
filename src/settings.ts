import { createParameterDecorator } from "maishu-node-mvc";
import { ServerContext } from "maishu-node-mvc";
import { startServer, Config as NodeMVCConfig } from 'maishu-node-mvc'

export interface MyServerContext extends ServerContext {
    settings: Settings & {
        innerStaticRoot: string;
        clientStaticRoot: string;
    }
}


// export interface Settings {
//     innerStaticRoot: string;
//     clientStaticRoot: string;
//     root: string
// }

export interface Settings {
    port: number,
    rootDirectory: string,
    sourceDirectory?: string,
    proxy?: NodeMVCConfig["proxy"],
    bindIP?: string,
    virtualPaths?: { [path: string]: string },
    headers?: NodeMVCConfig["headers"],
    actionFilters?: NodeMVCConfig["actionFilters"],
    logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal",
    station?: {
        // 网关地址
        gateway: string,
        // 站点的路径
        path: string,
    }
    // gateway: string,
}

export let settings = createParameterDecorator(async (req, res, context: MyServerContext) => {
    return context.settings;
})

