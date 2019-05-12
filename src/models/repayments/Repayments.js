import utils from '../../utils/utills';
import repaymentDb from './repaymentDb';

const { genid } = utils;
class Repayment {
  constructor(loanId, amount) {
    this.id = genid(repaymentDb.length);
    this.createdOn = Repayment.setDate;
    this.loanId = loanId;
    this.amount = amount;
  }

  static setDate() {
    const currentDatetime = new Date();
    const formattedDate = `${currentDatetime.getFullYear()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}`;
    return formattedDate;
  }
}

export default Repayment;