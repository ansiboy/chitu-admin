import { DataSource, DataSourceArguments, DataSourceSelectResult } from "maishu-wuzhui-helper";

export type PageDataSourceArguments<T> = DataSourceArguments<T> & {
    search?: {
        placeholder?: string,
        execute: (searchText: string) => Promise<DataSourceSelectResult<T>>,
    },

    /**  
     * 指定的数据项是否可以删除
     */
    itemCanDelete?: (dataItem: T) => boolean,
    /** 
     * 指定的数据项是否可以删除 
     */
    itemCanUpdate?: (dataItem: T) => boolean
}

export class PageDataSource<T> extends DataSource<T> {
    options: PageDataSourceArguments<T>;

    constructor(args: PageDataSourceArguments<T>) {
        super(args);

        this.options = args;
    }
}