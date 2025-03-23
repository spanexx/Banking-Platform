const { body, param } = require('express-validator');
const { validate } = require('./validate');

const accountValidationRules = [
  body('accountType')
    .isIn(['checking', 'savings', 'fixed'])
    .withMessage('Invalid account type'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency'),
];

exports.validateAccount = [accountValidationRules, validate];

exports.validateAccountStatus = [
  param('id').isMongoId().withMessage('Invalid account ID'),
  body('status')
    .isIn(['active', 'inactive', 'frozen'])
    .withMessage('Invalid account status'),
  validate
];
