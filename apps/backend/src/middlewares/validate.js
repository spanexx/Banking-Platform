const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }
  next();
};
