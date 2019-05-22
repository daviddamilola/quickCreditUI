import Loan from '../models/loans/Loan';
import loans from '../models/loans/loansDb';
import users from '../models/usersDb';
import resfunc from './userController';
import Repayment from '../models/repayments/Repayments';
import queries from '../models/queryModel';
import pg from '../database app/pg';


const { response } = resfunc;
class LoansController {
  /**
 * checks for payload presence if no payload auth has failed.
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
 * @param {req, res} the request object and response object.
 * @return {json} json containing the response.
 */

  static reqLoan(req, res) {
    LoansController.checkPayload(res);
    const decoded = res.locals.payload;
    const targetUser = users.find(user => user.email === decoded.payload.email);
    if (req.query.repaid === 'true' && req.query.status === 'verified') {
      return LoansController.repaidLoans(targetUser, res);
    }
    if (req.query.repaid === 'false' && req.query.status === 'verified') {
      return LoansController.partiallyPaid(targetUser, res);
    }
    if (targetUser.isAdmin === true && req.method === 'GET') {
      LoansController.returnData(res, loans);
    }
    return LoansController.returnData(res, { message: 'welcome to the apply page' });
  }

  /**
 * finds an existing loan.
 *
 * @param {loansdb, email} the database to look in and the email to look for
 * @return {loan} The specific loan.
 */
  static findExistLoan(loansdb, email) {
    return loansdb.find(ex => ex.email === email && ex.repaid === false);
  }

  /**
 * send an error response
 *
 * @param {res, status, error} the database to look in and the email to look for
 * @return {json} json containing error and status code
 */
  static errResponse(res, status, error) {
    return res.json({
      status,
      error,
    });
  }

  /**
 * prevents an unknown user from accessing loans
 *
 * @param {res, email} the response object and the user email
 * @return {user} The specific user.
 */
  static prevUnknownUser(res, email) {
    const user = users.find(exists => exists.email === email);
    if (!user) {
      return LoansController.errResponse(res, 404, 'no such user');
    }
    return user;
  }
  /**
 * makes a loan application.
 *
 * @param {req, res} the request and response object
 * @return {json} returns json containing loan info
 */

  static async applyForLoan(req, res) {
    const { tenor, amount } = req.body;
    const { locals: { payload: { payload: { email, firstName, lastName, role, status } } } } = res;
    if (role === 'Admin') {
      return res.json({
        status: 403,
        error: 'Admin cannot apply for loan',
      });
    }
    if (status === 'pending') {
      return res.json({
        status: 403,
        error: 'you are not yet verified, wait till you are verified then apply',
      });
    }
    try {
      const application = new Loan(email, tenor, parseFloat(amount));
      const {
        createdOn, userEmail, loanStatus, repaid, loanTenor, loanAmount, paymentInstallment, balance, interest,
      } = application;
      const { rows } = await pg.query(queries.createLoanApplication,
        [createdOn,
          userEmail, loanStatus, repaid, loanTenor, loanAmount, paymentInstallment, balance, interest]);

      const data = {
        loanId: rows[0].id,
        firstName,
        lastName,
        email: rows[0].users,
        tenor: rows[0].tenor,
        amount: rows[0].amount,
        paymentInstallment: rows[0].paymentinstallment,
        status: rows[0].status,
        balance: rows[0].balance,
        interest: rows[0].interest,
      };
      return response(res, 201, data);
    } catch (err) {
      return res.json({
        status: 400,
        error: 'an error occured, try again later',
      });
    }
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
    LoansController.checkIfAdmin(targetUser);
    const repaid = loans.filter(
      loan => loan.status === 'verified' && loan.repaid === true,
    );
    const clientResponse = LoansController.returnData(res, repaid);
    return clientResponse;
  }

  /**
 * get partially paid loans.
 *
 * @param {targetUser, res} the user to check, the response object.
 * @return {clientResponse} returns the client response.
 */
  static partiallyPaid(targetUser, res) {
    LoansController.checkIfAdmin(targetUser);
    const partiallyPaid = loans.filter(
      loan => loan.status === 'verified' && loan.repaid === false,
    );
    if (!partiallyPaid) {
      return res.json({
        status: 404,
        error: 'no user has partially paid',
      });
    }
    return LoansController.returnData(res, partiallyPaid);
  }

