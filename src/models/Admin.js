import User from './newuser';

class Admin extends User {
  constructor(email, firstname, lastname, hashPassword, address, phonenumber) {
    super(email, firstname, lastname, hashPassword, address, phonenumber)
    super.isAdmin = true;
    super.status = 'verified';
  }
}

export default Admin;
