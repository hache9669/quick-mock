// src/route/api/hello.js
const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'hello' });
});

module.exports = router;