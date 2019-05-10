import chai from 'chai';
import supertest from 'supertest';
import users from '../models/usersDb';
import loanHandler from '../controllers/loansHandler';
import Loan from '../models/loans/Loan';
import server from '../server';
import auth from '../middleware/auth';
import authorize from '../middleware/authorize';
import utils from '../utils/utills';

const { expect } = chai;
describe('User', () => {
  beforeEach((done) => {
    // empty database
    users.splice(0, users.length);
    // call done()
    done();
  });
});

describe('signup route', () => {
  it('GET /api/v1/auth/signup should return the user sign up form', (done) => {
    supertest(server)
      .get('/api/v1/auth/signup')
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(200);
        done();
      });
  });
  it('should signup a user ', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'lorem@ipsum.com',
        firstName: 'lorem',
        lastName: 'ipsum',
        password: 'lorem001',
        address: '1,lorem street',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(201);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(body).to.have.property('data');
        expect(body.data).to.have.property('email');
        expect(body.data).to.have.property('firstName');
        expect(body.data).to.have.property('lastName');
        expect(res.status).to.a('number');
        done();
      });
  });

  it('should not signup an existing user ', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'lorem@ipsum.com',
        firstName: 'lorem',
        lastName: 'ipsum',
        password: 'lorem001',
        address: '1,lorem street',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(409);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(body).to.have.property('error');
        expect(body.error).to.equal('existent user');
        expect(res.status).to.a('number');
        done();
      });
  });
  const user1 = {
    email: 'lorem',
    firstName: 'lorem45',
    lastName: 'ipsum234',
    password: 'lorem',
    address: 'unknown',
  };
  it('should not signup user with invalid details ', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send(user1)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(406);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(body).to.have.property('error');
        expect(res.status).to.a('number');
        done();
      });
  });
});
describe('utilities', () => {
  it('should be an object', (done) => {
    expect(utils).to.be.an('object');
    done();
  });
  it('should have hashpassword and compare password method', (done) => {
    expect(utils).to.haveOwnProperty('hashPassword');
    expect(utils).to.haveOwnProperty('comparePassword');
    done();
  });
  it('hashPassword method of utils should return a hash', (done) => {
    expect(utils.hashPassword('password')).to.not.equal('password');
    expect(utils.hashPassword('password').length).to.be.gte(10);
    done();
  });
});

/* authentication tests */
describe('authentication', () => {
  const id = users.length + 1;
  const password = 'randompas1623732834';
  const isAdmin = false;
  it('makeToken() should generate a new token for new user', (done) => {
    expect(auth.makeToken).to.be.an.instanceOf(Function);
    expect(auth.makeToken(id, password, isAdmin)).to.be.a('string');
    done();
  });
  it('should authorize user for a given route', (done) => {
    supertest(server)
      .get('/api/v1/loans')
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty('error');
        expect(res.status).to.be.equal(401);
        expect(res.body.status).to.be.equal(401);
        done();
      });
  });
  it('should sign up a valid user and give that user a token', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'david@damilola.com',
        firstName: 'damilola',
        lastName: 'david',
        password: 'address124',
        address: '25, lagos',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(201);
        expect(body.data).to.haveOwnProperty('token');
        done();
      });
  });
});
describe('authorisation', () => {
  it('should be modular', (done) => {
    expect(authorize).to.be.an.instanceOf(Object);
    expect(authorize).to.haveOwnProperty('authorize');
    done();
  });
});

/* sign in route */

describe('signin route', () => {
  it('should return the sign in page form ', (done) => {
    supertest(server)
      .get('/api/v1/auth/signin')
      .end((err, res) => {
        expect(res.body).to.be.an.instanceOf(Object);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body.status).to.be.equals(200);
        done();
      });
  });
  it('should login user with details', (done) => {
    supertest(server)
      .post('/api/v1/auth/signin')
      .send({
        email: 'works3@gmail.com',
        password: 'weWork20',
      })
      .end((err, res) => {
        expect(res.body).to.be.an.instanceOf(Object);
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('data');
        done();
      });
  });
});

describe('Loans', () => {
  it('should be an object', (done) => {
    expect(new Loan('g@g.com', 12, 3000)).to.be.an.instanceOf(Loan);
    done();
  });
});

describe('loansHandler', () => {
  it('should have handlers for routes', (done) => {
    expect(loanHandler).to.haveOwnProperty('reqLoan');
    expect(loanHandler).to.haveOwnProperty('applyForLoan');
    done();
  });
});
