'use strict';

require('dotenv').config();

const dbConfig = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": 'mysql'
};

const config = {
  "development": dbConfig,
  "test": dbConfig,
  "production": dbConfig
};

module.exports = config;
