'use strict';

const _ = require('lodash');
const joi = require('joi');

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
    const {error, value} = joi.validate(req.body, rules);
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
          id: {$in: roleIds}
        }
      }).then(roles => {
        return user.setAdminRole(roles);
      });
    }));
  }
}

module.exports = new UserController();
