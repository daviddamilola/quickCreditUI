
import repaymentDb from '../models/repayments/repaymentDb';
import loanDb from '../models/loans/loansDb';
import users from '../models/usersDb';
import responseMethod from './userController';
import errResMethod from './loansController';
import pg from '../database app/pg';

const { errResponse } = errResMethod;
const { response } = responseMethod;

class RepaymentController {
  /**
 * returns user loan history.
 *
 * @param { req, res } the request object, the response object.
 * @return {json Response} returns the client a json response.
 */
  static async viewLoanHistory(req, res) {
    const { locals: { payload: { payload: { email } } } } = res;
    const { params: { id } } = req;
    if (!res.locals.payload) {
      return errResponse(res, 401, 'authentication failed');
    }
    const historyQuery = `SELECT FROM repayments WHERE loanid = ${id} ORDER BY id`;
    const loanQuery = `SELECT FROM loans WHERE id = ${id}`;
    const LoanResult = await pg.query(loanQuery);
    const { rows } = await pg.query(historyQuery);
    console.log(rows, LoanResult.rows);
    // const foundLoan = loanDb.find(loan => loan.id === parseInt(req.params.id, 10));
    // const data = {
    //   loanId: foundRepay.loanId,
    //   createdOn: foundRepay.createdOn,
    //   monthlyInstallment: foundLoan.paymentInstallment,
    //   amount: foundRepay.amount,
    // };
    // return response(res, 200, data);
  }
}

export default RepaymentController;
