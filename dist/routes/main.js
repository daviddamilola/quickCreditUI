"use strict";

/* eslint linebreak-style: ["error", "windows"] */
var express = require('express');

var router = express.Router(); // Home page route.

router.get('/', function (req, res) {
  res.sendStatus(200);
  res.sendFile('/index.html');
});
module.exports = router;