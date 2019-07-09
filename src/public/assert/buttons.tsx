import ReactDOM = require("react-dom");
import React = require("react");
import { Resource } from "entities";

export class Buttons {
    static createListEditButton(onclick: (e: React.MouseEvent) => void) {
        return <button key={Math.random()} className="btn btn-minier btn-info"
            onClick={e => onclick(e)}>
            <i className="icon-pencil" />
        </button>
    }
    static createListDeleteButton(onclick: (e: React.MouseEvent) => void) {
        return <button key={Math.random()} className="btn btn-minier btn-danger"
            onClick={e => onclick(e)}>
            <i className="icon-trash" />
        </button>
    }
    static createListViewButton(onclick: (e: React.MouseEvent) => void) {
        return <button key={Math.random()} className="btn btn-minier btn-success"
            onClick={e => onclick(e)}>
            <i className="icon-eye-open" />
        </button>
    }
    static createPageAddButton(onclick: (e: React.MouseEvent) => void) {
        return <button key={Math.random()} className="btn btn-primary pull-right" onClick={e => onclick(e)}>
            <i className="icon-plus" />
            <span>添加</span>
        </button>
    }
}