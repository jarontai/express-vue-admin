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
  }

}

module.exports = new PermissionController();
