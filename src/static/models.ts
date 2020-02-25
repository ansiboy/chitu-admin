interface Model {
    id: string;
    create_date_time: Date;
}

export class Resource implements Model {
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

export type ResourceData = {
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

export class Path implements Model {
    id: string;
    create_date_time: Date;
    value: string;
    remark?: string;
    resource?: Resource;
}