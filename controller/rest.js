'use strict';

const joi = require('joi');
const _ = require('lodash');

const BaseController = require('./base');

/**
 * REST控制器基类，提供默认的Rest请求方法，必须绑定模型
 */
class RestController extends BaseController {
  /**
   * Creates an instance of RestController.
   *
   * @param {any} modelName
   *
   */
  constructor(modelName) {
    super();

    // rest操作参数校验规则
    this.restRules = {};
    // 示例
    // this.restRules = {
    //   create: {
    //     name: joi.string().min(3).required(),
    //     comment: joi.string().min(2).required()
    //   },
    //   update: {
    //     name: joi.string().min(3),
    //     comment: joi.string().min(2)
    //   }
    // };

    // 绑定模型
    if (modelName) {
      this.modelName = modelName;
      this.model = this.models[modelName];
      if (!this.model) {
        throw new Error(`The model ${modelName} for rest controller is missing or invalid!`);
      }
    } else {
      throw new Error('Rest controller should bind to a model!');
    }
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
    res.reply(this.model.findAndCount(data));
  }

  /**
   * 创建对象
   */
  create(req, res) {
    let data = req.body;
    if (this.restRules.create) {
      const validate = joi.validate(req.body, this.restRules.create);
      if (validate.error) {
        return res.replyError(validate.error);
      }
      data = validate.value;
    }
    res.reply(this.model.create(data));
  }

  /**
   * 更新对象
   */
  update(req, res) {
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }

    let data = req.body;
    if (this.restRules.update) {
      const validate = joi.validate(req.body, this.restRules.update);
      if (validate.error) {
        return res.replyError(validate.error);
      }
      data = validate.value;
    }
    res.reply(this.model.update(data, { where: { id: req.params.id } }));
  }

  /**
   * 查找单个对象
   */
  show(req, res) {
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }
    res.reply(this.model.findById(req.params.id));
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
        res.reply(obj.destroy());
      } else {
        res.replyError(this.modelName + ' not found');
      }
    });
  }
}

module.exports = RestController;
