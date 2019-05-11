// import jwt from 'jsonwebtoken';
import Loan from '../models/loans/Loan';
import loans from '../models/loans/loansDb';
import users from '../models/usersDb';
import validate from '../utils/validate';
// import validate from '../utils/validate';
// import Util from '../utils/utills';
// import Authenticate from '../middleware/auth';


class LoansHandler {
  // req loaan page
  static reqLoan(req, res) {
    const decoded = res.locals.payload;
    const targetUser = users.find(user => user.email === decoded.payload.email);
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
    const { email, tenor, amount } = req.body;
    // validate body
    const result = validate.validateLoanApp(req.body);
    if (result.error) {
      return res.status(406).json({
        status: 406,
        error: result.error,
      });
    }
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
    if (!loan) {
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
}

export default LoansHandler;
