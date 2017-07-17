'use strict';

const express = require('express');
const router = express.Router();

const util = require('../util');
const userController = require('../controller/admin/user');
const roleController = require('../controller/admin/role');
const permissionController = require('../controller/admin/permission');
const sessionController = require('../controller/admin/session');

util.restRoute('/users', router, userController);
util.restRoute('/roles', router, roleController);
util.restRoute('/permissions', router, permissionController);

util.mapRoute(router, [
  {path: '/sessions', method: 'get', 'target': 'index'},
  {path: '/sessions', method: 'post', 'target': 'create'},
  {path: '/sessions', method: 'delete', 'target': 'destroy'},
], sessionController);

module.exports = router;
