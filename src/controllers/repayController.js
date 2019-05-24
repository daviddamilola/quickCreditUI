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
    const { locals: { payload: { payload: { email, isAdmin } } } } = res;
    const { params: { id } } = req;
    if (!res.locals.payload) {
      return errResponse(res, 401, 'authentication failed');
    }
    try {
      const historyQuery = 'SELECT * FROM repayments WHERE loanid=$1 ORDER BY id';
      const loanQuery = `SELECT * FROM loans WHERE id = ${id}`;
      const LoanResult = await pg.query(loanQuery);
      const { rows } = await pg.query(historyQuery, [id]);
      console.log(LoanResult.rows[0].users, email);
      console.log(rows[0]);
      if (rows[0] === undefined) {
        return res.json({
          status: 404,
          error: 'you have not made any repayments yet',
        });
      }
      if (email !== LoanResult.rows[0].users && isAdmin === false) {
        return res.json({
          status: 403,
          error: 'you can only view your loan history, use your ID',
        });
      }
      const data = {
        loanId: rows[0].id,
        createdOn: rows[0].createdon,
        monthlyInstallment: LoanResult.rows[0].paymentinstallment,
        amount: rows[0].amount,
      };
      return response(res, 200, data);
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        error: 'an error occured',
      });
    }
  }
}

export default RepaymentController;
