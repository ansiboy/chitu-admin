import React = require("react");
import { buttonOnClick, ClickArguments } from "maishu-ui-toolkit";

export class Buttons {
    static codes = {
        add: 'add',
        edit: 'edit',
        remove: 'remove',
        view: 'view',
        save: 'save'
    }
    static createListEditButton(onclick: (e: React.MouseEvent) => void) {
        return <button className="btn btn-minier btn-info"
            onClick={e => onclick(e)}>
            <i className="icon-pencil" />
        </button>
    }
    static createListDeleteButton(onclick: (e: React.MouseEvent) => void) {
        return <button className="btn btn-minier btn-danger"
            onClick={e => onclick(e)}>
            <i className="icon-trash" />
        </button>
    }
    static createListViewButton(onclick: (e: React.MouseEvent) => void) {
        return <button className="btn btn-minier btn-success"
            onClick={e => onclick(e)}>
            <i className="icon-eye-open" />
        </button>
    }
    static createPageAddButton(onclick: (e: MouseEvent) => Promise<any>) {
        return this.createPageTopRightButton("添加", "icon-plus", onclick);
    }
    static createPageTopRightButton(text: string, icon: string, onclick: (e: MouseEvent) => Promise<any>, args?: ClickArguments) {
        return <button className="btn btn-primary pull-right" ref={button => {
            if (!button) return;
            buttonOnClick(button, (event) => onclick(event), args)
        }}>
            <i className={icon} />
            <span>{text}</span>
        </button>
    }
}