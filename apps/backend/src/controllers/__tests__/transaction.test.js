const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../index');  // Update import
const Customer = require('../../models/Customer');
const Account = require('../../models/Account');
const { generateTestToken } = require('../../test/helpers');

describe('Transaction Controller', () => {
  let token;
  let testCustomer;
  let sourceAccount;
  let destinationAccount;

  beforeEach(async () => {
    testCustomer = await global.createTestCustomer(Customer);
    token = generateTestToken(testCustomer._id);

    sourceAccount = await Account.create({
      customerId: testCustomer._id,
      accountType: 'checking',
      accountNumber: '1234567890',
      balance: 1000,
      currency: 'USD'
    });

    destinationAccount = await Account.create({
      customerId: testCustomer._id,
      accountType: 'savings',
      accountNumber: '0987654321',
      balance: 500,
      currency: 'USD'
    });
  });

  describe('POST /api/v1/transactions/transfer', () => {
    it('should transfer money between accounts successfully', async () => {
      const response = await request(app)
        .post('/api/v1/transactions/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          sourceAccountId: sourceAccount._id,
          destinationAccountId: destinationAccount._id,
          amount: 500,
          description: 'Test transfer'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Transfer successful');

      const updatedSourceAccount = await Account.findById(sourceAccount._id);
      const updatedDestinationAccount = await Account.findById(destinationAccount._id);

      expect(updatedSourceAccount.balance).toBe(500);
      expect(updatedDestinationAccount.balance).toBe(1000);
    });

    it('should fail when insufficient funds', async () => {
      const response = await request(app)
        .post('/api/v1/transactions/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          sourceAccountId: sourceAccount._id,
          destinationAccountId: destinationAccount._id,
          amount: 2000,
          description: 'Test transfer'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient');
    });
  });
});
