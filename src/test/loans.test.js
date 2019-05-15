import chai from 'chai';
import supertest from 'supertest';
import Loan from '../models/loans/Loan';
import users from '../models/usersDb';
import loanHandler from '../controllers/loansHandler';
import server from '../server';

const { expect } = chai;
describe('User', () => {
  beforeEach((done) => {
    users.splice(0, users.length);
    done();
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
    expect(loanHandler.reqLoan).to.be.a('function');
    expect(loanHandler.applyForLoan).to.be.a('function');
    done();
  });
  it('should return array of loans for Admin', (done) => {
    supertest(server)
      .get('/api/v1/loans')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6IndvcmtzNEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1NTc2NTkxNDAsImV4cCI6MTU1NzgzMTk0MH0.iiD2pjnnIPja5iwAbCD1gmtpyZkRp6h6h5KGFpa7Inw')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        done();
      });
  });
});

describe('GET /api/v1/loans/:id/repayments users should be able to view repaid loans', () => {
  it('should return authentication error for users not logged in', (done) => {
    supertest(server)
      .get('/api/v1/loans/1/repayments')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6IndvcmtzNEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1NTc2NTkxNDAsImV4cCI6MTU1NzgzMTk0MH0.iiD2pjnnIPja5iwAbCD1gmtpyZkRp6h6h5KGFpa7Inw')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        done();
      });
  });
});
