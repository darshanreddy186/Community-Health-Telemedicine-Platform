const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get doctors — patients only see available ones
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'patient'
      ? { role: 'doctor', isAvailable: true }
      : { role: 'doctor' };
    const doctors = await User.find(query).select('-password').sort({ rating: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle own availability (doctor only)
router.patch('/availability', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Forbidden' });
    const doctor = await User.findById(req.user.id);
    doctor.isAvailable = !doctor.isAvailable;
    await doctor.save();
    res.json({ isAvailable: doctor.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
