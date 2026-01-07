const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const auth = require('../middleware/auth');

router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

module.exports = router; 