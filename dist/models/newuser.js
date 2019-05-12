"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NewUser = function NewUser(email, firstname, lastname, hashPassword) {
  _classCallCheck(this, NewUser);

  this.id = (0, _v["default"])();
  this.email = email;
  this.firstname = firstname;
  this.lastname = lastname;
  this.password = hashPassword;
  this.status = 'pending';
  this.isAdmin = false;
  this.dateCreated = new Date();
};

var _default = NewUser;
exports["default"] = _default;