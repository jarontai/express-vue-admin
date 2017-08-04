'use strict';

const _ = require('lodash');
const joi = require('joi');
const credential = require('credential');
const pw = credential();

const RestController = require('../rest');

class UserController extends RestController {
  constructor() {
    super('AdminUser');

    this.defaultUserRole = 'member';

    const AdminRole = this.models['AdminRole'];
    AdminRole.findOne({ where: { name: this.defaultUserRole } }).then((result) => {
      if (!result) {
        throw new Error('Failed to load the default user role! Should run sequelize seeder first!');
      }
    });
  }

  /**
   * 分页返回所有对象
   */
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
    data.distinct = true;
    res.reply(this.model.findAndCount(data));
  }

  /**
   * 创建对象
   */
  create(req, res) {
    const rules = {
      username: joi.string().min(3).required(),
      password: joi.string().min(6).required(),
      disabled: joi.boolean().default(false),
      roles: joi.array().default([]),
    };
    const { error, value } = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    const AdminRole = this.models['AdminRole'];
    const creationRoles = value.roles;
    creationRoles.push(this.defaultUserRole);

    const result = pw.hash(value.password).then((hash) => {
      value.password = hash;
      delete value.roles;
      return AdminRole.findAll({ where: { name: { $in: creationRoles } } });
    }).then((roles) => {
      return this.sequelize.transaction((t) => {
        return this.model.create(value, { transaction: t }).then((user) => {
          return user.setRoles(roles, { transaction: t }).then(() => { });
        });
      });
    });
    res.reply(result);
  }

  /**
   * 更新对象
   */
  update(req, res) {
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }
    const rules = {
      username: joi.string().min(3),
      password: joi.string().min(6),
      disabled: joi.boolean(),
      roles: joi.array(),
    };
    const { error, value } = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    let updateRoles;
    const AdminRole = this.models['AdminRole'];
    const result = Promise.resolve().then(() => {
      if (value.password) {
        return pw.hash(value.password).then((hash) => {
          value.password = hash;
        });
      }
    }).then(() => {
      if (value.roles) {
        return AdminRole.findAll({ where: { name: { $in: value.roles } } }).then((roles) => {
          updateRoles = roles;
        });
      }
    }).then(() => {
      delete value.roles;
      return this.model.findById(req.params.id).then((user) => {
        if (user && user.name === 'admin' && value.username) {
          // 禁止修改默认的admin用户名称
          console.error('Found updates to admin username');
          delete value.username;
          console.error('Abandon updates to admin username');
        }
        return this.sequelize.transaction((t) => {
          return user.update(value, { transaction: t }).then((user) => {
            return user.setRoles(updateRoles, { transaction: t }).then(() => { });
          });
        });
      });
    });
    res.reply(result);
  }

  // 获取用户角色列表
  fetchRoles(req, res) {
    const AdminRole = this.models['AdminRole'];
    const promise = this.model.findById(req.params.id).then(user => {
      return AdminRole.findAll({
        where: {
          '$users.id$': user.get('id')
        },
        include: [{
          model: this.model,
          as: 'users'
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
      roles: joi.array()
    };
    const { error, value } = joi.validate(req.body, rules);
    if (error) {
      return res.replyError(error);
    }

    const AdminRole = this.models['AdminRole'];
    res.reply(this.model.findById(req.params.id).then(user => {
      return AdminRole.findAll({
        where: {
          name: { $in: value.roles }
        }
      }).then(roles => {
        return user.setAdminRole(roles);
      });
    }));
  }

  /**
  * 删除单个对象
  */
  destroy(req, res) {
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }

    this.model.findById(req.params.id).then((obj) => {
      if (obj) {
        if (obj.name === 'admin') {
          res.replyError('Admin can\'t be deleted!');
        } else {
          res.reply(obj.destroy());
        }
      } else {
        res.replyError(this.modelName + ' not found');
      }
    });
  }
}

module.exports = new UserController();
