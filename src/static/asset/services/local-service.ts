import { Service } from 'maishu-chitu-service'

export abstract class LocalService extends Service {

    abstract contextName: string

    url(path: string) {
        console.assert(requirejs != null);
        let contexts = requirejs.exec("contexts");
        let context: RequireContext = contexts[this.contextName];
        if (context != null && context.config != null && context.config.baseUrl != null) {
            return `${context.config.baseUrl}${path}`;
        }
        return `${path}`;
    }
}