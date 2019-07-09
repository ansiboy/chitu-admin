import { string } from "prop-types";

export let constants = {
    buttons: {
        add: "add",
        edit: "edit",
        delete: "delete",
        view: "view",
    }
}

export let localText = function (text: string) {

    let strings = {
        add: "添加",
        edit: "编辑",
        delete: "删除",
        view: "查看",
        role_permission: "权限管理"
    }

    return strings[text] || text;

}