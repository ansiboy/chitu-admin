const { start } = require("./out/server/index");
const path = require("path");

start({
    port: 4612,
    staticRootDirectory: path.join(__dirname, "out/public"),
    virtualPaths: {
        "node_modules": path.join(__dirname, "node_modules")
    }
});

