export let errors = {
    settingItemNull(name: string) {
        let msg = `Setting item '${name}' is null.`;
        return new Error(msg);
    },
    notAbsolutePath(path: string) {
        let msg = `Path "${path}" is not a absolute path.`;
        return new Error(msg);
    },
    directoryNotExists(path: string) {
        let msg = `Directory "${path}" is not exists.`;
        return new Error(msg);
    },
    pathIsNotDirectory(path: string) {
        let msg = `Path ${path} is not a directory.`;
        return new Error(msg);
    }
}