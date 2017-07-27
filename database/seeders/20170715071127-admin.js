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

module.exports = {
  up: function () {
    return pw.hash(adminPwd).then((hash) => {
      return AdminUser.create({
        username: 'admin',
        password: hash,
      }).then((user) => {
        return AdminRole.create({
          name: 'admin'
        }).then((role) => {
          return user.setRoles([role]).then(() => {
            return role;
          });
        });
      }).then((role) => {
        return Promise.mapSeries([
          {
            name: 'dashboard'
          },
          {
            name: 'admin'
          },
          {
            name: 'admin:user'
          },
          {
            name: 'admin:role'
          },
          {
            name: 'admin:permission'
          }
        ], (data) => {
          return AdminPermission.create(data);
        }).then((permissions) => {
          return role.setPermissions(permissions);
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
