import websiteConfig from "json!websiteConfig";
import { Less } from "maishu-ui-toolkit";
import { pathContact } from "maishu-toolkit";

let contextName = websiteConfig.requirejs != null ? websiteConfig.requirejs.context : null;
let req = requirejs.config({ context: contextName });

/** 对 requirejs 进行封装，方便使用 */
export class RequireJS {
    loadjs(modules: string[]): Promise<any[]> {
        return new Promise<any[]>((resolove, reject) => {
            req(modules,
                function (...args: any[]) {
                    resolove(args);
                },
                function (err) {
                    reject(err);
                }
            )
        })
    }
    loadLess(stationPath: string) {
        Less.renderByRequireJS(stationPath, { contextName: contextName });
    }
    websitePath(stationPath: string) {
        let contexts = requirejs.exec("contexts");
        let context = contexts[contextName];
        if (context != null && context.config != null && context.config.baseUrl != null) {
            return pathContact(context.config.baseUrl, stationPath);
        }
        return stationPath;
    }
}