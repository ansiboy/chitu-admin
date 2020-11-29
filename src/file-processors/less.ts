// import { FileProcessor, pathConcat, StatusCode, RequestResult } from "maishu-node-mvc";
import { RequestContext, RequestProcessor, RequestResult } from "maishu-node-web-server";
import less = require("less");
import * as fs from "fs";
import * as path from "path";

export class LessProcessor implements RequestProcessor {
    async execute(ctx: RequestContext): Promise<RequestResult> {
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
        } as Less.Options);

        return {
            content: output.css,
            headers: { "Content-Type": "text/css; charset=UTF-8" }
        };
    }

}

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