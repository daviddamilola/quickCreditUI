class Repayment {
  constructor(loanId, amount) {
    this.createdOn = Repayment.setDate();
    this.loanId = loanId;
    this.amountPaid = parseFloat(amount);
  }

  static setDate() {
    const currentDatetime = new Date();
    const formattedDate = `${currentDatetime.getFullYear()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}`;
    return formattedDate;
  }
}

export default Repayment;
