import websiteConfig from "json!websiteConfig";
import { Less } from "maishu-ui-toolkit";
import { pathContact } from "maishu-toolkit";
import { errors } from "./errors";

let contextName = websiteConfig.requirejs != null ? websiteConfig.requirejs.context : null;

/** 对 requirejs 进行封装，方便使用 */
export class Requirejs {
    static loadjs(modules: string[]): Promise<any[]> {
        return new Promise<any[]>((resolove, reject) => {
            // 直接使用 requirejs.config webpack 打包会去掉 requirejs，原因不明
            let req = window["requirejs"].config({ context: contextName });
            req(modules,
                function (...args: any[]) {
                    resolove(args);
                },
                function (err) {
                    console.log(err);
                    reject(err);
                }
            )
        })
    }
    static loadLess(stationPath: string) {
        Less.renderByRequireJS(stationPath, { contextName: contextName });
    }
    static websitePath(stationPath: string) {
        if (!stationPath)
            throw errors.argumentNull("stationPath");

        if (typeof stationPath != "string")
            throw errors.argumentTypeIncorrect("stationPath", "string");

        let contexts = requirejs.exec("contexts");
        let context = contexts[contextName];
        if (context != null && context.config != null && context.config.baseUrl != null) {
            return pathContact(context.config.baseUrl, stationPath);
        }
        return stationPath;
    }
}