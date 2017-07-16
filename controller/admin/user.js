'use strict';

const joi = require('joi');

const RestController = require('../rest');

class UserController extends RestController {
  constructor() {
    super('User');

    this.createRules = {
      username: joi.string().min(3).required(),
      password: joi.string().min(6).required()
    };

    this.updateRules = {
      username: joi.string().min(3),
      password: joi.string().min(6)
    };
  }


}

module.exports = new UserController();
