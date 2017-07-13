'use strict';

const _ = require('lodash');
const models = require('../database/models');

/**
 * 控制器基类，提供默认的控制器方法，请勿修改
 *
 * @class BaseController
 */
class BaseController {
  /**
   * Creates an instance of BaseController.
   *
   * @param {any} modelName
   *
   * @memberOf BaseController
   */
  constructor(modelName) {
    if (modelName) {
      this.modelName = modelName;
      this.model = models[modelName];
    }
    this.models = models;
  }

  /**
   * 模型对象对象转换为JSON
   *
   * @param {any} arr
   *
   * @memberOf BaseController
   */
  arrayToJSON(modelArr) {
    return _.map(modelArr, (o) => {
      return o.toJSON();
    });
  }

  /**
   * 返回空对象
   *
   * @returns {Promise}
   *
   * @memberOf BaseController
   */
  empty() {
    return this.Promise.resolve({});
  }

  /**
   * 分页返回所有对象
   *
   * @returns {Promise}
   *
   * @memberOf BaseController
   */
  index(params) {
    params = params || {};
    let data = {
      offset: +params.offset || 0,
      limit: +params.limit || 100
    };
    if (params.where && _.isObject(params.where)) {
      data.where = params.where;
    }
    return this.model.findAll(data);
  }

  /**
   * 创建对象
   *
   * @param {any} data
   * @returns {Promise}
   *
   * @memberOf BaseController
   */
  create(data) {
    return this.model.create(data);
  }

  /**
   * 更新对象
   *
   * @param {any} id
   * @param {any} data
   * @returns {Promise}
   *
   * @memberOf BaseController
   */
  update(id, data) {
    return this.model.update(data, {where: {id: id}});
  }

  /**
   * 查找单个对象
   *
   * @param {any} id
   * @returns {Promise}
   *
   * @memberOf BaseController
   */
  show(id) {
    return this.model.findById(id);
  }

  /**
   * 删除单个对象
   *
   * @param {any} id
   * @returns {Promise}
   *
   * @memberOf BaseController
   */
  destroy(id) {
    return this.model.findById(id).then((obj) => {
      if (obj) {
        return obj.destroy();
      }
    });
  }
}

module.exports = BaseController;
