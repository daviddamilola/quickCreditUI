import Loan from '../models/loans/Loan';
import queries from '../models/queryModel';
import Util from '../utils/utills';
import pg from '../database app/pg';

class LoansController {
  /**
   * handles get request for the loan resource.
   *
   * @param {req, res} the request object and response object.
   * @return {json} json containing the response.
   */

  static async reqLoan(req, res) {
    try {
      Util.checkPayload(res);
      if (req.query.repaid === 'true' && req.query.status === 'approved') {
        return LoansController.repaidLoans(req, res);
      }
      if (req.query.repaid === 'false' && req.query.status === 'approved') {
        return LoansController.partiallyPaid(req, res);
      }
      if (req.query.status === 'pending') {
        return LoansController.pendingLoans(req, res);
      }

      const {
        locals: {
          payload: {
            payload: {
              isAdmin, email,
            },
          },
        },
      } = res;
      
      if (isAdmin) {
        const query = 'SELECT * FROM loans';
        const { rows } = await pg.query(query);
        if (!rows[0]) {
          return Util.errResponse(res, 404, 'no loans made yet');
        }
        return Util.returnData(res, rows);
      }
      const query = 'SELECT * FROM loans WHERE users=$1';
      const { rows } = await pg.query(query, [email]);
      if (!rows[0]) {
        return Util.errResponse(res, 404, 'you have not made any loans yet');
      }
      return Util.returnData(res, rows);
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  /**
   * checks if user is eligible to apply.
   *
   * @param {req, res} the request and response object
   * @return {true} returns true
   */
  static async checkEligibility(req, res) {
    try {
      const { email } = res.locals.payload.payload;
      const queryString = 'select * from users where email=$1';
      const { rows } = await pg.query(queryString, [email]);
      console.log('verified status', rows[0]);
      return rows[0].status !== 'verified' ? { status: false, text: 'you are not yet verified' }
        : { status: true, text: 'u are free to apply' };
    } catch (error) {
      return false;
    }
  }

  /**
   * makes a loan application.
   *
   * @param {req, res} the request and response object
   * @return {json} returns json containing loan info
   */
  static async applyForLoan(req, res) {
    const { tenor, amount } = req.body;
    const { email, firstName, lastName } = res.locals.payload.payload;
    try {
      const {
        createdOn, userEmail, loanStatus,
        repaid, loanTenor, loanAmount, paymentInstallment, balance, interest,
      } = new Loan(email, tenor, parseInt(amount, 10));
      const { rows } = await pg.query(queries.createLoanApplication,
        [createdOn, userEmail, loanStatus, repaid, loanTenor, loanAmount,
          paymentInstallment, balance, interest]);
      const data = {
        firstName,
        lastName,
        ...rows[0],
      };
      return Util.response(res, 201, data);
    } catch (err) {
      console.log(err);
      if (err.routine === 'ExecConstraints') {
        return Util.errResponse(res, 409, 'tenor must be less than or equal 12');
      }
      return Util.errResponse(res, 500, 'internal server error');
    }
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
      Util.checkIfAdmin(isAdmin);
      const repaidQuery = 'SELECT * FROM loans WHERE repaid=$1 AND balance=$2';
      const { rows } = await pg.query(repaidQuery, [true, 0]);
      if (rows[0] === undefined) {
        return Util.errResponse(res, 404, 'no fully repaid loans found');
      }
      console.log(rows[0]);
      return Util.returnData(res, rows[0]);
    } catch (error) {
      return Util.errResponse(res, 400, `an error occured: ${error}`);
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
      Util.checkIfAdmin(isAdmin);
      const partialQuery = 'SELECT * FROM loans WHERE repaid=$1 AND status=$2';
      const { rows } = await pg.query(partialQuery, [false, 'approved']);
      console.log('rows are ', rows[0]);
      if (rows[0] === undefined) {
        return Util.errResponse(res, 404, 'no partially repaid loans found');
      }
      return Util.returnData(res, rows);
    } catch (error) {
      return Util.errResponse(res, 400, `an error occured: ${error}`);
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
    const { isAdmin } = res.locals.payload.payload;
    Util.checkIfAdmin(isAdmin, res);
    if (typeof (parseInt(loanId, 10)) !== 'number') {
      return Util.errResponse(res, 422, 'loanId has to be an integer number');
    }
    const { body: { status } } = req;
    if (status.toLowerCase() !== 'approve') {
      if (status.toLowerCase() !== 'reject') {
        return Util.errResponse(res, 422, 'the status body must be either approve or reject');
      }
    }
    let data;
    if (status.toLowerCase() === 'approve') {
      data = await LoansController.approveLoan(req, res);
    }
    if (status.toLowerCase() === 'reject') {
      data = await LoansController.rejectLoan(req, res);
    }
    return Util.response(res, 204, data);
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
    const updateStatusQuery = 'UPDATE loans SET status = $1 WHERE id = $2 RETURNING *';
    try {
      const { rows } = await pg.query(updateStatusQuery, [newStatus, loanId]);
      console.log('returned row is', rows[0]);
      return rows[0];
    } catch (error) {
      return Util.errResponse(res, 400, 'an error occurred, try again');
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
      return Util.errResponse(res, 400, 'an error occured, try again');
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
    const { isAdmin } = res.locals.payload.payload;
    Util.checkIfAdmin(isAdmin, res);
    try {
      const specificquery = 'SELECT * from loans WHERE id = $1';
      const { rows } = await pg.query(specificquery, [`${parseInt(loanId, 10)}`]);
      if (!rows[0]) {
        return Util.errResponse(res, 404, 'no loan with provided id');
      }
      return Util.response(res, 200, rows[0]);
    } catch (error) {
      return Util.errResponse(res, 500, 'an error occured try again');
    }
  }

  /**
    * get pending loans.
    *
    * @param {req, res} the req object, the response object.
    * @return {clientResponse} returns the client response.
    */

  static async pendingLoans(req, res) {
    const {
      locals: {
        payload: {
          payload: {
            isAdmin,
          },
        },
      },
    } = res;
    if (!isAdmin) return Util.errResponse(res, 401, 'unauthorized');
    try {
      const query = 'SELECT * FROM loans WHERE status = $1';
      const { rows } = await pg.query(query, ['pending']);
      if (!rows[0]) {
        return Util.errResponse(res, 404, 'you have no pending loans');
      }
      return Util.response(res, 200, rows);
    } catch (error) {
      return Util.errResponse(res, 500, 'an error occured try again');
    }
  }
}

export default LoansController;
