'use strict';

require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const expressListRoutes = require('express-list-routes');

const app = express();
const port = process.env.NODE_ENV === 'test' ? process.env.SERVER_PORT_TEST || 3001 : process.env.SERVER_PORT || 3000;
const apiPath = process.env.API_PATH + '/' + process.env.API_VERSION;
const util = require('./util');
const baseRouter = require('./route/base');
const adminRouter = require('./route/admin');
const baseMiddleware = require('./middleware/base');

// 数据库
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  timezone: '+08:00',
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('Database ok.');
  })
  .catch(err => {
    console.error('Database fail.', err);
  });

// 中间件
app.all('*', function (req, res, next) {
  // 设置cors
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', 'true');  // 允许发送Cookie数据
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});
if (util.isNotProdEnv()) {
  app.use(morgan('dev'));
}
app.use(session({
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }),
  secret: 'express-vue-admin',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(baseMiddleware.reply);

// 路由
app.use(apiPath + '/', baseRouter);
app.use(apiPath + '/admin', adminRouter);

// 打印路由
if (util.isNotProdEnv()) {
  expressListRoutes({}, 'ROOT:', baseRouter);
  expressListRoutes({ prefix: '/admin' }, 'ADMIN:', adminRouter);
}

// 错误处理
app.use(baseMiddleware.notFound);
app.use(baseMiddleware.error);

// 启动
app.listen(port, () => {
  console.log(`Server listening at - ${apiPath} : ${port}`);
});

module.exports = app;
