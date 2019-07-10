import { Application } from "assert/application";
import { Page } from "maishu-chitu-react";
import * as ui from "maishu-ui-toolkit";

export default function errorHandle(app: Application, error: Error, page: Page) {
    ui.alert({
        title: "错误", 
        message: error.message
    })
}