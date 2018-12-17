var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let modules = 'modules';
requirejs.config({
    shim: {},
    baseUrl: '../',
    paths: {
        less: 'node_modules/less/dist/less',
        text: 'node_modules/requirejs-text/text',
        bootstrap: 'node_modules/bootstrap',
        json5: 'node_modules/json5/dist/index',
        react: 'node_modules/react/umd/react.development',
        'react-dom': 'node_modules/react-dom/umd/react-dom.development',
        'maishu-chitu': 'node_modules/maishu-chitu/dist/chitu',
        'maishu-chitu-react': 'node_modules/maishu-chitu-react/out/index',
    }
});
requirejs(['text!bootstrap/dist/css/bootstrap.css'], (str) => __awaiter(this, void 0, void 0, function* () {
    let style = document.createElement('style');
    document.head.appendChild(style);
    style.innerText = str;
}));
var references = ['react', 'react-dom', 'application'];
requirejs(references, function (React, ReactDOM, app) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;
    window['h'] = React.createElement;
    app.default.run();
});
