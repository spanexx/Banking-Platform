const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

global.createTestCustomer = async (Customer, data = {}) => {
  return await Customer.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'Password123!',
    phoneNumber: '+1234567890',
    dateOfBirth: new Date('1990-01-01'),
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      postalCode: '12345',
      country: 'Test Country'
    },
    identification: {
      type: 'passport',
      number: 'TEST123456'
    },
    ...data
  });
};
