# express-vue-admin

## Under construction ...

项目结构：

      .
      ├── web/          web app
      ├── server.js     服务器
      ├── router.js     路由
      ├── util.js       工具
      ├── middleware/   中间件
      | ├── base.js     基础中间件
      | └── ...         其他业务中间件
      ├── controller/   控制器
      | ├── base.js     基础控制器
      | ├── rest.js     rest控制器
      | ├── admin/      admin模块控制器
      | └── ...         其他业务模块控制器
      ├── database/     sequelize数据库文件
      | ├── models/     模型
      | └── migrations/ migration文件
      └── config/       配置
        └── database.js sequelize-cli数据库配置
