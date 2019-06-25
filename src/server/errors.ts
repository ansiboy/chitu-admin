export let errors = {
    settingItemNull(name: string) {
        let msg = `Setting item '${name}' is null.`
        return new Error(msg)
    }
}