'use strict';

const util = require('../../../util');

module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define('AdminPermission', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, util.addModelCommonOptions({
    tableName: 'admin_permission'
  }));

  permission.associate = function(models) {
    models.AdminRole.belongsToMany(models.AdminPermission, {as: 'AdminPermission', through: 'admin_role_permission', foreignKey: 'rid', constraints: false});
    models.AdminPermission.belongsToMany(models.AdminRole, {as: 'AdminRole', through: 'admin_role_permission', foreignKey: 'pid', constraints: false});
  };

  return permission;
};
