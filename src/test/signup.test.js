import chai from 'chai';
import supertest from 'supertest';
import users from '../models/usersDb';
import server from '../server';


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
        expect(body.status).to.be.equal(400);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(res.status).to.a('number');
        done();
      });
  });
  it('should throw an error if request fields are empty', (done()) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      password: undefined,
      address: undefined,
    })
      .end((req, res) => {
      const { body } = res;
      expect(body.status).to.be.equal(400);
      done();
    });
});
});
