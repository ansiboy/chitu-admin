import { VirtualDirectory, FileProcessor, ExecuteResult } from "maishu-node-web-server";
import less = require("less");
import * as fs from "fs";
import { StatusCode, FileProcessorResult } from "maishu-node-web-server";

export function createLessFileProcessor(staticDirectory: VirtualDirectory) {
    let f: FileProcessor = async function (args): Promise<FileProcessorResult> {

        if (!args.physicalPath || !fs.existsSync(args.physicalPath))
            return { statusCode: StatusCode.NotFound, content: "Page Not FOund", contentType: "text/plain; charset=UTF-8" };

        let buffer = fs.readFileSync(args.physicalPath);
        let originalCode = buffer.toString();
        let output = await less.render(originalCode, {
            paths: [staticDirectory.physicalPath]
        } as Less.Options);

        return { content: output.css, contentType: "text/css; charset=UTF-8" };
    }

    return f;
}