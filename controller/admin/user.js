'use strict';

const RestController = require('../rest');

class UserController extends RestController {
  constructor() {
    super('User');
  }
}

module.exports = new UserController();
