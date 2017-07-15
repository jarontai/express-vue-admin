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
    const result = userModel.findOne({where: {username: value.username}}).then((user) => {
      if (user) {
        return pw.verify(user.password, value.password).then((result) => {
          if (result) {
            req.session.user = value.username;
          } else {
            req.session.destroy();
            return Promise.reject('invalid password');
          }
        });
      } else {
        return Promise.reject('user not found');
      }
    });
    return res.reply(result);
  }

  /**
   * delete session(logout)
   */
  destroy() {

  }
}

module.exports = new SessionController();
