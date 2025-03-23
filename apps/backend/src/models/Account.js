const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required'],
    enum: {
      values: ['checking', 'savings', 'fixed'],
      message: 'Account type must be checking, savings, or fixed'
    }
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Account number must be 10 digits'
    }
  },
  balance: {
    type: Number,
    required: [true, 'Balance is required'],
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    uppercase: true,
    enum: {
      values: ['USD', 'EUR', 'GBP'],
      message: 'Currency not supported'
    },
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'frozen'],
    default: 'active'
  },
  lastTransactionDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Use single index declaration for performance
accountSchema.index({ 
  accountNumber: 1,
  customerId: 1 
});

// Virtual for formatted balance
accountSchema.virtual('formattedBalance').get(function() {
  return `${this.balance.toFixed(2)} ${this.currency}`;
});

// Static method to generate unique account number
accountSchema.statics.generateAccountNumber = async function() {
  const random = Math.floor(Math.random() * 9000000000) + 1000000000;
  const exists = await this.findOne({ accountNumber: random.toString() });
  if (exists) return this.generateAccountNumber();
  return random.toString();
};

// Method to validate transaction amount
accountSchema.methods.canDebit = function(amount) {
  return this.balance >= amount;
};

// Add validation methods for testing
accountSchema.methods.validateDailyLimit = async function(amount) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayTransactions = await mongoose.model('Transaction').aggregate([
    {
      $match: {
        sourceAccountId: this._id,
        createdAt: { $gte: todayStart },
        type: { $in: ['withdrawal', 'transfer'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const dailyTotal = (todayTransactions[0]?.total || 0) + amount;
  const dailyLimit = this.accountType === 'business' ? 50000 : 10000;

  if (dailyTotal > dailyLimit) {
    throw new Error(`Daily transaction limit of ${dailyLimit} would be exceeded`);
  }
  return true;
};

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
