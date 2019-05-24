import Loan from '../models/loans/Loan';
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
    try {
      if (res.locals.payload.payload === undefined) {
        return res.json({
          status: 401,
          error: 'authentication failed, login again to get access',
        });
      }
      return true;
    } catch (error) {
      return true;
    }
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

  static async reqLoan(req, res) {

    try {
      LoansController.checkPayload(res);
      const {
        locals: {
          payload: {
            payload: {
              email, firstName, lastName, isAdmin, status,
            },
          },
        },
      } = res;
      if (req.query.repaid === 'true' && req.query.status === 'approved') {
        console.log('in repaid');
        return LoansController.repaidLoans(req, res);
      }
      if (req.query.repaid === 'false' && req.query.status === 'approved') {
        console.log('in part repaid');
        return LoansController.partiallyPaid(req, res);
      }
      console.log('selecting all...');
      const allLoansQuery = 'SELECT * FROM loans WHERE ';
      const { rows } = await pg.query(allLoansQuery);
      return LoansController.returnData(res, rows);
    } catch (error) {
      console.log(error);
    }
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
 * makes a loan application.
 *
 * @param {req, res} the request and response object
 * @return {json} returns json containing loan info
 */

  static async applyForLoan(req, res) {
    const { tenor, amount } = req.body;
    const {
      locals: {
        payload: {
          payload: {
            email, firstName, lastName, isAdmin, status,
          },
        },
      },
    } = res;
    if (isAdmin === true) {
      return res.json({
        status: 403,
        error: 'Admin cannot apply for loan',
      });
    }
    if (status !== 'verified') {
      return res.json({
        status: 403,
        error: 'you are not yet verified, wait till you are verified then apply',
      });
    }
    try {
      const application = new Loan(email, tenor, parseFloat(amount));
      const {
        createdOn, userEmail, loanStatus,
        repaid, loanTenor, loanAmount, paymentInstallment, balance, interest,
      } = application;
      const { rows } = await pg.query(queries.createLoanApplication,
        [createdOn,
          userEmail, loanStatus, repaid,
          loanTenor, loanAmount, paymentInstallment, balance, interest]);

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
      console.log(err);
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

  static checkIfAdmin(isAdmin, res) {

    console.log('checking if admin ...');
    console.log('admin is ...' + (isAdmin === true));

    if (!isAdmin) {
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
 * @param {req, res} the req object, the response object.
 * @return {clientResponse} returns the client response.
 */
  static async repaidLoans(req, res) {
    const {
      locals: {
        payload: {
          payload: {
            isAdmin,
          },
        },
      },
    } = res;

    try {
      LoansController.checkIfAdmin(isAdmin);
      const repaidQuery = 'SELECT * FROM loans WHERE repaid=$1';
      const { rows } = await pg.query(repaidQuery, [true]);
      return LoansController.returnData(res, rows[0]);
    } catch (error) {
      return LoansController.errResponse(res, 400, 'an error occured');
    }
  }

  /**
 * get partially paid loans.
 *
 * @param {targetUser, res} the user to check, the response object.
 * @return {clientResponse} returns the client response.
 */
  static async partiallyPaid(req, res) {
    const {
      locals: {
        payload: {
          payload: {
            isAdmin,
          },
        },
      },
    } = res;
    try {
      LoansController.checkIfAdmin(isAdmin);
      const partialQuery = 'SELECT * FROM loans WHERE repaid=$1 AND status=$2';
      const { rows } = await pg.query(partialQuery, [false, 'approved']);
      console.log('rows are ', rows[0]);
      return LoansController.returnData(res, rows[0]);
    } catch (error) {
      return LoansController.errResponse(res, 400, 'an error occured');
    }
  }

  /**
* approve or reject loan.
*
* @param {req, res} the req object, the response object.
* @return {clientResponse} returns the client response.
*/
  static async approveRejectLoan(req, res) {
    const { params: { loanId } } = req;
    const {
      locals: {
        payload: {
          payload: {
            isAdmin,
          },
        },
      },
    } = res;
    LoansController.checkIfAdmin(isAdmin, res);
    if (typeof (parseInt(loanId, 10)) !== 'number') {
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

  /**
* updates status to rejected.
*
* @param {req, res} the req object, the response object.
* @return {data} returns data to the caller.
*/
  static async rejectLoan(req, res) {
    const { params: { loanId } } = req;
    const newStatus = 'rejected';
    const updateStatusQuery = 'UPDATE loans SET status = $1 WHERE id = $2 returning *';
    try {
      const { rows } = await pg.query(updateStatusQuery, [newStatus, loanId]);
      return rows[0];
    } catch (error) {
      return {
        status: 400,
        error: 'an error occured',
      };
    }
  }

  /**
* updates status to approved.
*
* @param {req, res} the req object, the response object.
* @return {data} returns data to the caller.
*/
  static async approveLoan(req, res) {
    const { params: { loanId } } = req;
    const newStatus = 'approved';
    const updateStatusQuery = 'UPDATE loans SET status = $1 WHERE id = $2 RETURNING *';
    try {
      const { rows } = await pg.query(updateStatusQuery, [newStatus, loanId]);
      return rows[0];
    } catch (error) {
      return {
        status: 400,
        error: 'an error occured',
      };
    }
  }

  /**
* view a specific loan.
*
* @param {req, res} the req object, the response object.
* @return {clientResponse} returns the client response.
*/
  static async viewSpecificLoan(req, res) {
    const { params: { loanId } } = req;
    const {
      locals: {
        payload: {
          payload: {
            isAdmin,
          },
        },
      },
    } = res;
    LoansController.checkIfAdmin(isAdmin, res);
    try {
      const specificquery = `SELECT * from loans WHERE id = ${parseInt(loanId, 10)}`;
      const { rows } = await pg.query(specificquery);
      if (rows[0] === undefined) {
        return res.json({
          status: 404,
          error: 'no loan with provided id',
        });
      }
      return res.json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.json({
        status: 400,
        error: 'an error occured, try again',
      });
    }
  }

  static async makeRepayment(req, res) {
    const { params: { loanId } } = req;
    const { locals: { payload: { payload: email, isAdmin } } } = res;
    const { body: { amountPaid } } = req;
    const loanquery = 'SELECT * FROM loans WHERE id=$1';
    const { rows } = await pg.query(loanquery, [loanId]);
    const newRepayment = new Repayment(loanId, amountPaid);
    const targetLoan = rows[0];
    console.log(targetLoan);
    if (email !== targetLoan.users && isAdmin === false) {
      return res.json({
        status: 403,
        error: 'you can only post repayment for your own loan history, use your ID',
      });
    }
    const newBalance = targetLoan.balance - newRepayment.amountPaid;
    const insertRepayment = 'INSERT INTO repayments (loanid, createdon, repaid, amount, balance, monthlyinstallment, amountpaid) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *';
    const payResult = await pg.query(insertRepayment,
      [newRepayment.loanId, newRepayment.createdOn,
      targetLoan.repaid, targetLoan.amount, newBalance, targetLoan.paymentinstallment,
      newRepayment.amountPaid]);
    const updateBalance = 'UPDATE loans SET balance = $1 WHERE id = $2 RETURNING balance';
    const updateStatus = 'UPDATE loans SET repaid = $1 WHERE id = $2 RETURNING *';

    try {
      switch (newBalance) {
        case 0:
          await pg.query(updateStatus, [true, loanId]);
          await pg.query(updateBalance, [true, loanId]);
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
          await pg.query(updateStatus, [true, loanId]);
          await pg.query(updateBalance, [newBalance, loanId]);
          res.json({
            status: 201,
            data: payResult.rows[0],
          });
          break;
      }
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        error: 'an error occurred',
      });
    }
  }
}

export default LoansController;
