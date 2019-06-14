class User {
  constructor(email, firstname, lastname, hashPassword, address, phonenumber) {
    this.email = email;
    this.firstname = firstname;
    this.status = 'pending';
    this.lastname = lastname;
    this.password = hashPassword;
    this.address = address;
    this.phonenumber = phonenumber;
    this.isAdmin = false;
    this.dateCreated = User.setDate(new Date());
    this.modifiedOn = User.setDate(new Date());
  }

  static setDate(date) {
    const currentDatetime = date;
    const formattedDate = `${currentDatetime.getFullYear()}-${currentDatetime.getMonth() + 1}-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}`;
    return formattedDate;
  }
}

export default User;
