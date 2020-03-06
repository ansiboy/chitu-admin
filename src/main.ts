import { start } from "./index";
import path = require("path");

let r = start({
    port: 4612,
    rootPhysicalPath: path.join(__dirname, "../demo"),
    virtualPaths: {
        "node_modules": path.join(__dirname, "../node_modules")
    }
})