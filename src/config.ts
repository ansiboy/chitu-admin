// import { WebSiteConfig } from "../out/static/assert/config";

export type WebSiteConfig = import("../out/static/index").WebSiteConfig;

let config: WebSiteConfig = {
    requirejs: {},
    firstPanelWidth: 130,
    secondPanelWidth: 130,
    menuItems: []
}

export default config;