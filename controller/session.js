'use strict';

const joi = require('joi');
const credential = require('credential');
const pw = credential();
const Promise = require('bluebird');

const BaseController = require('./base');

class SessionController extends BaseController {
  /**
   * Check session
   */
  index(req, res) {
    res.reply(req.session.user ? [req.session.user] : []);
  }

  /**
   * Create session(login)
   */
  create(req, res) {
    const rules = {
      username: joi.string().min(3).required(),
      password: joi.string().min(3).required()
    };
    const { error, value } = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    const AdminUser = this.models['AdminUser'];
    const result = AdminUser.findOne({ where: { username: value.username }, attributes: { include: ['id', 'password'] } }).then((user) => {
      if (user) {
        return pw.verify(user.password, value.password).then((result) => {
          if (result) {
            const userData = {
              id: user.id,
              username: user.username
            };
            req.session.user = userData;

            return user.getRolePermissions().then((result) => {
              userData.roles = result.roles || [];
              userData.permissions = result.permissions || [];
              return userData;
            });
          } else {
            req.session.destroy();
            return Promise.reject('Username or passwrod error!');
          }
        });
      } else {
        return Promise.reject('User not found!');
      }
    });
    return res.reply(result);
  }

  /**
   * Delete session(logout)
   */
  destroy(req, res) {
    req.session.destroy();
    return res.reply();
  }

  // Update user password
  updatePassword(req, res) {
    const rules = {
      oldPassword: joi.string().min(6).required(),
      newPassword: joi.string().min(6).required(),
      newPasswordRepeat: joi.string().min(6).required()
    };
    const { error, value } = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }
    if (value.newPassword !== value.newPasswordRepeat) {
      return res.replyError('Invalid password repetition!');
    }

    const AdminUser = this.models['AdminUser'];
    const userId = req.user.id;
    const result = AdminUser.findByPk(userId, { attributes: { include: ['password'] } }).then((user) => {
      if (user) {
        return pw.verify(user.password, value.oldPassword).then((result) => {
          if (result) {
            return pw.hash(value.newPassword).then((hash) => {
              return user.update({
                password: hash
              }).then(() => { });
            });
          } else {
            return Promise.reject('Invalid old passwrod!');
          }
        });
      } else {
        return Promise.reject('User not found!');
      }
    });
    res.reply(result);
  }
}

module.exports = new SessionController();
