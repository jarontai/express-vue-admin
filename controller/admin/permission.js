'use strict';

const joi = require('joi');

const RestController = require('../rest');

class PermissionController extends RestController {
  constructor() {
    super('AdminPermission');

    this.restRules = {
      create: {
        name: joi.string().min(3).required()
      },
      update: {
        name: joi.string().min(3)
      }
    };
  }

}

module.exports = new PermissionController();
