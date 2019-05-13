// import jwt from 'jsonwebtoken';
import Loan from '../models/loans/Loan';
import loans from '../models/loans/loansDb';
import users from '../models/usersDb';
import validate from '../utils/validate';


class LoansHandler {
  // req loan page
  static reqLoan(req, res) {
    if (!res.locals.payload) {
      res.json({
        status: 401,
        error: 'authentication failed, login again to get access',
      });
    }
    const decoded = res.locals.payload;
    const targetUser = users.find(user => user.email === decoded.payload.email);
    if (req.query) {
      LoansHandler.repaidLoans(targetUser, res);
    }

    // depending on the value of isAdmin it'll either return all loan application or the apply page
    if (targetUser.isAdmin === true) {
      // TODO
      return res.json({
        status: 200,
        data: loans,
      });
    }
    return res.json({
      status: 200,
      data: {
        message: 'welcome to the apply loan page',
      },
    });
  }

  //  apply for loan POST /loans
  static applyForLoan(req, res) {
    const { tenor, amount } = req.body;
    // validate body
    const result = validate.validateLoanApp(req.body);
    if (result.error) {
      return res.status(406).json({
        status: 406,
        error: result.error,
      });
    }
    // TODO get email from payload instead of requesting email
    const decoded = res.locals.payload;
    const { email } = decoded.payload;

    const user = users.find(exists => exists.email === email);
    // if non existent user
    if (!user) {
      return res.json({
        status: 401,
        error: 'no user with that email',
      });
    }

    // user should only apply one loan at a time
    const loan = loans.find(existingloan => existingloan.email === email);
    if (loan) {
      return res.json({
        status: 409,
        error: 'you have an existing loan application',
      });
    }
    // make new application
    const application = new Loan(email, tenor, amount);
    loans.push(application);

    const { firstName, lastName } = user;
    return res.json({
      status: 201,
      data: {
        loanId: application.id,
        firstName,
        lastName,
        email: application.email,
        tenor: application.tenor,
        amount: application.amount,
        paymentInstallment: application.paymentInstallment,
        status: application.status,
        balance: application.balance,
        interest: application.interest,
      },
    });
  }

  static repaidLoans(targetUser, res) {
    if (targetUser.isAdmin === false) {
      res.json({
        status: 401,
        error: 'you are unauthorized to access this resource',
      });
    }
    const repaid = loans.filter(
      loan => loan.status === 'verified' && loan.repaid === true,
    );
    return res.json({
      status: 200,
      data: repaid,
    });
  }
}


export default LoansHandler;
