
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MasterPage } from './masterPage';
import * as chitu_react from 'maishu-chitu-react';
import * as fs from 'fs';

let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
let masterPage = ReactDOM.render(<MasterPage />, element) as MasterPage;

interface Config {
    firstPanelWidth: string
}


export class Application extends chitu_react.Application {
    private config: Config;

    constructor() {
        super({ container: masterPage.pageContainer })

        this.loadConfig()
        this.loadStyle()
    }

    loadConfig(): Config {
        if (!this.config) {
            this.config = window['adminConfig'] || {}
        }

        return this.config
    }

    protected defaultPageNodeParser() {
        let nodes: { [key: string]: chitu.PageNode } = {}
        let p: chitu.PageNodeParser = {
            actions: {},
            parse: (pageName) => {
                let node = nodes[pageName];
                if (node == null) {
                    let path = `modules_${pageName}`.split('_').join('/');
                    node = { action: this.createDefaultAction(path, loadjs), name: pageName };
                    nodes[pageName] = node;
                }
                return node;
            }
        }
        return p
    }

    /** 加载样式文件 */
    loadStyle() {
        let str = fs.readFileSync("content/admin_style_default.less").toString();
        let config = this.config
        if (config.firstPanelWidth) {
            str = str + `\r\n@firstPanelWidth: ${config.firstPanelWidth};`
        }
        let less = window['less']
        less.render(str, function (e, result) {
            if (e) {
                console.error(e)
                return
            }

            let style = document.createElement('style')
            document.head.appendChild(style)
            style.innerText = result.css
        })
    }

    createMasterPage() {


    }

    run() {
        super.run()
        masterPage.init(this)
    }
}

function loadjs(path: string): Promise<any> {
    return new Promise<Array<any>>((reslove, reject) => {
        requirejs([path],
            function (result: any) {
                reslove(result);
            },
            function (err: Error) {
                reject(err);
            });
    });
}

// let app = new Application()
// export default app;





