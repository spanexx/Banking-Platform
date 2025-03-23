const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/errors');

exports.createAccount = async (req, res, next) => {
  try {
    // Verify customer doesn't exceed account limit
    const accountCount = await Account.countDocuments({ customerId: req.customer.id });
    if (accountCount >= 5) {
      throw new BadRequestError('Maximum number of accounts reached');
    }

    const accountNumber = await Account.generateAccountNumber();
    const account = new Account({
      ...req.body,
      customerId: req.customer.id,
      accountNumber
    });
    
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({ customerId: req.customer.id });
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};

exports.getAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      customerId: req.customer.id
    });
    
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    // Check if account is accessible
    if (account.status === 'frozen') {
      throw new ForbiddenError('Account is frozen');
    }
    
    res.json(account);
  } catch (err) {
    next(err);
  }
};

exports.updateAccountStatus = async (req, res, next) => {
  try {
    if (!['active', 'inactive', 'frozen'].includes(req.body.status)) {
      throw new BadRequestError('Invalid account status');
    }

    const account = await Account.findById(req.params.id);
    
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    // Only allow status change if account belongs to customer or user is admin
    if (!req.customer.isAdmin && account.customerId.toString() !== req.customer.id) {
      throw new ForbiddenError('Not authorized to modify this account');
    }

    account.status = req.body.status;
    await account.save();
    
    res.json(account);
  } catch (err) {
    next(err);
  }
};

exports.getBalance = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      customerId: req.customer.id
    });
    
    if (!account) {
      throw new NotFoundError('Account not found');
    }
    
    res.json({ balance: account.balance });
  } catch (err) {
    next(err);
  }
};

exports.getStatements = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { sourceAccountId: req.params.id },
        { destinationAccountId: req.params.id }
      ]
    })
    .sort('-createdAt')
    .limit(50);
    
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};
