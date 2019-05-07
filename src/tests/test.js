/* eslint linebreak-style: ["error", "windows"] */
import supertest from 'supertest';
import server from '../server';

const serverAgent = supertest.agent(server);

describe('user should be able to signup', () => {
  it('GET /api/v1/auth/signup should return the user sign up form', (done) => {
    serverAgent.get('/api/v1/auth/signup')
      .end((err, res) => {
        res.status.should.be.equal(200);
        done();
      });
  });

  it('GET /api/v1/auth/signup should retutn an object', (done) => {
    serverAgent.get('/api/v1/auth/signup')
      .expect(200).end((err, res) => {
        res.body.should.be.an.instanceOf(Object);
        Object.keys(res.body).length.should.equal(2);
        done();
      });
  });

  it('POST /api/v1/auth/signup should save a user to db and return user', (done) => {
    serverAgent.post('/api/v1/auth/signup')
      .send({ email: 'lorem@ipsum.com', password: 'password', confirmPassword: 'password' })
      .end((err, res) => {
        res.body.status.should.equal(201);
        res.body.data.should.ownProperty('token');
        res.body.data.should.ownProperty('id');
        res.body.should.ownProperty('data');
        res.body.data.should.be.an.instanceOf(Object);
        res.body.data.should.have.property('email', 'lorem@ipsum.com');
        done();
      });
  });

  it('POST /api/v1/auth/signup should return object with error property if passwords dont match', (done) => {
    serverAgent.post({ email: 'lorem@ipsum.com', password: 'password', confirmPassword: 'notpassword' })
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.error.should.be.equal('passwords are not the same');
      });
    done();
  });
});
