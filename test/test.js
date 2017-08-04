'use strict';

require('dotenv').config();

process.env.NODE_ENV='test';

const apiPath = process.env.API_PATH + '/' + process.env.API_VERSION;

const server = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('index', () => {
  it('should return index', function(done) {
    agent.get(apiPath)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('sessions creation', () => {
  it('should get empty session', function(done) {
    agent.get(apiPath+'/sessions')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').with.length(0);
        done();
      });
  });

  it('should create session', function(done) {
    this.timeout(6000); // 密码加密费时较长

    agent.post(apiPath+'/sessions')
      .send({
        "username": "admin",
        "password": "adminpwd"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').with.to.have.all.keys('id', 'username', 'roles', 'permissions');
        done();
      });
  });
});

describe('users', () => {
  it('should return user list', function(done) {
    agent.get(apiPath + '/admin/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').with.to.have.property('count').least(1);
        expect(res.body).to.have.property('data').to.have.property('rows').to.have.lengthOf.least(1);
        expect(res.body.data.rows[0]).to.have.all.keys('id', 'username', 'roles', 'createdAt', 'updatedAt', 'disabled');
        done();
      });
  });

  it('should return admin user', function(done) {
    agent.get(apiPath + '/admin/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').to.have.property('username').to.equal('admin');
        done();
      });
  });

  it('should update admin user', function(done) {
    this.timeout(6000); // 密码加密费时较长

    agent.put(apiPath + '/admin/users/1')
      .send({
        "username": "admin",
        "password": "adminpwd",
        "roles": ["admin"]
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
  });

  it('should return user roles', function(done) {
    agent.get(apiPath + '/admin/users/1/roles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').to.have.lengthOf.above(0);
        done();
      });
  });
});

describe('roles', () => {
  it('should return role list', function(done) {
    agent.get(apiPath + '/admin/roles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').with.to.have.property('count').above(1);
        expect(res.body).to.have.property('data').to.have.property('rows').to.have.lengthOf.above(1);
        expect(res.body.data.rows[0]).to.have.all.keys('id', 'name', 'comment', 'permissions', 'createdAt', 'updatedAt');
        done();
      });
  });
});

describe('permissions', () => {
  it('should return permission list', function (done) {
    agent.get(apiPath + '/admin/permissions')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').with.to.have.property('count').above(1);
        expect(res.body).to.have.property('data').to.have.property('rows').to.have.lengthOf.above(1);
        expect(res.body.data.rows[0]).to.have.all.keys('id', 'name', 'comment', 'createdAt', 'updatedAt');
        done();
      });
  });
});

describe('sessions delete', () => {
  it('should delete session', function(done) {
    agent.del(apiPath + '/sessions')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
