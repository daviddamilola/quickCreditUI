import Loan from '../models/loans/Loan';
import loans from '../models/loans/loansDb';
import users from '../models/usersDb';

class LoansHandler {
  /**
 * checks for payload presence if no paylooad auth has failed.
 *
 * @param {res} the response object, pay load is in res.locals.payload
 * @return {true} .
 */
  static checkPayload(res) {
    if (!res.locals.payload) {
      return res.json({
        status: 401,
        error: 'authentication failed, login again to get access',
      });
    }
    return true;
  }

  /**
 * Creates a 200 response with the desired data.
 *
 * @param {res, info} the response object, the data to be returned
 * @return {res.json({status:200, data: info})} The response to the client.
 */
  static returnData(res, info) {
    return res.json({
      status: 200,
      data: info,
    });
  }
  /**
 * handles get request for the loan resource.
 *
 * @param {number} d The desired diameter of the circle.
 * @return {Circle} The new Circle object.
 */

  static reqLoan(req, res) {
    LoansHandler.checkPayload(res);
    const decoded = res.locals.payload;
    const targetUser = users.find(user => user.email === decoded.payload.email);
    if (req.query.repaid === 'true' && req.query.status === 'verified') {
      return LoansHandler.repaidLoans(targetUser, res);
    }
    if (req.query.repaid === 'false' && req.query.status === 'verified') {
      return LoansHandler.partiallyPaid(targetUser, res);
    }
    if (targetUser.isAdmin === true && req.method === 'GET') {
      LoansHandler.returnData(res, loans);
    }
    return LoansHandler.returnData(res, { message: 'welcome to the apply page' });
  }

  /**
 * validates the request Body.
 *
 * @param {req, res} the request object, the response object.
 * @return {true} inputs are correct.
 */
  // static validateBody(req, res) {
  //   const result = validate.validateLoanApp(req.body);
  //   if (result.error) {
  //     return res.status(406).json({
  //       status: 406,
  //       error: result.error,
  //     });
  //   }
  //   return true;
  // }

  static applyForLoan(req, res) {
    const { tenor, amount } = req.body;
    LoansHandler.validateBody(req, res);
    // TODO get email from payload instead of requesting email
    const decoded = res.locals.payload;
    const { email } = decoded.payload;

    const user = users.find(exists => exists.email === email);
    // if non existent user
    if (!user) {
      return res.json({
        status: 404,
        error: 'no user with that email',
      });
    }

    // user should only apply one loan at a time
    const loan = loans
      .find(existingloan => existingloan.email === email && existingloan.repaid === false);
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
  /**
 * Checks if a user is admin.
 *
 * @param {targetUser, res} the user to check, the response object.
 * @return {true} returns true if the user is admin, and an error response otherwise.
 */

  static checkIfAdmin(targetUser, res) {
    if (targetUser.isAdmin === false) {
      return res.json({
        status: 401,
        error: 'you are unauthorized to access this resource',
      });
    }
    return true;
  }

  /**
 * get repaid loans.
 *
 * @param {targetUser, res} the user to check, the response object.
 * @return {clientResponse} returns the client response.
 */
  static repaidLoans(targetUser, res) {
    LoansHandler.checkIfAdmin(targetUser);
    const repaid = loans.filter(
      loan => loan.status === 'verified' && loan.repaid === true,
    );
    const clientResponse = LoansHandler.returnData(res, repaid);
    return clientResponse;
  }

  /**
 * get repaid loans.
 *
 * @param {targetUser, res} the user to check, the response object.
 * @return {clientResponse} returns the client response.
 */
  static partiallyPaid(targetUser, res) {
    LoansHandler.checkIfAdmin(targetUser);
    const partiallyPaid = loans.filter(
      loan => loan.status === 'verified' && loan.repaid === false,
    );
    if (!partiallyPaid) {
      return res.json({
        status: 404,
        error: 'no user has partially paid',
      });
    }
    return LoansHandler.returnData(res, partiallyPaid);
  }
}


export default LoansHandler;
