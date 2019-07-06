import React = require("react");
import { hideDialog, showDialog } from "maishu-ui-toolkit";
import ReactDOM = require("react-dom");
import { ItemPageContext } from "./item-page";
import { DataSource } from "maishu-wuzhui";
import { FormValidator, ValidateField } from "maishu-dilu";
import { ValidateDataField } from "./common";

type BeforeSave = (dataItem: any) => Promise<any>

export function createItemDialog<T extends { id: string }>(dataSource: DataSource<T>, name: string, child: React.ReactElement): { show: (dataItem: T) => void } {

    class ItemDialog extends React.Component<{ dataItem: T }, { dataItem: T }> {

        private static instance: ItemDialog;
        private static dialogElement: HTMLElement;

        validator: FormValidator;
        private beforeSaves: BeforeSave[];
        private fieldsConatiner: HTMLElement;

        constructor(props: ItemDialog["props"]) {
            super(props);
            this.state = { dataItem: props.dataItem };

            this.beforeSaves = [];
        }

        private async onSaveButtonClick(dataItem: T) {
            this.validator.clearErrors()
            if (!this.validator.check()) {
                return Promise.reject('validate fail')
            }

            await this.save(dataItem);
            hideDialog(ItemDialog.dialogElement);
        }

        async save(dataItem: T) {
            if (this.beforeSaves.length > 0) {
                await Promise.all(this.beforeSaves.map(m => m(dataItem)));
            }

            if (dataItem.id) {
                await dataSource.update(dataItem);
            }
            else {
                await dataSource.insert(dataItem);
            }
        }

        componentDidMount() {
            let nodes: React.ReactNode[] = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
            var validateFields = nodes.filter(o => o != null)
                .map((o: React.ReactElement<any>) => {
                    let props = o.props as ValidateDataField & { dataField: string, name: string }
                    if (props == null || props.validateRules == null)
                        return null

                    let f: ValidateField = { name: props.name || props.dataField, rules: props.validateRules || [] }
                    return f
                })
                .filter(o => o != null)

            this.validator = new FormValidator(this.fieldsConatiner, ...validateFields)
        }

        render() {
            let { dataItem } = this.state;
            return <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{dataItem.id ? `修改${name}` : `添加${name}`}</h4>
                    </div>
                    <div className="modal-body well" ref={e => this.fieldsConatiner = e || this.fieldsConatiner}>
                        <ItemPageContext.Provider value={{
                            dataItem: dataItem,
                            updatePageState: (dataItem) => {
                                this.setState({ dataItem })
                            },
                            beforeSave: (callback: BeforeSave) => {
                                this.beforeSaves.push(callback);
                            }
                        }}>
                            {child}
                        </ItemPageContext.Provider>

                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" onClick={e => { hideDialog(ItemDialog.dialogElement) }}>
                            <i className="icon-reply" />
                            <span>取消</span>
                        </button>
                        <button className="btn btn-primary" onClick={() => this.onSaveButtonClick(dataItem)}>
                            <i className="icon-save" />
                            <span>确定</span>
                        </button>
                    </div>
                </div>
            </div>
        }

        static show(dataItem: T) {
            if (!ItemDialog.dialogElement) {
                ItemDialog.dialogElement = document.createElement("div");
                ItemDialog.dialogElement.className = "modal fade-in";
                document.body.appendChild(ItemDialog.dialogElement);
                ItemDialog.instance = ReactDOM.render(<ItemDialog dataItem={dataItem} />, ItemDialog.dialogElement) as any;
            }

            ItemDialog.instance.setState({ dataItem: dataItem });
            showDialog(ItemDialog.dialogElement);
        }
    }

    return ItemDialog;
}