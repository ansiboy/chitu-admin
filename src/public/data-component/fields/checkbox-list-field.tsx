import React = require("react");
import { errors } from "../errors";
import { ItemPageContext } from "../item-page";
import { radioList, checkboxList } from "maishu-wuzhui-helper";
import { DataSource } from "maishu-wuzhui";
import { ValidateDataField } from "data-component/common";
import { Role } from "entities";

interface CheckboxListFieldProps<T> {
    dataField: keyof T, label: string,
    dataType: 'string' | 'number',
    defaultValue?: string | number,
    dataSource: DataSource<T>,
    nameField: keyof T,
    valueField: keyof T,
}

export class CheckboxListField<T> extends React.Component<CheckboxListFieldProps<T> & ValidateDataField, { value?: string }>{
    constructor(props: CheckboxListField<T>['props']) {
        super(props)
        this.state = {}
    }
    render() {
        let { dataField, label, dataSource, nameField, valueField } = this.props
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                dataItem[dataField] = dataItem[dataField] || this.props.defaultValue
                return <div className="item">
                    <label>{label}</label>
                    <span>
                        <div ref={e => {
                            if (!e) return;
                            checkboxList<T>({
                                element: e,
                                dataSource: dataSource,
                                dataField: dataField,
                                nameField: nameField,
                                valueField: valueField,
                                dataItem: dataItem
                            })
                        }}>
                        </div>
                        <div className={`validationMessage ${dataField}`} style={{ display: "none" }} >请选择用户角色</div>

                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}
