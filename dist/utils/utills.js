"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint linebreak-style: ["error", "windows"] */
var util = {
  hashPassword: function hashPassword(password) {
    return _bcryptNodejs["default"].hashSync(password);
  },
  comparePassword: function comparePassword(password, hash) {
    return _bcryptNodejs["default"].compareSync(password, hash);
  }
};
var _default = util;
exports["default"] = _default;