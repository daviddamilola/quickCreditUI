/* eslint linebreak-style: ["error", "windows"] */
import bycrypt from 'bcrypt-nodejs';

class util {
  static hashPassword(password) {
    return bycrypt.hashSync(password);
  }

  static comparePassword(password, hash) {
    return bycrypt.compareSync(password, hash);
  }

  static genid(db) {
    let id = 0;
    if (db.length) {
      id += 1;
    }
    return id;
  }

  /**
  * send an error response
  *
  * @param {res, status, error} the error status and error text
  * @return {json} json containing error and status code
  */
  static errResponse(res, status, error) {
    return res.status(status).json({
      status,
      error,
    });
  }

  /**
* Creates a 200 response with the desired data.
*
* @param {res, info} the response object, the data to be returned
* @return {res.json({status:200, data: info})} The response to the client.
*/
  static returnData(res, info) {
    return res.json({
      status: 200,
      data: info,
    });
  }

  /**
 * checks for payload presence if no payload auth has failed.
 *
 * @param {res} the response object, pay load is in res.locals.payload
 * @return {true} .
 */
  static checkPayload(res) {
    try {
      if (res.locals.payload.payload === undefined) {
        return res.json({
          status: 401,
          error: 'authentication failed, login again to get access',
        });
      }
      return true;
    } catch (error) {
      return true;
    }
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
  * Checks if a user is admin.
  *
  * @param {targetUser, res} the user to check, the response object.
  * @return {true} returns true if the user is admin, and an error response otherwise.
  */

  static checkIfAdmin(isAdmin, res) {
    if (!isAdmin) {
      return res.json({
        status: 401,
        error: 'you are unauthorized to access this resource',
      });
    }
    return true;
  }
}

export const dataReplacer = (template, data) => {
  const result = template.replace(/{{([^\s]*)}}/g, (match, ...args) => {
    const prop = args[0];
    if (!data[prop]) throw new Error(`Error: no property named "${prop}" in provided data`);
    return data[prop];
  });
  return result;
};

export default util;
