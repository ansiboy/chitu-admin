import React = require("react");
import { Rule } from "maishu-dilu";
import { ItemPageContext } from "../item-page";
import { DataSource } from "maishu-wuzhui";

interface DropdownFieldProps<T, S> {
    dataField: keyof T, label: string, name?: string,
    placeholder?: string,
    // items: () => Promise<NameValue[]>,
    dataSource: DataSource<S>,
    nameField: Extract<keyof S, string>,
    valueField: Extract<keyof S, string>,
    validateRules?: Rule[],
    onChange?: (value: string, dataItem: T) => void
}

interface DropdownFieldState {
    items: { name: string, value: string }[]
}

export class DropdownField<T, S> extends React.Component<DropdownFieldProps<T, S>, DropdownFieldState> {
    constructor(props: DropdownField<T, S>['props']) {
        super(props)

        this.state = { items: [] };
    }
    componentDidMount() {
        let { nameField, valueField } = this.props;
        this.props.dataSource.select({}).then(r => {
            let items = r.dataItems.map(o => ({ name: `${o[nameField]}`, value: `${o[valueField]}` }));
            this.setState({ items })
        });
        this.props.dataSource.inserted.add((sender, item) => {
            let { items } = this.state;
            items.push({ name: `${item[nameField]}`, value: `${item[valueField]}` });
        })
    }
    render() {
        let { dataField, label, name, placeholder } = this.props;
        let { items } = this.state;
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                return <div className="input-control">
                    <label>{label}</label>
                    <span>
                        <select name={name || dataField as string} className="form-control"
                            ref={e => {
                                if (!e) return
                                e.value = dataItem[dataField] || ''
                                e.onchange = () => {
                                    dataItem[dataField] = e.value
                                    if (this.props.onChange) {
                                        this.props.onChange(e.value, dataItem)
                                    }

                                    args.updatePageState(dataItem)
                                }

                                // this.props.items().then(items => {
                                //     items.forEach(item => {
                                //         let optionElement = document.createElement('option');
                                //         optionElement.value = item.value;
                                //         optionElement.innerHTML = item.name;
                                //         e.options.add(optionElement);
                                //         return optionElement;
                                //     })
                                // })

                            }} >
                            {placeholder ? <option value="">{placeholder}</option> : null}
                            {items.map((o, i) =>
                                <option key={i} value={o.value}>{o.name}</option>
                            )}
                        </select>
                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}