  /**
* approve or reject loan.
*
* @param {req, res} the req object, the response object.
* @return {clientResponse} returns the client response.
*/
  static approveRejectLoan(req, res) {
    const reqloanId = req.params.loanId;
    if (typeof (parseInt(reqloanId, 10)) !== 'number') {
      return LoansController.errResponse(res, 422, 'loanId has to be an integer number');
    }
    const { body: { status } } = req;
    if (status.toLowerCase() !== 'approve') {
      if (status.toLowerCase() !== 'reject') {
        return LoansController.errResponse(res, 422, 'the status body must be either approve or reject');
      }
    }
    let data;
    if (status.toLowerCase() === 'approve') {
      data = LoansController.approveLoan(req, res);
    }
    if (status.toLowerCase() === 'reject') {
      data = LoansController.rejectLoan(req, res);
    }
    return res.json({
      status: 201,
      data,
    });
  }

  static rejectLoan(req) {
    const reqloanId = req.params.loanId;
    const targetLoan = loans.find(loan => loan.id === parseInt(reqloanId, 10));
    targetLoan.status = 'rejected';
    const {
      id, amount, tenor, status, monthlyInstallment, interest,
    } = targetLoan;
    const data = {
      loanId: id,
      loanAmount: amount,
      tenor,
      status,
      monthlyInstallment,
      interest,
    };
    return data;
  }

  static approveLoan(req) {
    const reqloanId = req.params.loanId;
    const targetLoan = loans.find(loan => loan.id === parseInt(reqloanId, 10));
    targetLoan.status = 'approved';
    const {
      id, amount, tenor, status, monthlyInstallment, interest,
    } = targetLoan;
    const data = {
      loanId: id,
      loanAmount: amount,
      tenor,
      status,
      monthlyInstallment,
      interest,
    };
    return data;
  }

  static viewSpecificLoan(req, res) {
    const { params: { loanId } } = req;
    const targetLoan = loans.find(loan => loan.id === parseInt(loanId, 10));
    if (!targetLoan) {
      return LoansController.errResponse(res, 404, 'no loan with such id');
    }
    return LoansController.returnData(res, targetLoan);
  }

  static async verifyLoan(req, res) {
    LoansController.checkPayload(res);
    LoansController.checkIfAdmin();

    const { params: { loanId } } = req;

    const loanQuery = `SELECT FROM loans WHERE id = ${parseInt(loanId, 10)}`;
    const targetLoan = await pg.query(loanQuery);
    console.log(targetLoan.rows);
    if (!targetLoan.rows) {
      LoansController.errResponse(res, 404, 'no loan with that id');
    }
    if (targetLoan.repaid === true && targetLoan.balance < 0) {
      return res.json({
        status: 400,
        error: 'you dont have any outsanding loan',
      });
    }
    return targetLoan.rows;
  }

  static async makeRepayment(req, res) {
    const { params: { loanId } } = req;
    const targetLoan = LoansController.verifyLoan(req, res);
    const { locals: { payload: { payload: email } } } = res;
    const { body: { amountPaid } } = req;
    const newRepayment = new Repayment(loanId, amountPaid);
    const newBalance = targetLoan.balance - newRepayment.amountPaid;

    switch (newBalance) {
      case 0:
        targetLoan.repaid = true;
        targetLoan.balance = newBalance;
        res.json({
          status: 201,
          data: {
            targetLoan,
            message: 'payment complete, you can apply for another loan',
          },
        });
        break;
      case newBalance < 0:
        res.json({
          status: 400,
          error: `you are overpaying your balance is ${targetLoan.balance}`,
        });
        break;
      default:
        targetLoan.balance = newBalance;
        res.json({
          status: 201,
          data: {
            id: newRepayment.id,
            loanId: targetLoan.id,
            createdOn: newRepayment.createdOn,
            amount: targetLoan.amount,
            monthlyInstallment: targetLoan.paymentInstallment,
            paidAmount: newRepayment.amountPaid,
            balance: targetLoan.balance,
          },
        });
        break;
    }
  }
}

export default LoansController;
