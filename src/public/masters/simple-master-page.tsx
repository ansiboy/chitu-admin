import { MasterPage } from "../master-page";
import React = require("react");
import { masterPageNames } from "./names";

interface State {
}

export class SimpleMasterPage extends MasterPage<State>{
    
    name: string = masterPageNames.simple;
    pageContainer: HTMLElement;

    render() {
        return <div ref={e => this.pageContainer = e || this.pageContainer}>

        </div>
    }

}