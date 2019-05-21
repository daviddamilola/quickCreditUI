import chai from 'chai';
import supertest from 'supertest';
import pg from '../database app/pg';
import server from '../server';


const { query } = pg;
const emptyTable = async () => {
  query('TRUNCATE users, loans, repayments CASCADE;');
};

const { expect } = chai;
describe('User', () => {
  beforeEach((done) => {
    // empty database
    emptyTable();
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
  // it('should signup a user ', (done) => {
  //   supertest(server)
  //     .post('/api/v1/auth/signup')
  //     .send({
  //       email: 'nickel@ipsum.com',
  //       firstname: 'lorem',
  //       lastname: 'ipsum',
  //       password: 'lorem001',
  //       address: '1,lorem street',
  //       bvn: '90856745623',
  //       phoneNumber: '78908657453',
  //     })
  //     .end((err, res) => {
  //       const { body } = res;
  //       expect(body.status).to.be.equal(201);
  //       expect(body).to.be.an('object');
  //       expect(body).to.have.property('status');
  //       expect(body).to.have.property('data');
  //       expect(body.data).to.have.property('email');
  //       expect(body.data).to.have.property('firstName');
  //       expect(body.data).to.have.property('lastName');
  //       expect(res.status).to.a('number');
  //       done();
  //     });
  // });

  it('should not signup an existing user ', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'lorem@ipsum.com',
        firstname: 'lorem',
        lastname: 'ipsum',
        password: 'lorem001',
        address: '1,lorem street',
        bvn: '12363573683',
        phoneNumber: '09087690876',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(400);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(body).to.have.property('error');
        expect(res.status).to.a('number');
        done();
      });
  });
  const user1 = {
    email: 'lorem',
    firstname: 'lorem45',
    lastname: 'ipsum234',
    password: 'lorem',
    address: 'unknown',
    bvn: '12334323',
    phonenumber: '0908764764r34',
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
  it('should throw an error if request fields are empty', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
        email: undefined,
        firstname: undefined,
        lastname: undefined,
        password: undefined,
        address: undefined,
        bvn: undefined,
        phonenumber: undefined,
      })
      .end((req, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(400);
        done();
      });
  });
});
