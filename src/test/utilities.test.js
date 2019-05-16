import chai from 'chai';
import users from '../models/usersDb';
import utils from '../utils/utills';

const { expect } = chai;
describe('User', () => {
  beforeEach((done) => {
    users.splice(0, users.length);
    done();
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