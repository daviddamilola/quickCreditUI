class Loan {
  constructor(email, tenor, amount) {
    this.userEmail = email;
    this.createdOn = Loan.setDate(new Date());
    this.repaid = false;
    this.loanTenor = parseInt(tenor, 10);
    this.loanAmount = Number.parseFloat(amount);
    this.loanStatus = 'pending';
    this.interest = 0.05 * this.loanAmount;
    console.log(this.loanAmount, this.loanTenor);
  }

  get paymentInstallment() {
    return ((this.loanAmount + this.interest) / (this.loanTenor)
    );
  }

  get balance() {
    return this.loanAmount + this.interest;
  }

  get balanceInit() {
    return (this.loanAmount + this.interest);
  }

  set balance(newBalance) {
    this.balance = newBalance;
  }

  static setDate(date) {
    const currentDatetime = date;
    const formattedDate = `${currentDatetime.getFullYear()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}`;
    return formattedDate;
  }
}

export default Loan;

