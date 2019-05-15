import chai from 'chai';
import supertest from 'supertest';
import users from '../models/usersDb';
import server from '../server';
import auth from '../middleware/auth';
import authorize from '../middleware/authorize';


const { expect } = chai;
describe('User', () => {
  beforeEach((done) => {
    users.splice(0, users.length);
    done();
  });
});

describe('authentication', () => {
  const id = users.length + 1;
  const password = 'randompas1623732834';
  const isAdmin = false;
  it('makeToken() should generate a new token for new user', (done) => {
    expect(auth.makeToken).to.be.an.instanceOf(Function);
    expect(auth.makeToken(id, password, isAdmin)).to.be.a('string');
    done();
  });

  it('should sign up a valid user and give that user a token', (done) => {
    supertest(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'genie@gm.com',
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
