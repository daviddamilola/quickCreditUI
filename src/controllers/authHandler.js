import fs from 'fs';
import usersjson from '../models/users.json';
import validate from '../utils/validate';
import path from '../models/users';
import Util from '../utils/utills';
import NewUser from '../models/newuser';
import Authenticate from '../middleware/auth';

const realPath = path.path;
const users = Array.from(usersjson);
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

    let savejson = { users: [] };
    const currentDb = fs.readFileSync(`${realPath}/users.json`, 'utf-8');
    savejson = JSON.parse(currentDb);
    savejson.push(userToBeCreated);
    const json = JSON.stringify(savejson);
    fs.writeFileSync(`${realPath}/users.json`, json);
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

  static reqSignin(req, res) {
    res.status(200);
    return res.json({
      status: 200,
      data: {
        message: 'welcome to the sign in page',
      },
    });
  }

  static login(req, res) {
    // get the user details
    const validationResult = validate.validateSignin(req.body);
    if (validationResult.error) {
      return res.status(400)
        .json({
          status: 400,
          data: {
            message: validationResult.error,
          },
        });
    }
    // verify that the user matches registered details
    const { email, password } = req.body;
    // TODO hash password and compare with hash in db

    const user = users.find(
      existing => existing.email === email,
    );
    const userPass = Util.comparePassword(password, user.password);

    if (!(user && userPass)) {
      return res.status(404).json({
        status: 400,
        error: 'user does not exist',
      });
    }
    // give the user a token
    const token = Authenticate.makeToken(user.id, user.email, user.isAdmin);
    // return json to client
    return res.json({
      status: 200,
      data: {
        token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  }
}
export default UserHandler;
