'use strict';

require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = process.env.SERVER_PORT || 3000;

// db
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  timezone: '+08:00',
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// routes
app.get('/', (req, res) => {
  res.end('Hola!');
});

app.get('/ping/:name', (req, res) => {
  res.end(`pong ${req.params.name}`);
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
