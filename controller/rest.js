'use strict';

const _ = require('lodash');
const BaseController = require('./base');

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
      this.model = this.models[modelName];
    }
  }

  /**
   * 分页返回所有对象
   *
   * @returns {Promise}
   *
   * @memberOf RestController
   */
  index(req, res) {
    const params = req.query || {};
    const data = {
      offset: +params.offset || 0,
      limit: +params.limit || 100
    };
    if (params.where && _.isObject(params.where)) {
      data.where = params.where;
    }
    res.reply(this.model.findAll(data));
  }

  /**
   * 创建对象
   *
   * @param {any} data
   * @returns {Promise}
   *
   * @memberOf RestController
   */
  create(req, res) {
    const data = req.body || {};
    res.reply(this.model.create(data));
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
  update(req, res) {
    const data = req.body || {};
    const params = req.params || {};
    res.reply(this.model.update(data, {where: {id: params.id}}));
  }

  /**
   * 查找单个对象
   *
   * @param {any} id
   * @returns {Promise}
   *
   * @memberOf RestController
   */
  show(req, res) {
    const data = req.query || {};
    res.reply(this.model.findById(data.id));
  }

  /**
   * 删除单个对象
   *
   * @param {any} id
   * @returns {Promise}
   *
   * @memberOf RestController
   */
  destroy(req, res) {
    const params = req.params || {};
    this.model.findById(params.id).then((obj) => {
      if (obj) {
        res.reply(obj.destroy());
      }
    });
  }
}

module.exports = RestController;
