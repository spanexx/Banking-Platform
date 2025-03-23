const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { 
  NotFoundError, 
  BadRequestError, 
  ForbiddenError, 
  InsufficientFundsError 
} = require('../utils/errors');
const mongoose = require('mongoose');

exports.deposit = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { accountId, amount, description } = req.body;
    
    if (amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    const account = await Account.findById(accountId).session(session);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    if (account.customerId.toString() !== req.customer.id) {
      throw new ForbiddenError('Not authorized to access this account');
    }

    if (account.status !== 'active') {
      throw new ForbiddenError(`Cannot deposit to ${account.status} account`);
    }

    account.balance += amount;
    await account.save({ session });

    const transaction = await Transaction.create([{
      type: 'deposit',
      amount,
      description,
      sourceAccountId: accountId,
      balance: account.balance
    }], { session });

    await session.commitTransaction();
    res.status(201).json(transaction[0]);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

exports.withdraw = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { accountId, amount, description } = req.body;

    if (amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    const account = await Account.findById(accountId).session(session);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    if (account.customerId.toString() !== req.customer.id) {
      throw new ForbiddenError('Not authorized to access this account');
    }

    if (account.status !== 'active') {
      throw new ForbiddenError(`Cannot withdraw from ${account.status} account`);
    }

    if (account.balance < amount) {
      throw new InsufficientFundsError('Insufficient balance for withdrawal');
    }

    account.balance -= amount;
    await account.save({ session });

    const transaction = await Transaction.create([{
      type: 'withdrawal',
      amount,
      description,
      sourceAccountId: accountId,
      balance: account.balance
    }], { session });

    await session.commitTransaction();
    res.status(201).json(transaction[0]);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

exports.transfer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sourceAccountId, destinationAccountId, amount, description } = req.body;

    if (sourceAccountId === destinationAccountId) {
      throw new BadRequestError('Cannot transfer to the same account');
    }

    if (amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    const sourceAccount = await Account.findById(sourceAccountId).session(session);
    const destinationAccount = await Account.findById(destinationAccountId).session(session);

    if (!sourceAccount || !destinationAccount) {
      throw new NotFoundError('One or both accounts not found');
    }

    if (sourceAccount.customerId.toString() !== req.customer.id) {
      throw new ForbiddenError('Not authorized to transfer from this account');
    }

    if (sourceAccount.status !== 'active' || destinationAccount.status !== 'active') {
      throw new ForbiddenError('Can only transfer between active accounts');
    }

    if (sourceAccount.currency !== destinationAccount.currency) {
      throw new BadRequestError('Cannot transfer between different currencies');
    }

    if (sourceAccount.balance < amount) {
      throw new InsufficientFundsError('Insufficient balance for transfer');
    }

    sourceAccount.balance -= amount;
    destinationAccount.balance += amount;

    await sourceAccount.save({ session });
    await destinationAccount.save({ session });

    const transaction = await Transaction.create([{
      type: 'transfer',
      amount,
      description,
      sourceAccountId,
      destinationAccountId,
      balance: sourceAccount.balance
    }], { session });

    await session.commitTransaction();
    res.status(201).json(transaction[0]);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

exports.getTransactionHistory = async (req, res, next) => {
  try {
    if (!req.customer.accounts?.length) {
      throw new NotFoundError('No accounts found');
    }

    const transactions = await Transaction.find({
      $or: [
        { sourceAccountId: { $in: req.customer.accounts } },
        { destinationAccountId: { $in: req.customer.accounts } }
      ]
    })
    .sort('-createdAt')
    .limit(50);

    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    // Verify transaction belongs to customer
    if (transaction.sourceAccountId.toString() !== req.customer.id && 
        transaction.destinationAccountId?.toString() !== req.customer.id) {
      throw new ForbiddenError('Not authorized to view this transaction');
    }

    res.json(transaction);
  } catch (err) {
    next(err);
  }
};
