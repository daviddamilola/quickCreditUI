import authenticate from './auth';
import Util from '../utils/utills';

const authenticateUser = (req, res, next) => {
  const payload = authenticate.verifyToken(res.locals.token);
  if (payload === null) {
    return Util.errResponse(res, 500, 'token failed');
  }
  res.locals.payload = payload;
  next();
};

export default authenticateUser;
