
import jwt from 'jsonwebtoken';
import config from '../config/config';

const Authenticate = {
  makeToken: (id, email, isAdmin, firstName, lastName, status) => {
    console.log('parameters =', id, email, isAdmin, firstName, lastName, status);
    const token = jwt.sign({
      id, email, isAdmin, firstName, lastName, status,
    }, config.secret, { expiresIn: '48h' });
    console.log('generated token', token);
    return token;
  },

  verifyToken: token => jwt.decode(token, { complete: true, json: true }),
};

export default Authenticate;
