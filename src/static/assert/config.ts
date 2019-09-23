
export type SimpleMenuItem = {
    name: string;
    path?: string | (() => string);
    icon?: string;
    children?: SimpleMenuItem[];
};

export let config = {
    firstPanelWidth: 130,
    secondPanelWidth: 130,
    loginRedirectURL: "",
    logoutRedirectURL: "",
    registerRedirectURL: "",
    menuItems: [] as SimpleMenuItem[]
}

export default config;

export type WebSiteConfig = typeof config;