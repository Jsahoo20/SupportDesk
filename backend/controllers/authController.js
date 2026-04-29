const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId, role, email) => {
  return jwt.sign({ userId, role, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const createAuthPayload = (user) => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  token: generateToken(user._id, user.role, user.email),
});

const register = async (req, res) => {
  const { name, email, password, department } = req.validatedBody;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const newUser = new User({ name, email, password, department });
  await newUser.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: createAuthPayload(newUser),
  });
};

const login = async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: createAuthPayload(user),
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
};

const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'Users retrieved',
    data: users,
  });
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: 'User role updated',
    data: user,
  });
};

module.exports = { register, login, getProfile, getUsers, updateUserRole };
