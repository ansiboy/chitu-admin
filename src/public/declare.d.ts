
declare module 'fs' {
    function readFileSync(path: string): any
}

declare let requirejs: any;

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

interface Model {
    id: string;
    create_date_time: Date;
}

declare class Resource implements Model {
    id: string;
    name: string;
    page_path?: string;
    parent_id?: string;
    sort_number: number;
    type: "menu" | "control" | "module";
    create_date_time: Date;
    data?: ResourceData;
    remark?: string;
    icon?: string;
    api_paths?: Path[];
}

declare type ResourceData = {
    position: "top-right" | "in-list";
    code?: string;
    button?: {
        className: string;
        execute_path?: string;
        toast?: string;
        showButtonText: boolean;
        title?: string;
    };
};

declare class Path implements Model {
    id: string;
    create_date_time: Date;
    value: string;
    remark?: string;
    resource?: Resource;
}