import { DataSource, DataControlField } from "maishu-wuzhui";
import { MenuItem } from "assert/masters/main-master-page";
import { createGridView } from "maishu-wuzhui-helper";
import { GridView } from "maishu-wuzhui"
import { loadItemModule } from "./common";
// import { PermissionService } from "assert/services/index";

type ListViewArguments<T> = {
    element: HTMLElement,
    dataSource: DataSource<T>,
    columns: DataControlField<T>[],
    menuItems: MenuItem[],
    resourceId: string,
    pageSize?: number,
    transform?: (items: T[]) => T[],
    context?: object,
}

export class ListView<T> {
    private _gridView: GridView<T>;

    constructor(args: ListViewArguments<T>) {
        this.initElement(args.element);

        let resource = args.menuItems.filter(o => o.id == args.resourceId)[0];
        console.assert(resource != null);
        let parentDeep = this.parentDeep(resource);
        if (parentDeep > 1) {
            let backButton = args.element.querySelector("button");
            backButton.style.removeProperty("display");
            backButton.onclick = () => history.back();
        }

        let navBar = args.element.querySelector("ul");
        this.loadTopControls(args).then(controls => {
            controls.reverse();
            controls.map(ctrl => {
                let li = document.createElement("li");
                li.className = "pull-right";
                li.appendChild(ctrl);
                return li;

            }).forEach(li => {
                navBar.appendChild(li);
            })

        })


        let tableElement = this.createGridView(args);
        args.element.appendChild(tableElement);

    }

    get gridView() {
        return this._gridView;
    }

    private parentDeep(menuItem: MenuItem) {
        let deep = 0;
        let parent = menuItem.parent;
        while (parent) {
            deep = deep + 1;
            parent = parent.parent;
        }

        return deep;
    }

    private initElement(element: HTMLElement) {
        element.innerHTML = `
        <div class="tabbable">
            <ul class="nav nav-tabs" style="min-height:34">
                <li class="pull-right">
                    <button class="btn btn-primary pull-right" style="display:none;">
                        <i class="icon-reply"></i>
                        <span>返回</span>
                    </button>
                </li>
            </ul>
        </div>
        `
    }

    private createGridView(args: ListViewArguments<T>) {
        let tableElement = document.createElement("table");

        let tableIsFixed = args.pageSize == null;
        let { dataSource, columns, pageSize } = args;
        this._gridView = createGridView({
            element: tableElement,
            dataSource: dataSource,
            columns: columns,
            pageSize: args.pageSize,
            pagerSettings: {
                activeButtonClassName: 'active',
                buttonContainerWraper: 'ul',
                buttonWrapper: 'li',
                buttonContainerClassName: 'pagination',
                showTotal: true
            },
            sort: args.transform,
            showHeader: !tableIsFixed,
        })

        if (tableIsFixed) {
            tableElement.style.maxWidth = "unset";
            tableElement.style.width = "calc(100% + 18px)";
            let element = document.createElement("div");
            element.innerHTML = `
            <table class="table table-striped table-bordered table-hover" style=" margin: 0 ">
                <thead>
                    <tr>
     
                    </tr>
                </thead>
            </table>
            <div style="height: calc(100% - 160px); width: calc(100% - 290px); position: absolute; overflow-y: scroll; overflow-x: hidden">
            </div>
            `;

            let div = element.querySelector("div");
            div.appendChild(tableElement);

            let tableHeader = element.querySelector("tr");
            columns.map((col, i) => {
                let th = document.createElement("th");
                console.assert(col != null, "col is null");

                if (col.itemStyle)
                    th.style.width = col.itemStyle["width"];

                th.innerHTML = col.headerText;
                return th;
            }).forEach(th => {
                tableHeader.appendChild(th);
            })

            return element;
        }



        return tableElement;
    }


    private async loadTopControls(args: ListViewArguments<T>): Promise<HTMLElement[]> {
        let resource_id = args.resourceId;
        if (!resource_id) return null

        let resources = args.menuItems;
        let menuItem = resources.filter(o => o.id == resource_id)[0];
        console.assert(menuItem != null)
        let menuItemChildren = resources.filter(o => o.parent_id == menuItem.id);
        let controlResources = menuItemChildren.filter(o => o.data != null && o.data.position == "top");
        let controlFuns = await Promise.all(controlResources.map(o => loadItemModule(o.page_path)));

        let controls = controlFuns.map((func, i) => func({ resource: controlResources[i], dataItem: {}, context: args.context }));
        return controls;
    }
}

