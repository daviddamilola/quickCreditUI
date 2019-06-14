import Util from '../utils/utills';

const prevAdminApply = (req, res, next) => {
  const { isAdmin } = res.locals.payload.payload;
  if (isAdmin) {
    return Util.errResponse(res, 409, 'admin cannot apply for loan');
  }
  return next();
};

export default prevAdminApply;
