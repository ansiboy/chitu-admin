"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_transform_1 = require("../js-transform");
const path = __importStar(require("path"));
const stream = __importStar(require("stream"));
class JavascriptTransform {
    constructor(commonjsToAmdMatchs) {
        this.commonjsToAmdMatchs = commonjsToAmdMatchs || [];
    }
    async execute(result, context) {
        let ext = path.extname(context.virtualPath);
        if (ext != ".js")
            return result;
        let filePhysicalPath = context.rootDirectory.findFile(context.virtualPath);
        if (!filePhysicalPath)
            return result;
        let convertToAmd = false;
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
        let content = null;
        let code = js_transform_1.commonjsToAmd(originalCode);
        content = `/** MVC Action: commonjsToAmd, transform to javascript amd, source file is ${filePhysicalPath} */ \r\n` + code;
        return { content, headers: { "Content-Type": "application/x-javascript; charset=UTF-8" } };
    }
    getContentAsString(r) {
        return new Promise((resolve, reject) => {
            if (r.content instanceof stream.Readable) {
                let buffer = Buffer.from([]);
                r.content.on("data", (data) => {
                    buffer = Buffer.concat([buffer, data]);
                });
                r.content.on("end", function () {
                    resolve(buffer.toString());
                });
                r.content.on("error", function (err) {
                    reject(err);
                });
            }
            else if (typeof r.content == "string") {
                resolve(r.content);
            }
            else {
                resolve(r.content.toString());
            }
        });
    }
}
exports.JavascriptTransform = JavascriptTransform;
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
