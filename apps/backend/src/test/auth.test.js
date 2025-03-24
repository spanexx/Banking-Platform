// const request = require('supertest');
// const { app } = require('../index');
// const Customer = require('../models/Customer');

// describe('Auth Endpoints', () => {
//   const testUser = {
//     firstName: 'Test',
//     lastName: 'User',
//     email: 'test@example.com',
//     password: 'TestPass123!',
//     phoneNumber: '+1234567890',
//     dateOfBirth: '1990-01-01',
//     identification: {
//       type: 'passport',
//       number: 'ABC123456'
//     }
//   };

//   beforeEach(async () => {
//     await Customer.deleteMany({});
//   });

//   describe('POST /api/v1/auth/register', () => {
//     it('should create a new customer', async () => {
//       const res = await request(app)
//         .post('/api/v1/auth/register')
//         .send(testUser);

//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty('token');
//       expect(res.body.customer).toHaveProperty('email', testUser.email);
//     });

//     it('should not create a customer with existing email', async () => {
//       await Customer.create(testUser);

//       const res = await request(app)
//         .post('/api/v1/auth/register')
//         .send(testUser);

//       expect(res.statusCode).toBe(409);
//     });
//   });

//   describe('POST /api/v1/auth/login', () => {
//     beforeEach(async () => {
//       await request(app)
//         .post('/api/v1/auth/register')
//         .send(testUser);
//     });

//     it('should login with valid credentials', async () => {
//       const res = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//           email: testUser.email,
//           password: testUser.password
//         });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('token');
//     });

//     it('should not login with invalid password', async () => {
//       const res = await request(app)
//         .post('/api/v1/auth/login')
//         .send({
//           email: testUser.email,
//           password: 'wrongpassword'
//         });

//       expect(res.statusCode).toBe(401);
//     });
//   });
// });
