import validator from 'validator';

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
      .catch(errors => res.json({ status: 400, message: errors.map(err => err.msg) }));
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
      res.json({ status: 400, message: errors.map(err => err.msg) });
    }
    console.log(req.body.email);
    return next();
  }

  static validateLoanApp(reqbody) {
    if (
      reqbody.tenor === undefined
      || reqbody.amount === undefined
    ) {
      return { error: 'fields cannot be empty' };
    }

    const msgArray = [];
    if (!validator.isNumeric(reqbody.tenor)) {
      msgArray.push('tenor should be a number and should not be more than 12');
    }
    if ((reqbody.tenor > 12)) {
      msgArray.push('tenor should not be more than 12');
    }
    if (!validator.isNumeric(reqbody.amount)) {
      msgArray.push('amount should be an integer!');
    }
    if (msgArray.length > 0) {
      return { error: msgArray };
    }
    return { message: 'success' };
  }
}

export default Validator;
