'use strict';

const _ = require('lodash');
const joi = require('joi');

const RestController = require('../rest');

class RoleController extends RestController {
  constructor() {
    super('AdminRole');

    this.restRules = {
      create: {
        name: joi.string().min(3).required()
      },
      update: {
        name: joi.string().min(3)
      }
    };
  }

  // 获取角色权限列表
  fetchPermissions(req, res) {
    const AdminRole = this.models['AdminRole'];
    const AdminPermission = this.models['AdminPermission'];

    const promise = AdminRole.findById(req.params.id).then(role => {
      return AdminPermission.findAll({
        where: {
          '$AdminRole.id$': role.get('id')
        },
        include: [{
          model: AdminRole,
          as: 'AdminRole'
        }]
      });
    });

    res.reply(promise.then(results => {
      return this.filterModels(results, ['id', 'name']);
    }));
  }

  // 更新角色权限
  updatePermissions(req, res) {
    const rules = {
      permissions: joi.array().items(joi.object().keys({
        id: joi.number().min(1).integer(),
        name: joi.string().min(1)
      }))
    };
    const {error, value} = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    const permissionIds = _.map(value.permissions, role => {
      return role.id;
    });
    const AdminPermission = this.models['AdminPermission'];
    const AdminRole = this.models['AdminRole'];
    res.reply(AdminRole.findById(req.params.id).then(role => {
      return AdminPermission.findAll({
        where: {
          id: {$in: permissionIds}
        }
      }).then(permissions => {
        return role.setAdminPermission(permissions);
      });
    }));
  }
}

module.exports = new RoleController();
