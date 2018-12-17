let modules = 'modules'
requirejs.config({
    shim: {
    },
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


requirejs(['text!bootstrap/dist/css/bootstrap.css'], async (str) => {
    let style = document.createElement('style')
    document.head.appendChild(style)
    style.innerText = str
})

var references = ['react', 'react-dom', 'application'];
requirejs(references, function (React, ReactDOM, app) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;
    window['h'] = React.createElement;
    app.default.run();

});



