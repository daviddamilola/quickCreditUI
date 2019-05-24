class Authorizer {
  static authorize(req, res, next) {
    const bearerHeader = req.headers.authorization;
    console.log('bearerHeader: ', req.headers);
    if (bearerHeader !== undefined) {
      res.locals.token = bearerHeader;
    } else {
      return res.json({
        status: 401,
        error: 'unauthorized, login or sign up to access',
      });
    } console.log('locals.token is:', res.locals.token);
    return next();
  }
}

export default Authorizer;
