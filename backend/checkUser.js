const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOne({ email: 'admin@gmail.com' });
    if (user) {
      console.log('User found:', {
        id: user._id,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      });

      const isMatch = await user.matchPassword('admin');
      console.log('Password "admin" match result:', isMatch);
      
      const directMatch = await bcrypt.compare('admin', user.password);
      console.log('Direct bcrypt compare result:', directMatch);
    } else {
      console.log('User admin@gmail.com NOT found in database.');
    }

    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkUser();
