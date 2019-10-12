export { InitArguments } from "./assert/startup";
import errorHandle1 = require("./assert/error-handle");
export let errorHandle = errorHandle1.default;
export { WebSiteConfig } from "./assert/config";
export { SimpleMenuItem, RequireConfig } from "./assert/config";
export { LocalService } from "./assert/services/local-service";

// export type WebSiteConfig = { [P in keyof WebSiteConfig1]?: WebSiteConfig1[P] };