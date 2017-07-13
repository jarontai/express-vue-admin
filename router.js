'use strict';

module.exports = app => {
  // routes
  app.get('/', (req, res) => {
    res.end('Hola!');
  });

  app.get('/ping/:name', (req, res) => {
    res.end(`pong ${req.params.name}`);
  });

  return app;
};
