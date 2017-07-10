'use strict';

require('dotenv').config();

const express = require('express');

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.get('/', (req, res) => {
  res.end('Hola!');
});

app.get('/ping/:name', (req, res) => {
  res.end(`pong ${req.params.name}`);
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
