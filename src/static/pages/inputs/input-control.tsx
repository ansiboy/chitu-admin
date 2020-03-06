import React = require("react");
import { FieldValidate } from "maishu-wuzhui-helper";

export interface InputControlProps<T> extends FieldValidate {
    dataField: keyof T,
}

export interface InputControlState {
    // value?: any,
}

export interface ItemDialog {
    inputControls: InputControl<any>[]
}

export abstract class InputControl<T, P extends InputControlProps<T> = InputControlProps<T>,
    S extends InputControlState = InputControlState> extends React.Component<P, S> {

    static defaultProps: InputControlProps<any> = { validateRules: [] } as InputControlProps<any>;

    constructor(props: P) {
        super(props);

    }

    abstract get value(): any;
    abstract set value(value: any)
}
