'use strict';

// Auth middlewares

const apiPath = process.env.API_PATH + '/' + process.env.API_VERSION;
const sessionPath = apiPath + '/admin/sessions';
const AdminUser = require('../database/models')['AdminUser'];

// Build login requried middleware
function login(req, res, next) {
  // No need to check when get or create session
  const reqPath = req.baseUrl + req.path;
  if ((req.method === 'GET' || req.method === 'POST') && reqPath === sessionPath) {
    return next();
  }

  if (req.session.user && req.session.user.id) {
    req.user = req.session.user; // Add login user to request object
    next();
  } else {
    next({ message: 'Login please！', status: 401 });
  }
}

// Build role required middleware
function buildRoleAuth(roleName) {
  if (!roleName) {
    throw new Error('Missing or invalid role name for role auth middleware!');
  }

  const role = function (req, res, next) {
    if (!AdminUser) {
      console.error('AdminUser model is invalid!');
      return next({ message: 'Model initialize error', status: 500 });
    }

    const userId = req.session.user.id;
    AdminUser.findByPk(userId).then(user => {
      if (user) {
        user.hasRole(roleName).then(result => {
          if (result) {
            next();
          } else {
            next({ message: 'Invalid auth！', status: 403 });
          }
        });
      } else {
        next({ message: 'User not found!', status: 400 });
      }
    });
  };

  return [login, role]; // Login check go first
}

module.exports = {
  login: login,
  role: buildRoleAuth
};
