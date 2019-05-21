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
  // it('should login user with details', (done) => {
  //   supertest(server)
  //     .post('/api/v1/auth/signin')
  //     .send({
  //       email: 'works3@gmail.com',
  //       password: 'weWork20',
  //     })
  //     .end((err, res) => {
  //       expect(res.body).to.be.an.instanceOf(Object);
  //       expect(res.body.status).to.be.equal(200);
  //       expect(res.body).to.haveOwnProperty('status');
  //       expect(res.body).to.haveOwnProperty('data');
  //       done();
  //     });
  // });
});
