'use strict';

const joi = require('joi');
const _ = require('lodash');

const BaseController = require('./base');

/**
 * REST控制器基类，提供默认的控制器方法，请勿修改
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
    let data = req.body;
    if (this.createRules) {
      const validate = joi.validate(req.body, this.createRules);
      if (validate.error) {
        return res.replyError(validate.error);
      }
      data = validate.value;
    }
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
    let data = req.body;
    if (this.updateRules) {
      const validate = joi.validate(req.body, this.updateRules);
      if (validate.error) {
        return res.replyError(validate.error);
      }
      data = validate.value;
    }

    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }

    res.reply(this.model.update(data, {where: {id: req.params.id}}));
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
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }
    res.reply(this.model.findById(req.params.id));
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
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }

    this.model.findById(req.params.id).then((obj) => {
      if (obj) {
        res.reply(obj.destroy());
      } else {
        res.replyError(this.modelName + ' not found');
      }
    });
  }
}

module.exports = RestController;
