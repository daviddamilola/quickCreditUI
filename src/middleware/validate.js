
class Validator {
  static validateSignup(req, res, next) {
    req.checkBody('email', 'Please enter a valid email').not().isEmpty().isEmail()
      .isLength({ min: 5 })
      .isLength({ max: 50 })
      .normalizeEmail()
      .trim();
    req.checkBody('firstName', 'Please supply a valid name')
      .not()
      .isEmpty()
      .isAlpha()
      .isLength({ max: 90 });
    req.checkBody('lastName', 'Please supply a valid name')
      .not()
      .isEmpty()
      .isAlpha()
      .isLength({ max: 90 });
    req.checkBody('address', 'Please supply valid address')
      .not()
      .isEmpty();
    req.checkBody('password', 'Please supply a valid name')
      .not()
      .isEmpty()
      .isAlphanumeric()
      .isLength({ max: 90 });
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.json({ status: 400, error: errors.map(err => err.msg) }));
  }

  static validateSignin(req, res, next) {
    req.checkBody('email', 'Please enter a valid email').not().isEmpty().isEmail()
      .isLength({ min: 5 })
      .isLength({ max: 50 })
      .normalizeEmail()
      .trim();
    req.checkBody('password', 'Please supply a valid password, min-6 and alphanumeric')
      .not()
      .isLength({ min: 6 })
      .isEmpty()
      .isAlphanumeric()
      .isLength({ max: 20 });
    const errors = req.ValidationErrors;
    if (errors) {
      res.json({ status: 400, error: errors.map(err => err.msg) });
    }
    console.log(req.body.email);
    return next();
  }

  static validateLoanApp(req, res, next) {
    req.checkBody('tenor', 'enter a number in the range 1-12').not().isEmpty().isNumeric()
      .isLength({ min: 1 })
      .isLength({ max: 12 });
    req.checkBody('email', 'enter a valid email').not().isEmpty().isEmail();
    req.checkBody('amount', 'enter a valid amount less than 100,000 ').not().isEmpty().isNumeric()
      .isLength({ min: 1 })
      .isLength({ max: 100000 });
    const errors = req.ValidationErrors;
    if (errors) {
      res.json({ status: 400, error: errors.map(err => err.msg) });
    }
    console.log(req.body.email);
    return next();
  }

  static checkstatus(req, res, next) {
    req.checkBody('status', 'status cannot be empty & must be either approve or reject')
      .not().isEmpty().isAlpha();
    req.checkParams('loanId', 'query :id can only be an integer number').isInt();
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.json({ status: 400, error: errors.map(err => err.msg) }));
  }

  static checkQuery(req, res, next) {
    req.checkParams('loanId', 'query :id can only be an integer number').isInt();
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.json({ status: 400, error: errors.map(err => err.msg) }));
  }
}
export default Validator;