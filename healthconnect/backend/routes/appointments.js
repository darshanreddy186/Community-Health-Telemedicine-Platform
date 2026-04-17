const router = require('express').Router();
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Book appointment (patient)
router.post('/', auth, async (req, res) => {
  try {
    const { doctor, date, time } = req.body;
    const appt = await (await Appointment.create({ patient: req.user.id, doctor, date, time }))
      .populate('patient doctor', 'name');

    // Notify patient
    await Notification.create({
      user: req.user.id,
      message: `Appointment booked with Dr. ${appt.doctor.name} on ${date} at ${time}.`,
      type: 'booked'
    });
    // Notify doctor
    await Notification.create({
      user: appt.doctor._id,
      message: `New appointment booked by ${appt.patient.name} on ${date} at ${time}.`,
      type: 'booked'
    });

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get appointments for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'patient'
      ? { patient: req.user.id }
      : { doctor: req.user.id };
    const appts = await Appointment.find(query)
      .populate('patient doctor', 'name email specialization')
      .sort({ date: 1, time: 1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel appointment
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('patient doctor', 'name email');

    // Notify both parties
    await Notification.create({
      user: appt.patient._id,
      message: `Your appointment with Dr. ${appt.doctor.name} on ${appt.date} at ${appt.time} was cancelled.`,
      type: 'cancelled'
    });
    await Notification.create({
      user: appt.doctor._id,
      message: `Appointment with ${appt.patient.name} on ${appt.date} at ${appt.time} was cancelled.`,
      type: 'cancelled'
    });

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
