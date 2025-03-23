const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

exports.createAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const account = new Account({
      ...req.body,
      customerId: req.user.id,
      balance: 0,
      status: 'active'
    });

    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ customerId: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      customerId: req.user.id
    });
    
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAccountStatus = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ balance: account.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStatements = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { accountId: req.params.id },
        { relatedAccountId: req.params.id }
      ]
    }).sort('-timestamp');
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};