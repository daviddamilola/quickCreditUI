
class Validator {
  static validateSignup(req, res, next) {
    console.log('beginning validation........')
    req.checkBody('email', 'Please enter a valid email').not().isEmpty().isEmail()
      .isLength({ min: 5 })
      .isLength({ max: 50 })
      .normalizeEmail()
      .trim();
    req.checkBody('firstName', 'Please supply a valid first name')
      .not()
      .isEmpty()
      .isAlpha()
      .isLength({ max: 90 });
    req.checkBody('lastName', 'Please supply a valid last name')
      .not()
      .isEmpty()
      .isAlpha()
      .isLength({ max: 90 });
    req.checkBody('address', 'Please supply valid address')
      .not()
      .isEmpty();
    req.checkBody('password', 'Please supply a valid password')
      .not()
      .isEmpty()
      .isAlphanumeric()
      .isLength({ max: 90 });
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.status(400).json({ status: 400, error: errors.map(err => err.msg) }));
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
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.status(400).json({ status: 400, error: errors.map(err => err.msg) }));
  }

  static validateLoanApp(req, res, next) {
    req.checkBody('tenor', 'tenor must be number in the range 1-12').not().isEmpty().isNumeric()
      .isLength({ min: 1 })
      .isLength({ max: 12 });
    req.checkBody('email', 'email should take the form johndoe@example.com').not().isEmpty().isEmail();
    req.checkBody('amount', 'amount cannot be empty and should be less than 100,000 ').not().isEmpty().isNumeric()
      .isLength({ min: 1 })
      .isLength({ max: 100000 });
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.status(400).json({ status: 400, error: [...new Set(errors.map(err => err.msg))] }));
  }

  static checkstatus(req, res, next) {
    req.checkBody('status', 'status cannot be empty & must be either approve or reject')
      .not().isEmpty().isAlpha();
    req.checkParams('loanId', 'query :id can only be an integer number').isInt();
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.status(400).json({ status: 400, error: errors.map(err => err.msg) }));
  }

  static validateRepaymemnt(req, res, next) {
    req.checkBody('amountPaid', 'amount cannot be empty and must be an integer')
      .not().isEmpty().isInt();
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.status(400).json({ status: 400, error: [...new Set(errors.map(err => err.msg))] }));
  }

  static checkQuery(req, res, next) {
    req.checkParams('loanId', 'query :id can only be an integer number').isInt();
    req.asyncValidationErrors()
      .then(() => next())
      .catch(errors => res.status(400).json({ status: 400, error: errors.map(err => err.msg) }));
  }
}
export default Validator;
