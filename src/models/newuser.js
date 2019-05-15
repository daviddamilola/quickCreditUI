import genId from '../utils/utills';
import users from '../models/usersDb';
const { genid } = genId;
class NewUser {
  constructor(email, firstname, lastname, hashPassword, address) {
    this.id = genid(users);
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = hashPassword;
    this.address = address;
    this.isAdmin = false;
    this.dateCreated = new Date();
  }
  get status() {
    return 'pending';
  }
  set status(status) {
    this.status = status;
  }
}

export default NewUser;
