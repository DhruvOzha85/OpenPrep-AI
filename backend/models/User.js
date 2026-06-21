const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'contributor', 'admin'],
      default: 'student',
    },
    streak: {
      count: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
    studyHours: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Refresh tokens (hashed)
    refreshTokens: [String],
    refreshTokenExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash reset/verification tokens
UserSchema.methods.generateToken = function (field) {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  if (field === 'resetPassword') {
    this.resetPasswordToken = hashed;
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  } else if (field === 'emailVerification') {
    this.emailVerificationToken = hashed;
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  }
  return token;
};

module.exports = mongoose.model('User', UserSchema);
