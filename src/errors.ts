import { Errors } from "maishu-toolkit";

class MyErrors extends Errors {
    settingItemNull<T>(name: keyof T) {
        let msg = `Setting item '${name}' is null.`;
        return new Error(msg);
    }
    notAbsolutePath(path: string) {
        let msg = `Path "${path}" is not a absolute path.`;
        return new Error(msg);
    }
    pathNotExists(path: string) {
        let msg = `Path "${path}" is not exists.`;
        return new Error(msg);
    }
    fileNotExists(path: string) {
        let msg = `File "${path}" is not exists.`;
        return new Error(msg);
    }
    pathIsNotDirectory(path: string) {
        let msg = `Path ${path} is not a directory.`;
        return new Error(msg);
    }
    argumentFieldNull(argumentName: string, fieldName: string) {
        return new Error(`Argument ${argumentName} field ${fieldName} cannt ben null or emtpy.`)
    }
    moduleRequireMember(modulePath: string, memberName: string) {
        let msg = `Module ${modulePath} has not member ${memberName}.`;
        return new Error(msg);
    }
}

export let errors = new MyErrors();