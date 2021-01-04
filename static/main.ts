import { WebsiteConfig } from "types";

var requirejsConfig: RequireConfig = {
    "paths": {
        "text": "node_modules/maishu-requirejs-plugins/lib/text",
        "react": "node_modules/react/umd/react.development",
        "react-dom": "node_modules/react-dom/umd/react-dom.development",
        "maishu-chitu": "node_modules/maishu-chitu/dist/index.min",
        "maishu-chitu-react": "node_modules/maishu-chitu-react/dist/index.min",
        "maishu-chitu-service": "node_modules/maishu-chitu-service/dist/index.min",
        "maishu-dilu": "node_modules/maishu-dilu/dist/index.min",
        "maishu-toolkit": "node_modules/maishu-toolkit/dist/index.min",
        "maishu-ui-toolkit": "node_modules/maishu-ui-toolkit/dist/index.min",
        "maishu-wuzhui": "node_modules/maishu-wuzhui/dist/index.min",
        "maishu-wuzhui-helper": "node_modules/maishu-wuzhui-helper/dist/index.min",
        "admin_style_default": "content/admin_style_default.less",
        "maishu-nws-chitu-admin": "node_modules/maishu-nws-chitu-admin",
    }
}
fetch("./website-config.json").then(async r => {
    let config: WebsiteConfig = await r.json();
    config.requirejs = config.requirejs || {};
    config.requirejs.paths = Object.assign(config.requirejs.paths || {}, requirejsConfig.paths);

    requirejs.config(config.requirejs || {});
    requirejs(["application"]);

}).catch(err => {
    console.log(err);
})


