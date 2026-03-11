const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });

    if (adminExists) {
      console.log('Admin user already exists. Updating password to "admin"...');
      adminExists.password = 'admin'; // Will be hashed by pre-save hook
      await adminExists.save();
      console.log('Admin password updated successfully.');
    } else {
      console.log('Creating default admin user...');
      const admin = new User({
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: 'admin',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }

    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
