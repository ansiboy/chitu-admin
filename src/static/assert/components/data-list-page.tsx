import { BasePage } from "./base-page";
import { DataSource, DataControlField, GridView } from "maishu-wuzhui";
import React = require("react");
import { createItemDialog, createGridView } from "maishu-wuzhui-helper";

export abstract class DataListPage<T> extends BasePage {
    abstract dataSource: DataSource<T>;
    abstract itemName: string;
    abstract columns: DataControlField<T>[];

    private itemTable: HTMLTableElement;
    gridView: GridView<T>;


    componentDidMount() {
        debugger
        this.gridView = createGridView({
            element: this.itemTable,
            dataSource: this.dataSource,
            columns: this.columns
        })
    }

    renderEditor(): React.ReactElement {
        return null;
    }

    renderToolbarRight() {
        let editor = this.renderEditor();
        if (editor == null) {
            return [];
        }

        let dialog = createItemDialog(this.dataSource, this.itemName, editor)

        let button = <button key="btnAdd" className="btn btn-primary btn-sm"
            onClick={() => dialog.show({} as T)}>
            <i className="icon-plus"></i>
            <span>添加</span>
        </button>

        return [button]
    }

    render() {

        return <table ref={e => this.itemTable = e || this.itemTable}>

        </table>
    }
}