import { start } from "./index";
import path = require("path");
import { VirtualDirectory } from "maishu-node-mvc";

let r = start({
    port: 4612,
    rootDirectory: new VirtualDirectory(path.join(__dirname, "demo")),
    virtualPaths: {
        "node_modules": path.join(__dirname, "../node_modules"),
        "lib": path.join(__dirname, "lib")
    }
})