const { body } = require('express-validator');
const { validate } = require('./validate');

const transactionValidationRules = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('accountId')
    .isMongoId()
    .withMessage('Invalid account ID'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters'),
  body('transferAccountId')
    .optional()
    .isMongoId()
    .withMessage('Invalid transfer account ID')
];

exports.validateTransaction = [transactionValidationRules, validate];
