import * as chitu_react from 'maishu-chitu-react';
import 'text!../content/admin_style_default.less'
import errorHandle from './error-handle';
import { MyService } from './services/my-service';
import { InitArguments } from 'index';
import { errors } from './errors';
import { StationConfig as WebSiteConfig } from '../types';

export interface RequireJS {
    (modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
    ({ context: string }, modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
}


export class Application extends chitu_react.Application {

    private service: MyService;
    private requirejs: RequireJS;
    private contextRequireJSs: { [name: string]: RequireJS } = {};

    constructor(requirejs: RequireJS, simpleContainer: HTMLElement, mainContainer: HTMLElement, blankContainer: HTMLElement) {
        super({
            container: {
                simple: simpleContainer,
                default: mainContainer,
                blank: blankContainer,
            },
            modulesPath: ""
        })

        this.service = this.createService(MyService);
        this.error.add((sender, error, page) => errorHandle(error, sender, page as chitu_react.Page));
        this.requirejs = requirejs;
    }

    protected loadjs(path: string) {
        this.service.files().then(files => {
            if (files.indexOf(`${path}.less`) >= 0) {
                this.requirejs([`less!${path}.less`]);
            }
            if (files.indexOf(`${path}.css`) >= 0) {
                this.requirejs([`css!${path}.css`]);
            }
        })

        let context: string;
        if (path.indexOf(":") > 0) {
            let arr = path.split(":");
            context = arr[0];
            path = arr[1];
        }

        path = `modules/${path}`;
        return new Promise<Array<any>>((reslove, reject) => {
            let req = context ? requirejs({ context }) : this.requirejs;
            req([path],
                function (result: any) {
                    reslove(result);
                },
                function (err: Error) {
                    reject(err);
                });
        });
    }

    async initStations(...paths: string[]): Promise<{ [path: string]: WebSiteConfig }> {
        if (paths == null)
            throw errors.argumentNull("paths");

        for (let i = 0; i < paths.length; i++) {
            console.assert(paths[i] != null, `paths[${i}] is null`);
            if (paths[i][0] != "/") {
                paths[i] = "/" + paths[i];
            }

            if (paths[i][paths[i].length - 1] != "/") {
                paths[i] = paths[i] + "/";
            }
        }

        let result: { [path: string]: WebSiteConfig } = {};
        let app = this;
        let responses = await Promise.all(paths.map(path => fetch(`${path}config`)))
        let configs: WebSiteConfig[] = await Promise.all(responses.map(r => r.json()));
        for (let i = 0; i < paths.length; i++) {
            let config = configs[i];

            config.requirejs = config.requirejs || {} as RequireConfig;
            console.assert(config.requirejs.context != null);
            config.requirejs.baseUrl = paths[i];
            config.requirejs.paths = config.requirejs.paths || {};

            config.requirejs.paths = Object.assign({}, defaultPaths, config.requirejs.paths);
            this.contextRequireJSs[paths[i]] = requirejs.config(config.requirejs);
            result[paths[i]] = config;
        }

        await Promise.all(paths.map((path, i) =>
            new Promise((resolve, reject) => {
                let contextName = configs[i].requirejs.context;
                console.assert(contextName != null, `Context of site '${path}' requirejs config is null`);
                requirejs({ context: contextName }, [`${path}clientjs_init`],
                    (initModule) => {
                        if (initModule && typeof initModule.default == 'function') {
                            let args: InitArguments = {
                                app, mainMaster: null,
                                requirejs: this.contextRequireJSs[path]
                            };

                            let result = initModule.default(args) as Promise<any>;
                            if (result != null && result.then != null) {
                                result.then(() => {
                                    resolve();
                                }).catch(err => {
                                    reject(err);
                                })

                                return;
                            }
                            else {
                                resolve();

                            }
                        }

                    },
                    function (err) {
                        reject(err);
                    }
                )
            })
        ));

        return result;
    }
}

let node_modules = 'node_modules'
let lib = 'assert/lib'

let defaultPaths = {
    css: `${lib}/css`,
    less: `${lib}/require-less-0.1.5/less`,
    lessc: `${lib}/require-less-0.1.5/lessc`,
    normalize: `${lib}/require-less-0.1.5/normalize`,
    text: `${lib}/text`,

    jquery: `${lib}/jquery-2.1.3`,
    "jquery.event.drag": `${lib}/jquery.event.drag-2.2/jquery.event.drag-2.2`,
    "jquery.event.drag.live": `${lib}/jquery.event.drag-2.2/jquery.event.drag.live-2.2`,

    "js-md5": `${node_modules}/js-md5/src/md5`,

    pin: `${lib}/jquery.pin/jquery.pin.min`,

    "react": `${node_modules}/react/umd/react.development`,
    "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
    "maishu-chitu": `${node_modules}/maishu-chitu/dist/index`,
    "maishu-chitu-admin": `${node_modules}/maishu-chitu-admin/dist/chitu_admin`,
    "maishu-chitu-admin/static": `${node_modules}/maishu-chitu-admin/out/static/index`,
    "maishu-chitu-react": `${node_modules}/maishu-chitu-react/dist/index`,
    "maishu-chitu-service": `${node_modules}/maishu-chitu-service/dist/index`,
    "maishu-dilu": `${node_modules}/maishu-dilu/dist/index`,
    "maishu-services-sdk": `${node_modules}/maishu-services-sdk/dist/index`,
    "maishu-image-components": `${node_modules}/maishu-image-components/index`,
    "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`,
    "maishu-node-auth": `${node_modules}/maishu-node-auth/dist/client/index`,
    "maishu-wuzhui": `${node_modules}/maishu-wuzhui/dist/index`,
    "maishu-wuzhui-helper": `${node_modules}/maishu-wuzhui-helper/dist/index`,
    "swiper": `${node_modules}/swiper/dist/js/swiper`,
    "xml2js": `${node_modules}/xml2js/lib/xml2js`,
    "polyfill": `${node_modules}/@babel/polyfill/dist/polyfill`,
    "url-pattern": `${node_modules}/url-pattern/lib/url-pattern`,
}















