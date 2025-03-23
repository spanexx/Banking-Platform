const mongoose = require('mongoose');

exports.errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Set default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // Handle mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle mongoose cast errors (invalid IDs)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid data format';
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value error';
    errors = [{
      field: Object.keys(err.keyValue)[0],
      message: `${Object.keys(err.keyValue)[0]} already exists`
    }];
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
