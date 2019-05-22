class AuthorizeAsAdmin {
  static checkIfAdmin(req, res, next) {
    const { locals: { payload: { payload: { role } } } } = res;
    if (role !== 'Admin') {
      return res.json({
        status: 403,
        error: 'Admin Protected Route'
      });
    }
    return next();
  }
}

export default AuthorizeAsAdmin;
