import { Settings } from "./settings";
import { HomeController } from "./controllers/home";
import fetch from "node-fetch";
import { getLogger } from "./logger";
import { PermissionConfig } from "./static/types";

export let g = {
    settings: null as Settings
}

export interface StationInfo {
    path: string,
    ip: string,
    port: number,
    permissions?: PermissionConfig
}

export function registerStation(settings: Settings) {

    console.assert(settings.station != null, "Station field is null");

    let ctrl = new HomeController();
    let config = ctrl.stationConfig(settings);

    let logger = getLogger();
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
    fetch(`http://${settings.station.gateway}/auth/registerStation`, {
        method: "POST",
        body: JSON.stringify(s),
        headers: { 'Content-Type': 'application/json' },
    }).then(async r => {
        let data = await r.json();
        logger.log(`Register station success.`);
    }).catch(err => {
        logger.log(`Register station fail.`);
    })
}