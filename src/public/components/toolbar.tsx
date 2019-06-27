import { Application } from "../_application";
import React = require("react");
import { Page } from "maishu-chitu";
import { config } from "../_config";

export class Toolbar extends React.Component<{ app: Application }, { currentPageName: string }> {

    private pageShowin = (sender: Application, page: Page) => {
        this.setState({ currentPageName: page.name })
    }

    constructor(props) {
        super(props)

        this.state = { currentPageName: null }
    }
    componentDidMount() {
        this.props.app.pageShowing.add(this.pageShowin)
    }
    componentWillUnmount() {
        this.props.app.pageShowing.remove(this.pageShowin)
    }
    render() {
        let showLoginButton = ['forget-password', 'login', 'register'].indexOf(this.state.currentPageName) < 0;
        return <ul>
            {showLoginButton ? <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                onClick={() => {
                    this.props.app.logout()
                    if (config.logoutRedirectURL) {
                        location.href = config.logoutRedirectURL
                        return
                    }
                    this.props.app.redirect('login')
                }}>
                <i className="icon-off"></i>
                <span style={{ paddingLeft: 4 }}>退出</span>
            </li> : null}
        </ul>
    }
}
