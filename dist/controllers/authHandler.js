"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _newuser = _interopRequireDefault(require("../models/newuser"));

var _users = _interopRequireDefault(require("../models/users"));

var _validate = _interopRequireDefault(require("../utils/validate"));

var _utills = _interopRequireDefault(require("../utils/utills"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserHandler =
/*#__PURE__*/
function () {
  function UserHandler() {
    _classCallCheck(this, UserHandler);
  }

  _createClass(UserHandler, null, [{
    key: "createUser",
    value: function createUser(req, res) {
      var result = _validate["default"].validateUser(req.body);

      if (result.error) {
        return res.status(422).json({
          status: 422,
          error: result.error.details[0].messsage
        });
      }

      var hashpassword = _utills["default"].hashPassword(req.body.password);

      var _req$body = req.body,
          email = _req$body.email,
          firstname = _req$body.firstname,
          lastname = _req$body.lastname;
      var userToBeCreated = new _newuser["default"](email, firstname, lastname, hashpassword);

      var user = _users["default"].find(function (existing) {
        return existing.email === email;
      });

      if (user) {
        return res.status(409).json({
          status: 409,
          error: 'existent user'
        });
      }

      _users["default"].push(userToBeCreated);

      var id = userToBeCreated.id,
          uemail = userToBeCreated.uemail,
          isAdmin = userToBeCreated.isAdmin;

      var token = _auth["default"].makeToken(id, uemail, isAdmin);

      return res.status(201).json({
        status: 201,
        token: token,
        data: userToBeCreated
      });
    }
  }]);

  return UserHandler;
}();

var _default = UserHandler;
exports["default"] = _default;