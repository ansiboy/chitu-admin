import { Service } from './service'
import { WebsiteConfig } from "../types";

// let clientFiles: string[];
let stationClientFiles: { [stationPath: string]: string[] } = {};
export class MyService extends Service {
    async files(stationPath?: string) {
        stationPath = stationPath || "";

        if (stationClientFiles[stationPath]) {
            return stationClientFiles[stationPath];
        }

        stationClientFiles[stationPath] = await this.get<string[]>(`${stationPath}clientFiles`);
        return stationClientFiles[stationPath];
    }

    async config(): Promise<WebsiteConfig> {
        let r = await this.get<WebsiteConfig>("./websiteConfig");
        return r;
    }
}
