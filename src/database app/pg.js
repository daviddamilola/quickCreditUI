import dotenv from 'dotenv';
import { Pool } from 'pg';
import config from './config';
import queries from '../models/usersDb';

dotenv.config();
let configdb;

if (process.env.NODE_ENV === 'test') {
  configdb = config.testConfig;
  console.log(`in test config : ${configdb}`);
}
if (process.env.NODE_ENV === 'development') {
  configdb = config.config;
  console.log(`in dev config : ${configdb}`);
}

const pool = new Pool(configdb);
const execute = async () => {
  console.log(configdb);
  try {
    await pool.connect();
    console.log('db connected successfully');
  } catch (error) {
    console.error(`oops error occured: ${error}`);
  }
};
execute();

const pg = {
  query: (...params) => params.length > 1 ? pool.query(params[0], params[1]) : pool.query(params[0]),
};

const initTables = async () => {
  try {
    await pg.query(queries.createUsersTable);
    await pg.query(queries.createLoansTable);
    await pg.query(queries.createRepaymentTable);
    await pg.query(queries.alterLoansTable);
    await pg.query(queries.alterRepaymentTable);
  } catch (error) {
    console.log(`oops error occured: ${error}`);
  }
};

initTables();

export default pg;
