class Authorizer {
  static authorize(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader !== undefined) {
      res.locals.token = bearerHeader;
    } else {
      return res.json({
        status: 401,
        error: 'unauthorized, login or sign up to access',
      });
    }
    return next();
  }
}

export default Authorizer;
