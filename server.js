'use strict';

require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = process.env.SERVER_PORT || 3000;
const router = require('./router');
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
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// 中间件
app.use(baseMiddleware.reply);

// 错误处理
app.use(baseMiddleware.error);

// 加载路由启动
router(app).listen(port, () => {
  console.log(`Server listening at ${port}`);
});

