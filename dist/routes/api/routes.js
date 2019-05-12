"use strict";

var _express = _interopRequireDefault(require("express"));

var _authHandler = _interopRequireDefault(require("../../controllers/authHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint linebreak-style: ["error", "windows"] */
// import UsersHandler from '../../controller/usersController';
// import LoansHandler from '../../controller/LoansController';
var app = _express["default"].Router(); // Home page route.


app.get('/auth/signup', _authHandler["default"].signup);
app.post('/auth/signup', _authHandler["default"].postsignup);
app.get('auth/signin', _authHandler["default"].signin);
app.post('/auth/signin', _authHandler["default"].signin);
module.exports = app;