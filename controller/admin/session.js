'use strict';

const joi = require('joi');
const credential = require('credential');
const pw = credential();

const BaseController = require('../base');

class SessionController extends BaseController {
  /**
   * check session
   */
  index() {

  }

  /**
   * create session(login)
   */
  create(req, res) {
    const rules = {
      username: joi.string().min(3).required(),
      password: joi.string().min(3).required()
    };
    const {error, value} = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    const userModel = this.models['User'];
    userModel.findOne({where: {username: value.username}}).then((user) => {
      // TODO - login user
    });
    return res.reply(value);
  }

  /**
   * delete session(logout)
   */
  destroy() {

  }
}

module.exports = new SessionController();
