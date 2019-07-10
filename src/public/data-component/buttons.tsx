import React = require("react");

export class Buttons {
    static buttonCodes = {
        add: 'add',
        edit: 'edit',
        delete: 'delete',
        view: 'view'
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
    static createPageAddButton(onclick: (e: React.MouseEvent) => void) {
        return <button className="btn btn-primary pull-right" onClick={e => onclick(e)}>
            <i className="icon-plus" />
            <span>添加</span>
        </button>
    }
}