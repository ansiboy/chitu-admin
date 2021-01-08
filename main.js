"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const path = require("path");
let r = index_1.start({
    port: 4612,
    rootPhysicalPath: path.join(__dirname, "demo"),
    virtualPaths: {
        "node_modules": path.join(__dirname, "node_modules"),
        "lib": path.join(__dirname, "lib")
    }
});
