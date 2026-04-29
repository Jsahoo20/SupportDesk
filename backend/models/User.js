const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLE, TICKET_CATEGORY } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return by default
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.EMPLOYEE,
    },
    department: {
      type: String,
      enum: TICKET_CATEGORY,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Indexes for fast queries
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
