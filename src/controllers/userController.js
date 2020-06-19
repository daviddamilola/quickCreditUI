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
    return Util.response(res, 200, data);
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
        password, email, firstName, lastName, address, phonenumber,
      },
    } = req;

    const hashpassword = Util.hashPassword(password);
    const user = /@quickcredit/.test(email)
      ? new Admin(email, firstName, lastName, hashpassword, address, phonenumber)
      : new User(email, firstName, lastName, hashpassword, address, phonenumber);
    try {
      const { rows } = await pg.query(queries.createuser, [user.firstname,
        user.lastname, user.password, user.email, user.address,
        user.phonenumber, user.isAdmin, user.status]);

      let token = null;

      try {
        token = Authenticate.makeToken(
          rows[0].id, rows[0].email, user.isAdmin, user.firstname, user.lastname, user.status,
        );
      } catch (error) {
        console.log(error)
        return res.json({
          status: 500,
          error: 'an error occured',
        });
      }

      const data = {
        token,
        firstName: user.firstname,
        lastName: user.lastname,
        createdOn: user.dateCreated,
      };
      return Util.response(res, 201, data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
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
    return Util.response(res, 200, data);
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

      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await pg.query(userQuery, [email]);
      const targetUser = rows[0];

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
        return res.status(400).json({
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
      return res.status(200).json({
        status: 200,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'an error occured',
      });
    }
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
      return Util.response(res, 200, rows[0]);
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
