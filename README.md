English | [简体中文](./README_CN.md)

# express-vue-admin

Minimal admin app build with Node.js and Vue2.

## Features
  * Fullstack JavaScript
  * Lean and tested rest api powered by Express.js
  * Minimal but fully work user/role/permission management
  * Clean UI build with the iview framework

## Components

express-vue-admin use lots of components to build the api server and frontend ui:

### Backend
* [express](https://expressjs.com/) - backend framework
* [sequelize](http://docs.sequelizejs.com/) - database ORM
* [joi](https://github.com/hapijs/joi) - validation
* [dotenv](https://github.com/motdotla/dotenv) - env config
* [mocha](https://mochajs.org/)/[chai](http://chaijs.com/)/[chai-http](https://github.com/chaijs/chai-http) - test toolchain
* mysql - database
* redis - cache
* ...

### Frontend
* [vue2](https://vuejs.org/) - main js framework
* [iview](https://www.iviewui.com/) - ui framework for vue
* [vue-resource](https://github.com/pagekit/vue-resource)/[vue-router](https://github.com/vuejs/vue-router)/[vuex](https://github.com/vuejs/vuex) - vue friends
* ...

## Files

      .
      ├── .env.example  env example
      ├── .sequelizerc  sequelize rc file
      ├── screenshots/  screenshots
      ├── web/          vue2 web app
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

## Screenshots

### login

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/login.png">
</kbd>
</p>

### admin/user

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/admin_user.png">
</kbd>
</p>

### admin/role

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/admin_role.png">
</kbd>
</p>

### admin/role delete

<p align="center">
<kbd>
  <img src="https://raw.github.com/jarontai/express-vue-admin/master/screenshots/admin_role_delete.png">
</kbd>
</p>


## How to run

 1. Install redis (optional)

 2. copy .env.example to .env (skip redis config would make session store in memory!)
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
    REDIS_HOST=localhost (optional)
    REDIS_PORT=6379 (optional)

    #misc
    ADMIN_SEED_PASSWORD=adminpwd
    TEST_SEED_PASSWORD=testpwd
    SERVER_PORT_TEST=3001

    ```

 3. install deps, do migration:
    ```
    $ npm install
    $ npx sequelize db:migrate
    $ npx sequelize db:seed:all
    ```

 4. run server and web app
    ```
    $ npm start

    $ cd ./web
    $ npm install
    $ npm run dev
    ```

## Test

Run basic api test:

```
$ npm run test
```

## License

MIT
