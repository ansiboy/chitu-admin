import { Service as BaseService } from 'maishu-chitu-service';
import { MenuItem } from 'masters/main-master-page';

export class AppService extends BaseService {
    async menuList() {
        let items = await this.get<MenuItem[]>('menu/list');
        let arr = new Array<MenuItem>()
        let stack = [...items]
        while (stack.length > 0) {
            let item = stack.pop();
            arr.push(item);
            (item.children || []).forEach(o => {
                arr.push(o)
            })
        }

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].parentId) {
                arr[i].parent = arr.filter(o => o.id == arr[i].parentId)[0]
            }
        }

        return items;
    }
}