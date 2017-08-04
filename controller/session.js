'use strict';

const joi = require('joi');
const credential = require('credential');
const pw = credential();
const Promise = require('bluebird');

const BaseController = require('./base');

class SessionController extends BaseController {
  /**
   * check session
   */
  index(req, res) {
    res.reply(req.session.user ? [req.session.user] : []);
  }

  /**
   * create session(login)
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
            return Promise.reject('用户名或密码错误，登录失败！');
          }
        });
      } else {
        return Promise.reject('用户不存在！');
      }
    });
    return res.reply(result);
  }

  /**
   * delete session(logout)
   */
  destroy(req, res) {
    req.session.destroy();
    return res.reply();
  }

  // 更新用户密码
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
      return res.replyError('两个新密码不一致！');
    }

    const AdminUser = this.models['AdminUser'];
    const userId = req.user.id;
    const result = AdminUser.findById(userId, { attributes: { include: ['password'] } }).then((user) => {
      if (user) {
        return pw.verify(user.password, value.oldPassword).then((result) => {
          if (result) {
            return pw.hash(value.newPassword).then((hash) => {
              return user.update({
                password: hash
              }).then(() => { });
            });
          } else {
            return Promise.reject('旧密码错误！');
          }
        });
      } else {
        return Promise.reject('用户不存在！');
      }
    });
    res.reply(result);
  }
}

module.exports = new SessionController();
