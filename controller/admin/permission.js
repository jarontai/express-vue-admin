'use strict';

const joi = require('joi');

const RestController = require('../rest');

class PermissionController extends RestController {
  constructor() {
    super('AdminPermission');

    this.restRules = {
      create: {
        name: joi.string().min(3).required(),
        comment: joi.string().min(2).required()
      },
      update: {
        name: joi.string().min(3),
        comment: joi.string().min(2)
      }
    };

    this.model.count().then((result) => {
      if (!result || result < 5) {
        throw new Error('Default admin permissions count error! Should run sequelize seeder first!');
      }
    });
  }

}

module.exports = new PermissionController();
