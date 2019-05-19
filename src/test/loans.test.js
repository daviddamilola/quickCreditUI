import chai from 'chai';
import supertest from 'supertest';
import Loan from '../models/loans/Loan';
import users from '../models/usersDb';
import loanHandler from '../controllers/loansController';
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

describe('admin can approve or reject loan application', () => {
  it('should have required request parameter', (done) => {
    supertest(server)
      .patch('/api/v1/loans/em')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6IndvcmtzNEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1NTc2NTkxNDAsImV4cCI6MTU1NzgzMTk0MH0.iiD2pjnnIPja5iwAbCD1gmtpyZkRp6h6h5KGFpa7Inw')
      .send({ status: 'approve' })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('status should not be empty', (done) => {
    supertest(server)
      .patch('/api/v1/loans/em')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6IndvcmtzNEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1NTc2NTkxNDAsImV4cCI6MTU1NzgzMTk0MH0.iiD2pjnnIPja5iwAbCD1gmtpyZkRp6h6h5KGFpa7Inw')
      .send({ status: undefined })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('should verify a loan application', (done) => {
    supertest(server)
      .patch('/api/v1/loans/1')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6IndvcmtzNEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1NTc2NTkxNDAsImV4cCI6MTU1NzgzMTk0MH0.iiD2pjnnIPja5iwAbCD1gmtpyZkRp6h6h5KGFpa7Inw')
      .send({ status: 'approve' })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data.status).to.be.equal('approved');
        done();
      });
  });
  it('should reject a loan application', (done) => {
    supertest(server)
      .patch('/api/v1/loans/1')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6IndvcmtzNEBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1NTc2NTkxNDAsImV4cCI6MTU1NzgzMTk0MH0.iiD2pjnnIPja5iwAbCD1gmtpyZkRp6h6h5KGFpa7Inw')
      .send({ status: 'reject' })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data.status).to.be.equal('rejected');
        done();
      });
  });
});
