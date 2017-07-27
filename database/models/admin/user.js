'use strict';

const _ = require('lodash');
const util = require('../../../util');
const Promise = require('bluebird');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('AdminUser', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    username: DataTypes.STRING,
    disabled: DataTypes.BOOLEAN,
    password: DataTypes.STRING
  }, util.addModelCommonOptions({
    tableName: 'admin_user',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    }
  }));

  user.prototype.hasRole = function (roleName) {
    return this.getRoles().then(roles => {
      let result = false;
      if (roleName && roles && roles.length) {
        _.forEach(roles, role => {
          if (role.get('name') === roleName) {
            result = true;
            return false;
          }
        });
      }
      return result;
    });
  };

  user.prototype.getRolePermissions = function () {
    const result = {
      roles: [],
      permissions: []
    };
    return this.getRoles().then((roles) => {
      roles = roles || [];
      const promises = _.map(roles, (role) => {
        result.roles.push(role.name);
        return role.getPermissions();
      });
      return Promise.all(promises).then((permissions) => {
        permissions = _.flatten(permissions || []);
        _.each(permissions, (permission) => {
          result.permissions.push(permission.name);
        });
        return result;
      });
    });
  };

  return user;
};
