import users from '../models/usersDb';
import Util from '../utils/utills';
import NewUser from '../models/newuser';
import Authenticate from '../middleware/auth';

class userController {
  static reqSignup(req, res) {
    const data = {
      message: 'welcome to the sign up page',
    };
    return userController.response(res, 200, data);
  }

  static response(res, status, data) {
    return res.json({
      status,
      data,
    });
  }

  static checkExistingUser(res, email) {
    const user = users.find(
      existing => existing.email === email,
    );
    if (user) {
      return res.status(409).json({
        status: 409,
        error: 'existent user',
      });
    }
    return false;
  }

  static createUser(req, res) {
    const {
      body: {
        password, email, firstName, lastName, address,
      },
    } = req;
    const hashpassword = Util.hashPassword(password);
    const userToBeCreated = new NewUser(email, firstName, lastName, hashpassword, address);
    if (!userController.checkExistingUser(res, email)) { users.push(userToBeCreated); }
    const token = Authenticate.makeToken(
      userToBeCreated.id, userToBeCreated.email, userToBeCreated.isAdmin,
    );
    const data = {
      token,
      id: userToBeCreated.id,
      firstName: userToBeCreated.firstname,
      lastName: userToBeCreated.lastname,
      email: userToBeCreated.email,
      createdOn: userToBeCreated.dateCreated,
    };
    return userController.response(res, 201, data);
  }

  static reqSignin(req, res) {
    const data = {
      message: 'welcome to the sign in page',
    };
    return userController.response(res, 200, data);
  }

  static verifyUserDetails(req, res) {
    const { email, password } = req.body;
    const user = users.find(
      existing => existing.email === email,
    );
    console.log(user);
    if (!(user)) {
      const error = {
        status: 400,
        error: 'user does not exist',
      };
      return error;
    }
    const userPass = Util.comparePassword(password, user.password);
    if (!(userPass)) {
      return res.status(404).json({
        status: 400,
        error: 'wrong password',
      });
    }

    return user;
  }

  static login(req, res) {
    const user = userController.verifyUserDetails(req, res);
    if (user.error) {
      return res.json({
        status: 404,
        error: user.error,
      });
    }
    const token = Authenticate.makeToken(user.id, user.email, user.isAdmin);
    const data = {
      token,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return userController.response(res, 200, data);
  }

  static verifyUser(req, res) {
    const targetUser = users.find(user => user.email === req.params.email);
    console.log(targetUser);
    if (targetUser === undefined) {
      return res.json({
        status: 404,
        error: 'no user with that email',
      });
    }
    targetUser.status = 'verified';
    const data = {
      email: targetUser.email,
      firstname: targetUser.firstName,
      lastName: targetUser.lastName,
      address: targetUser.address,
      password: targetUser.password,
      status: targetUser.status,
    };
    return userController.response(res, 201, data);
  }
}
export default userController;
