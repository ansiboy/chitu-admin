
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MasterPage, Menu } from './masterPage';
import * as chitu_react from 'maishu-chitu-react';
import * as fs from 'fs';
import { config } from './config';
import { UserService } from './services/user';

let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
let masterPage = ReactDOM.render(<MasterPage />, element) as MasterPage;


export class Application extends chitu_react.Application {

    constructor() {
        super({ container: masterPage.pageContainer })

    }


    protected defaultPageNodeParser() {
        let nodes: { [key: string]: chitu.PageNode } = {}
        let p: chitu.PageNodeParser = {
            actions: {},
            parse: (pageName) => {
                let node = nodes[pageName];
                if (node == null) {
                    let path = `modules/${pageName}`;
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

    async loadMenus() {

        let userService = this.currentPage.createService(UserService)
        let resources = await userService.resources()

        let menus = resources.filter(o => o.parent_id == null)
            .map(o => ({
                name: o.name,
                path: o.path,
                children: []
            } as Menu))

        masterPage.setState({ menus })
    }

    createMasterPage() {
    }

    run() {
        super.run()
        this.loadStyle()
        this.loadMenus()
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






