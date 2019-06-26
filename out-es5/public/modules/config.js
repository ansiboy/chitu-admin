"use strict";

define(["require", "exports"], function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.config = window['maishu-chitu-admin-config'] = window['maishu-chitu-admin-config'] || {};
  exports.config.login = Object.assign({
    showForgetPassword: true,
    showRegister: true
  }, exports.config.login || {});
});
