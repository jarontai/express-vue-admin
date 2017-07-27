'use strict';

const util = require('../../../util');

module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define('AdminPermission', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, util.addModelCommonOptions({
    tableName: 'admin_permission'
  }));

  permission.associate = function(models) {
    models.AdminRole.belongsToMany(models.AdminPermission, {as: 'permissions', through: 'admin_role_permission', foreignKey: 'rid', constraints: false});
    models.AdminPermission.belongsToMany(models.AdminRole, {as: 'roles', through: 'admin_role_permission', foreignKey: 'pid', constraints: false});
  };

  return permission;
};
