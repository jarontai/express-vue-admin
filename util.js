'use strict';

module.exports = {
  // rest路由
  restRoute: (path, router, controller) => {
    path = path || '';
    router.get(path+'/', (req, res) => {
      controller.index(req.query).then((result) => {
        res.reply(result);
      });
    }).get(path+'/:id', (req, res) => {
      controller.show(req.params.id).then((result) => {
        res.reply(result);
      });
    }).post(path+'/', (req, res) => {
      controller.create(req.body).then((result) => {
        res.reply(result);
      });
    }).put(path+'/:id', (req, res) => {
      controller.update(req.params.id, req.body).then((result) => {
        res.reply(result);
      });
    }).delete(path+'/:id', (req, res) => {
      controller.destroy(req.params.id).then((result) => {
        res.reply(result);
      });
    });
  },
  // 是生产环境
  isProdEnv() {
    return process.env.NODE_ENV === 'production';
  },
  // 设置模型通用option
  addModelCommonOptions: (options) => {
    if (options) {
      options.freezeTableName = true;
      options.timestamps = true;

      options.getterMethods = options.getterMethods || {};
      options.getterMethods.createdAt = options.getterMethods.createdAt || function() { return this.getDataValue('created_at'); };
      options.getterMethods.updatedAt = options.getterMethods.updatedAt || function() { return this.getDataValue('updated_at'); };

      options.setterMethods = options.setterMethods || {};
      options.setterMethods.createdAt = options.setterMethods.createdAt || function(value) { return this.setDataValue('created_at', value); };

      options.charset = options.charset || 'utf8';
      options.collate = options.collate || 'utf8_general_ci';
    }
    return options;
  }
};
