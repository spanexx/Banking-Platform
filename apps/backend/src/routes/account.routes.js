const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const { validateAccount, auth } = require('../middlewares/index');

router.use(auth);

// Account management routes
router.post('/', validateAccount, accountController.createAccount);
router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccount);
router.patch('/:id/status', accountController.updateAccountStatus);
router.get('/:id/balance', accountController.getBalance);
router.get('/:id/statements', accountController.getStatements);

module.exports = router;
