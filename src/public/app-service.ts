import { Service as BaseService } from 'maishu-chitu-service';
import { MenuItem } from 'masters/main-master-page';

export class AppService extends BaseService {
    menuList() {
        return this.get<MenuItem[]>('menu/list')
    }
}