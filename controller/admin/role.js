'use strict';

const joi = require('joi');

const RestController = require('../rest');

class RoleController extends RestController {
  constructor() {
    super('AdminRole');

    this.createRules = {
      name: joi.string().min(3).required()
    };

    this.updateRules = {
      name: joi.string().min(3)
    };
  }

}

module.exports = new RoleController();
