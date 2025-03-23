const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Account reference is required']
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['deposit', 'withdrawal', 'transfer']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be at least $0.01']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxLength: [255, 'Description cannot exceed 255 characters']
  },
  relatedAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    validate: {
      validator: function(v) {
        return this.transactionType === 'transfer' ? !!v : true;
      },
      message: 'Related account required for transfers'
    }
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
