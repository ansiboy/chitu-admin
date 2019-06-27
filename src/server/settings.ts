
interface Settings {
    roleId: string, gateway: string, clientPath: string
}

export let settings: Settings = global['settings'] = global['settings'] || {}