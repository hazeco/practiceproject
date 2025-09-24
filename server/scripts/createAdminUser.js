// Temporary script to create an admin user in the users collection
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  console.log('Connecting to:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  const email = 'admin@example.com';
  const username = 'admin';
  const password = 'admin123';

  // Check if admin already exists
  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    user.password = password; // plain text, ให้ model hash เอง
    await user.save();
    console.log('Updated existing user to admin:', email);
  } else {
    user = new User({
      username,
      email,
      password: password, // plain text, ให้ model hash เอง
      role: 'admin',
    });
    await user.save();
    console.log('Created new admin user:', email);
  }
  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
