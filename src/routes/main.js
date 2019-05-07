/* eslint linebreak-style: ["error", "windows"] */
const express = require('express');

const router = express.Router();

// Home page route.
router.get('/', (req, res) => {
  res.sendStatus(200);
  res.sendFile('/index.html');
});

module.exports = router;
