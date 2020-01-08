const { start } = require("./out/index");
const path = require("path");

start({
    port: 4612,
    rootDirectory: path.join(__dirname, "demo"),
    virtualPaths: {
        "node_modules": path.join(__dirname, "node_modules")
    }
});