const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { auth, idempotencyCheck, validateTransaction } = require('../middlewares/index');

router.use(auth);

// Transaction routes with idempotency check
router.post('/deposit', validateTransaction, idempotencyCheck, transactionController.deposit);
router.post('/withdraw', validateTransaction, idempotencyCheck, transactionController.withdraw);
router.post('/transfer', validateTransaction, idempotencyCheck, transactionController.transfer);

// Transaction history
router.get('/history', transactionController.getTransactionHistory);
router.get('/:id', transactionController.getTransaction);

module.exports = router;
