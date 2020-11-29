
import * as fs from "fs";
import { VirtualDirectory, ContentTransform, RequestContext, RequestResult } from "maishu-node-web-server";
import { StatusCode } from "maishu-chitu-service";

import { commonjsToAmd } from "../js-transform";
import * as path from "path";
import * as stream from "stream";

export class JavascriptTransform implements ContentTransform {
    private commonjsToAmdMatchs: string[];
    constructor(commonjsToAmdMatchs?: string[]) {
        this.commonjsToAmdMatchs = commonjsToAmdMatchs || [];
    }

    async execute(result: RequestResult, context: RequestContext): Promise<RequestResult> {
        let ext = path.extname(context.virtualPath);
        if (ext != ".js")
            return result;

        let filePhysicalPath = context.rootDirectory.findFile(context.virtualPath);
        if (!filePhysicalPath)
            return result;

        let convertToAmd: boolean = false;
        let toAmd = this.commonjsToAmdMatchs;
        for (let i = 0; i < toAmd.length; i++) {
            let regex = new RegExp(toAmd[i]);
            if (regex.test(filePhysicalPath)) {
                convertToAmd = true;
                break;
            }
        }

        // let buffer = fs.readFileSync(filePhysicalPath);
        let originalCode = await this.getContentAsString(result);
        if (convertToAmd == false) {
            let content = `/** MVC Action: commonjsToAmd, source file is ${filePhysicalPath} */ \r\n` + originalCode;
            return { content, headers: { "Content-Type": "application/x-javascript; charset=UTF-8" } };
        }
        //===========================================================================

        let content: string = null;
        let code = commonjsToAmd(originalCode);
        content = `/** MVC Action: commonjsToAmd, transform to javascript amd, source file is ${filePhysicalPath} */ \r\n` + code;

        return { content, headers: { "Content-Type": "application/x-javascript; charset=UTF-8" } };

    }

    private getContentAsString(r: RequestResult): Promise<string> {
        return new Promise((resolve, reject) => {
            if (r.content instanceof stream.Readable) {
                let buffer = Buffer.from([]);
                r.content.on("data", (data) => {
                    buffer = Buffer.concat([buffer, data])
                })
                r.content.on("end", function () {
                    resolve(buffer.toString())
                })
                r.content.on("error", function (err) {
                    reject(err);
                })
            }
            else if (typeof r.content == "string") {
                resolve(r.content)
            }
            else {
                resolve(r.content.toString());
            }
        })
    }

}

// export function createJavascriptFileProcessor(staticDirectory: VirtualDirectory, commonjsToAmdMatchs: string[]) {
//     let f: FileProcessor = (args) => {
//         console.assert(args.physicalPath != null);
//         console.assert(fs.existsSync(args.physicalPath));
//         let filePhysicalPath = staticDirectory.findFile(args.virtualPath);
//         if (filePhysicalPath == null || !fs.existsSync(filePhysicalPath)) {
//             return { statusCode: StatusCode.NotFound, content: "Page Not FOund", contentTypes: contentTypes.textPlain };
//         }

//         let convertToAmd: boolean = false;
//         let toAmd = commonjsToAmdMatchs || [];
//         for (let i = 0; i < toAmd.length; i++) {
//             let regex = new RegExp(toAmd[i]);
//             if (regex.test(filePhysicalPath)) {
//                 convertToAmd = true;
//                 break;
//             }
//         }

//         let buffer = fs.readFileSync(filePhysicalPath);
//         let originalCode = buffer.toString();
//         if (convertToAmd == false) {
//             let content = `/** MVC Action: commonjsToAmd, source file is ${filePhysicalPath} */ \r\n` + originalCode;
//             return { content, contentType: "application/x-javascript; charset=UTF-8" };
//         }
//         //===========================================================================

//         let content: string = null;
//         let code = commonjsToAmd(originalCode);
//         content = `/** MVC Action: commonjsToAmd, transform to javascript amd, source file is ${filePhysicalPath} */ \r\n` + code;

//         return { content, contentType: "application/x-javascript; charset=UTF-8" };
//     }

//     return f;
// }