'use strict';

const _ = require('lodash');
const util = require('../../../util');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('AdminUser', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, util.addModelCommonOptions({
    tableName: 'admin_user',
    defaultScope: {
      attributes: {
        exclude: ['password', 'deletedAt']
      }
    }
  }));

  user.prototype.hasRole = function(roleName) {
    return this.getAdminRole().then(roles => {
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

  return user;
};
