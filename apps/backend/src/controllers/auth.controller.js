const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Customer = require('../models/Customer');
const { UnauthorizedError } = require('../utils/errors');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
};

const register = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    const token = signToken(customer._id);
    res.status(201).json({ token, customer });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer || !(await customer.comparePassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    customer.lastLogin = new Date();
    customer.failedLoginAttempts = 0;
    await customer.save();

    const token = signToken(customer._id);
    res.json({ token, customer });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // In a real implementation, you would blacklist the token
    res.json({ message: 'Successfully logged out' });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = signToken(req.customer.id);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    
    if (!customer) {
      return res.json({ message: 'Password reset instructions sent if email exists' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    customer.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
      
    customer.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await customer.save();

    // TODO: Send password reset email
    res.json({ message: 'Password reset instructions sent' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const customer = await Customer.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!customer) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    customer.password = req.body.password;
    customer.passwordResetToken = undefined;
    customer.passwordResetExpires = undefined;
    await customer.save();

    const token = signToken(customer._id);
    res.json({ token, message: 'Password successfully reset' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signToken,
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};
