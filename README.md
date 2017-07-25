# express-vue-admin

### 使用Express, Vue2开发的管理后台脚手架项目

### 项目构成:

* vue2 - 前端JS框架
* iview - 前端UI框架
* vue-resource/vue-router/vuex - 前端主要组件
* express - 后端web框架
* sequelize - ORM
* joi - 参数校验
* dotenv - 环境配置
* mysql - 数据库
* redis - 缓存
* ...


### 项目结构：

      .
      ├── .env.example  环境配置示例
      ├── .sequelizerc  sequelize配置
      ├── web/          vue web应用
      ├── server.js     服务器
      ├── middleware/   中间件
      | ├── base.js     基础中间件
      | ├── auth.js     鉴权中间件
      | └── ...         其他业务中间件
      ├── route/        路由
      | ├── base.js     基础路由
      | ├── admin.js    admin模块路由
      | └── ...         其他路由
      ├── controller/   控制器
      | ├── base.js     基础控制器
      | ├── rest.js     rest基础控制器
      | ├── session.js  session控制器
      | ├── admin/      admin模块控制器
      | └── ...         其他业务模块控制器
      ├── database/     sequelize数据库文件
      | ├── models/     模型
      | └── migrations/ migration文件
      | └── seeders/    seeder文件
      ├── util.js       工具
      └── config/       配置
        └── database.js sequelize-cli数据库配置

### 运行步骤:

#### TODO ...
