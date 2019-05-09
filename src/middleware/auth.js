
import jwt from 'jsonwebtoken';

// generate token for newly create user
exports.makeToken = (id, email, isAdmin) => {
  const role = isAdmin ? 'Admin' : 'User';
  const token = jwt.sign({ id, email, role }, process.env.TOKEN_SUPER_SECRET, { expiresIn: '48h', })
  return token;
};
