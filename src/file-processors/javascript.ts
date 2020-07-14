import { FileProcessor } from "maishu-node-web-server";

import * as fs from "fs";
import { VirtualDirectory } from "maishu-node-mvc";
import { StatusCode } from "maishu-chitu-service";
import { contentTypes } from "maishu-node-mvc/out/action-results";

import { commonjsToAmd } from "../js-transform";

export function createJavascriptFileProcessor(staticDirectory: VirtualDirectory, commonjsToAmdMatchs: string[]) {
    let f: FileProcessor = (args) => {
        console.assert(args.physicalPath != null);
        console.assert(fs.existsSync(args.physicalPath));
        let filePhysicalPath = staticDirectory.findFile(args.virtualPath);
        if (filePhysicalPath == null || !fs.existsSync(filePhysicalPath)) {
            return { statusCode: StatusCode.NotFound, content: "Page Not FOund", contentTypes: contentTypes.textPlain };
        }

        let convertToAmd: boolean = false;
        let toAmd = commonjsToAmdMatchs || [];
        for (let i = 0; i < toAmd.length; i++) {
            let regex = new RegExp(toAmd[i]);
            if (regex.test(filePhysicalPath)) {
                convertToAmd = true;
                break;
            }
        }

        let buffer = fs.readFileSync(filePhysicalPath);
        let originalCode = buffer.toString();
        if (convertToAmd == false) {
            let content = `/** MVC Action: commonjsToAmd, source file is ${filePhysicalPath} */ \r\n` + originalCode;
            return { content, contentType: "application/x-javascript; charset=UTF-8" };
        }
        //===========================================================================

        let content: string = null;
        let code = commonjsToAmd(originalCode);
        content = `/** MVC Action: commonjsToAmd, transform to javascript amd, source file is ${filePhysicalPath} */ \r\n` + code;

        return { content, contentType: "application/x-javascript; charset=UTF-8" };
    }

    return f;
}