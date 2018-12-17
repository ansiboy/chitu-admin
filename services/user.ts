
import { config } from "config";
import Service from "./service";

let { protocol } = location;

interface Resource {
    id?: string,
    name: string,
    path?: string,
    parent_id: string,
    sort_number: number,
    type: string,
    create_date_time: Date,
}

export class UserService extends Service {
    url(path: string) {
        return `${protocol}//${config.serviceHost}/${path}`
    }
    resources() {
        let url = this.url('resource/list')
        let resources = this.get<Resource[]>(url, { type: 'platform' })
        return resources
    }
}