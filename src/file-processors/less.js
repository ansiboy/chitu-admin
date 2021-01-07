"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const less = require("less");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class LessProcessor {
    async execute(ctx) {
        var ext = path.extname(ctx.virtualPath);
        if (ext != ".css")
            return null;
        let physicalPath = path.join(ctx.rootDirectory.physicalPath, path.basename(ctx.virtualPath) + ".less");
        if (!fs.existsSync(physicalPath))
            return null;
        let buffer = fs.readFileSync(physicalPath);
        let originalCode = buffer.toString();
        let output = await less.render(originalCode, {
            paths: [physicalPath]
        });
        return {
            content: output.css,
            headers: { "Content-Type": "text/css; charset=UTF-8" }
        };
    }
}
exports.LessProcessor = LessProcessor;
// export function createLessFileProcessor(basePhysicalPath: string) {
//     if (!basePhysicalPath) throw errors.argumentNull("basePhysicalPath");
//     if (!fs.existsSync(basePhysicalPath)) throw errors.pathNotExists(basePhysicalPath);
//     let f: FileProcessor = async function (args): Promise<RequestResult> {
//         let filePath = pathConcat(basePhysicalPath, args.virtualPath);
//         if (!fs.existsSync(filePath))
//             return {
//                 statusCode: StatusCode.NotFound, content: "Page Not FOund",
//                 headers: { "Content-Type": "text/plain; charset=UTF-8" }
//             };
//         let buffer = fs.readFileSync(args.physicalPath);
//         let originalCode = buffer.toString();
//         let output = await less.render(originalCode, {
//             paths: [basePhysicalPath]
//         } as Less.Options);
//         return { content: output.css, headers: { "Content-Type": "text/css; charset=UTF-8" } };
//     }
//     return f;
// }
