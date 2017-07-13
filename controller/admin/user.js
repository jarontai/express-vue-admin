'use strict';

const BaseCtrl = require('../base');

class UserCtrl extends BaseCtrl {
  constructor() {
    super('User');
  }
}

module.exports = new UserCtrl();
