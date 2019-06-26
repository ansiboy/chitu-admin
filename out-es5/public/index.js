"use strict";

define(["require", "exports", "./modules/auth/login", "./modules/auth/register", "./modules/auth/forget-password", "./forms/login", "./forms/register", "./forms/forget-password", "./config"], function (require, exports, login, register, _forgetPassword, _loginForm, _registerForm, _forgetPasswordForm, config_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var define = window['define'];

  if (typeof define === "function") {
    define('./modules/forget-password', function () {
      return exports.forgetPassword;
    });
    define('./modules/login', function () {
      return login;
    });
    define('./modules/register', function () {
      return register;
    });
  }

  var element = document.createElement('div');
  document.body.insertBefore(element, document.body.children[0]);
  exports.config = config_1.config;
  exports.forgetPassword = _forgetPassword;
  exports.loginForm = _loginForm;
  exports.registerForm = _registerForm;
  exports.forgetPasswordForm = _forgetPasswordForm;
});
