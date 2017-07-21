'use strict';

const express = require('express');
const router = express.Router();

const util = require('../util');
const sessionController = require('../controller/session');
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  res.reply('Hola!');
});

// 查看/创建session无需登录，登出需要
util.buildRoute([
  {path: '/sessions', method: 'get', target: 'index'},
  {path: '/sessions', method: 'post', target: 'create'},
  {path: '/sessions', method: 'delete', target: 'destroy', middlewares: [authMiddleware.login]},
], router, sessionController);

module.exports = router;
