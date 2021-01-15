"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const maishu_toolkit_1 = require("maishu-toolkit");
exports.errors = Object.assign(new maishu_toolkit_1.Errors(), {
    elementNotExistsWithName(name) {
        let msg = `Element with name ${name} is not exists.`;
        let error = new Error(msg);
        error.name = exports.errors.elementNotExistsWithName.name;
        return error;
    },
    argumentNull(name) {
        let msg = `Argument ${name} is null or empty.`;
        let error = new Error(msg);
        error.name = exports.errors.argumentNull.name;
        return error;
    },
    fieldNull(itemName, fieldName) {
        let msg = `Argument ${itemName} field of ${fieldName}  is null or empty.`;
        let error = new Error(msg);
        error.name = exports.errors.fieldNull.name;
        return error;
    },
    notImplement() {
        return new Error('Not implement.');
    },
    masterPageNameCanntEmpty() {
        let msg = `Name of the master page can be null or empty.`;
        let error = new Error(msg);
        error.name = exports.errors.masterPageNameCanntEmpty.name;
        return error;
    },
    masterNotExists(masterName) {
        let msg = `Master '${masterName}' is not exists.`;
        let error = new Error(msg);
        error.name = exports.errors.masterNotExists.name;
        return error;
    },
    masterPageExists(masterName) {
        let msg = `Master '${masterName}' is exists.`;
        let error = new Error(msg);
        error.name = exports.errors.masterPageExists.name;
        return error;
    },
    masterContainerIsNull(name) {
        let msg = `Container of master '${name}' is null.`;
        let error = new Error(msg);
        error.name = exports.errors.masterContainerIsNull.name;
        return error;
    },
    authServiceHostNotConfig() {
        let msg = `Auth service host is not config`;
        let error = new Error(msg);
        error.name = exports.errors.authServiceHostNotConfig.name;
        return error;
    },
    registerButtonNotExists() {
        let msg = `Register button is not exists`;
        let error = new Error(msg);
        error.name = exports.errors.registerButtonNotExists.name;
        return error;
    },
    sendVerifyCodeButtonNotExists() {
        let msg = `Send verify code button is not exists.`;
        let error = new Error(msg);
        error.name = exports.errors.sendVerifyCodeButtonNotExists.name;
        return error;
    },
    unexpectedNullResult() {
        let msg = `Null result is unexpected.`;
        return new Error(msg);
    },
    moduleIsNull(path) {
        let msg = `Module ${path} is null.`;
        return new Error(msg);
    },
    moduleHasNoneDefaultExports(path) {
        let msg = `Module ${path} has none default exports.`;
        return new Error(msg);
    },
    moduleHasDefaultExportIsNotFunction(path) {
        let msg = `Default export of module ${path} is not a function.`;
        return new Error(msg);
    },
    serviceUrlCanntNull(serviceName) {
        let msg = `Service '${serviceName}' base url can not null.`;
        return new Error(msg);
    },
    unknonwResourceName(resourceName) {
        let msg = `Resource name '${resourceName}' is unknown.`;
        return new Error(msg);
    },
    settingItemNull(name) {
        let msg = `Setting item '${name}' is null.`;
        return new Error(msg);
    },
    notAbsolutePath(path) {
        let msg = `Path "${path}" is not a absolute path.`;
        return new Error(msg);
    },
    pathNotExists(path) {
        let msg = `Path "${path}" is not exists.`;
        return new Error(msg);
    },
    fileNotExists(path) {
        let msg = `File "${path}" is not exists.`;
        return new Error(msg);
    }
});
