import { Service as ChiTuSerivce } from 'maishu-chitu-service'
import { WebSiteConfig } from "assert/config"

let clientFiles: string[];
export class MyService extends ChiTuSerivce {
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
