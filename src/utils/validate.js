import validator from 'validator';

class Validator {
  static validateSignup(reqbody) {
    if (reqbody === undefined) { return { error: 'fields cannot be empty' }; }
    const msgArray = [];
    if (!validator.isEmail(reqbody.email)) {
      msgArray.push('valid email is required');
    }
    if (!validator.isAlpha(reqbody.firstName)) {
      msgArray.push('names must contain alphabets only');
    }
    if (!validator.isAlpha(reqbody.lastName)) {
      msgArray.push('names must contain alphabets only');
    }
    if (!validator.matches(reqbody.password, new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'))) {
      msgArray.push('passwords must contain six characters or more and has least one lowercase and one numeric character or has at least one uppercase and one numeric character');
    }
    if (!validator.isAlpha(reqbody.address)) {
      msgArray.push('names must contain alphabets only');
    }
    if (msgArray.length > 1) {
      return { error: msgArray };
    }
    return { message: 'success' };
  }

  static validateSignin(reqbody) {
    if (reqbody.email === undefined || reqbody.password === undefined) return { error: 'fields cannot be empty' };
    const msgArray = [];
    if (!validator.isEmail(reqbody.email)) {
      msgArray.push('valid email is required');
    }
    if (!validator.matches(reqbody.password, new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'))) {
      msgArray.push('passwords must contain six characters or more and has least one lowercase and one numeric character or has at least one uppercase and one numeric character');
    }
    if (msgArray.length > 0) {
      return { error: msgArray };
    }
    return {
      message: 'success',
    };
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
