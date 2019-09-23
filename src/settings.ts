import { createParameterDecorator } from "maishu-node-mvc";
import { ServerContext } from "maishu-node-mvc/dist/server-context";

export interface MyServierContext extends ServerContext {
    settings: Settings
}


export interface Settings {
    innerStaticRoot: string;
    clientStaticRoot: string;
}


export let settings = createParameterDecorator(async (req, res, context: MyServierContext) => {
    return context.settings;
})

// export let settings: Settings = global['settings'] = global['settings'] || {}