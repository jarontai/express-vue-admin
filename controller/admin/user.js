'use strict';

const _ = require('lodash');
const joi = require('joi');
const credential = require('credential');
const pw = credential();

const RestController = require('../rest');

class UserController extends RestController {
  constructor() {
    super('AdminUser');

    this.restRules = {
      create: {
        username: joi.string().min(3).required(),
        password: joi.string().min(6).required()
      },
      update: {
        username: joi.string().min(3),
        password: joi.string().min(6)
      }
    };
  }

  index(req, res) {
    const params = req.query || {};
    const data = {
      offset: +params.offset || 0,
      limit: +params.limit || 10
    };
    if (params.where && _.isObject(params.where)) {
      data.where = params.where;
    }
    const AdminRole = this.models['AdminRole'];
    data.include = [{ model: AdminRole, as: 'roles' }];
    res.reply(this.model.findAndCount(data));
  }

  // 获取用户角色列表
  fetchRoles(req, res) {
    const AdminRole = this.models['AdminRole'];
    const AdminUser = this.models['AdminUser'];

    const promise = AdminUser.findById(req.params.id).then(user => {
      return AdminRole.findAll({
        where: {
          '$AdminUser.id$': user.get('id')
        },
        include: [{
          model: AdminUser,
          as: 'AdminUser'
        }]
      });
    });

    res.reply(promise.then(results => {
      return this.filterModels(results, ['id', 'name']);
    }));
  }

  // 更新用户角色
  updateRoles(req, res) {
    const rules = {
      roles: joi.array().items(joi.object().keys({
        id: joi.number().min(1).integer(),
        name: joi.string().min(1)
      }))
    };
    const { error, value } = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    const roleIds = _.map(value.roles, role => {
      return role.id;
    });
    const AdminUser = this.models['AdminUser'];
    const AdminRole = this.models['AdminRole'];
    res.reply(AdminUser.findById(req.params.id).then(user => {
      return AdminRole.findAll({
        where: {
          id: { $in: roleIds }
        }
      }).then(roles => {
        return user.setAdminRole(roles);
      });
    }));
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

    const userId = req.user.id;
    const result = this.model.findById(userId, { attributes: { include: ['password'] } }).then((user) => {
      if (user) {
        return pw.verify(user.password, value.oldPassword).then((result) => {
          if (result) {
            return pw.hash(value.newPassword).then((hash) => {
              return user.update({
                password: hash
              }).then(() => {});
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

module.exports = new UserController();
