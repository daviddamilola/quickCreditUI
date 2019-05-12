
import repaymentDb from '../models/repayments/repaymentDb';
import loanDb from '../models/loans/loansDb';
import users from '../models/usersDb';

class RepaymentHandler {
  static viewLoanHistory(req, res) {
    if (!res.locals.payload) {
      res.status(200).json({
        status: 401,
        error: 'authentication failed, login again to get access',
      });
    }
    const decoded = res.locals.payload;
    const targetUser = users.find(user => user.email === decoded.payload.email);
    if (!targetUser) {
      res.status(404).json({
        status: 404,
        error: 'not found',
      });
    }
    // get repayment from database where loan id is the same as id supplied
    const foundRepay = repaymentDb.find(repay => repay.loanId === parseInt(req.params.id, 10));
    // get monthly installment
    const foundLoan = loanDb.find(loan => loan.id === parseInt(req.params.id, 10));
    return res.status(200).json({
      status: 200,
      data: {
        loanId: foundRepay.loanId,
        createdOn: foundRepay.createdOn,
        monthlyInstallment: foundLoan.paymentInstallment,
        amount: foundRepay.amount,
      },
    });
  }
}

export default RepaymentHandler;
