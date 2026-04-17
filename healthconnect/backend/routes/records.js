const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Record = require('../models/Record');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload record
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const record = await Record.create({
      patient: req.user.id,
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get records for patient
router.get('/', auth, async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
