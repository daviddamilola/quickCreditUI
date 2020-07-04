class AuthorizeAsAdmin {
  static checkIfAdmin(req, res, next) {
    const { locals: { payload: { payload: { isAdmin } } } } = res;
    if (!isAdmin) {
      return res.json({
        status: 403,
        error: 'Admin Protected Route',
      });
    }
    return next();
  }
}

export default AuthorizeAsAdmin;
