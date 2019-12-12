import { Settings } from "./settings";
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

export function registerStation(settings: Settings) {

    console.assert(settings.station != null, "Station field is null");

    let ctrl = new HomeController();
    let config = ctrl.websiteConfig(settings);

    let logger = getLogger(PROJECT_NAME, settings.logLevel);
    if (config.requirejs != null) {
        config.requirejs.context = settings.station.path;
    }
    else {
        logger.info("Requirejs field is null or empty.");
    }

    let s: StationInfo = {
        path: settings.station.path,
        ip: settings.bindIP || "127.0.0.1",
        port: settings.port,
    }

    logger.info(`Register station '${settings.station.path}'.`);
    let socket = IO(`http://${settings.station.gateway}`);
    socket.on("connect", () => {
        logger.info("Socket client connected.");
        let data = JSON.stringify(Object.assign(s, { permissions: settings.station.permissions }));
        socket.emit("registerStation", data);
    })

  
}