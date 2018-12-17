"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const service_1 = require("./service");
let { protocol } = location;
class UserService extends service_1.default {
    url(path) {
        return `${protocol}//${config_1.config.authServiceHost}/${path}`;
    }
    resources() {
        let url = this.url('resource/list');
        let resources = this.get(url, { type: 'platform' });
        return resources;
    }
}
exports.UserService = UserService;
