# Admin-Scaffold（后台脚手架）

后台脚手架，为后台开发而准备

1. 安装

   ```
   npm i maishu-nws-chitu-admin
   ```

1. 项目文件夹结构

   ```
   website
   |--controllers
   |--static
   |--|--modules
   |--|--website-config.json
   |--nws-config.json
   ```

   **说明**

   1. controllers 用于放置 node-mvc 的控制器
   1. static 用于存放静态文件
   1. website-config.json 用于和网站页面相关的配置

1. 网站的配置

   website-config.json 文件结构如下

   ```ts
   {
       "requirejs": {
           "deps": string[];
           "paths": {  [key: string]: string;  }
       },
       "menuItems": [
           {
               "id": string,
               "icon": string,
               "name": string,
               "path": string,
               "roleIds": string[],
               "children": MenuItem[]
           }
       ]
   }
   ```

   其中 requirejs 用于配置 requirejs 的加载，menuItems 用于配置页面的菜单。

   MenuItem 各个字段：

   1. id，菜单项的编号，使用 guid
   1. icon，图标类名，系统内置了 bootstrap 和 Font Awesome 图标
   1. name, 菜单项名称
   1. path, 页面路径
   1. roleIds, 一个或者多个角色编号，使用数组
   1. children, 子菜单
