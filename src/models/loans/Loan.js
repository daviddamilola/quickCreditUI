import loans from './loansDb';

class Loan {
  constructor(email, tenor, amount) {
    this.id = loans.length + 1;
    this.email = email;
    this.createdOn = Loan.setDate(new Date());
    this.repaid = false;
    this.tenor = parseInt(tenor, 10);
    this.amount = parseFloat(amount);
    this.interest = parseFloat(0.05 * (this.amount));
  }

  get paymentInstallment() {
    return (this.amount + this.interest) / this.tenor;
  }

  get balance() {
    return this.amount + this.interest;
  }

  get balanceInit() {
    return (this.amount + this.interest);
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
