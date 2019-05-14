import chai from 'chai';
import Loan from '../models/loans/Loan';
import users from '../models/usersDb';
import loanHandler from '../controllers/loansHandler';

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
    done();
  });
});
