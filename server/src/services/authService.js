const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueToken = (user) => jwt.sign(
  { role: user.role },
  process.env.JWT_SECRET,
  { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
);

const register = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'Employee' });
  return { user: publicUser(user), token: issueToken(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  const passwordMatches = user && await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return { user: publicUser(user), token: issueToken(user) };
};

module.exports = { register, login, publicUser };
