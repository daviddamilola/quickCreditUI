import pg from '../database app/pg';
import Repayment from '../models/repayments/Repayments';
import queries from '../models/queryModel';
import Util from '../utils/utills';

class RepaymentController {
  /**
 * returns user loan history.
 *
 * @param { req, res } the request object, the response object.
 * @return {json Response} returns the client a json response.
 */
  static async viewLoanHistory(req, res) {
    const { locals: { payload: { payload: { email, isAdmin } } } } = res;
    const { params: { loanId } } = req;
    try {
      const historyQuery = 'SELECT * FROM repayments WHERE loanid=$1 ORDER BY id';
      const loanQuery = 'SELECT * FROM loans WHERE id = $1';
      const LoanResult = await pg.query(loanQuery, [loanId]);
      const { rows } = await pg.query(historyQuery, [loanId]);
      if (rows.length === 0) {
        return Util.errResponse(res, 404, 'you have not made any repayments yet');
      }
      if (email !== LoanResult.rows[0].users && isAdmin === false) {
        return Util.errResponse(res, 403, 'you can only view your loan history.');
      }
      return Util.response(res, 200, rows);
    } catch (error) {
      return Util.errResponse(res, 400, 'an error occurred');
    }
  }

  static async makeRepayment(req, res) {
    try {
      const { params: { loanId } } = req;
      const { locals: { payload: { payload: email, isAdmin } } } = res;
      const { body: { amountPaid } } = req;
      const loanquery = 'SELECT * FROM loans WHERE id=$1 ';
      const { rows } = await pg.query(loanquery, [loanId]);
      if (rows.length < 1) {
        return Util.errResponse(res, 404, 'no loan with such id');
      }
      if (rows[0].status !== 'approved') {
        return Util.errResponse(res, 400, 'your loan is not yet approved');
      }
      const newRepayment = new Repayment(loanId, amountPaid);
      const targetLoan = rows[0];
      if (email !== targetLoan.users && isAdmin === false) {
        return Util.errResponse(res, 403, 'you can only post repayment for your own loan history, use your ID');
      }
      const newBalance = targetLoan.balance - newRepayment.amountPaid;
      const updateLoanStatus = 'UPDATE loans SET repaid = $1 WHERE id = $2 RETURNING *';
      const updateRepaidStatus = 'UPDATE repayments SET repaid = $1 WHERE id = $2 RETURNING *';
      if (newBalance < 0) {
        return Util.errResponse(res, 400, `you are overpaying your balance is ${targetLoan.balance}`);
      }
      if (amountPaid < rows[0].paymentinstallment) {
        return Util.errResponse(res, 409, `you are to pay a minimum of ${rows[0].paymentinstallment} naira`);
      }
      const payResult = await pg.query(queries.insertRepayment,
        [newRepayment.loanId, newRepayment.createdOn,
        targetLoan.repaid, targetLoan.amount, newBalance, targetLoan.paymentinstallment,
        newRepayment.amountPaid]);
      await pg.query(queries.updateBalance, [newBalance, loanId]);
      if (newBalance === 0) {
        await pg.query(updateLoanStatus, [true, loanId]);
        await pg.query(updateRepaidStatus, [true, loanId]);
      }
      return Util.response(res, 201, payResult.rows[0]);
    } catch (error) {
      return Util.errResponse(res, 400, 'an error occurred');
    }
  }
}

export default RepaymentController;
