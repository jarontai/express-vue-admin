'use strict';

const joi = require('joi');
const _ = require('lodash');

const BaseController = require('./base');

/**
 * Base rest controller, needs model binding
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

    // Parameters validate rules
    // Example:
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
    this.restRules = {};

    // Model binding
    if (modelName) {
      this.modelName = modelName;
      this.model = this.models[modelName];
      if (!this.model) {
        throw new Error(`The rest controller binding model ${modelName} is missing or invalid!`);
      }
    } else {
      throw new Error('Rest controller should bind to a model!');
    }
  }

  /**
   * List model with limit and offset
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
    res.reply(this.model.findAndCountAll(data));
  }

  /**
   * Create model
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
   * Update model
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
   * Show model
   */
  show(req, res) {
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }
    res.reply(this.model.findByPk(req.params.id));
  }

  /**
   * Delete model
   */
  destroy(req, res) {
    if (!req.params || !req.params.id) {
      return res.replyError('missing id parameter');
    }

    this.model.findByPk(req.params.id).then((obj) => {
      if (obj) {
        res.reply(obj.destroy());
      } else {
        res.replyError(this.modelName + ' not found');
      }
    });
  }
}

module.exports = RestController;
