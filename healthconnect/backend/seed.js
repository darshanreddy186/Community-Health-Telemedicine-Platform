const bcrypt = require('bcryptjs');
const User = require('./models/User');

const dummyDoctors = [
  {
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@healthconnect.com',
    specialization: 'Cardiologist',
    experience: 12,
    availability: 'Mon–Fri, 9am–5pm',
    availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
    rating: 4.9,
    isAvailable: true,
  },
  {
    name: 'Dr. James Patel',
    email: 'james.patel@healthconnect.com',
    specialization: 'Dentist',
    experience: 8,
    availability: 'Mon–Thu, 10am–6pm',
    availableSlots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
    rating: 4.7,
    isAvailable: true,
  },
  {
    name: 'Dr. Emily Chen',
    email: 'emily.chen@healthconnect.com',
    specialization: 'Dermatologist',
    experience: 10,
    availability: 'Tue–Sat, 8am–4pm',
    availableSlots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM'],
    rating: 4.8,
    isAvailable: true,
  },
  {
    name: 'Dr. Robert Okafor',
    email: 'robert.okafor@healthconnect.com',
    specialization: 'Neurologist',
    experience: 15,
    availability: 'Mon–Fri, 8am–3pm',
    availableSlots: ['8:00 AM', '10:30 AM', '1:00 PM'],
    rating: 4.6,
    isAvailable: false,
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@healthconnect.com',
    specialization: 'Pediatrician',
    experience: 7,
    availability: 'Mon–Sat, 9am–6pm',
    availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:30 PM'],
    rating: 4.5,
    isAvailable: true,
  },
  {
    name: 'Dr. Carlos Rivera',
    email: 'carlos.rivera@healthconnect.com',
    specialization: 'Orthopedic Surgeon',
    experience: 18,
    availability: 'Mon–Thu, 7am–3pm',
    availableSlots: ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM'],
    rating: 4.3,
    isAvailable: true,
  },
  {
    name: 'Dr. Aisha Nwosu',
    email: 'aisha.nwosu@healthconnect.com',
    specialization: 'Psychiatrist',
    experience: 9,
    availability: 'Tue–Fri, 10am–5pm',
    availableSlots: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    rating: 4.4,
    isAvailable: true,
  },
];

async function seedDoctors() {
  const count = await User.countDocuments({ role: 'doctor' });
  if (count > 0) {
    // Patch existing seeded doctors with rating + isAvailable if missing
    for (const d of dummyDoctors) {
      await User.updateOne(
        { email: d.email, role: 'doctor' },
        { $set: { rating: d.rating, isAvailable: d.isAvailable } }
      );
    }
    return;
  }
  const password = await bcrypt.hash('doctor123', 10);
  const docs = dummyDoctors.map(d => ({ ...d, password, role: 'doctor' }));
  await User.insertMany(docs);
  console.log('Seeded 7 dummy doctors');
}

module.exports = seedDoctors;
