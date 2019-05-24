import Util from '../utils/utills';
import User from '../models/newuser';
import Admin from '../models/Admin';
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
 * creates a user
 *
 * @param {req, res} req: request object, res: response object
 * @return {false} .
 */
  static async createUser(req, res) {
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
      console.log(`query returned ${rows[0]}`);
      console.log('making token ....');
      console.log(user.isAdmin);
      const token = Authenticate.makeToken(
        rows[0].id, rows[0].email, user.isAdmin, user.firstname, user.lastname, user.status,
      );
      console.log(`token made 
      ${token}`);
      const data = {
        token,
        firstName: user.firstname,
        lastName: user.lastname,
        createdOn: user.dateCreated,
      };
      userController.response(res, 201, data);
    } catch (error) {
      console.log(error);
      if (error.routine === '_bt_check_unique') {
        return res.json({
          status: 409,
          error: 'user exists!',
        });
      }
      return res.json({
        status: 400,
        error: 'an error occured',
      });
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
  static async verifyUserDetails(req) {
    try {
      const { email, password } = req.body;
      console.log('email is:', email, 'password is: ', password);
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await pg.query(userQuery, [email]);
      const targetUser = rows[0];
      console.log('target user is: ', targetUser);
      console.log('email is:', email, 'password is: ', password);
      const userPass = Util.comparePassword(password, targetUser.password);
      if (!(userPass)) {
        return {
          status: 400,
          error: 'wrong password',
        };
      }
      return targetUser;
    } catch (error) {
      if (error.routine === 'errorMissingColumn') {
        return {
          status: 400,
          error: 'no user with that email',
        };
      }
      return {
        status: 400,
        error,
      };
    }
  }

  /**
 * login a user
 *
 * @param { req, res } req: the request object, res: the response object
 * @return {json} .
 */
  static async login(req, res) {
    try {
      const user = await userController.verifyUserDetails(req, res);
      console.log('user before error=', user);
      if (user.error) {
        return res.json({
          status: 400,
          error: user.error,
        });
      }
      const token = Authenticate.makeToken(user.id, user.email, user.isadmin, user.firstname, user.lastname, user.status);
      const data = {
        token,
        id: user.id,
        firstName: user.firstname,
        lastName: user.lastname,
      };
      // reuserController.response(res, 200, data);
      return res.json({
        status: 200,
        data,
      });
    } catch (error) {
      return res.json({
        status: 400,
        error: 'an error occured',
      });
    }
    // try {
    //   const user = await userController.verifyUserDetails(req, res);
    //   return res.json({
    //     status: 200,
    //     data: {
    //       mesage: 'logged in user'
    //     }
    //   })
    // } catch (error) {
    //   return res.json({
    //     status: 500,
    //     error,
    //   })
    // }
  }

  /* gets a user
  *
  * @param { req, res } req: the request object, res: the response object
  * @return {json} .
  */
  static async getUser(req, res) {
    const userQuery = 'SELECT * FROM USERS WHERE id = $1';
    try {
      const { params: { id } } = req;
      const { rows } = await pg.query(userQuery, id);
      if (!rows[0]) {
        return res.json({
          status: 404,
          error: 'user not found',
        });
      }
      return userController.response(res, 200, rows[0]);
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'an error occured',
      });
    }
  }

  /* verifies a user
  *
  * @param { req, res } req: the request object, res: the response object
  * @return {json} .
  */
  static async verifyUser(req, res) {
    const { params: { email } } = req;
    const newStatus = 'verified';
    const updateQuery = 'UPDATE users SET status = $1 WHERE email = $2 returning id, email, firstName, lastName, address, status, isAdmin, createdOn, modifiedOn';
    try {
      const { rows } = await pg.query(updateQuery, [newStatus, email]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'no records matching email',
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'error occured, try again',
      });
    }
  }
}

export default userController;
