// FOR TEST

requirejs.config({
    "paths": {
        "react": "node_modules/react/umd/react.development",
        "react-dom": "node_modules/react-dom/umd/react-dom.development",
        "maishu-chitu":"node_modules/maishu-chitu/dist/chitu",
        "maishu-chitu-react": "node_modules/maishu-chitu-react/out/index",
        "modules": "out/modules/"
    }
})

requirejs(['react', 'react-dom', 'maishu-chitu-react'], function (React, ReactDOM) {
    requirejs(['dist/chitu_admin'], function (mod) {
    })
})

