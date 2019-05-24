import User from './newuser';

class Admin extends User {
  constructor(email, firstname, lastname, hashPassword, address, phonenumber, bvn) {
    super(email, firstname, lastname, hashPassword, address, phonenumber, bvn)
    super.isAdmin = true;
  }
}

export default Admin;
