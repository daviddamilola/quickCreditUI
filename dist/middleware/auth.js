"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Authenticate = {
  makeToken: function makeToken(id, email, isAdmin) {
    var token = _jsonwebtoken["default"].sign({
      id: id,
      email: email,
      isAdmin: isAdmin
    }, process.env.SECRET_KEY, {
      expiresIn: '48h'
    });

    return token;
  },
  validateToken: function () {
    var _validateToken = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res, next) {
      var token, decode, user;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              // get token from headers
              token = req.headers.token; // is token provided ? if not return err response

              if (token) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", res.status(403).json({
                status: 403,
                error: 'login to access page'
              }));

            case 4:
              _context.next = 6;
              return _jsonwebtoken["default"].verify(token, process.env.SECRET_KEY);

            case 6:
              decode = _context.sent;
              user = _users["default"].find(function (validUser) {
                return validUser.id === decode.id;
              }); // invalid user

              if (user) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", res.status(401).json({
                status: 401,
                error: 'invalid login token'
              }));

            case 10:
              // valid user
              req.user = decode;
              return _context.abrupt("return", next());

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", res.status(400).json({
                status: 400,
                error: _context.t0
              }));

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 14]]);
    }));

    function validateToken(_x, _x2, _x3) {
      return _validateToken.apply(this, arguments);
    }

    return validateToken;
  }()
};
var _default = Authenticate;
exports["default"] = _default;