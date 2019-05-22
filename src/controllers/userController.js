import users from '../models/usersDb';
import Util from '../utils/utills';
import User from '../models/newuser';
// import Admin from '../models/Admin';
import Authenticate from '../middleware/auth';
import queries from '../models/queryModel';
import pg from '../database app/pg';

class userController {
  /**
 * requests sign up page
 *
 * @param {req, res} req: the request object, res: the response objet
 * @return {json object} .
 */
  static reqSignup(req, res) {
    const data = {
      message: 'welcome to the sign up page',
    };
    return userController.response(res, 200, data);
  }

  /**
 * returns a response with the data passed in
 *
 * @param {res, status, data} res: the response object, status code, data to be returned
 * @return {json object} .
 */

  static response(res, status, data) {
    return res.json({
      status,
      data,
    });
  }

  /**
 * checks for an existing user
 *
 * @param {res, email} res: the response object, email
 * @return {false} .
 */
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

  /**
 * creates a user
 *
 * @param {req, res} req: request object, res: response object
 * @return {false} .
 */
  static async createUser(req, res) {
    console.log(req.body);
    const {
      body: {
        password, email, firstName, lastName, address, phonenumber, bvn,
      },
    } = req;

    const hashpassword = Util.hashPassword(password);
    const hashbvn = Util.hashPassword(bvn);
    const user = new User(email, firstName, lastName, hashpassword, address, phonenumber, hashbvn);
    try {
      const { rows } = await pg.query(queries.createuser, [user.firstname,
      user.lastname, user.password, user.email, user.address,
      user.phonenumber, user.bvn, user.isAdmin, user.status]);
      console.log(rows);
      const token = Authenticate.makeToken(
        rows[0].id, rows[0].email, rows[0].isAdmin, rows[0].firstname, rows[0].lastname, rows[0].status,
      );
      const data = {
        token,
        firstName: user.firstname,
        lastName: user.lastname,
        createdOn: user.dateCreated,
      };
      return userController.response(res, 201, data);
    } catch (error) {
      console.log(error);
      if (error.routine === '_bt_check_unique') {
        return res.json({
          status: 409,
          error: 'user exists!',
        });
      }
    }
  }

  /**
 * requests sign in page
 *
 * @param { req, res } req: the request object, res: the response object
 * @return {json} .
 */
  static reqSignin(req, res) {
    const data = {
      message: 'welcome to the sign in page',
    };
    return userController.response(res, 200, data);
  }

  /**
 * verifies user details
 *
 * @param { req, res } req: the request object, res: the response object
 * @return {user} .
 */
  static async verifyUserDetails(req, res) {
    const { email, password } = req.body;
    const userQuery = 'SELECT firstname, lastname, email, id, password, isadmin FROM users ';
    const { rows } = await pg.query(userQuery);
    const targetUser = rows.find(each => each.email === email);
    if (!(targetUser)) {
      const error = {
        status: 400,
        error: 'user does not exist',
      };
      return error;
    }
    const userPass = Util.comparePassword(password, targetUser.password);
    if (!(userPass)) {
      return res.json({
        status: 400,
        error: 'wrong password',
      });
    }
    return targetUser;
  }

  /**
 * login a user
 *
 * @param { req, res } req: the request object, res: the response object
 * @return {json} .
 */
  static async login(req, res) {
    const user = await userController.verifyUserDetails(req, res);
    console.log(user);
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

  /**
 * verifies a user
 *
 * @param { req, res } req: the request object, res: the response object
 * @return {json} .
 */
  static verifyUser(req, res) {
    const targetUser = users.find(user => user.email === req.params.email);
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
