
import repaymentDb from '../models/repayments/repaymentDb';
import loanDb from '../models/loans/loansDb';
import users from '../models/usersDb';
import responseMethod from './userController';
import errResMethod from './loansController';

const { errResponse } = errResMethod;
const { response } = responseMethod;

class RepaymentController {
  /**
 * returns user loan history.
 *
 * @param { req, res } the request object, the response object.
 * @return {json Response} returns the client a json response.
 */
  static viewLoanHistory(req, res) {
    if (!res.locals.payload) {
      return errResponse(res, 401, 'authentication failed');
    }
    const decoded = res.locals.payload;
    const targetUser = users.find(user => user.email === decoded.payload.email);
    if (!targetUser) {
      return errResponse(res, 404, 'not found');
    }

    const foundRepay = repaymentDb.find(repay => repay.loanId === parseInt(req.params.id, 10));
    const foundLoan = loanDb.find(loan => loan.id === parseInt(req.params.id, 10));
    const data = {
      loanId: foundRepay.loanId,
      createdOn: foundRepay.createdOn,
      monthlyInstallment: foundLoan.paymentInstallment,
      amount: foundRepay.amount,
    };
    return response(res, 200, data);
  }
}

export default RepaymentController;
