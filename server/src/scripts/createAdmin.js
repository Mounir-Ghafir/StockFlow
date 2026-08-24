const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding an admin');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role: 'Admin' },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${admin.email} (${admin.role})`);
  await mongoose.disconnect();
};

createAdmin().catch((error) => {
  console.error('Unable to create admin:', error.message);
  process.exitCode = 1;
});
