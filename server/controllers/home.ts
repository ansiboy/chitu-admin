import { controller, action } from "maishu-node-mvc";
import path = require("path");
import fs = require("fs");
import os = require("os");
import { settings, Settings } from "../settings";

@controller("/")
export class HomeController {
    @action()
    index() {
        return 'Hello World'
    }

    // @action()
    // loginInfo(@request req: http.IncomingMessage) {
    //     let cookies = cookie.parse(req.headers.cookie);
    //     return cookies["app-login-info"];
    // }

    @action()
    clientFiles(@settings settings: Settings): string[] {
        console.assert(settings.clientStaticRoot != null);
        if (!fs.existsSync(settings.clientStaticRoot))
            return null;

        let s = fs.statSync(settings.clientStaticRoot);
        console.assert(s.isDirectory());

        let paths: string[] = [];
        let stack = [settings.clientStaticRoot];
        while (stack.length > 0) {
            let parentPath = stack.pop();

            let files = fs.readdirSync(parentPath);
            for (let i = 0; i < files.length; i++) {
                let p = path.join(parentPath, files[i]);
                let s = fs.statSync(p);
                if (s.isDirectory())
                    stack.push(p);
                else {
                    let filePath = path.relative(settings.clientStaticRoot, p);
                    paths.push(filePath);
                    path.resolve()
                }
            }
        }

        if (os.platform() == "win32") {
            paths.forEach((p, i) => {
                paths[i] = p.replace(/\\/g, "/")
            })
        }


        return paths;
    }
}