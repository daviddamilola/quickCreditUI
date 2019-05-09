/* eslint linebreak-style: ["error", "windows"] */
import bycrypt from 'bcrypt-nodejs';

const util = {
  hashPassword(password) {
    return bycrypt.hashSync(password);
  },

  comparePassword(password, hash) {
    return bycrypt.compareSync(password, hash);
  },
};

export default util;
