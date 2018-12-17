define(["require", "exports", "config", "./service"], function (require, exports, config_1, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let { protocol } = location;
    class UserService extends service_1.default {
        url(path) {
            return `${protocol}//${config_1.config.serviceHost}/${path}`;
        }
        resources() {
            let url = this.url('resource/list');
            let resources = this.get(url, { type: 'platform' });
            return resources;
        }
    }
    exports.UserService = UserService;
});
