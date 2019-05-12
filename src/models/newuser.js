import uuid from 'uuid/v4';

class NewUser {
  constructor(email, firstname, lastname, hashPassword, address) {
    this.id = uuid();
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = hashPassword;
    this.address = address;
    this.status = 'pending';
    this.isAdmin = false;
    this.dateCreated = new Date();
  }
}

export default NewUser;
