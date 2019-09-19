import { Service as ChiTuSerivce, AjaxOptions, ValueStore } from 'maishu-chitu-service'

export class Service extends ChiTuSerivce {
    files() {
        return this.get<string[]>("./clientFiles");
    }
}
