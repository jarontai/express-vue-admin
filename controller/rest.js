'use strict';

const _ = require('lodash');
const BaseController = require('./base');
const models = require('../database/models');

/**
 * 控制器基类，提供默认的控制器方法，请勿修改
 *
 * @class RestController
 */
class RestController extends BaseController {
  /**
   * Creates an instance of RestController.
   *
   * @param {any} modelName
   *
   * @memberOf RestController
   */
  constructor(modelName) {
    super();

    if (modelName) {
      this.modelName = modelName;
      this.model = models[modelName];
    }
    this.models = models;
  }

  /**
   * 分页返回所有对象
   *
   * @returns {Promise}
   *
   * @memberOf RestController
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
   * @memberOf RestController
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
   * @memberOf RestController
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
   * @memberOf RestController
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
   * @memberOf RestController
   */
  destroy(id) {
    return this.model.findById(id).then((obj) => {
      if (obj) {
        return obj.destroy();
      }
    });
  }
}

module.exports = RestController;
