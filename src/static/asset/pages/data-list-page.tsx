import { BasePage } from "./base-page";
import { DataSource, DataControlField, GridView, CustomField, GridViewCell, GridViewEditableCell, BoundField } from "maishu-wuzhui";
import React = require("react");
import { createGridView, FieldValidate } from "maishu-wuzhui-helper";
import { createItemDialog, Dialog } from "./item-dialog";
import ReactDOM = require("react-dom");
import { InputControl, InputControlProps } from "./inputs/input-control";
import { GridViewCellControl } from "maishu-wuzhui";
import { PageDataSource } from "./page-data-source";
import { PageProps } from "maishu-chitu-react";

interface BoundInputControlProps<T> extends InputControlProps<T> {
    boundField: BoundField<T>
}

let OperationColumnWidth = 140;
let ScrollBarWidth = 18;

/** 数据绑定列控件 */
class BoundFieldControl<T> extends InputControl<T, BoundInputControlProps<T>>{
    control: GridViewCellControl;
    cell: GridViewEditableCell<T>;

    private _value;
    constructor(props: BoundFieldControl<T>["props"]) {
        super(props);

        this.state = {};
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;

        if (this.control != null)
            this.control.value = value;
    }

    render() {
        console.assert(this.state != null);

        return <span ref={e => {
            if (this.control != null) {
                return;
            }

            this.control = this.props.boundField.createControl();
            this.control.element.setAttribute("name", this.props.dataField as string);
            this.control.value = this._value;

            this.control.element.onchange = () => {
                this._value = this.control.value;
            }

            e.appendChild(this.control.element);
        }}>

        </span>
    }
}

export abstract class DataListPage<T, P extends PageProps = PageProps, S = {}> extends BasePage<P, S> {

    abstract dataSource: DataSource<T>;
    abstract itemName: string;
    abstract columns: DataControlField<T>[];

    //============================================
    // protected
    protected pageSize?: number = 15;
    protected headerFixed = false;

    /** 是否显示命令字段 */
    protected showCommandField = true;

    /** 对显示的数据进行转换 */
    protected translate?: (items: T[]) => T[];
    //============================================

    private itemTable: HTMLTableElement;
    private gridView: GridView<T>;
    private dialog: Dialog<T>;
    private _operationField: CustomField<T>;

    constructor(props: P) {
        super(props);


    }

    get operationField() {
        return this._operationField;
    }

    componentDidMount() {
        this.columns = this.columns || [];

        if (this.showCommandField) {
            let it = this;
            this._operationField = new CustomField<T>({
                headerText: "操作",
                headerStyle: { textAlign: "center", width: `${OperationColumnWidth}px` },
                itemStyle: { textAlign: "center" },
                createItemCell(dataItem: T) {
                    let cell = new GridViewCell();
                    ReactDOM.render(
                        <DataCommand<T> {...{ dataItem, dataSource: it.dataSource, dialog: it.dialog, }} />,
                        cell.element
                    );
                    return cell;
                }
            });
        }

        this.gridView = createGridView({
            element: this.itemTable,
            dataSource: this.dataSource,
            columns: this.operationField ? [...this.columns, this._operationField] : this.columns,
            pageSize: this.pageSize,
            translate: this.translate,
            showHeader: this.headerFixed != true,
        })
    }

    renderEditor(): React.ReactElement<any, any> {
        return <>
            {this.columns.filter(o => o instanceof BoundField && o.readOnly != true).map((col, i) =>
                <div key={i} className="form-group clearfix input-control">
                    <label>{col.headerText}</label>
                    <BoundFieldControl boundField={col as BoundField<any>} dataField={(col as BoundField<any>).dataField}
                        validateRules={(col as FieldValidate).validateRules} />
                </div>
            )}
        </>
    }

    protected renderToolbarRight() {
        let editor = this.renderEditor();
        if (editor == null) {
            return [];
        }

        this.dialog = createItemDialog(this.dataSource, this.itemName, editor);
        let addButton = this.getAddButton();
        let searchInput = this.getSearchControl();
        return [addButton, searchInput,];
    }

    protected getAddButton() {
        let button = this.dataSource.canInsert ? <button key="btnAdd" className="btn btn-primary"
            onClick={() => this.dialog.show({} as T)}>
            <i className="icon-plus"></i>
            <span>添加</span>
        </button> : null;

        return button;
    }

    protected getSearchControl() {
        let dataSource = this.dataSource as PageDataSource<T>;
        let search = dataSource.options ? dataSource.options.search : null;
        let searchInput = search ? <>
            <input type="text" className="form-control pull-left" placeholder={search.placeholder || ""} style={{ width: 300 }}></input>
            <button className="btn btn-primary btn-sm  pull-left">
                <i className="icon-search"></i>
                <span>搜索</span>
            </button>
        </> : null;

        return searchInput;
    }

    render() {
        if (this.headerFixed) {
            let columns = this.columns || [];
            return <>
                <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                    <thead>
                        <tr>
                            {columns.map((col, i) =>
                                <th key={i} ref={e => {
                                    if (!e) return;
                                    if (!col.itemStyle)
                                        return;

                                    e.style.width = col.itemStyle["width"];
                                    if (this.operationField == null && i == columns.length - 1) {
                                        e.style.width = `calc(${e.style.width} + ${ScrollBarWidth}px)`
                                    }

                                }}>{col.headerText}</th>
                            )}
                            {this.operationField ? <th style={{ width: OperationColumnWidth + ScrollBarWidth }}>
                                {this._operationField.headerText}
                            </th> : null}
                        </tr>
                    </thead>
                </table>
                <div style={{
                    height: "calc(100% - 160px)", width: 'calc(100% - 300px)',
                    position: 'absolute', overflowY: "scroll", overflowX: "hidden"
                }}>
                    <table ref={e => this.itemTable = e || this.itemTable}>

                    </table>
                </div>
            </>
        }

        return <table ref={e => this.itemTable = e || this.itemTable}>

        </table>
    }
}

interface DataCommandProps<T> {
    dataSource: DataSource<T>,
    dataItem: T,
    dialog: Dialog<T>
}

class DataCommand<T> extends React.Component<DataCommandProps<T>> {
    private dataSource: PageDataSource<T>;

    constructor(props: DataCommandProps<T>) {
        super(props);

        this.dataSource = props.dataSource as PageDataSource<T>;
        this.dataSource.options = this.dataSource.options || {} as any;

        console.assert(this.dataSource != null);
    }

    private edit() {
        this.props.dialog.show(this.props.dataItem);
    }
    private itemCanDelete() {
        if (this.dataSource.options.itemCanDelete == null)
            return true;

        return this.dataSource.options.itemCanDelete(this.props.dataItem);
    }
    private itemCanUpdate() {
        if (this.dataSource.options.itemCanUpdate == null)
            return true;

        return this.dataSource.options.itemCanUpdate(this.props.dataItem);
    }
    render() {
        return <>
            {this.props.dataSource.canUpdate ?
                <button className="btn btn-minier btn-info"
                    onClick={() => this.edit()}
                    disabled={!this.itemCanUpdate()}>
                    <i className="icon-pencil"></i>
                </button> : null}
            {this.dataSource.canDelete ?
                <button className="btn btn-minier btn-danger"
                    disabled={!this.itemCanDelete()}>
                    <i className="icon-trash"></i>
                </button> : null}
        </>
    }
}