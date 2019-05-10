import authenticate from './auth';

const { verifyToken } = authenticate;

exports.authenticateUser = (req, res, next) => {
  const payload = verifyToken(res.locals.token);
  res.locals.payload = payload;
  next();
};
