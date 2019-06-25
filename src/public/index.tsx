import login = require('./modules/login')
import register = require('./modules/register')
import { Application } from './application';
import { MainMasterPage } from './masters/main-master-page';
import { masterPageNames } from './masters/names';
import { SimpleMasterPage } from './masters/simple-master-page';
import { Toolbar } from './components/toolbar';
import React = require('react');
import _forgetPassword = require('./modules/forget-password')
import _loginForm = require('./forms/login')
import _registerForm = require('./forms/register')
import _forgetPasswordForm = require('./forms/forget-password')

let define = window['define']
if (typeof define === "function") {
    define('./modules/forget-password', () => forgetPassword)
    define('./modules/login', () => login)
    define('./modules/register', () => register)
}

let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);

// export let app = new Application()
// let mainMasterPage = app.masterPage = app.createMasterPage(MainMasterPage) as MainMasterPage
// app.createMasterPage(SimpleMasterPage)
// mainMasterPage.setToolbar(<Toolbar app={app} />)

// app.setPageMaster('forget-password', masterPageNames.simple)
// app.setPageMaster('login', masterPageNames.simple)
// app.setPageMaster('register', masterPageNames.simple)

// export { Service } from './services/service';
export { config } from './config'
export let forgetPassword = _forgetPassword
export let loginForm = _loginForm
export let registerForm = _registerForm
export let forgetPasswordForm = _forgetPasswordForm
