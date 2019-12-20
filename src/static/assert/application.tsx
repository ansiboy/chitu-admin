import * as chitu_react from 'maishu-chitu-react';
import errorHandle from './error-handle';

export interface RequireJS {
    (modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
    ({ context: string }, modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
}


export class Application extends chitu_react.Application {
    constructor(requirejs: RequireJS, simpleContainer: HTMLElement, mainContainer: HTMLElement, blankContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer,
                blank: blankContainer,
            }
        })

        this.error.add((sender, error, page) => errorHandle(error, sender, page as chitu_react.Page));
    }

}









