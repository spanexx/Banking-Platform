const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const loanSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required'],
    index: true
  },
  principalAmount: {
    type: Number,
    required: [true, 'Principal amount is required'],
    min: [100, 'Minimum loan amount is 100']
  },
  interestRate: {
    type: Number,
    required: true,
    min: [0.1, 'Interest rate must be at least 0.1%'],
    max: [25, 'Maximum interest rate is 25%']
  },
  termMonths: {
    type: Number,
    required: true,
    min: [1, 'Minimum term is 1 month'],
    max: [360, 'Maximum term is 360 months']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentSchedule: [{
    dueDate: Date,
    principal: Number,
    interest: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'late'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'paid', 'defaulted', 'pending'],
    default: 'pending'
  },
  loanType: {
    type: String,
    required: true,
    enum: ['personal', 'mortgage', 'auto', 'business']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining balance
loanSchema.virtual('remainingBalance').get(function() {
  return this.paymentSchedule.reduce((sum, payment) => {
    return payment.status !== 'paid' ? sum + payment.principal + payment.interest : sum;
  }, 0);
});

// Index for common queries
loanSchema.index({ status: 1 });
loanSchema.index({ customerId: 1, status: 1 });

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;