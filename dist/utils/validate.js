"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var validate =
/*#__PURE__*/
function () {
  function validate() {
    _classCallCheck(this, validate);
  }

  _createClass(validate, null, [{
    key: "validateUser",
    value: function validateUser(user) {
      var schema = _joi["default"].object().keys({
        email: _joi["default"].string().email().trim().required(),
        firstname: _joi["default"].string().regex(/^[A-Z]+$/).trim().uppercase().required().error(function () {
          'provide a valid firstname';
        }),
        lastname: _joi["default"].string().regex(/^[A-Z]+$/).trim().required().error(function () {
          'provide a valid lastname';
        }),
        password: _joi["default"].alphanum().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/).required().error(function () {
          'password should contain at least one lowercase alphabet, one uppercase alphabet, at least one number, one special character and must be a min of eight characters';
        })
      });

      return _joi["default"].validate(user, schema);
    }
  }]);

  return validate;
}();

var _default = validate;
exports["default"] = _default;