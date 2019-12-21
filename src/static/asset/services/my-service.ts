import { Service } from './service'
import { WebsiteConfig } from "../../types";

let clientFiles: string[];
export class MyService extends Service {
    async files() {
        if (clientFiles) {
            return clientFiles;
        }
        clientFiles = await this.get<string[]>("./clientFiles");
        return clientFiles;
    }

    async config(): Promise<WebsiteConfig> {
        let r = await this.get<WebsiteConfig>("./websiteConfig");
        return r;
    }
}
