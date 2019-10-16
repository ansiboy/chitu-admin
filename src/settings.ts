import { createParameterDecorator } from "maishu-node-mvc";
import { ServerContext } from "maishu-node-mvc";

export interface MyServerContext extends ServerContext {
    settings: Settings
}


export interface Settings {
    innerStaticRoot: string;
    clientStaticRoot: string;
    root: string
}


export let settings = createParameterDecorator(async (req, res, context: MyServerContext) => {
    return context.settings;
})

// export let settings: Settings = global['settings'] = global['settings'] || {}