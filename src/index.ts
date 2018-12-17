
import { Application } from './application'

//=============================================
// 用于 requirejs
define('react', function () {
    return require('react')
})

define('react-dom', function () {
    return require('react-dom')
})
//=============================================

let app = new Application()
app.run()
