const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const accountRoutes = require('./account.routes');
const transactionRoutes = require('./transaction.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
