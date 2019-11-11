// import * as log4js from "log4js";
// import { g } from "./global";

// log4js.configure({
//     appenders: {
//         console: { type: "console" }
//     },
//     categories: {
//         default: {
//             appenders: ['console'], level: 'info'
//         }
//     }
// });
// export function getLogger(): log4js.Logger {
//     let logger = log4js.getLogger();

//     console.assert(g.settings != null, "settings is null.");
//     logger.level = g.settings.logLevel;
//     // let info = logger.info;
//     // logger.info = function (message: any, ...args: any[]) {
//     //     debugger;
//     //     return info.apply(this, [message, ...args]);
//     // }
//     return logger;
// }