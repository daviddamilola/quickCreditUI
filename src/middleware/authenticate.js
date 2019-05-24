import authenticate from './auth';

const authenticateUser = (req, res, next) => {
  console.log('token is ', res.locals.token);

  const payload = authenticate.verifyToken(res.locals.token);

  console.log('verified token is', payload);
  res.locals.payload = payload;
  next();
};

export default authenticateUser;
