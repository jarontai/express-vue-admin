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
    this.timeout(6000); // session创建费时较长

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
        expect(res.body).to.have.property('data').with.to.have.property('count').above(1);
        expect(res.body).to.have.property('data').to.have.property('rows').to.have.lengthOf.above(1);
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
