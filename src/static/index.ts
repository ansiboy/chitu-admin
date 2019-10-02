export { InitArguments } from "./assert/startup";
import errorHandle1 = require("./assert/error-handle");
export let errorHandle = errorHandle1.default;
import { WebSiteConfig as WebSiteConfig1 } from "./assert/config";
export { SimpleMenuItem } from "./assert/config";
export type WebSiteConfig = { [P in keyof WebSiteConfig1]?: WebSiteConfig1[P] };