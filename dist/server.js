"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _volleyball = _interopRequireDefault(require("volleyball"));

var _main = _interopRequireDefault(require("./routes/main"));

var _routes = _interopRequireDefault(require("./routes/api/routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint linebreak-style: ["error", "windows"] */
// import debug from 'debug';
var app = (0, _express["default"])();
var port = process.env.PORT || 5000;
app.set('port', process.env.PORT || 5000);
app.use(_volleyball["default"]);
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
})); // the API routes

app.use(_express["default"]["static"](_path["default"].join('UI')));
app.use('/', _main["default"]);
app.use('/api/v1/', _routes["default"]);
app.use(function (req, res) {
  res.status(404);
  res.send('page does not exist');
}); // catch all

app.use(function (err, req, res) {
  res.status(err.status || 500);
});
app.listen(port, function () {
  return console.log(" app listening on port ".concat(port, "!"));
});
module.exports = app;