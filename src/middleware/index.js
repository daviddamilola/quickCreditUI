/* eslint-disable import/prefer-default-export */
import queries from '../models/queryModel';
import pg from '../database app/pg';
import util from '../utils/utills';

export const existingUser = async (req, res, next) => {
  try {
    const response = await pg.query(queries.selectUser, [req.body.email, req.body.phonenumber]);
    console.log(response.rows.length > 0);
    return response.rows.length > 0 ? util.errResponse(res, 409, { message: 'existing user' }) : next();
  } catch (error) {
    return util.errResponse(res, 500, { message: error });
  }
};


export const Eligibility = async (req, res, next) => {
  try {
    const { email } = res.locals.payload.payload;
    const queryString = 'select * from users where email=$1';
    const { rows } = await pg.query(queryString, [email]);
    return rows[0].status !== 'verified' ? res.status(403).json({ status: 403, message: 'you are not yet verified' }) : next();
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'internal server error' });
  }
};


export const existingLoan = async (req, res, next) => {
  try {
    const { email } = res.locals.payload.payload;
    const queryString = 'select * from loans where users=$1 and repaid=$2';
    const { rows } = await pg.query(queryString, [email, false]);
    return rows.length > 0 ? res.status(409).json({ status: 409, message: 'existing email application' }) : next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: 500, message: 'internal server error' });
  }
};
