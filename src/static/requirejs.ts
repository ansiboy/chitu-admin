import websiteConfig from "json!websiteConfig";
import { Less } from "maishu-ui-toolkit";

let context = websiteConfig.requirejs != null ? websiteConfig.requirejs.context : null;
let req = requirejs.config({ context: context });

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
        Less.renderByRequireJS(stationPath, { contextName: context });
    }
}