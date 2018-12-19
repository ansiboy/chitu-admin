// FOR TEST

requirejs.config({
    "paths": {
        "react": "node_modules/react/umd/react.development",
        "react-dom": "node_modules/react-dom/umd/react-dom.development",
        "modules": "out/modules/"
    }
})

requirejs(['react', 'react-dom'], function (React, ReactDOM) {
    requirejs(['dist/chitu_admin'], function (mod) {
    })
})

