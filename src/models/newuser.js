import genId from '../utils/utills';
import users from './usersDb';

const { genid } = genId;
class NewUser {
  constructor(email, firstname, lastname, hashPassword, address) {
    this.id = genid(users);
    this.email = email;
    this.firstname = firstname;
    this.status = 'pending';
    this.lastname = lastname;
    this.password = hashPassword;
    this.address = address;
    this.isAdmin = false;
    this.dateCreated = new Date();
  }
}

export default NewUser;
