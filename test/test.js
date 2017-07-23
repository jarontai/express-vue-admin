'use strict';

require('dotenv').config();

process.env.NODE_ENV='test';

const apiPath = process.env.API_PATH + '/' + process.env.API_VERSION;

const server = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('index', () => {
  it('should return index', (done) => {
    chai.request(server)
        .get(apiPath)
        .end((err, res) => {
          res.status.should.be.eq(200);
          done();
        });
  });
});
