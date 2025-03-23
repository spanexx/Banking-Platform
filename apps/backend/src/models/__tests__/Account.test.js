const mongoose = require('mongoose');
const Account = require('../Account');
const Customer = require('../Customer');

describe('Account Model', () => {
  let testCustomer;

  beforeEach(async () => {
    testCustomer = await global.createTestCustomer(Customer);
  });

  it('should create an account successfully', async () => {
    const account = new Account({
      customerId: testCustomer._id,
      accountType: 'checking',
      accountNumber: '1234567890',
      balance: 1000,
      currency: 'USD'
    });

    await expect(account.save()).resolves.toBeDefined();
    expect(account.balance).toBe(1000);
    expect(account.status).toBe('active');
  });

  it('should validate daily transaction limits', async () => {
    const account = await Account.create({
      customerId: testCustomer._id,
      accountType: 'checking',
      accountNumber: '1234567890',
      balance: 20000,
      currency: 'USD'
    });

    await expect(account.validateDailyLimit(9000)).resolves.toBe(true);
    await expect(account.validateDailyLimit(11000)).rejects.toThrow('Daily transaction limit');
  });

  it('should not allow negative balances', async () => {
    const account = new Account({
      customerId: testCustomer._id,
      accountType: 'checking',
      accountNumber: '1234567890',
      balance: -100,
      currency: 'USD'
    });

    await expect(account.save()).rejects.toThrow('Balance cannot be negative');
  });
});
