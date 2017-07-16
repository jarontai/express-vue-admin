'use strict';

const util = require('../../util');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
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
        exclude: ['password', 'deletedAt']
      }
    },
    scopes: {
    },
    indexes: [
    ],
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }));
};
