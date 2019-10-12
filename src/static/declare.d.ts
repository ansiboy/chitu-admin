
declare module 'fs' {
    function readFileSync(path: string): any
}

declare type RequireFunction = (modules: string[], callback?: Function, err?: Function) => void;

declare let requirejs: {
    (config: RequireConfig, modules: string[], callback?: Function, err?: Function);
    (config: RequireConfig): RequireFunction;
    config: Function;
    exec(name: string);
    load(context: RequireContext, id: string, url: string);
};

type RequireContext = {
    config: RequireConfig
}


declare let define: Function;

declare module "js-md5" {
    let md5: {
        (text: string): string;
    };
    export = md5;
}

declare module "auth/settings" {
    let settings: { gateway: string };
    export = settings;
}


