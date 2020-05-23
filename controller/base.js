'use strict';

const _ = require('lodash');
const models = require('../database/models');

/**
 * Base controller
 */
class BaseController {
  /**
   * Creates an instance of BaseController.
   */
  constructor() {
    this.sequelize = models.sequelize;
    this.models = models;
  }

  /**
   * Convert model array to json with fields filtering
   *
   * @param {*} modelArr
   * @param {*} fields
   */
  filterModels(modelArr, fields) {
    return _.map(modelArr, (o) => {
      let result;
      const temp = o.toJSON();
      if (!fields || !fields.length) {
        result = temp;
      } else {
        result = {};
        _.forEach(fields, field => {
          result[field] = temp[field];
        });
      }
      return result;
    });
  }
}

module.exports = BaseController;
