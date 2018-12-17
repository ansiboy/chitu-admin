
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MasterPage } from './masterPage';
import * as chitu_react from 'maishu-chitu-react';
import * as json5 from 'json5';

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

    loadConfig(): Promise<Config> {
        if (this.config)
            return Promise.resolve(this.config)

        return new Promise((resolve, reject) => {
            requirejs(['text!config.json5'],
                (str) => {
                    this.config = json5.parse(str)
                    resolve(this.config)
                },
                (err) => {
                    reject(err)
                })
        })
    }

    /** 加载样式文件 */
    loadStyle() {
        requirejs(['text!/content/admin_style_default.less', 'less'], async (str, less) => {
            let config = await this.loadConfig();
            if (config.firstPanelWidth)
                str = str + `\r\n@firstPanelWidth: ${config.firstPanelWidth};`

            less.render(str, function (e, result) {
                if (e) {
                    console.error(e)
                    return
                }

                let style = document.createElement('style')
                document.head.appendChild(style)
                style.innerText = result.css
            })
        })
    }

    createMasterPage() {


    }

    run() {
        super.run()
        masterPage.init(this)
    }
}

let app = new Application()
export default app;





