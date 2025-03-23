const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const { UnauthorizedError } = require('../utils/errors');

exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedError('No authentication token, access denied');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find customer and check if still exists
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      throw new UnauthorizedError('User not found');
    }

    // Check if password was changed after token was issued
    if (customer.changedPasswordAfter(decoded.iat)) {
      throw new UnauthorizedError('Password recently changed, please login again');
    }

    // Attach customer to request object
    req.customer = customer;
    next();
  } catch (error) {
    next(new UnauthorizedError('Authentication failed'));
  }
};
