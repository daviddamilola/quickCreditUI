class Loan {
  constructor(email, tenor, amount) {
    this.userEmail = email;
    this.createdOn = Loan.setDate(new Date());
    this.repaid = false;
    this.loanTenor = parseInt(tenor, 10);
    this.loanAmount = amount;
    this.loanStatus = 'pending';
    this.balance = amount + (0.05 * amount);
    this.interest = 0.05 * amount;
    this.balanceInit = amount + (0.05 * amount);
    this.paymentInstallment = (amount + (0.05 * amount)) / tenor;
  }

  static setDate(date) {
    const currentDatetime = date;
    const formattedDate = `${currentDatetime.getFullYear()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}`;
    return formattedDate;
  }
}

export default Loan;

