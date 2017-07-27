'use strict';

const util = require('../../../util');

module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('AdminRole', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, util.addModelCommonOptions({
    tableName: 'admin_role'
  }));

  role.associate = function(models) {
    models.AdminUser.belongsToMany(models.AdminRole, {as: 'roles', through: 'admin_user_role', foreignKey: 'uid', constraints: false});
    models.AdminRole.belongsToMany(models.AdminUser, {as: 'users', through: 'admin_user_role', foreignKey: 'rid', constraints: false});
  };

  return role;
};
