const express = require('express');
const router = express.Router();
const { auth, rbac } = require('../middlewares/index');
const customerController = require('../controllers/customer.controller');

router.use(auth); // Protect all routes

// Customer profile routes
router.get('/profile', customerController.getProfile);
router.patch('/profile', customerController.updateProfile);

// Admin routes
router.get('/', rbac(['admin']), customerController.getAllCustomers);
router.get('/:id', rbac(['admin']), customerController.getCustomer);
router.put('/:id', rbac(['admin']), customerController.updateCustomer);
router.delete('/:id', rbac(['admin']), customerController.deleteCustomer);

module.exports = router;
