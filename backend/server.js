const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediTrack backend is running.' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB connected');

    // Seed default admin user if none exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@meditrack.com',
        password: hashed,
        role: 'admin',
      });
      console.log('Seeded default admin: admin@meditrack.com / admin123');
    }

    // Start server only after DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
