const webpack = require('webpack');
let pkg = require("./package.json");
let license = `
 ${pkg.name} v${pkg.version}
 
 Copyright (c) 2016-2018, shu mai <ansiboy@163.com>
 Licensed under the MIT License.
`;
module.exports = {
    entry: __dirname + "/out/static/index.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist", //打包后的文件存放的地方
        filename: "static.js", //打包后输出文件的文件名
        libraryTarget: "umd",
        library: "chitu-admin"
    },
    mode: 'development',
    devtool: 'source-map',
    externals: ["json!websiteConfig",
        "text!admin_style_default",
        'react', 'react-dom', 'less', 'lessjs',
        'maishu-chitu', 'maishu-chitu-react', 'maishu-dilu',
        'maishu-services-sdk', 'maishu-toolkit', 'maishu-ui-toolkit',
        'maishu-wuzhui', 'maishu-wuzhui-helper',
    ],
    plugins: [
        new webpack.BannerPlugin(license),
    ],
    module: {
        rules: [{
            test: /\.less$/i,
            use: 'raw-loader',
        }]
    }
}