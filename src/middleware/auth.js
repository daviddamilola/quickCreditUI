
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Authenticate = {
  makeToken: (id, email, isAdmin, firstName, lastName, status) => {
    const token = jwt.sign({
      id, email, isAdmin, firstName, lastName, status,
    }, process.env.SECRET, { expiresIn: '48h' });
    return token;
  },

  verifyToken: token => jwt.decode(token, { complete: true, json: true }),
};

export default Authenticate;
