const jwt = require('jsonwebtoken');

exports.generateTestToken = (customerId) => {
  return jwt.sign({ id: customerId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  });
};

exports.createMockAccount = async (Account, customerId, data = {}) => {
  return await Account.create({
    customerId,
    accountType: 'checking',
    accountNumber: Math.random().toString().slice(2, 12),
    balance: 1000,
    currency: 'USD',
    ...data
  });
};

exports.createMockTransaction = async (Transaction, data = {}) => {
  return await Transaction.create({
    type: 'transfer',
    amount: 100,
    description: 'Test transaction',
    ...data
  });
};
