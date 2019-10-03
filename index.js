const { start } = require("./out/index");
const path = require("path");

start({
    port: 4612,
    // staticRootDirectory: path.join(__dirname, "demo/public"),
    // controllerPath: path.join(__dirname, "demo/server/controllers"),
    rootDirectory: path.join(__dirname, "demo"),
    virtualPaths: {
        "node_modules": path.join(__dirname, "node_modules")
    }
});