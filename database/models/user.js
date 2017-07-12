'use strict';

const util = require('../../util');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    disabled: DataTypes.BOOLEAN
  }, util.addModelCommonOptions({
    tableName: 'user',
    classMethods: {
      associate: (models) => {
        // models.User.hasOne(models.UserStatistic, {foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
        // models.User.hasMany(models.Video, {as: 'Videos', constraints: false});
      }
    },
    defaultScope: {
      attributes: {
        exclude: ['password', 'salt']
      }
    },
    scopes: {
    },
    indexes: [
    ],
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }));
};
