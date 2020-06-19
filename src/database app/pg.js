import dotenv from 'dotenv';
import { Pool } from 'pg';
import queries from '../models/queryModel';
import 'regenerator-runtime/runtime';

dotenv.config();
let configdb;

if (process.env.NODE_ENV === 'test') {
  configdb = {
    connectionString: process.env.TEST_DB_URL,
  };
}
if (process.env.NODE_ENV !== 'test') {
  configdb = {
    connectionString: process.env.DATABASE_URL,
  };
}
const pool = new Pool(configdb);
const execute = async () => {
  try {
    await pool.connect();
    console.log(`db connected successfully in ${process.env.NODE_ENV} mode`);
  } catch (error) {
    console.error(`oops error occured: ${error}`);
  }
};
execute();

const pg = {
  // eslint-disable-next-line no-confusing-arrow
  query: async (...params) => {
    try {
      const result = await params.length > 1 ? pool.query(params[0], params[1]) : pool.query(params[0]);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
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
