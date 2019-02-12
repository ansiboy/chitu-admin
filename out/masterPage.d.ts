import React = require('react');
import * as chitu_react from 'maishu-chitu-react';
export interface Config {
    firstPanelWidth: string;
    secondPanelWidth: string;
    authServiceHost: string;
    menuType: string;
}
export declare type MenuItem = {
    id?: string;
    name: string;
    path?: string;
    icon?: string;
    parent?: MenuItem;
    children?: MenuItem[];
    visible?: boolean;
};
interface State {
    currentPageName?: string;
    toolbar?: JSX.Element;
    menus: MenuItem[];
    resourceId?: string;
    /** 不显示菜单的页面 */
    hideMenuPages?: string[];
}
interface Props {
}
export declare class MasterPage extends React.Component<Props, State> {
    pageContainer: HTMLElement;
    private app;
    constructor(props: Props);
    private showPageByNode;
    private findMenuItemByResourceId;
    private findMenuItemByPageName;
    /** 设置工具栏 */
    setToolbar(toolbar: JSX.Element): void;
    /** 设置菜单 */
    setMenus(menus: MenuItem[]): void;
    setHideMenuPages(pageNames: string[]): void;
    readonly application: Application;
    componentDidMount(): void;
    render(): JSX.Element;
}
export declare class Application extends chitu_react.Application {
    private _masterPage;
    constructor(masterPage: MasterPage);
    readonly masterPage: MasterPage;
    readonly config: Config;
    protected defaultPageNodeParser(): chitu.PageNodeParser;
    /** 加载样式文件 */
    loadStyle(): void;
    createMasterPage(): void;
    run(): void;
}
export declare let app: Application;
export {};
