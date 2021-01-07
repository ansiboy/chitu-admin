import { BasePage } from "./base-page";
import {
    DataSource, DataControlField, CustomField, GridViewCell, GridViewEditableCell,
    BoundField, GridViewCellControl, createGridView, boundField, BoundFieldParams,
    dateTimeField, CheckboxListFieldParams, checkboxListField
} from "maishu-wuzhui-helper";
import * as React from "react";
import { createItemDialog, Dialog } from "./item-dialog";
import * as ReactDOM from "react-dom";
import { InputControl, InputControlProps } from "./inputs/input-control";
import { PageDataSource } from "./page-data-source";
import { PageProps } from "maishu-chitu-react";
import { buttonOnClick, confirm } from "maishu-ui-toolkit";

interface BoundInputControlProps<T> extends InputControlProps<T> {
    boundField: BoundField<T>
}

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

export interface DataListPageState {
    tableSize?: { width: number, height: number }
}

export abstract class DataListPage<T, P extends PageProps = PageProps, S extends DataListPageState = DataListPageState> extends BasePage<P, S> {
    /** 操作列宽度 */
    protected CommandColumnWidth = 140;
    protected ScrollBarWidth = 18;

    abstract dataSource: DataSource<T>;
    abstract columns: DataControlField<T>[];
    protected itemName?: string;

    //============================================
    // protected
    protected pageSize?: number = 15;
    protected headerFixed = false;

    /** 是否显示命令字段 */
    protected showCommandColumn = true;

    /** 对显示的数据进行转换 */
    protected translate?: (items: T[]) => T[];
    //============================================

    protected deleteConfirmText: (dataItem: T) => string;


    private itemTable: HTMLTableElement;
    private dialog: Dialog<T>;
    private commandColumn: CustomField<T>;

    constructor(props: P) {
        super(props);

        window.addEventListener("resize", () => {
            let height = window.innerHeight - 160;
            let width = window.innerWidth - 80;
            let firstMenuPanel = document.getElementsByClassName("first")[0] as HTMLElement;
            let secondMenuPanel = document.getElementsByClassName("second")[0] as HTMLElement;
            if (firstMenuPanel) {
                width = width - firstMenuPanel.offsetWidth;
            }
            if (secondMenuPanel) {
                width = width - secondMenuPanel.offsetWidth;
            }

            let tableSize: DataListPageState["tableSize"];
            if (this.state != null) {
                tableSize = this.state.tableSize;
            }
            if (tableSize == null || tableSize.height != height || tableSize.width != width) {
                this.setState({ tableSize: { width, height } });
            }
        })
    }

    calcTableSize() {
        let height = window.innerHeight - 160;
        let width = window.innerWidth - 40;
        let firstMenuPanel = document.getElementsByClassName("first")[0] as HTMLElement;
        let secondMenuPanel = document.getElementsByClassName("second")[0] as HTMLElement;
        if (firstMenuPanel) {
            width = width - firstMenuPanel.offsetWidth;
        }
        if (secondMenuPanel) {
            width = width - secondMenuPanel.offsetWidth;
        }

        return { width, height };
    }

