import React = require("react");
import { PageProps } from "maishu-chitu-react";

export abstract class BasePage<P extends PageProps = PageProps, S = {}> extends React.Component<P, S> {

    protected backbuttonVisiable = false;

    constructor(props: P) {
        super(props);

        let render = this.render;
        this.render = () => {
            let toolbarLeft = this.renderToolbarLeft();
            let toolbarRight = this.renderToolbarRight();
            return <>
                <div className="tabbable">
                    <ul className="nav nav-tabs">
                        {toolbarLeft.map((o, i) =>
                            <li key={i} className="pull-left">{o}</li>
                        )}
                        {toolbarRight.reverse().map((o, i) =>
                            <li key={i} className="pull-right">{o}</li>
                        )}
                        <li className="pull-right">
                            <button className="btn btn-primary pull-right" style={{ display: this.backbuttonVisiable ? null : "none" }}
                                onClick={() => this.props.app.back()}>
                                <i className="icon-reply"></i>
                                <span>返回</span>
                            </button>
                        </li>
                    </ul>
                </div>
                {render ? render.apply(this) : null}
            </>
        }
    }

    protected renderToolbarLeft(): React.ReactElement<any, any>[] {
        return [];
    }

    protected renderToolbarRight(): React.ReactElement<any, any>[] {
        return [];
    }
}