/* eslint linebreak-style: ["error", "windows"] */
import bycrypt from 'bcrypt-nodejs';

const util = {
  hashPassword(password) {
    return bycrypt.hashSync(password);
  },

  comparePassword(password, hash) {
    return bycrypt.compareSync(password, hash);
  },
  genid(db) {
    let id = 0;
    if (db.length) {
      id += 1;
    }
    return id;
  },
};

export default util;
