'use strict';

module.exports = {
  addModelCommonOptions: (options) => {
    if (options) {
      options.freezeTableName = true;
      options.timestamps = true;

      options.getterMethods = options.getterMethods || {};
      options.getterMethods.createdAt = options.getterMethods.createdAt || function() { return this.getDataValue('created_at'); };
      options.getterMethods.updatedAt = options.getterMethods.updatedAt || function() { return this.getDataValue('updated_at'); };

      options.setterMethods = options.setterMethods || {};
      options.setterMethods.createdAt = options.setterMethods.createdAt || function(value) { return this.setDataValue('created_at', value); };

      options.charset = options.charset || 'utf8';
      options.collate = options.collate || 'utf8_general_ci';
    }
    return options;
  }
};
