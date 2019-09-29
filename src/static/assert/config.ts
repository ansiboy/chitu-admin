

export type SimpleMenuItem = {
    name: string;
    path?: string | (() => string);
    icon?: string;
    children?: SimpleMenuItem[];
};

export interface WebSiteConfig {
    requirejs: RequireConfig,
    firstPanelWidth: number,
    secondPanelWidth: number,
    menuItems: SimpleMenuItem[],
}