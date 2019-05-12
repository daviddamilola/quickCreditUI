import users from '../models/users.json';
import validate from '../utils/validate';
import Util from '../utils/utills';
import NewUser from '../models/newuser';
import Authenticate from '../middleware/auth';

class UserHandler {
  static reqSignup(req, res) {
    res.status(200);
    res.json({
      status: 200,
      data: {
        message: 'welcome to quick credit',
      },
    });
  }

  static createUser(req, res) {
    const { body } = req;
    const result = validate.validateSignup(body);
    if (result.error) {
      return res.status(406).json({
        status: 406,
        error: result.error,
      });
    }

    const hashpassword = Util.hashPassword(body.password);
    const {
      email, firstName, lastName, address,
    } = body;
    const userToBeCreated = new NewUser(email, firstName, lastName, hashpassword, address);
    const user = users.find(
      existing => existing.email === body.email,
    );
    if (user) {
      return res.status(409).json({
        status: 409,
        error: 'existent user',
      });
    }
    users.push(userToBeCreated);
    const token = Authenticate.makeToken(
      userToBeCreated.id, userToBeCreated.email, userToBeCreated.isAdmin,
    );
    return res.status(201).json({
      status: 201,
      data: {
        token,
        id: userToBeCreated.id,
        firstName: userToBeCreated.firstname,
        lastName: userToBeCreated.lastname,
        email: userToBeCreated.email,
        createdOn: userToBeCreated.dateCreated,
      },
    });
  }
}
export default UserHandler;