    componentDidMount() {
        this.columns = this.columns || [];

        if (this.showCommandColumn) {
            let it = this;
            this.commandColumn = new CustomField<T>({
                headerText: "操作",
                headerStyle: { textAlign: "center", width: `${this.CommandColumnWidth}px` },
                itemStyle: { textAlign: "center", width: `${this.CommandColumnWidth}px` },
                createItemCell(dataItem: T, cellElement) {
                    let cell = new GridViewCell(cellElement);
                    ReactDOM.render(<>
                        {it.leftCommands(dataItem)}
                        {it.editButton(dataItem)}
                        {it.deleteButton(dataItem)}
                        {it.rightCommands(dataItem)}
                    </>, cell.element);
                    return cell;
                }
            });
        }
        createGridView({
            element: this.itemTable,
            dataSource: this.dataSource,
            columns: this.commandColumn ? [...this.columns, this.commandColumn] : this.columns,
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
                        validateRules={(col as BoundField<T>).validateRules} />
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
        let addButton = this.addButton();
        let searchInput = this.searchControl();
        return [searchInput, addButton,];
    }

    /** 获取页面添加按钮 */
    protected addButton() {
        let button = this.dataSource.canInsert ? <button key="btnAdd" className="btn btn-primary btn-sm"
            onClick={() => this.dialog.show({} as T)}>
            <i className="icon-plus"></i>
            <span>添加</span>
        </button> : null;

        return button;
    }

    /** 获取页面编辑按钮 */
    protected editButton(dataItem: T) {
        if (!this.dataSource.canUpdate)
            return null;

        let ps = this.dataSource as PageDataSource<T>;
        let options = ps.options || {} as typeof ps.options;
        let itemCanUpdate = options.itemCanUpdate || (() => true);
        return <button className="btn btn-minier btn-info"
            onClick={() => this.executeEdit(dataItem)}
            disabled={!itemCanUpdate(dataItem)}>
            <i className="icon-pencil"></i>
        </button>
    }

    /** 获取页面删除按钮 */
    protected deleteButton(dataItem: T) {
        if (!this.dataSource.canDelete)
            return;

        let ps = this.dataSource as PageDataSource<T>;
        let options = ps.options || {} as typeof ps.options;
        let itemCanDelete = options.itemCanDelete || (() => true);
        return <button className="btn btn-minier btn-danger"
            disabled={!itemCanDelete(dataItem)}
            ref={e => {
                if (!e) return;
                if (e.getAttribute("button-on-click")) {
                    return;
                }

                e.setAttribute("button-on-click", "true");
                buttonOnClick(e, () => this.executeDelete(dataItem));
            }}>
            <i className="icon-trash"></i>
        </button>
    }

    /** 执行编辑操作 */
    protected executeEdit(dataItem: T) {
        this.dialog.show(dataItem);
    }

    /** 执行删除操作 */
    protected executeDelete(dataItem: T) {
        if (this.deleteConfirmText) {
            let message = this.deleteConfirmText(dataItem);
            return new Promise<any>((resolve, reject) => {
                confirm({
                    title: "请确认", message,
                    confirm: async () => {
                        return this.dataSource.delete(dataItem)
                            .then(r => resolve(r))
                            .catch(err => reject(err))
                    },
                    cancle: async () => {
                        resolve({});
                    }
                })
            })
        }
        return this.dataSource.delete(dataItem);
    }

    /** 获取页面搜索栏 */
    protected searchControl() {
        let dataSource = this.dataSource as PageDataSource<T>;
        let search = dataSource.options ? dataSource.options.search : null;
        let searchInput = search ? <>
            <input type="text" className="form-control pull-left input-sm" placeholder={search.placeholder || ""} style={{ width: 300 }}></input>
            <button className="btn btn-primary btn-sm">
                <i className="icon-search"></i>
                <span>搜索</span>
            </button>
        </> : null;

        return searchInput;
    }

    protected rightCommands(dataItem: T): JSX.Element[] {
        return [];
    }

    protected leftCommands(dataItem: T): JSX.Element[] {
        return [];
    }

    render() {
        let tableSize = this.state ? this.state.tableSize : this.calcTableSize();
        if (this.headerFixed) {
            let columns = this.columns || [];
            return <>
                <div style={{ height: `${tableSize.height}px`, width: `${tableSize.width}px`, overflowY: "scroll", overflowX: "hidden" }}>
                    <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}>
                        <thead>
                            <tr>
                                {columns.map((col, i) =>
                                    <th key={i} ref={e => {
                                        if (!e) return;
                                        if (!col.itemStyle)
                                            return;

                                        e.style.width = col.itemStyle["width"];
                                        if (this.commandColumn == null && i == columns.length - 1) {
                                            e.style.width = `calc(${e.style.width} + ${this.ScrollBarWidth}px)`
                                        }

                                    }}>{col.headerText}</th>
                                )}
                                {this.commandColumn ? <th style={{ width: this.CommandColumnWidth + this.ScrollBarWidth }}>
                                    {this.commandColumn.headerText}
                                </th> : null}
                            </tr>
                        </thead>
                    </table>
                    <table ref={e => this.itemTable = e || this.itemTable}>

                    </table>
                </div>
            </>
        }

        return <table ref={e => this.itemTable = e || this.itemTable}>

        </table>
    }

    boundField(params: BoundFieldParams<T>) {
        return boundField(params);
    }

    dateTimeField(params: BoundFieldParams<T>) {
        return dateTimeField(params);
    }

    checkboxListField<S>(params: CheckboxListFieldParams<T, S>): BoundField<T> {
        return checkboxListField(params)
    }
}

