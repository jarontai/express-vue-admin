'use strict';

const express = require('express');
const router = express.Router();

const util = require('../util');
const userController = require('../controller/admin/user');
const roleController = require('../controller/admin/role');
const permissionController = require('../controller/admin/permission');
const authMiddleware = require('../middleware/auth');

// admin角色才能访问本模块接口
router.use(authMiddleware.role('admin'));

util.restRoute('/users', router, userController);
util.restRoute('/roles', router, roleController);
util.restRoute('/permissions', router, permissionController);

module.exports = router;
