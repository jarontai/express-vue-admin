'use strict';

const util = require('../../../util');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AdminUser', {
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
};
