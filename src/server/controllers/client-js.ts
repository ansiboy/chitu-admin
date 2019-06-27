import { controller, action } from "maishu-node-mvc";
import { settings } from "../settings";
import path = require("path");
import fs = require("fs");

@controller()
export class ClientJSController {
    @action("/clientjs_init.js")
    initjs() {
        let initJS = `define([],function(){
            return {
                default: function(){
                    
                }
            }
        })`;
        if (settings.clientPath) {
            let initJSPath = path.join(settings.clientPath, "init.js");
            if (fs.existsSync(initJSPath)) {
                let buffer = fs.readFileSync(initJSPath);
                initJS = buffer.toString();
            }
        }
        return initJS;
    }
}