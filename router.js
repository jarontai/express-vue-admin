'use strict';

const util = require('./util');
const adminUserCtrl = require('./controller/admin/user');
const express = require('express');
const expressListRoutes = require('express-list-routes');

// root
const rootRouter = express.Router();
rootRouter.route('/').get((req, res) => {
  res.end('Hola!');
});

// admin
const adminRouter = express.Router();
util.restRoute('/users', adminRouter, adminUserCtrl);

// 打印所有路由，便于开发调试
if (!util.isProdEnv()) {
  expressListRoutes({}, 'ROOT:', rootRouter );
  expressListRoutes({ prefix: '/admin' }, 'ADMIN:', adminRouter );
}

module.exports = {
  process: app => {
    app.use('/', rootRouter);
    app.use('/admin', adminRouter);

    return app;
  }
};
