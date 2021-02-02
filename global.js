"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStation = exports.NODE_MODULES = exports.LIB = exports.CONTROLLERS = exports.STATIC = exports.PROJECT_NAME = void 0;
const IO = require("socket.io-client");
const maishu_node_mvc_1 = require("maishu-node-mvc");
exports.PROJECT_NAME = "chitu-admin";
exports.STATIC = "static";
exports.CONTROLLERS = "controllers";
exports.LIB = "lib";
exports.NODE_MODULES = "node_modules";
function registerStation(data, settings) {
    console.assert(data.station != null, "Station field is null");
    // let config = HomeController.getWebsiteConfig(data, settings.logLevel);
    let logger = maishu_node_mvc_1.getLogger(exports.PROJECT_NAME, settings.logLevel);
    // if (config.requirejs != null) {
    //     config.requirejs.context = data.station.path;
    // }
    // else {
    //     logger.info("Requirejs field is null or empty.");
    // }
    let s = {
        path: data.station.path,
        ip: settings.bindIP || "127.0.0.1",
        port: settings.port,
    };
    logger.info(`Register station '${data.station.path}'.`);
    let socket = IO(`http://${data.station.gateway}`);
    socket.on("connect", () => {
        logger.info("Socket client connected.");
        let data = JSON.stringify(Object.assign(s, { permissions: settings.station.permissions }));
        socket.emit("registerStation", data);
    });
    socket.on("error", (err) => {
        logger.error(err);
    });
}
exports.registerStation = registerStation;
