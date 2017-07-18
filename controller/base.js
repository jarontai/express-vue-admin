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
   */
  constructor() {
    this.models = models;
  }

  /**
   * 模型对象对象转换为JSON
   *
   * @param {any} arr
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
   */
  empty() {
    return this.Promise.resolve({});
  }
}

module.exports = BaseController;
