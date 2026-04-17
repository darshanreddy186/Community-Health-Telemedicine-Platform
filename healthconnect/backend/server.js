require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const seedDoctors = require('./seed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/records', require('./routes/records'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/chat', require('./routes/chatbot'));
app.use('/api/notifications', require('./routes/notifications'));

// Socket.io
const Message = require('./models/Message');
io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => socket.join(roomId));
  socket.on('sendMessage', async (data) => {
    const msg = await Message.create(data);
    io.to(data.roomId).emit('receiveMessage', msg);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDoctors();
    server.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
