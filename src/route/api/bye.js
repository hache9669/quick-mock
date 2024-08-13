// src/route/api/hello.js
const express = require('express');
const router = express.Router();

router.get('/bye', (req, res) => {
  res.json({ message: 'bye' });
});

module.exports = router;