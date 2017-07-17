'use strict';

const joi = require('joi');

const RestController = require('../rest');

class PermissionController extends RestController {
  constructor() {
    super('AdminPermission');

    this.createRules = {
      name: joi.string().min(3).required()
    };

    this.updateRules = {
      name: joi.string().min(3)
    };
  }

}

module.exports = new PermissionController();
