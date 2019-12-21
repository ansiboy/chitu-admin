import { Settings, ServerContextData } from "./settings";
import { HomeController } from "./controllers/home";
import IO = require("socket.io-client");
import { getLogger } from "maishu-node-mvc";

export const PROJECT_NAME = "chitu-admin";
export let g = {
    settings: null as Settings
}

export interface StationInfo {
    path: string,
    ip: string,
    port: number,
    // permissions?: PermissionConfig
}

export function registerStation(data: ServerContextData, settings: Settings) {

    console.assert(data.station != null, "Station field is null");

    let ctrl = new HomeController();
    let config = HomeController.getWebsiteConfig(data);

    let logger = getLogger(PROJECT_NAME, settings.logLevel);
    if (config.requirejs != null) {
        config.requirejs.context = data.station.path;
    }
    else {
        logger.info("Requirejs field is null or empty.");
    }

    let s: StationInfo = {
        path: data.station.path,
        ip: settings.bindIP || "127.0.0.1",
        port: settings.port,
    }

    logger.info(`Register station '${data.station.path}'.`);
    let socket = IO(`http://${data.station.gateway}`);
    socket.on("connect", () => {
        logger.info("Socket client connected.");
        let data = JSON.stringify(Object.assign(s, { permissions: settings.station.permissions }));
        socket.emit("registerStation", data);
    })

    socket.on("error", (err) => {
        logger.error(err);
    })


}