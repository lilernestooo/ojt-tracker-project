const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getUserById } = require('../models/userModel');

const registerUser = async (data) => {
  if (!data) throw new Error('Request body is missing');
  const { name, email, password } = data;
  if (!name || !email || !password) throw new Error('Name, email, and password are required');

  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = 'user';

  const user = await createUser({ name, email, password: hashedPassword, role });
  return user;
};

const loginUser = async (data) => {
  if (!data) throw new Error('Request body is missing');
  const { email, password } = data;
  if (!email || !password) throw new Error('Email and password are required');

  const user = await getUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const getUserProfile = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = { registerUser, loginUser, getUserProfile };