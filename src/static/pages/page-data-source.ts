import { DataSource, DataSourceArguments, DataSourceSelectResult } from "maishu-wuzhui";

type PageDataSourceArguments<T> = DataSourceArguments<T> & {
    search?: {
        placeholder?: string,
        execute: (searchText: string) => Promise<DataSourceSelectResult<T>>,
    }
}

export class PageDataSource<T> extends DataSource<T> {
    options: PageDataSourceArguments<T>;

    constructor(args: PageDataSourceArguments<T>) {
        super(args);

        this.options = args;
    }
}