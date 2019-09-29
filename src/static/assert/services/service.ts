import { Service as ChiTuSerivce, AjaxOptions, ValueStore } from 'maishu-chitu-service'
// import defaultConfig from 'assert/config';
import { WebSiteConfig } from "assert/config"

let clientFiles: string[];
export class Service extends ChiTuSerivce {
    async files() {
        if (clientFiles) {
            return clientFiles;
        }
        clientFiles = await this.get<string[]>("./clientFiles");
        return clientFiles;
    }

    async config(): Promise<WebSiteConfig> {
        let r = await this.get<WebSiteConfig>("./config");
        return r;
    }
}
