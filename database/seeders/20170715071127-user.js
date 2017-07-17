'use strict';

const credential = require('credential');
const pw = credential();

module.exports = {
  up: function (queryInterface, Sequelize) {
    return pw.hash('adminpwd').then((hash) => {
      return queryInterface.bulkInsert('admin_user', [{
        username: 'admin',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('admin_user', null, {});
  }
};
