'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const credential = require('credential');
const pw = credential();

const models = require('../models');
const AdminUser = models['AdminUser'];
const AdminRole = models['AdminRole'];
const AdminPermission = models['AdminPermission'];

const adminPwd = process.env.ADMIN_SEED_PASSWORD || 'adminpwd';
const testPwd = process.env.TEST_SEED_PASSWORD || 'testpwd';

module.exports = {
  up: function () {
    let adminUser, testUser, adminRole, memberRole;
    return pw.hash(adminPwd).then((hash) => {
      return AdminUser.create({
        username: 'admin',
        password: hash,
      }).then((admin) => {
        adminUser = admin;
        return pw.hash(testPwd).then((hash) => {
          return AdminUser.create({
            username: 'test',
            password: hash,
          });
        });
      }).then((user) => {
        testUser = user;
        return AdminRole.create({
          name: 'admin',
          comment: '管理员'
        }).then((role) => {
          adminRole = role;
          return AdminRole.create({
            name: 'member',
            comment: '普通用户'
          });
        }).then((role) => {
          memberRole = role;
          return adminUser.setRoles([memberRole, adminRole]).then(() => {
            return testUser.setRoles([memberRole]);
          });
        });
      }).then(() => {
        return Promise.mapSeries([
          {
            name: 'dashboard',
            comment: 'Dashboard'
          },
          {
            name: 'admin',
            comment: '后台管理'
          },
          {
            name: 'admin:user',
            comment: '后台管理:用户'
          },
          {
            name: 'admin:role',
            comment: '后台管理:角色'
          },
          {
            name: 'admin:permission',
            comment: '后台管理:权限'
          }
        ], (data) => {
          return AdminPermission.create(data);
        }).then((permissions) => {
          return memberRole.setPermissions([permissions[0]]).then(() => {
            return adminRole.setPermissions(permissions);
          });
        });
      });
    });
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('admin_user', null, {}).then(() => {
      return queryInterface.bulkDelete('admin_role', null, {});
    }).then(() => {
      return queryInterface.bulkDelete('admin_permission', null, {});
    }).then(() => {
      return queryInterface.bulkDelete('admin_user_role', null, {});
    }).then(() => {
      return queryInterface.bulkDelete('admin_role_permission', null, {});
    });
  }
};
