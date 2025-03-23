const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');  
const Customer = require('../models/Customer');  
const Audit = require('../models/Audit');  
const { validationResult } = require('express-validator');  

exports.register = async (req, res) => {  
  try {  
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {  
      return res.status(400).json({ errors: errors.array() });  
    }  

    const { firstName, lastName, email, password, phoneNumber } = req.body;  
    const existingCustomer = await Customer.findOne({ email });  

    if (existingCustomer) {  
      return res.status(400).json({ message: 'Email already registered' });  
    }  

    const customer = new Customer({ firstName, lastName, email, password, phoneNumber });  
    await customer.save();  

    // Audit log  
    await new Audit({  
      action: 'registration',  
      userId: customer._id,  
      details: { method: 'email' },  
      ipAddress: req.ip  
    }).save();  

    const token = jwt.sign(  
      { userId: customer._id },  
      process.env.JWT_SECRET,  
      { expiresIn: '1h' }  
    );  

    res.status(201).json({ token, userId: customer._id });  
  } catch (err) {  
    res.status(500).json({ message: 'Registration failed', error: err.message });  
  }  
};  

exports.login = async (req, res) => {  
  try {  
    const { email, password } = req.body;  
    const customer = await Customer.findOne({ email }).select('+password');  

    if (!customer || !(await customer.comparePassword(password))) {  
      return res.status(401).json({ message: 'Invalid credentials' });  
    }  

    const token = jwt.sign(  
      { userId: customer._id },  
      process.env.JWT_SECRET,  
      { expiresIn: '1h' }  
    );  

    // Audit log  
    await new Audit({  
      action: 'login',  
      userId: customer._id,  
      ipAddress: req.ip,  
      userAgent: req.get('User-Agent')  
    }).save();  

    res.json({ token, userId: customer._id });  
  } catch (err) {  
    res.status(500).json({ message: 'Login failed', error: err.message });  
  }  
};  

exports.logout = async (req, res) => {  
  try {  
    // In a real implementation, you would blacklist the token here  
    res.json({ message: 'Logged out successfully' });  
  } catch (err) {  
    res.status(500).json({ message: 'Logout failed', error: err.message });  
  }  
};  

exports.refreshToken = async (req, res) => {  
  try {  
    const token = jwt.sign(  
      { userId: req.user.id },  
      process.env.JWT_SECRET,  
      { expiresIn: '1h' }  
    );  
    res.json({ token });  
  } catch (err) {  
    res.status(500).json({ message: 'Token refresh failed', error: err.message });  
  }  
};  

exports.forgotPassword = async (req, res) => {  
  try {  
    const { email } = req.body;  
    const customer = await Customer.findOne({ email });  

    if (customer) {  
      // Implement password reset token generation and email sending here  
    }  

    res.json({ message: 'If account exists, reset instructions sent' });  
  } catch (err) {  
    res.status(500).json({ message: 'Password reset failed', error: err.message });  
  }  
};  

exports.resetPassword = async (req, res) => {  
  try {  
    // Implement token validation and password update logic here  
    res.json({ message: 'Password reset successful' });  
  } catch (err) {  
    res.status(500).json({ message: 'Password reset failed', error: err.message });  
  }  
};