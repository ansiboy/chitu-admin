interface Config {
    firstPanelWidth: string,
    authServiceHost: string,
    menuType: string,
}

export let config: Config = window['adminConfig'] || {}

