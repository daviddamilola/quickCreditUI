/* eslint linebreak-style: ["error", "windows"] */
import express from 'express';

const router = express.Router();

// Home page route.
router.get('/auth/signup', (req, res) => {
  res.status(200);
  res.send('hello from api');
});

module.exports = router;
