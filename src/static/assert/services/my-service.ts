import { Service } from './service'
import { StationConfig } from "../../types";

let clientFiles: string[];
export class MyService extends Service {
    async files() {
        if (clientFiles) {
            return clientFiles;
        }
        clientFiles = await this.get<string[]>("./clientFiles");
        return clientFiles;
    }

    async config(): Promise<StationConfig> {
        let r = await this.get<StationConfig>("./stationConfig");
        return r;
    }
}
