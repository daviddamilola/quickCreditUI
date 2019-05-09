"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint linebreak-style: ["error", "windows"] */
var serverAgent = _supertest["default"].agent(_server["default"]);

describe('user should be able to signup', function () {
  it('GET /api/v1/auth/signup should return the user sign up form', function (done) {
    serverAgent.get('/api/v1/auth/signup').end(function (err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });
  it('GET /api/v1/auth/signup should retutn an object', function (done) {
    serverAgent.get('/api/v1/auth/signup').expect(200).end(function (err, res) {
      res.body.should.be.an.instanceOf(Object);
      Object.keys(res.body).length.should.equal(2);
      done();
    });
  });
  it('POST /api/v1/auth/signup should save a user to db and return user', function (done) {
    serverAgent.post('/api/v1/auth/signup').send({
      email: 'lorem@ipsum.com',
      password: 'password',
      confirmPassword: 'password'
    }).end(function (err, res) {
      res.body.status.should.equal(201);
      res.body.data.should.ownProperty('token');
      res.body.data.should.ownProperty('id');
      res.body.should.ownProperty('data');
      res.body.data.should.be.an.instanceOf(Object);
      res.body.data.should.have.property('email', 'lorem@ipsum.com');
      done();
    });
  });
  it('POST /api/v1/auth/signup should return object with error property if passwords dont match', function (done) {
    serverAgent.post({
      email: 'lorem@ipsum.com',
      password: 'password',
      confirmPassword: 'notpassword'
    }).end(function (err, res) {
      res.status.should.be.equal(400);
      res.body.error.should.be.equal('passwords are not the same');
    });
    done();
  });
});