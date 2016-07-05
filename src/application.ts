import chitu = require('chitu');
import service = require('services/service');
import ko = require('knockout');

// class LoginModel {
//     username = ko.observable<string>();
//     password = ko.observable<string>();
//     login() {
//         app.showContent();
//     }
// }

class Application extends chitu.Application {
    private _contentElement: HTMLElement;
    //private _loginElement: HTMLElement;

    constructor() {
        super({
            container: (routeData: chitu.RouteData, prevous: chitu.PageContainer) => {
                var c: chitu.PageContainer = chitu.PageContainerFactory.createInstance(this, routeData, prevous);

                console.assert(this._contentElement != null);
                this._contentElement.appendChild(c.element);
                return c;
            }
        });

        this._contentElement = document.getElementById('mainContent');
        //let container = $(this._contentElement).parents('.main-container-inner').first();
        // this._loginElement = container.next('[name="login"]')[0];
        // console.assert(this._loginElement != null);

        // let loginModel = new LoginModel();
        // ko.applyBindings(loginModel, this._loginElement);
    }
    // showLogin() {
    //     let container = $(this._contentElement).parents('.main-container-inner').first();
    //     container.hide();
    //     container.next('[name="login"]').show();
    // }
    // showContent() {
    //     let container = $(this._contentElement).parents('.main-container-inner').first();
    //     container.show();
    //     container.next('[name="login"]').hide();
    // }
}

let app: Application = window['app'] = window['app'] || new Application();
app.run();

// if (!service.token) {
//     app.showLogin();
// }
// else {
//     app.showContent();
// }

export = app;