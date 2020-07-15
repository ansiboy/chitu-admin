import { FileProcessor, pathConcat } from "maishu-node-web-server";
import less = require("less");
import * as fs from "fs";
import { StatusCode, FileProcessorResult } from "maishu-node-web-server";
import { errors } from "../errors";

export function createLessFileProcessor(basePhysicalPath: string) {
    if (!basePhysicalPath) throw errors.argumentNull("basePhysicalPath");
    if (!fs.existsSync(basePhysicalPath)) throw errors.pathNotExists(basePhysicalPath);

    let f: FileProcessor = async function (args): Promise<FileProcessorResult> {
        let filePath = pathConcat(basePhysicalPath, args.virtualPath);
        if (!fs.existsSync(filePath))
            return { statusCode: StatusCode.NotFound, content: "Page Not FOund", contentType: "text/plain; charset=UTF-8" };

        let buffer = fs.readFileSync(args.physicalPath);
        let originalCode = buffer.toString();
        let output = await less.render(originalCode, {
            paths: [basePhysicalPath]
        } as Less.Options);

        return { content: output.css, contentType: "text/css; charset=UTF-8" };
    }

    return f;
}