import { Service as ChiTuSerivce, AjaxOptions, ValueStore } from 'maishu-chitu-service'
import defaultConfig from 'assert/config';

let clientFiles: string[];
export class Service extends ChiTuSerivce {
    async files() {
        if (clientFiles) {
            return clientFiles;
        }
        clientFiles = await this.get<string[]>("./clientFiles");
        return clientFiles;
    }

    async config(): Promise<typeof defaultConfig> {
        let clientFiles = await this.files();
        let configFile = clientFiles.filter(o => o == "config.js")[0];
        if (configFile) {
            let mod = await import(configFile)
            if (mod != null) {
                return Object.assign(defaultConfig, mod.default || {});
            }
        }
        return defaultConfig;

    }
}
