# express-vue-admin

## [中文README](README_CN.md)

### Admin app scaffold build with express and vue2

### Components:

* [vue2](https://vuejs.org/) - js framework
* [iview](https://www.iviewui.com/) - ui framework
* [vue-resource](https://github.com/pagekit/vue-resource)/[vue-router](https://github.com/vuejs/vue-router)/[vuex](https://github.com/vuejs/vuex) - vue components
* [express](https://expressjs.com/) - backend framework
* [sequelize](http://docs.sequelizejs.com/) - ORM
* [joi](https://github.com/hapijs/joi) - validation
* [dotenv](https://github.com/motdotla/dotenv) - env config
* [mocha](https://mochajs.org/)/[chai](http://chaijs.com/)/[chai-http](https://github.com/chaijs/chai-http) - test
* mysql - database
* redis - cache
* ...

### Structures：

      .
      ├── .env.example  env example
      ├── .sequelizerc  sequelize rc file
      ├── screenshots/  screenshots
      ├── web/          vue web app
      ├── test/         test files
      ├── server.js     server
      ├── middleware/   middlewares
      | ├── base.js     base middleware
      | ├── auth.js     auth middleware
      | └── ...
      ├── route/        routes
      | ├── base.js     base route
      | ├── admin.js    admin route
      | └── ...
      ├── controller/   controllers
      | ├── base.js     base controller
      | ├── rest.js     rest controller
      | ├── session.js  session controller
      | ├── admin/      admin controller
      | └── ...
      ├── database/     sequelize files
      | ├── models/     models
      | └── migrations/ migration files
      | └── seeders/    seeder files
      ├── util.js       util
      └── config/       config
        └── database.js sequelize-cli config

### Screenshots:

#### login

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/login.png">
</kbd>
</p>

#### admin/user

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/admin_user.png">
</kbd>
</p>

#### admin/role

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/admin_role.png">
</kbd>
</p>

#### admin/role delete

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/admin_role_delete.png">
</kbd>
</p>


### Run:

 0. Install redis

 1. copy .env.example to .env
    ```
    #server
    NODE_ENV=development
    SERVER_PORT=3000
    API_PATH=/api
    API_VERSION=v1

    #db
    DB_HOST=localhost
    DB_DATABASE=admin
    DB_USER=root
    DB_PASSWORD=root

    #redis
    REDIS_HOST=localhost
    REDIS_PORT=6379

    #misc
    ADMIN_SEED_PASSWORD=adminpwd
    TEST_SEED_PASSWORD=testpwd
    SERVER_PORT_TEST=3001

    ```
 2. install sequelize-cli
    ```
    $ npm install -g sequelize-cli
    ```
 3. install deps, do migration:
    ```
    $ npm install
    $ sequelize db:migrate
    $ sequelize db:seed:all
    ```
 4. run server and web app
    ```
    $ npm start

    $ cd ./web
    $ npm install
    $ npm run dev
    ```

### Test
```
$ npm run test
```

### TODO

* use [node_acl](https://github.com/OptimalBits/node_acl)
* i18n
* more tests
* ...
